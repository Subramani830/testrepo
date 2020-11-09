frappe.listview_settings['Request Customer Quotation'] = {
	add_fields: ["customer_name", "opportunity_type", "opportunity_from", "status"],
	get_indicator: function(doc) {
		var indicator = [__(doc.status), frappe.utils.guess_colour(doc.status), "status,=," + doc.status];
		if(doc.status=="Quotation") {
			indicator[1] = "green";
		}
		return indicator;
	},
	onload: function(listview) {
		var method = "axis_inspection.axis_inspection.doctype.request_customer_quotation.request_customer_quotation.set_multiple_status";

		listview.page.add_menu_item(__("Set as Open"), function() {
			listview.call_for_selected_items(method, {"status": "Open"});
		});

		listview.page.add_menu_item(__("Set as Closed"), function() {
			listview.call_for_selected_items(method, {"status": "Closed"});
		});

		if(listview.page.fields_dict.opportunity_from) {
			listview.page.fields_dict.opportunity_from.get_query = function() {
				return {
					"filters": {
						"name": ["in", ["Customer", "Lead"]],
					}
				};
			};
		}
	}
};
