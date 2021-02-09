# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import flt, add_days
from frappe import _
from datetime import datetime

def execute(filters=None):
	columns = get_columns()
	data=[]
	conditions=get_conditions(filters)
	expiry_details = get_data(filters,conditions)
	if expiry_details:
		for e in expiry_details:
			if e.contract_end_date:
				e.update({
					"document": "Employee Contract",
					"expiry_date":datetime.strftime(e.contract_end_date, "%d-%m-%Y")
				})
			elif e.id_expiry_date:
				e.update({
					"document": "ID",
					"expiry_date":datetime.strftime(e.id_expiry_date, "%d-%m-%Y")
				})
			elif e.valid_upto:
				e.update({
					"document": "Passport",
					"expiry_date":datetime.strftime(e.valid_upto, "%d-%m-%Y")
				})
			elif e.visa_expiry_date:
				e.update({
					"document": "Visa",
					"expiry_date":datetime.strftime(e.visa_expiry_date, "%d-%m-%Y")
				})
			elif e.driving_license_expiry:
				e.update({
					"document": "Driving License",
					"expiry_date":datetime.strftime(e.driving_license_expiry, "%d-%m-%Y")
				})
			elif e.expiration_date:
				e.update({
					"document": "Skill - "+e.skill,
					"expiry_date":datetime.strftime(e.expiration_date, "%d-%m-%Y")
				})
			data.append(e)
		a={'id_number': 'Total','document':len(data)}
		data.append(a)
	return columns, data

def get_columns():
	columns = [{
		'label': _('ID'),
		'fieldtype': 'Link',
		'fieldname': 'id_number',
		'width': 130,
		'options': 'Employee'
	}, 
	{
		'label': _('Employee Name'),
		'fieldtype': 'Data',
		'fieldname': 'employee_name',
		'width': 150,
	},
	{
		'label': _('Document'),
		'fieldtype': 'Data',
		'fieldname': 'document',
		'width': 150,
	},
	{
		'label': _('Expiry Date'),
		'fieldtype': 'Data',
		'fieldname': 'expiry_date',
		'width': 120,
	},
	{
		'label': _('Remaining Days'),
		'fieldtype': 'Data',
		'fieldname': 'remaining_days',
		'width': 120,
	}]

	return columns


def get_data(filters,conditions):
	if filters.get('document')=='ID':
		query="""select e.id_number, e.employee_name,e.id_expiry_date,DATEDIFF(e.id_expiry_date, NOW()) as  remaining_days from `tabEmployee` e where status="Active" {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)
		return employee_list

	elif filters.get('document')=='Passport':
		query="""select e.id_number, e.employee_name,e.valid_upto,DATEDIFF(e.valid_upto, NOW()) as  remaining_days from `tabEmployee` e where status="Active" {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)
		return employee_list

	elif filters.get('document')=='Visa':
		query="""select e.id_number, e.employee_name,e.visa_expiry_date,DATEDIFF(e.visa_expiry_date, NOW()) as  remaining_days from `tabEmployee` e where status="Active" {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)
		return employee_list
	
	elif filters.get('document')=='Driving License':
		query="""select e.id_number, e.employee_name,e.driving_license_expiry,DATEDIFF(e.driving_license_expiry, NOW()) as  remaining_days from `tabEmployee` e where status="Active" {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)
		return employee_list

	elif filters.get('document')=='Employee Contract':
		query="""select e.id_number, e.employee_name,e.contract_end_date,DATEDIFF(contract_end_date, NOW()) as  remaining_days from `tabEmployee` e where status="Active" {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)
		return employee_list

	elif filters.get('document')=='Skill':
		query="""select e.id_number, e.employee_name,s.skill,s.expiration_date,DATEDIFF(s.expiration_date, NOW()) as  remaining_days from `tabEmployee` e left join `tabEmployee Skill` s on e.employee=s.parent where status="Active" {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)
		return employee_list
	
	else:
		query="""select e.id_number, e.employee_name,e.id_expiry_date,DATEDIFF(e.id_expiry_date, NOW()) as  remaining_days from `tabEmployee` e where status="Active" AND DATEDIFF(e.id_expiry_date, NOW())<=90 {conditions} """.format(conditions=conditions)
		employee_list=frappe.db.sql(query, as_dict=True)

		query="""select e.id_number, e.employee_name,e.valid_upto,DATEDIFF(e.valid_upto, NOW()) as  remaining_days from `tabEmployee` e where status="Active"AND DATEDIFF(e.valid_upto, NOW())<=90 {conditions} """.format(conditions=conditions)
		employee_list+=frappe.db.sql(query, as_dict=True)

		query="""select e.id_number, e.employee_name,e.visa_expiry_date,DATEDIFF(e.visa_expiry_date, NOW()) as  remaining_days from `tabEmployee` e where status="Active" AND DATEDIFF(e.visa_expiry_date, NOW())<=90 {conditions} """.format(conditions=conditions)
		employee_list+=frappe.db.sql(query, as_dict=True)

		query="""select e.id_number, e.employee_name,e.driving_license_expiry,DATEDIFF(e.driving_license_expiry, NOW()) as  remaining_days from `tabEmployee` e where status="Active" AND DATEDIFF(e.driving_license_expiry, NOW())<=90 {conditions} """.format(conditions=conditions)
		employee_list+=frappe.db.sql(query, as_dict=True)

		query="""select e.id_number, e.employee_name,e.contract_end_date,DATEDIFF(contract_end_date, NOW()) as  remaining_days from `tabEmployee` e where status="Active" AND DATEDIFF(contract_end_date, NOW())<=90 {conditions} """.format(conditions=conditions)
		employee_list+=frappe.db.sql(query, as_dict=True)

		query="""select e.id_number, e.employee_name,s.skill,s.expiration_date,DATEDIFF(s.expiration_date, NOW()) as  remaining_days from `tabEmployee` e left join `tabEmployee Skill` s on e.employee=s.parent where status="Active" AND DATEDIFF(s.expiration_date, NOW())<=90 {conditions} """.format(conditions=conditions)
		employee_list+=frappe.db.sql(query, as_dict=True)
		return employee_list

