frappe.ui.form.on('Material Request', {
	onload_post_render: function(frm) {
		// your code here
		frm.remove_custom_button("Bill of Materials", 'Get items from');
		frm.remove_custom_button("Product Bundle", 'Get items from');
	var bt = ['Pick List']
        bt.forEach(function(bt){
        frm.page.remove_inner_button(bt, 'Create')
            });
	},
	after_save:function(frm){
		location.reload()
	},
	requested_for:function(frm) {
				if(frm.doc.requested_for!==undefined){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_reports_to",
			async:false,
					args: {
						doctype: 'Employee',
						name: frm.doc.requested_for
					},
				callback: function(r){
					frm.set_value('department_manager',r.message)
				}
			});
			}
	}
});
