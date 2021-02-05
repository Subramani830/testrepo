// Copyright (c) 2016, veena and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Employee Documents Expiration Report"] = {
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
			"fieldname":"document",
			"label": __("Document"),
			"fieldtype": "Select",
			"options": ["","ID","Passport","Visa","Driving License","Contract","Skill"]
			
		},
		{
			"fieldname":"period",
			"label": __("Period(no of days)"),
			"fieldtype": "Select",
			"options": ["30","50","90"],
			"reqd": 1,
			"default": "30"
		}
	]
};
