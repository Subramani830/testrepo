# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import date
from datetime import timedelta
from datetime import datetime

def execute(filters=None):
	columns = get_columns()
	conditions = get_conditions(filters)
	data = get_data(filters,conditions)
	for dicts in data:
		if dicts['delivery_date'] != None:
			dicts['delivery_date'] = str(datetime.strftime(dicts['delivery_date'], "%d-%m-%Y"))
		if dicts['customers_purchase_order_valid_till'] != None:
			dicts['customers_purchase_order_valid_till'] = str(datetime.strftime(dicts['customers_purchase_order_valid_till'], "%d-%m-%Y"))

	chart = get_chart_data(data)

	return columns, data, None, chart


def get_columns():
	columns = [
		{
			"fieldname": "name",
			"label": _("Sales Order"),
			"fieldtype": "Link",
			"options": "Sales Order",
			"width": 200
		},
		{
			"fieldname": "status",
			"label": _("Billing and Delivery Status"),
			"fieldtype": "Data",
			"width": 200
		},
		{
			"fieldname": "customers_purchase_order_valid_till",
			"label": _("Delivery Date"),
			"fieldtype": "date",
			"width": 200
		},
		{
			"fieldname": "delivery_date",
			"label": _("Customer's Purchase Order Valid Till"),
			"fieldtype": "date",
			"width": 200
		},
		{
			"fieldname": "date_percentage",
			"label": _("Date %"),
			"fieldtype": "percent",
			"width": 100
		},
		{
			"fieldname": "per_billed",
			"label": _("Billed %"),
			"fieldtype": "percent",
			"width": 100
		},
		{
			"fieldname": "per_delivered",
			"label": _("Delivered %"),
			"fieldtype": "percent",
			"width": 100
		},
	]
	return columns

def get_data(filters,conditions):
	query="""select so.name,so.status,so.customers_purchase_order_valid_till,so.delivery_date, (100 - ((DATEDIFF(so.delivery_date,Now()) / DATEDIFF(so.delivery_date, so.customers_purchase_order_valid_till))*100))as date_percentage,so.per_billed,so.per_delivered from `tabSales Order` so WHERE  (100 - ((DATEDIFF(so.delivery_date,Now()) / DATEDIFF(so.delivery_date, so.customers_purchase_order_valid_till))*100))>=70{conditions}""".format(conditions=conditions)
	sales_order=frappe.db.sql(query, as_dict=True)

	return sales_order

def get_conditions(filters):
	conditions=""
	if filters.get('company'):
		conditions += " AND  so.company = '{}'".format(filters.get('company'))
		conditions += " AND so.delivery_date >= NOW()"
	return conditions

def get_chart_data(data):
	labels = []
	date_per = []
	completed = []
	bill_per = []

	for order in data:
		labels.append(order.name)
		date_per.append(order.date_percentage)
		completed.append(order.per_delivered)
		bill_per.append(order.per_billed)

	return {
		"data": {
			'labels': labels[:30],
			'datasets': [
				{
					"name": "Date %",
					"values": date_per[:30]
				},
				{
					"name": "Delivered %",
					"values": completed[:30]
				},
				{
					"name": "Billed %",
					"values": bill_per[:30]
				}
			]
		},
		"type": "bar",
		"colors": ["#fc4f51", "#ffd343","#00FF00"],
		"barOptions": {
			"stacked": False
		}
	}
