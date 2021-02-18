// Copyright (c) 2016, veena and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Contract Summary"] = {
	"filters": [
		{
			"fieldname": "company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"default": frappe.defaults.get_user_default("Company"),
			"reqd": 1
		}
	]
};
