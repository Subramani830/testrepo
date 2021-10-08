# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _
from datetime import date
from datetime import datetime
import datetime
import json
import pandas as pd
from frappe.utils import flt

class EmployeeDeductions(Document):
	def validate(self):
		self.validate_duplicate_record()
		
	def validate_duplicate_record(self):
		for row in self.deduction_calculation:
			row.balance=row.total-flt(row.actual_paid)
		employee=frappe.db.sql("""
			select name from `tabEmployee Deductions`
			where employee = %s
				and name != %s
		""",(self.employee, self.name))
		if employee:
			frappe.throw(_("Employee {0} already exists for the Employee Deductions").format(self.employee))

	def on_update(self):
		date=frappe.get_list("Deduction Detail",filters={"parenttype":"Employee Deductions","parent":self.name},fields=['start_date'],order_by='start_date')
		start_date=(date[0].start_date).strftime("%Y-%m-%d")
		end_date=datetime.datetime.today().strftime('%Y-%m-%d')

		dates = [start_date,end_date]
		start, end = [datetime.datetime.strptime(_, "%Y-%m-%d") for _ in dates]
		monthList=[datetime.datetime.strptime('%2.2d-%2.2d' % (y, m), '%Y-%m').strftime('%b-%y') \
		for y in range(start.year, end.year+1) \
		for m in range(start.month if y==start.year else 1, end.month+1 if y == end.year else 13)]
		
		self.total_balance=0
		for row in monthList:
			for val in self.get('deduction_calculation'):
				if val.month==row:
					self.total_balance+=val.balance
					if val.month==datetime.datetime.now().strftime('%b')+'-'+datetime.datetime.now().strftime('%y'):
						self.current_month_balance=val.balance


@frappe.whitelist()
def convertDateFormat(start_date):
	start_date=str(start_date)
	date=datetime.datetime.strptime(start_date, '%Y-%m-%d')
	return date.strftime('%b-%y')

@frappe.whitelist()	
def fetch_salary_slip_amount(start_date,end_date,employee):
	deduction_amount=0
	salary_slip_deduction = frappe.db.sql("""
		SELECT
			`tabSalary Slip`.employee_deduction
		FROM
			`tabSalary Slip`
		WHERE
			`tabSalary Slip`.employee = %(employee)s
			AND %(date)s BETWEEN `tabSalary Slip`.start_date AND `tabSalary Slip`.end_date
			AND `tabSalary Slip`.status="Submitted"
		""", {
			'employee': employee,
			'date': end_date
		}, as_dict=True)
	if salary_slip_deduction:
		deduction_amount=salary_slip_deduction[0].employee_deduction
	return deduction_amount

@frappe.whitelist()
def updateDeductionCalculation(start_date,end_date,amount,employee):
	val=dict()
	paid_amount=list()
	no_of_months=monthDiff(start_date,end_date)
	val['deduction_amount']=round((int(amount)/no_of_months),2)
	# val['paid_amount']=deduction_amount
	dates = [start_date,end_date]
	start, end = [datetime.datetime.strptime(_, "%Y-%m-%d") for _ in dates]
	val['month_list']=[datetime.datetime.strptime('%2.2d-%2.2d' % (y, m), '%Y-%m').strftime('%b-%y') \
       for y in range(start.year, end.year+1) \
       for m in range(start.month if y==start.year else 1, end.month+1 if y == end.year else 13)]
	if val['month_list']:
		for each_month in val['month_list']:
			deduction_amount=fetch_salary_slip_amount_of_recurring_month(employee,each_month)
			paid_amount.append(deduction_amount)
	val['paid_amount']=paid_amount
	return val

def monthDiff(start_date,end_date):
	start_date=datetime.datetime.strptime(start_date, '%Y-%m-%d')
	end_date=datetime.datetime.strptime(end_date, '%Y-%m-%d')
	return (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)+1

@frappe.whitelist()
def get_month(month,name):
	return frappe.db.get_list('Deduction Calculation',filters={'month':month,'parent':name,'parenttype':'Employee Deductions'},fields=['name','recurring','total','balance','one_time'])
	
def fetch_salary_slip_amount_of_recurring_month(employee,each_month):
	datetime_object = datetime.datetime.strptime(each_month, "%b-%y")
	# month_number = datetime_object.month
	end_date=datetime_object
	deduction_amount=0
	salary_slip_deduction = frappe.db.sql("""
		SELECT
			`tabSalary Slip`.employee_deduction
		FROM
			`tabSalary Slip`
		WHERE
			`tabSalary Slip`.employee = %(employee)s
			AND MONTH(%(date)s) BETWEEN MONTH(`tabSalary Slip`.start_date) AND MONTH(`tabSalary Slip`.end_date)
			AND YEAR(%(date)s) BETWEEN YEAR(`tabSalary Slip`.start_date) AND YEAR(`tabSalary Slip`.end_date)
			AND `tabSalary Slip`.status="Submitted"
		""", {
			'employee': employee,
			'date': end_date
		}, as_dict=True)
	if salary_slip_deduction:
		deduction_amount=salary_slip_deduction[0].employee_deduction
	return deduction_amount

