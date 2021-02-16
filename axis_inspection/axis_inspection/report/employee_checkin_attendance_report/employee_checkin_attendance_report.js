// Copyright (c) 2016, veena and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Employee Checkin Attendance Report"] = {
	"filters": [{
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
		},
		{
			"fieldname":"designation",
			"label": __("Designation"),
			"fieldtype": "Link",
			"options": "Designation",
		},
		{
			"fieldname":"department",
			"label": __("Department"),
			"fieldtype": "Link",
			"options": "Department",
		},
		{
			"fieldname":"branch",
			"label": __("Branch"),
			"fieldtype": "Link",
			"options": "Branch",
		}
	],
	"formatter": function(value, row, column, data, default_formatter) {
		value = default_formatter(value, row, column, data);
		if (data && data.bold) {
			value = value.bold();

		}
		return value;
	}
};
