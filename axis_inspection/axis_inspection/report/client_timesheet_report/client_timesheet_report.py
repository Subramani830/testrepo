# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
# from frappe.utils  import flt,add_days
from frappe import _
from datetime import datetime

def execute(filters=None):
	columns = get_columns()
	data = get_data(filters)
	return columns, data

def get_columns():
	columns = [
		{
			"fieldname":"name",
			"label": _("Name"),
			"fieldtype": "Link",
			"options": "Timesheet",
			"width":150
		},
		{
			'fieldname': 'start_date',
			'label':_('Start Date'),
			'fieldtype': 'date',
			'width': 150,
		},
		{
			'fieldname': 'employee',
			'label':_('Employee'),
			'fieldtype': 'Link',
			'width': 150,
			'options':'Employee' 
		},
		{
			"fieldname":"project",
			"label":_("Project"),
			"fieldtype":"Link",
			"options":"Project",
			"width":150
		},
		{
			"fieldname":"task",
			"label":_("Task"),
			"fieldtype":"Link",
			"options":"Task",
			"width":150
		},
		{
			"fieldname":"contract_no",
			"label":_("Contract"),
			"fieldtype":"Link",
			"options":"Contract",
			"width":150
		},
		{
			"fieldname":"sales_order",
			"label":_("Sales Order"),
			"fieldtype":"Link",
			"options":"Sales Order",
			"width":150
		},
		{
			"fieldname":"po_no",
			"label":_("Customer Purchase Order"),
			"fieldtype":"Link",
			"options":"Contract",
			"width":150
		},
		{
			"fieldname":"customer",
			"label":_("Customer"),
			"fieldtype":"Link",
			"options":"Customer",
			"width":150
		},
		{
			"fieldname":"asset_name",
			"label":_("Asset Name"),
			"fieldtype":"Link",
			"options":"Asset",
			"width":150
		},
		{
			"fieldname":"hours",
			"label":_("Hours"),
			"fieldtype":"Data",
			"width":150
		},
		{
			"fieldname":"item_name",
			"label":_("Item Name"),
			"fieldtype":"Link",
			"options":"Item",
			"width":150
		},
		{
			"fieldname":"quantity",
			"label":_("Quantity"),
			"fieldtype":"Data",
			"width":150
		},
	]
	return columns

def get_data(filters):
	conditions=get_conditions(filters)
	query="""select  DISTINCT t.name,t.start_date,t.employee,t.project,td.task,t.contract_no,t.sales_order,t.po_no,s.customer,at.asset_name,at.hours,cd.item_name,cd.quantity from `tabTimesheet` t LEFT JOIN `tabTimesheet Detail` td  on td.parent=t.name LEFT JOIN `tabSales Order` s on t.sales_order=s.name LEFT JOIN `tabAsset Item` at on t.name=at.parent LEFT JOIN `tabConsumable Detail` cd on t.name=cd.parent where t.status!="Cancelled"{conditions}""".format(conditions=conditions)
	return frappe.db.sql(query, as_list=True)

def get_conditions(filters):
	conditions=""
	if filters.get('company'):
		conditions += " AND  t.company = '{}'".format(filters.get('company'))
	if filters.get('start_date'):
		conditions += " AND  t.start_date >= '{}'".format(filters.get('start_date'))
	if filters.get('end_date'):
		conditions += " AND  t.end_date <= '{}'".format(filters.get('end_date'))
	if filters.get('employee'):
		conditions += " AND  t.employee = '{}'".format(filters.get('employee'))
	if filters.get('sales_order'):
		conditions += " AND  t.sales_order = '{}'".format(filters.get('sales_order'))
	if filters.get('project'):
		conditions += " AND  t.project = '{}'".format(filters.get('project'))
	if filters.get('task'):
		conditions += " AND  td.task = '{}'".format(filters.get('task'))
	if filters.get('contract_no'):
		conditions += " AND  t.contract_no = '{}'".format(filters.get('contract_no'))
	if filters.get('po_no'):
		conditions += " AND  t.po_no = '{}'".format(filters.get('po_no'))
	if filters.get('customer'):
		conditions += " AND  s.customer = '{}'".format(filters.get('customer'))
	if filters.get('status'):
		conditions += " AND  t.status= '{}'".format(filters.get('status'))

	return conditions

def validate_filters(filters):
	if not filters.get("company"):
		frappe.throw(_("{0} is mandatory").format(_("Company")))
	
	if not filters.get("start_date") and not filters.get("end_date"):
		frappe.throw(_("{0} and {1} are mandatory").format(frappe.bold(_("From Date")), frappe.bold(_("To Date"))))
	
	if filters.from_date > filters.to_date:
		frappe.throw(_("From Date must be before To Date"))
