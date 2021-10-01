frappe.query_reports["Asset Report"] = {
    "filters": [
		{
			"fieldname":"date",
			"label": __("Date"),
			"fieldtype": "Date",
			"reqd": 1,
			"default": frappe.datetime.get_today(),
		}
    ]
}