def get_conditions(filters):
	conditions=""
	if filters.get('employee'):
		conditions += "AND  e.employee = '{}'".format(filters.get('employee'))

	if filters.get('company'):
		conditions += " AND  e.company = '{}'".format(filters.get('company'))

	if filters.get('period')=='30':
		if filters.get('document')=='ID':
			conditions += " AND  DATEDIFF(e.id_expiry_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Passport':
			conditions += " AND  DATEDIFF(e.valid_upto, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Visa':
			conditions += " AND  DATEDIFF(e.visa_expiry_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Driving License':
			conditions += " AND  DATEDIFF(e.driving_license_expiry, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Employee Contract':
			conditions += " AND  DATEDIFF(e.contract_end_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Skill':
			conditions += " AND  DATEDIFF(s.expiration_date, NOW()) <= '{}'".format(int(filters.get('period')))
	
	if filters.get('period')=='50':
		if filters.get('document')=='ID':
			conditions += " AND  DATEDIFF(e.id_expiry_date, NOW()) >= 31 AND  DATEDIFF(e.id_expiry_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Passport':
			conditions += " AND  DATEDIFF(e.valid_upto, NOW()) >= 31 AND  DATEDIFF(e.valid_upto, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Visa':
			conditions += " AND  DATEDIFF(e.visa_expiry_date, NOW()) >= 31 AND  DATEDIFF(e.visa_expiry_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Driving License':
			conditions += " AND  DATEDIFF(e.driving_license_expiry, NOW()) >= 31 AND  DATEDIFF(e.driving_license_expiry, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Employee Contract':
			conditions += " AND  DATEDIFF(e.contract_end_date, NOW()) >= 31 AND  DATEDIFF(e.contract_end_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Skill':
			conditions += " AND  DATEDIFF(s.expiration_date, NOW()) >= 31 AND  DATEDIFF(s.expiration_date, NOW()) <='{}'".format(int(filters.get('period')))

	if filters.get('period')=='90':
		if filters.get('document')=='ID':
			conditions += " AND  DATEDIFF(e.id_expiry_date, NOW()) >= 51 AND  DATEDIFF(e.id_expiry_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Passport':
			conditions += " AND  DATEDIFF(e.valid_upto, NOW()) >= 51 AND  DATEDIFF(e.valid_upto, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Visa':
			conditions += " AND  DATEDIFF(e.visa_expiry_date, NOW()) >= 51 AND  DATEDIFF(e.visa_expiry_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Driving License':
			conditions += " AND  DATEDIFF(e.driving_license_expiry, NOW()) >= 51 AND  DATEDIFF(e.driving_license_expiry, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Employee Contract':
			conditions += " AND  DATEDIFF(e.contract_end_date, NOW()) >= 51 AND  DATEDIFF(e.contract_end_date, NOW()) <= '{}'".format(int(filters.get('period')))
		elif filters.get('document')=='Skill':
			conditions += " AND  DATEDIFF(s.expiration_date, NOW()) >= 51 AND  DATEDIFF(s.expiration_date, NOW()) <='{}'".format(int(filters.get('period')))			
	return conditions 
		#pass






