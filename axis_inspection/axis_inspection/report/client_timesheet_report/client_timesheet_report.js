// Copyright (c) 2016, veena and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Client Timesheet Report"] = {
	"filters": [
		{
			"fieldname":"company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"reqd": 1,
			"default": frappe.defaults.get_user_default("Company")
		},
		{
			"fieldname": "start_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_days(frappe.datetime.get_today(), -1),
			"reqd": 1
			},
			{
			"fieldname": "end_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today(),
			"reqd": 1
			},
		{
			"fieldname":"employee",
			"label": __("Employee"),
			"fieldtype": "Link",
			"options": "Employee",
		},
		{
			"fieldname":"project",
			"label":__("Project"),
			"fieldtype":"Link",
			"options":"Project"
		},
		{
			"fieldname":"task",
			"label":__("Task"),
			"fieldtype":"Link",
			"options":"Task"
		},
		{
			"fieldname":"sales_order",
			"label":__("Sales Order"),
			"fieldtype":"Link",
			"options":"Sales Order"
		},
		{
			"fieldname":"contract",
			"label":__("Contract"),
			"fieldtype":"Link",
			"options":"Contract"
		},
		{
			"fieldname":"po_no",
			"label":__("Customer Purchase Order"),
			"fieldtype":"Link",
			"options":"Contract"
		},
		{
			"fieldname":"customer",
			"label":__("Customer"),
			"fieldtype":"Link",
			"options":"Customer"
		}
	]
};