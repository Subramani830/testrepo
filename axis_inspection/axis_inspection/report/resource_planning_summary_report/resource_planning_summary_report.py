# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def execute(filters=None):
	q_issue = []
	q_return = []
	q = []
	columns = get_columns()
	conditions,conditions1 = get_conditions(filters)
	data = get_data(filters,conditions,conditions1)
	print(data)
	for dicts in data:
		if dicts['qty_issued'] == 0.0:
			dicts['qty_issued'] = None
		else:
			dicts['qty_issued'] = int(dicts['qty_issued'])
			q_issue.append(dicts['qty_issued'])
		if dicts['qty_return'] == 0.0:
			dicts['qty_return'] = None
		else :
			dicts['qty_return'] = int(dicts['qty_return'])
			q_return.append(dicts['qty_return'])
		dicts['qty'] = int(dicts['qty'])
		q.append(dicts['qty'])
	a = {'item_name':'Total','qty_issued':sum(q_issue),'qty_return':sum(q_return),'qty':sum(q)}
	data.append(a)
	data.append({})
	return columns, data

def get_columns():
	columns = [
		{
			"fieldname": "item_name",
			"label": _("Particular"),
			"fieldtype": "Data",
			"width": 200
		},
		{
			"fieldname": "item_code",
			"label": _("Code"),
			"fieldtype": "Link",
			"options": "Item",
			"width": 200
		},
		{
			"fieldname": "qty_issued",
			"label": _("Qty Issued"),
			"fieldtype": "Int",
			"width": 200
		},
		{
			"fieldname": "qty_return",
			"label": _("Qty Returned"),
			"fieldtype": "Int",
			"width": 200
		},
		{
			"fieldname": "qty",
			"label": _("Quantity"),
			"fieldtype": "Int",
			"width": 200
		},
		{
			"fieldname": "employee",
			"label": _("Employee"),
			"fieldtype": "Link",
			"options": "Employee",
			"width": 200
		},
		{
			"fieldname": "name",
			"label": _("Resource Planning"),
			"fieldtype": "Link",
			"options": "Resource Planning",
			"width": 200
		}
	]
	return columns

def get_data(filters,conditions,conditions1):
	query="""select sed.item_name,sed.item_code,(CASE WHEN se.stock_entry_type='Material Issue' THEN sed.qty ELSE 0 END)as qty_issued,(CASE WHEN se.stock_entry_type='Material Receipt' THEN sed.qty ELSE 0 END)as qty_return,(CASE WHEN se.stock_entry_type='Material Issue' THEN sed.qty ELSE -1*sed.qty END)as qty,se.employee,rp.name,se.name as se_name from `tabStock Entry` se \
		JOIN `tabSales Order` so ON se.project=so.project \
		JOIN `tabResource Planning` rp ON so.name=rp.sales_order \
		LEFT JOIN `tabStock Entry Detail` sed ON se.name=sed.parent \
		where se.docstatus = 1 {conditions} \
		UNION \
		SELECT ta.item_name,ta.item_code, (CASE WHEN tam.purpose='Issue' THEN 1 ELSE 0 END)as qty_issued,(CASE WHEN tam.purpose='Receipt' THEN 1 ELSE 0 END)as qty_return,(CASE WHEN tam.purpose='Issue' THEN 1 ELSE -1 END)as qty, (tami.to_employee)as employee,trp.name,tam.name as am_name FROM `tabAsset Movement` tam 
		JOIN `tabSales Order` tso ON tam.project=tso.project
		JOIN `tabResource Planning` trp on tso.name=trp.sales_order 
		LEFT JOIN `tabAsset Movement Item` tami on tam.name=tami.parent
		Left JOIN `tabAsset` ta ON tami.asset=ta.name where tam.docstatus=1 {conditions1}\
		""".format(conditions=conditions,conditions1=conditions1)
	resource=frappe.db.sql(query, as_dict=True)

	return resource


def get_conditions(filters):
	conditions=""
	conditions1=""
	if filters.get('company'):
		conditions += " AND  se.company = '{}'".format(filters.get('company'))
		conditions1 += " AND  tam.company = '{}'".format(filters.get('company'))
	if filters.get('from_date'):
		conditions += " AND  se.posting_date >= '{}'".format(filters.get('from_date'))
		conditions1 += " AND  tam.transaction_date >= '{}'".format(filters.get('from_date'))
	if filters.get('to_date'):
		conditions += " AND  se.posting_date <= '{}'".format(filters.get('to_date'))
		conditions1 += " AND  tam.transaction_date <= '{}'".format(filters.get('to_date'))
	if filters.get('employee'):
		conditions += "AND se.employee = '{}'".format(filters.get('employee'))
		conditions1 += "AND tami.to_employee = '{}'".format(filters.get('employee'))
	return conditions,conditions1