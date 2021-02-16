# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime as dt

def execute(filters=None):
	data= []
	work_h = []
	late_e = []
	early_e = []
	present = []
	absent = []

	columns = get_columns()
	conditions=get_conditions(filters)
	data = get_data(filters,conditions)
	for dicts in data:
		if dicts['in_time'] != None:
			dicts['in_time'] = str(dicts['in_time'])
		if dicts['out_time'] != None:
			dicts['out_time'] = str(dicts['out_time'])
		dicts['working_hours'] = float(dicts['working_hours'])
		work_h.append(dicts['working_hours'])
		dicts['late_entry'] = float(dicts['late_entry'])
		late_e.append(dicts['late_entry'])
		dicts['early_exit'] = float(dicts['early_exit'])
		early_e.append(dicts['early_exit'])
		if dicts['status'] == 'Present':
			present.append(dicts['status'])
		if dicts['status'] == 'Absent':
			absent.append(dicts['status'])


	a={'employee': 'Total','working_hours':sum(work_h),'late_entry':sum(late_e),'early_exit':sum(early_e),'status':'Present ='+str(len(present))+",\n"+'Absent ='+str(len(absent))}
	data.append(a)
	data.append({})

	return columns, data

def validate_filters(filters):
	if not filters.get("company"):
		frappe.throw(_("{0} is mandatory").format(_("Company")))
	
	if not filters.get("from_date") and not filters.get("to_date"):
		frappe.throw(_("{0} and {1} are mandatory").format(frappe.bold(_("From Date")), frappe.bold(_("To Date"))))
	
	if filters.from_date > filters.to_date:
		frappe.throw(_("From Date must be before To Date"))

def get_columns():
	columns = [
		{
			'label':_('Employee'),
			'fieldtype': 'Link',
			'fieldname': 'employee',
			'width': 160,
			'options':'Employee' 
		},
		{
			'label':_('Employee Name'),
			'fieldtype': 'Data',
			'fieldname': 'employee_name',
			'width': 130
		},
		{
			'label':_('Designation'),
			'fieldtype': 'Data',
			'fieldname': 'designation',
			'width': 130 
		},
		{
			'label':_('Department'),
			'fieldtype': 'Data',
			'fieldname': 'department',
			'width': 130
		},
		{
			'label':_('Branch'),
			'fieldtype': 'Data',
			'fieldname': 'branch',
			'width': 130
		},
		{
			'label':_('Date'),
			'fieldtype': 'Date',
			'fieldname': 'attendance_date',
			'width': 130 
		},
		{
			'label':_('In Time'),
			'fieldtype': 'Datetime',
			'fieldname': 'in_time',
			'width': 130 
		},
		{
			'label':_('Out Time'),
			'fieldtype': 'Datetime',
			'fieldname': 'out_time',
			'width': 130 
		},
		{
			'label':_('Working Hours'),
			'fieldtype': 'Float',
			'fieldname': 'working_hours',
			'width': 130 
		},
		{
			'label':_('Late Entry'),
			'fieldtype': 'Data',
			'fieldname': 'late_entry',
			'width': 130 
		},
		{
			'label':_('Early Exit'),
			'fieldtype': 'Data',
			'fieldname': 'early_exit',
			'width': 130 
		},
		{
			'label':_('Status'),
			'fieldtype': 'Data',
			'fieldname': 'status',
			'width': 150 
		}
	]
	return columns

def get_data(filters,conditions):
	query="""select a.employee, a.employee_name,e.department,e.designation,e.branch,a.attendance_date,a.in_time,a.out_time,a.working_hours,(CASE WHEN a.late_entry=1 THEN a.shift_time-a.working_hours ELSE a.late_entry END) as late_entry,(CASE WHEN a.early_exit=1 THEN a.shift_time-a.working_hours ELSE a.early_exit END) as early_exit,a.status from `tabAttendance` a LEFT JOIN `tabEmployee` e on a.employee=e.name where a.docstatus = 1 {conditions} ORDER BY a.attendance_date ASC""".format(conditions=conditions)
	employee_list=frappe.db.sql(query, as_dict=True)

	return employee_list

def get_conditions(filters):
	conditions=""
	if filters.get('company'):
		conditions += " AND  a.company = '{}'".format(filters.get('company'))
	if filters.get('from_date'):
		conditions += " AND  a.attendance_date >= '{}'".format(filters.get('from_date'))
	if filters.get('to_date'):
		conditions += " AND  a.attendance_date <= '{}'".format(filters.get('to_date'))
	if filters.get('employee'):
		conditions += " AND  a.employee = '{}'".format(filters.get('employee'))
	if filters.get('designation'):
		conditions += " AND  e.designation = '{}'".format(filters.get('designation'))
	if filters.get('department'):
		conditions += " AND  e.department = '{}'".format(filters.get('department'))
	if filters.get('branch'):
		conditions += " AND  e.branch = '{}'".format(filters.get('branch'))
	return conditions
