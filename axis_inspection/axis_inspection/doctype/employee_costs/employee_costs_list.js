frappe.listview_settings['Employee Costs'] = {
	get_indicator: function (doc) {
		if (doc.status === "Cancelled") {
			return [__("Cancelled"), "red", "status,=,Cancelled"];
		} else if (doc.status === "Draft") {
			return [__("Draft"), "orange", "status,=,Draft"];
		} else if (doc.status === "Paid") {
			return [__("Paid"), "green", "status,=,Paid"];
		}else if (doc.status === "Submitted") {
			return [__("Submitted"), "blue", "status,=,Submitted"];
		}
	}
};
