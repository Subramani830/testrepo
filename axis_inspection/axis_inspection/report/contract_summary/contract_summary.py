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
		if dicts['start_date'] != None:
			dicts['start_date'] = str(datetime.strftime(dicts['start_date'], "%d-%m-%Y"))
		if dicts['end_date'] != None:
			dicts['end_date'] = str(datetime.strftime(dicts['end_date'], "%d-%m-%Y"))
	chart = get_chart_data(data)

	return columns, data, None, chart
def get_columns():
	columns = [
		{
			"fieldname": "name",
			"label": _("Contract"),
			"fieldtype": "Link",
			"options": "Contract",
			"width": 200
		},
		{
			"fieldname": "party_type",
			"label": _("Party Type"),
			"fieldtype": "select",
			"width": 200
		},
		{
			"fieldname": "party_name",
			"label": _("Party Name"),
			"fieldtype": "data",
			"width": 200
		},
		{
			"fieldname": "start_date",
			"label": _("Start Date"),
			"fieldtype": "date",
			"width": 100
		},
		{
			"fieldname": "end_date",
			"label": _("End Date"),
			"fieldtype": "date",
			"width": 100
		},
		{
			"fieldname": "date_percentage",
			"label": _("Date %"),
			"fieldtype": "percent",
			"width": 100
		},
		{
			"fieldname": "maximum_value",
			"label": _("Maximum Value"),
			"fieldtype": "currency",
			"width": 150
		},
		{
			"fieldname": "amt_left",
			"label": _("Amount Left"),
			"fieldtype": "currency",
			"width": 150
		},
		{
			"fieldname": "amt_per",
			"label": _("Amount Remaining%"),
			"fieldtype": "percent",
			"width": 150
		}
	]
	return columns

def get_data(filters,conditions):
	query="""select c.name,c.party_type,c.party_name,c.start_date,c.end_date, (100 - ((DATEDIFF(c.end_date,Now()) / DATEDIFF(c.end_date, c.start_date))*100))as date_percentage, c.maximum_value, c.amt_left,((c.amt_left/c.maximum_value)*100)as amt_per from `tabContract` c WHERE  (100 - ((DATEDIFF(c.end_date,Now()) / DATEDIFF(c.end_date, c.start_date))*100))>=70{conditions}""".format(conditions=conditions)
	contract=frappe.db.sql(query, as_dict=True)

	return contract

def get_conditions(filters):
	conditions=""
	if filters.get('company'):
		conditions += " AND  c.company = '{}'".format(filters.get('company'))
		conditions += " AND c.end_date >= NOW()"
	return conditions

def get_chart_data(data):
	labels = []
	date_per = []
	#completed = []
	amt_perc = []

	for con in data:
		labels.append(con.name)
		date_per.append(con.date_percentage)
		#completed.append(con.per_delivered)
		amt_perc.append(con.amt_per)

	return {
		"data": {
			'labels': labels[:30],
			'datasets': [
				{
					"name": "Date %",
					"values": date_per[:30]
				},
				{
					"name": "Amount %",
					"values": amt_perc[:30]
				}
			]
		},
		"type": "bar",
		"colors": ["#fc4f51","#ffd343"],
		"barOptions": {
			"stacked": False
		}
	}
