// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Timesheet', {
employee:function(frm,cdt,cdn){
	frappe.call({
		method:"axis_inspection.axis_inspection.api.get_department_manager",
		async:false,
				args: {
					doctype: 'Employee',
					name: frm.doc.employee
				},
			callback: function(r){
				frm.set_value('department_manager',r.message)
			}
		});
}
});
