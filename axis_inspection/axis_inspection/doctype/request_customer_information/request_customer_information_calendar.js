frappe.views.calendar["Request Customer Information"] = {
	field_map: {
		"start": "contact_date",
		"end": "contact_date",
		"id": "name",
		"title": "customer_name",
		"allDay": "allDay"
    },
	options: {
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month'
		}
    },
    get_events_method: 'axis_inspection.axis_inspection.doctype.request_customer_information.request_customer_information.get_events'
}
