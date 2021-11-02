# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import erpnext
from frappe import _
import json
from frappe.utils import flt, rounded, money_in_words
from axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions import convertDateFormat
from axis_inspection.axis_inspection.api import get_working_hours
from datetime import datetime

@frappe.whitelist()
def additional_salary(doc,method=None):
    def get_overtime_bill(doc):
        total_costing_amount = 0.0
        basic_amount=0
        contract_working_hours=0
        employee_contract_rec=frappe.db.get_value('Employee Contract',{'docstatus':1,'party_name':doc.employee},['name'])
        contract_working_hours=frappe.db.get_value('Contract Term Detail', {'contract_term': 'Working Hours','parent':employee_contract_rec}, ['value'])
        salary_structure = frappe.db.get_value('Salary Structure Assignment', {'employee': doc.employee, 'from_date': [
                                           '<=', doc.start_date], 'docstatus': 1}, 'salary_structure', order_by='from_date desc')
        if salary_structure:
            basic_amount_rec = frappe.db.sql(
                """select s.salary_component,s.amount from `tabSalary Detail` s where s.parentfield="Earnings" and s.parenttype="Salary Structure" and s.salary_component="Basic Salary" and s.parent=%s""", (salary_structure), as_dict=True)
            if basic_amount_rec:
                if basic_amount_rec[0].salary_component=="Basic Salary":
                    basic_amount=basic_amount_rec[0].amount

        timesheet = frappe.db.get_list('Timesheet', {'employee': doc.employee, 'timesheet_date': [
                                     "between", [doc.start_date, doc.end_date]], 'timesheet_type': 'Basic', 'docstatus': 1}, 'name')
        for val in timesheet:
            costing_hours_list = frappe.db.get_list('Timesheet Detail', filters={
                                                    'activity_type': 'Overtime', 'parent': val.name}, fields=['hours'])
            for row in costing_hours_list:
                overtime_amount=0
                overtime_amount=round((((basic_amount*12/365)/int(contract_working_hours))*1.5)*row.hours,2)
                total_costing_amount = total_costing_amount+overtime_amount
        return total_costing_amount

    if doc.employee != None:
        costing_amount=0
        costing_amount = get_overtime_bill(doc)
        create_additional_salary(doc.employee, 'Overtime',
                                    doc.start_date, costing_amount)

        month = convertDateFormat(doc.end_date)
        parent = frappe.db.get_value('Employee Deductions', {
                                    'employee': doc.employee}, 'name')
        if parent:
            employee_deductions = frappe.db.sql("""
                SELECT *
                FROM
                    `tabDeduction Detail`
                WHERE
                    `tabDeduction Detail`.parent = %(parent)s
                    AND `tabDeduction Detail`.parenttype = 'Employee Deductions'
                    AND %(end_date)s BETWEEN `tabDeduction Detail`.start_date AND `tabDeduction Detail`.end_date
                """, {
                    'parent': parent,
                    'end_date': doc.end_date
                }, as_dict=True)
            if employee_deductions:
                # file = open("/home/erpnext/frappe-bench/MyFile.txt", "a")
                # file.write("found emp deductioN")
                # file.close()
                for record in employee_deductions:   
                    if record.deduction_type=="One Time":                                      
                        create_additional_salary(doc.employee, record.salary_component_name, doc.start_date, record.retention_amount)
                    else:
                        num_months = (record.end_date.year - record.start_date.year) * 12 + (record.end_date.month - record.start_date.month)
                        try:
                            recurring_amount=record.retention_amount/(num_months+1)
                        except Exception:
                            recurring_amount=record.retention_amount
                        create_additional_salary(doc.employee, record.salary_component_name, doc.start_date, recurring_amount)

        working_hours = get_working_hours(doc.employee_name)
        earnings = get_earnings(doc.salary_structure)
        total_working_days=0
        if doc.total_working_days:
            total_working_days=doc.total_working_days
        if working_hours:
            hours = float(working_hours)
            attendance_deduction_amount = ((earnings/total_working_days)/hours)*doc.attendance_deduction_hours
            #Commenting attendance deduction creation for now
            #create_additional_salary(doc.employee, 'Attendance Deduction', doc.start_date, attendance_deduction_amount)


def validate(self, method):
    update_attendance_deduction(self)
    update_earnings(self.employee, self)
    update_salary_slip(self)


def on_submit(self, method):
    update_actual_paid(self)


def on_cancel(self, method):
    remove_actual_paid(self)


@frappe.whitelist()
def update_salary_slip(self):
    #setting gross pay to 0 otherwise it keeps incrementing
    self.gross_pay = 0
    self.total_deduction = 0
    for row in self.earnings:
        self.gross_pay += row.amount

    total_deduction = 0
    for row in self.deductions:
        total_deduction += row.amount

    self.total_deduction = total_deduction
    self.net_pay = flt(self.gross_pay) - \
        (flt(self.total_deduction) + flt(self.total_loan_repayment))
    self.rounded_total = rounded(self.net_pay)
    company_currency = erpnext.get_company_currency(self.company)
    total = self.net_pay if self.is_rounding_total_disabled() else self.rounded_total
    self.total_in_words = money_in_words(total, company_currency)


