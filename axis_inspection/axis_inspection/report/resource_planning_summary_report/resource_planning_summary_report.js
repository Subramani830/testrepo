// Copyright (c) 2016, veena and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Resource Planning Summary Report"] = {
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
			"fieldname":"employee",
			"label": __("Employee"),
			"fieldtype": "Link",
			"options": "Employee",
		},
		{
		"fieldname": "from_date",
		"label": __("From Date"),
		"fieldtype": "Date",
		"default": frappe.datetime.add_days(frappe.datetime.get_today(), -1),
		"reqd": 1
		},
		{
		"fieldname": "to_date",
		"label": __("To Date"),
		"fieldtype": "Date",
		"default": frappe.datetime.get_today(),
		"reqd": 1
		}

	]
};
