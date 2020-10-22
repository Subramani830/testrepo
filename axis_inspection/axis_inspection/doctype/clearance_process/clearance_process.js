// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Clearance Process', {
	 refresh: function(frm,cdt,cdn) {
		if(frm.fields_dict["clearance_process_detail"].grid.get_field('item_code')) {
			frm.set_query("equipment", "clearance_process_detail", function() {
				return {
					query: "erpnext.controllers.queries.item_query",
					filters: {'is_fixed_asset': 1}
				}
			});
		}
	 },
	before_save:function(frm,cdt,cdn){
		var status="Cleared"
		$.each(frm.doc.clearance_process_detail,function(idx, item){
			if(item.status=="Open"){
				status="Open"
			}
		frm.set_value('status',status)
		});
},
employee:function(frm,cdt,cdn){
	frappe.call({
		method:"axis_inspection.axis_inspection.api.get_department_manager",
		async:false,
				args: {
					doctype: 'Employee',
					name: frm.doc.employee
				},
			callback: function(r){
				console.log(r.message)
				frm.set_value('department_manager',r.message)
			}
		});
}
});