def update_actual_paid(self):
    deduction_names=[]
    total_employee_deduction=0
    month = convertDateFormat(self.start_date)
    parent = frappe.db.get_value('Employee Deductions', {
                                 'employee': self.employee}, 'name')
    if parent:
        deductions=frappe.db.get_list('Deduction Detail',filters={'parent':parent},fields=['salary_component_name'])
        if deductions:
            for each in deductions:
                deduction_names.append(each.salary_component_name)
        if self.deductions:
            for rec in self.deductions:
                if rec.salary_component in deduction_names:
                    total_employee_deduction=total_employee_deduction+rec.amount
        name = frappe.db.get_value('Deduction Calculation', {
                                   'parenttype': 'Employee Deductions', 'month': month, 'parent': parent}, 'name')
        frappe.db.set_value('Deduction Calculation', {
                            "name": name}, "actual_paid", total_employee_deduction)
        doc = frappe.get_doc('Employee Deductions', parent)
        doc.save()


def remove_actual_paid(self):
    date = self.start_date.strftime('%Y-%m-%d')
    month = convertDateFormat(date)
    parent = frappe.db.get_value('Employee Deductions', {
                                 'employee': self.employee}, 'name')
    if parent:
        name = frappe.db.get_value('Deduction Calculation', {
                                   'parenttype': 'Employee Deductions', 'month': month, 'parent': parent}, 'name')
        frappe.db.set_value('Deduction Calculation', {
                            "name": name}, "actual_paid", 0)
        doc = frappe.get_doc('Employee Deductions', parent)
        doc.save()


def update_attendance_deduction(self):
    total_hours = 0.0
    records = frappe.db.sql("""select total_delay from `tabAttendance` where employee=%s AND(attendance_date BETWEEN %s AND %s) """,
                            (self.employee, self.start_date, self.end_date), as_dict=True)
    for row in records:
        total_hours = total_hours+row['total_delay']

    self.attendance_deduction_hours = total_hours


def get_earnings(salary_structure):
    earnings = 0.0
    earnings_list = frappe.db.sql(
        """select amount from `tabSalary Detail` where parentfield="Earnings" and parenttype="Salary Structure" and parent=%s""", (salary_structure), as_dict=True)
    for row in earnings_list:
        earnings += row['amount']
    return earnings


def update_earnings(employee, self):
    salary_structure = frappe.db.get_value('Salary Structure Assignment', {'employee': employee, 'from_date': [
                                           '<=', self.start_date], 'docstatus': 1}, 'salary_structure', order_by='from_date desc')
    if salary_structure:
        component_list = frappe.db.sql(
            """select s.salary_component,s.amount from `tabSalary Detail` s INNER JOIN `tabSalary Component` c on s.parentfield="Earnings" and s.parenttype="Salary Structure" and s.parent=%s and c.is_project_allwoance =1 and s.salary_component=c.name""", (salary_structure), as_dict=True)
        if component_list:
            for component in component_list:
                total_working_days = frappe.db.sql("""
                select count(DISTINCT DATE(td.from_time)) as working_days from `tabTimesheet Detail` td join  `tabTimesheet` t
           on(t.name=td.parent) where td.activity_type IN ('On Duty','Overtime','Standby') and td.docstatus=1 and td.from_time 
                BETWEEN %s and DATE_ADD(%s, INTERVAL 1 DAY) and t.employee=%s and t.timesheet_type='Basic' and td.is_project_allowance_applicable=1
                """, (frappe.utils.add_months(self.start_date, -1), frappe.utils.add_months(self.end_date, -1), employee), as_dict=True)
                if total_working_days:
                    for val in total_working_days:
                        if val.working_days != 0:
                            amount_per_day = round(
                                ((component.amount*12)/365), 2)
                            amount = amount_per_day*val.working_days
                            create_additional_salary(
                                employee, component.salary_component, self.start_date, amount)
                        else:
                            amount = 0
                            create_additional_salary(
                                employee, component.salary_component, self.start_date, amount)


def create_additional_salary(employee, salary_component, start_date, amount):
    if amount!=0.0:
        if not frappe.db.exists('Additional Salary', {'employee': employee, 'salary_component': salary_component, 'payroll_date': start_date}):
            doc = frappe.get_doc(dict(doctype='Additional Salary',
                                    employee=employee,
                                    salary_component=salary_component,
                                    payroll_date=start_date,
                                    amount=amount))
            doc.save()
            doc.submit()
        else:
            frappe.db.sql("""update `tabAdditional Salary` set amount=%s where employee=%s and salary_component=%s and payroll_date=%s""",
                        (amount, employee, salary_component, start_date))
