frappe.ui.form.on('Employee Skill Map', {
	// refresh: function(frm) {

	// }
    after_save:function(frm){
	frappe.call({
		"method": "frappe.client.set_value",
		"async":false,
		"args": {
		"doctype": "Employee",
		"name": frm.doc.name,
		"fieldname": "employee_skill_map",
		"value": frm.doc.name
		}
	});
    }
});