# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
import erpnext
from frappe.model.document import Document
from frappe import _
from datetime import date
from datetime import datetime
import datetime
from frappe.utils import flt, rounded, date_diff, money_in_words
from datetime import timedelta
from frappe.utils import cint
from axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions import convertDateFormat
from axis_inspection.axis_inspection.api import get_working_hours


def validate(self, method):
    update_earnings(self.employee, self)
    update_attendance_deduction(self)
    update_salary_slip(self)


def on_submit(self, method):
    update_actual_paid(self)


def on_cancel(self, method):
    remove_actual_paid(self)


@frappe.whitelist()
def update_salary_slip(self):
    costing_amount = get_overtime_bill(self)
    #create_additional_salary(self.employee,'Overtime', self.start_date, costing_amount)
    self.overtime_bill = costing_amount
    self.gross_pay = self.overtime_bill
    for row in self.earnings:
        self.gross_pay += row.amount

    total_deduction = 0
    if self.employee_deduction == 0:
        month = convertDateFormat(self.end_date)
        parent = frappe.db.get_value('Employee Deductions', {
                                     'employee': self.employee}, 'name')
        if parent:
            self.employee_deduction = frappe.db.get_value('Deduction Calculation', {
                                                          'parenttype': 'Employee Deductions', 'month': month, 'parent': parent}, 'balance')
    total_deduction = self.employee_deduction
    for row in self.deductions:
        total_deduction += row.amount

    working_hours = get_working_hours(self.employee_name)
    earnings = get_earnings(self.salary_structure)
    if working_hours:
        hours = float(working_hours)
        self.attendance_deduction_amount = (
            (earnings/self.total_working_days)/hours)*self.attendance_deduction_hours
        total_deduction += self.attendance_deduction_amount

    self.total_deduction = total_deduction
    self.net_pay = flt(self.gross_pay) - \
        (flt(self.total_deduction) + flt(self.total_loan_repayment))
    self.rounded_total = rounded(self.net_pay)
    company_currency = erpnext.get_company_currency(self.company)
    total = self.net_pay if self.is_rounding_total_disabled() else self.rounded_total
    self.total_in_words = money_in_words(total, company_currency)


def update_actual_paid(self):
    month = convertDateFormat(self.start_date)
    parent = frappe.db.get_value('Employee Deductions', {
                                 'employee': self.employee}, 'name')
    if parent:
        name = frappe.db.get_value('Deduction Calculation', {
                                   'parenttype': 'Employee Deductions', 'month': month, 'parent': parent}, 'name')
        frappe.db.set_value('Deduction Calculation', {
                            "name": name}, "actual_paid", self.employee_deduction)
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
                BETWEEN %s and DATE_ADD(%s, INTERVAL 1 DAY) and t.employee=%s and t.timesheet_type='Client' and td.is_project_allowance_applicable=1
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


def get_overtime_bill(self):
    total_costing_amount = 0.0
    timesheet = frappe.db.get_list('Timesheet', {'employee': self.employee, 'timesheet_date': [
                                   "between", [self.start_date, self.end_date]], 'timesheet_type': 'Client', 'docstatus': 1}, 'name')
    for val in timesheet:
        costing_amount_list = frappe.db.get_list('Timesheet Detail', filters={
                                                 'activity_type': 'Overtime', 'parent': val.name}, fields=['costing_amount'])
        for row in costing_amount_list:
            total_costing_amount = total_costing_amount+row.costing_amount
    return total_costing_amount


def create_additional_salary(employee, salary_component, start_date, amount):
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
