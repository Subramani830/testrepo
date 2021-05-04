# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe, erpnext
from frappe.model.document import Document
from frappe import _
from datetime import date
from datetime import datetime
import datetime
from frappe.utils import flt,rounded, date_diff, money_in_words
from datetime import timedelta
from frappe.utils import cint
from axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions import convertDateFormat
from axis_inspection.axis_inspection.api import get_working_hours

def validate(self,method):
    update_attendance_deduction(self)
    update_salary_slip(self)

@frappe.whitelist()
def update_salary_slip(self):
#    amount=frappe.db.get_list('Timesheet',{'employee':self.employee,'start_date':["between",[self.start_date,self.end_date]]},'total_costing_amount')
#    costing_amount=0
#    for row in amount:
#	        costing_amount+=row.total_costing_amount

#    self.overtime_bill=costing_amount
    self.gross_pay=self.overtime_bill
    for row in self.earnings:
        self.gross_pay+=row.amount
    if self.employee_deduction==0:
        month=convertDateFormat(self.start_date)
        parent=frappe.db.get_value('Employee Deductions',{'employee':self.employee},'name')
        if parent:
            self.employee_deduction=frappe.db.get_value('Deduction Calculation',{'parenttype':'Employee Deductions','month':month,'parent':parent},'balance')
    
    total_deduction=self.employee_deduction
    for row in self.deductions:
        total_deduction+=row.amount

    working_hours=get_working_hours(self.employee_name)
    if working_hours:
        hours=float(working_hours)
        amount=(self.gross_pay/30)/hours
        self.attendance_deduction_amount=self.attendance_deduction_hours*amount*2
        total_deduction+=self.attendance_deduction_amount
    
    self.total_deduction=total_deduction
    self.net_pay = flt(self.gross_pay) - (flt(self.total_deduction) + flt(self.total_loan_repayment))
    self.rounded_total = rounded(self.net_pay)
    company_currency = erpnext.get_company_currency(self.company)
    total = self.net_pay if self.is_rounding_total_disabled() else self.rounded_total
    self.total_in_words = money_in_words(total, company_currency)
    

def update_actual_paid(self,method):
	month=convertDateFormat(self.start_date)
	parent=frappe.db.get_value('Employee Deductions',{'employee':self.employee},'name')
	if parent:
		name=frappe.db.get_value('Deduction Calculation',{'parenttype':'Employee Deductions','month':month,'parent':parent},'name')
		frappe.db.set_value('Deduction Calculation', {"name": name}, "actual_paid", self.employee_deduction)
		doc=frappe.get_doc('Employee Deductions',parent)
		doc.save()

def remove_actual_paid(self,method):
    date=self.start_date.strftime('%Y-%m-%d')
    month=convertDateFormat(date)
    parent=frappe.db.get_value('Employee Deductions',{'employee':self.employee},'name')
    if parent:
        name=frappe.db.get_value('Deduction Calculation',{'parenttype':'Employee Deductions','month':month,'parent':parent},'name')
        frappe.db.set_value('Deduction Calculation', {"name": name}, "actual_paid", 0)
        doc=frappe.get_doc('Employee Deductions',parent)
        doc.save()


def update_attendance_deduction(self):
    total_seconds=0.0
    records=frappe.db.sql("""select total_delay_duration from `tabAttendance` where employee=%s AND(attendance_date BETWEEN %s AND %s) """,(self.employee,self.start_date,self.end_date),as_dict=True)
    for row in records:
        total_seconds=total_seconds+row['total_delay_duration'].total_seconds()
   
    total_hours=total_seconds/3600
    self.attendance_deduction_hours=total_hours
