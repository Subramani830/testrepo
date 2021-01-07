// Copyright (c) 2019, Frappe Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Skill', {
	 refresh: function(frm) {
		if (!frm.is_new()) {
			frm.add_custom_button(__('Update Skill Name'), function () {
			frm.trigger("update_skill_name");
			});
	}
	 },
	update_skill_name: function(frm) {
		var d = new frappe.ui.Dialog({
			title: __('Update Skill Name'),
			fields: [
				{
					"label": "Skill Name",
					"fieldname": "skill_name",
					"fieldtype": "Data",
					"reqd": 1,
					"default": frm.doc.skill_name
				}
			],
			primary_action: function() {
				var data = d.get_values();
				if(data.skill_name === frm.doc.skill_name) {
					d.hide();
					return;
				}

				frappe.call({
					method: "axis_inspection.axis_inspection.doctype.skill.skill.update_skill_name",
					args: {
						skill_name: data.skill_name,
						name: frm.doc.name
					},
					callback: function(r) {
						if(!r.exc) {
							if(r.message) {
								frappe.set_route("Form", "Skill", r.message);
							} else {
								frm.set_value("skill_name", data.skill_name);
							}
							d.hide();
						}
					}
				});
			},
			primary_action_label: __('Update')
		});
		d.show();
	}
});
