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
	}
});
