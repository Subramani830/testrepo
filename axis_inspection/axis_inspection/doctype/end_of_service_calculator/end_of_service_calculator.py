# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class EndofServiceCalculator(Document):
	pass

@frappe.whitelist()
def get_salary_slip(employee):
	return frappe.db.get_list('Salary Slip',filters={'employee':employee,'docstatus':1},fields=['name'],order_by='start_date DESC');

@frappe.whitelist()
def update_earnings_and_deductions(parenttype,parent):
	return frappe.db.get_list('Salary Detail',filters={'parenttype':parenttype,'parent':parent},fields=['salary_component','amount','parentfield']);

@frappe.whitelist()
def get_amt_salary_year_small(salary,year):
	amt=float(salary)*int(year)*0.5;
	return amt;

@frappe.whitelist()
def get_amt_salary_year_large(salary,year):
	remaining_year=int(year)-5;
	amt1=float(salary)*5*0.5;
	amt2=float(salary)*int(remaining_year);
	total=amt1+amt2;
	return total;

@frappe.whitelist()
def get_amt_salary_year_month_small(salary,year,month):
	amt1=float(salary)*int(year)*0.5;
	amt2=((float(salary)/12)*0.5)*int(month);
	total=amt1+amt2;
	return total;

@frappe.whitelist()
def get_amt_salary_year_month_large(salary,year,month):
	remaining_year=int(year)-5;
	amt1=float(salary)*5*0.5;
	amt2=float(salary)*int(remaining_year);
	amt3=(float(salary)/12)*int(month);
	total= amt1+amt2+amt3;
	return total;


@frappe.whitelist()
def get_amt_salary_year_month_days_small(salary,year,month,days):
	amt1=float(salary)*int(year)*0.5;
	amt2=((float(salary)/12)*0.5)*int(month);
	amt3=((float(salary)/359)*0.5)*int(days);
	total=amt1+amt2+amt3;
	return total;

@frappe.whitelist()
def get_amt_salary_year_month_days_large(salary,year,month,days):
	remaining_year=int(year)-5;
	amt1=float(salary)*5*0.5;
	amt2=float(salary)*int(remaining_year);
	amt3=(float(salary)/12)*int(month);
	amt4=(float(salary)/359)*int(days);
	total= amt1+amt2+amt3+amt4;
	return total;

@frappe.whitelist()
def get_amt_salary_year_days_small(salary,year,days):
	amt1=float(salary)*int(year)*0.5;
	amt2=((float(salary)/359)*0.5)*int(days);
	total=amt1+amt2;
	return total;

@frappe.whitelist()
def get_amt_salary_year_days_large(salary,year,days):
	remaining_year=int(year)-5;
	amt1=float(salary)*5*0.5;
	amt2=float(salary)*int(remaining_year);
	amt3=(float(salary)/359)*int(days);
	total= amt1+amt2+amt3;
	return total;




