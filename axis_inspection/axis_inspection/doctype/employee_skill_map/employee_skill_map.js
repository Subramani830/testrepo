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

frappe.ui.form.on('Employee Skill', {
expiration_date:function(frm,cdt, cdn){
	$.each(frm.doc.employee_skills,function(idx,skill){
		if(skill.expiration_date<skill.evaluation_date){
			skill.expiration_date='';
			cur_frm.refresh_field('expiration_date');
			frappe.throw("Expiration date cannot be before Evaluation date.");
		}
	});
}
});