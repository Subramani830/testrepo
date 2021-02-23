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
from axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions import convertDateFormat



def update_salary_slip(doc,method):
#    amount=frappe.db.get_list('Timesheet',{'employee':doc.employee,'start_date':["between",[doc.start_date,doc.end_date]],'workflow_state':'Completed'},'total_costing_amount')
#    costing_amount=0
#    for row in amount:
#        costing_amount+=row.total_costing_amount

#    doc.overtime_bill=costing_amount
    doc.gross_pay=doc.overtime_bill
    for row in doc.earnings:
        doc.gross_pay+=row.amount
    if doc.employee_deduction==0:
        month=convertDateFormat(doc.start_date)
        parent=frappe.db.get_value('Employee Deductions',{'employee':doc.employee},'name')
        if parent:
            doc.employee_deduction=frappe.db.get_value('Deduction Calculation',{'parenttype':'Employee Deductions','month':month,'parent':parent},'balance')
    
    total_deduction=doc.employee_deduction
    for row in doc.deductions:
        total_deduction+=row.amount

    doc.total_deduction=total_deduction
    doc.net_pay = flt(doc.gross_pay) - (flt(doc.total_deduction) + flt(doc.total_loan_repayment))
    doc.rounded_total = rounded(doc.net_pay)
    company_currency = erpnext.get_company_currency(doc.company)
    total = doc.net_pay if doc.is_rounding_total_disabled() else doc.rounded_total
    doc.total_in_words = money_in_words(total, company_currency)
    

def update_actual_paid(doc,method):
	month=convertDateFormat(doc.start_date)
	parent=frappe.db.get_value('Employee Deductions',{'employee':doc.employee},'name')
	if parent:
		name=frappe.db.get_value('Deduction Calculation',{'parenttype':'Employee Deductions','month':month,'parent':parent},'name')
		frappe.db.set_value('Deduction Calculation', {"name": name}, "actual_paid", doc.employee_deduction)
		doc1=frappe.get_doc('Employee Deductions',parent)
		doc1.save()

def remove_actual_paid(doc,method):
    date=doc.start_date.strftime('%Y-%m-%d')
    month=convertDateFormat(date)
    parent=frappe.db.get_value('Employee Deductions',{'employee':doc.employee},'name')
    if parent:
        name=frappe.db.get_value('Deduction Calculation',{'parenttype':'Employee Deductions','month':month,'parent':parent},'name')
        frappe.db.set_value('Deduction Calculation', {"name": name}, "actual_paid", 0)
        doc1=frappe.get_doc('Employee Deductions',parent)
        doc1.save()
