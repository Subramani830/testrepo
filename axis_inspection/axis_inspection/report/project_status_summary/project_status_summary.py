# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _

def execute(filters=None):
	columns = get_columns()
	data = []
	conditions=get_conditions(filters)

	data = get_data(filters,conditions)
	for project in data:
		project["total_tasks"] = frappe.db.count("Task", filters={"project": project['name']})
		project["completed_tasks"] = frappe.db.count("Task", filters={"project": project['name'], "status": "Completed"})
		project["overdue_tasks"] = frappe.db.count("Task", filters={"project": project['name'], "status": "Overdue"})

	chart = get_chart_data(data)
	report_summary = get_report_summary(data)

	return columns, data, None, chart, report_summary

def get_columns():
	return [
		{
			"fieldname": "name",
			"label": _("Project"),
			"fieldtype": "Link",
			"options": "Project",
			"width": 200
		},
		{
			"fieldname": "project_type",
			"label": _("Type"),
			"fieldtype": "Link",
			"options": "Project Type",
			"width": 120
		},
		{
			"fieldname": "status",
			"label": _("Status"),
			"fieldtype": "Data",
			"width": 120
		},
		{
			"fieldname": "total_tasks",
			"label": _("Total Tasks"),
			"fieldtype": "Data",
			"width": 120
		},
		{
			"fieldname": "completed_tasks",
			"label": _("Tasks Completed"),
			"fieldtype": "Data",
			"width": 120
		},
		{
			"fieldname": "overdue_tasks",
			"label": _("Tasks Overdue"),
			"fieldtype": "Data",
			"width": 120
		},
		{
			"fieldname": "percent_complete",
			"label": _("Completion"),
			"fieldtype": "Data",
			"width": 120
		},
		{
			"fieldname": "expected_start_date",
			"label": _("Start Date"),
			"fieldtype": "Date",
			"width": 120
		},
		{
			"fieldname": "expected_end_date",
			"label": _("End Date"),
			"fieldtype": "Date",
			"width": 120
		},
		{
			"fieldname": "date_percentage",
			"label": _("Duration Left%"),
			"fieldtype": "percent",
			"width": 200
		},
		{
			"fieldname": "total_sales_amount",
			"label": _("Total Sales Amount"),
			"fieldtype": "currency",
			"width": 150
		},
		{
			"fieldname": "total_billed_amount",
			"label": _("Total Billed Amount"),
			"fieldtype": "currency",
			"width": 200
		},
		{
			"fieldname": "sales_percentage",
			"label": _("Sales Remaining%"),
			"fieldtype": "percent",
			"width": 150
		}
	]

def get_data(filters,conditions):
	query="""select p.name,p.status,p.percent_complete,p.expected_start_date,p.expected_end_date,p.project_type,(CASE WHEN p.expected_start_date > NOW() THEN 100 ELSE ( (DATEDIFF(p.expected_end_date,Now()) / DATEDIFF(p.expected_end_date, p.expected_start_date))*100)END)as date_percentage,p.total_sales_amount,p.total_billed_amount,(((p.total_sales_amount-p.total_billed_amount)/p.total_sales_amount)*100) as sales_percentage from `tabProject` p WHERE {conditions} ORDER BY p.expected_end_date ASC""".format(conditions=conditions)
	proj=frappe.db.sql(query, as_dict=True)

	return proj

def get_conditions(filters):
	conditions=""
	if filters.get('company'):
		conditions += " p.company = '{}'".format(filters.get('company'))
		conditions += " AND p.expected_end_date >= NOW()"
	if filters.get('is_active'):
		conditions += " AND  p.is_active = '{}'".format(filters.get('is_active'))
	if filters.get('status'):
		conditions += " AND  p.status = '{}'".format(filters.get('status'))
	if filters.get('project_type'):
		conditions += " AND  p.project_type = '{}'".format(filters.get('project_type'))
	if filters.get('priority'):
		conditions += " AND  p.priority = '{}'".format(filters.get('priority'))
	return conditions


def get_chart_data(data):
	labels = []
	total = []
	completed = []
	overdue = []
	date_per = []
	sales_per = []

	for project in data:
		labels.append(project.name)
		total.append(project.total_tasks)
		completed.append(project.completed_tasks)
		overdue.append(project.overdue_tasks)
		date_per.append(project.date_percentage)
		sales_per.append(project.sales_percentage)

	return {
		"data": {
			'labels': labels[:50],
			'datasets': [
				{
					"name": "Overdue",
					"values": overdue[:30]
				},
				{
					"name": "Completed",
					"values": completed[:30]
				},
				{
					"name": "Total Tasks",
					"values": total[:30]
				},
				{
					"name": "Duration Left%",
					"values": date_per[:30]
				},
				{
					"name": "Sales Remaining%",
					"values": sales_per[:50]
				},
			]
		},
		"type": "bar",
		"colors": ["#fc4f51", "#ffd343","#00FF00", "#7575ff","#78d6ff"],
		"barOptions": {
			"stacked": False
		}
	}

def get_report_summary(data):
	if not data:
		return None

	avg_completion = sum([project.percent_complete for project in data]) / len(data)
	total = sum([project.total_tasks for project in data])
	total_overdue = sum([project.overdue_tasks for project in data])
	completed = sum([project.completed_tasks for project in data])

	return [
		{
			"value": avg_completion,
			"indicator": "Green" if avg_completion > 50 else "Red",
			"label": "Average Completion",
			"datatype": "Percent",
		},
		{
			"value": total,
			"indicator": "Blue",
			"label": "Total Tasks",
			"datatype": "Int",
		},
		{
			"value": completed,
			"indicator": "Green",
			"label": "Completed Tasks",
			"datatype": "Int",
		},
		{
			"value": total_overdue,
			"indicator": "Green" if total_overdue == 0 else "Red",
			"label": "Overdue Tasks",
			"datatype": "Int",
		}
	]
