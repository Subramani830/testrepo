frappe.ui.form.on('Supplier Quotation', {
    onload_post_render: function(frm){ 
	var bt = ['Quotation', 'Subscription']
        bt.forEach(function(bt){
        frm.page.remove_inner_button(bt, 'Create')
            });
	
   }
})
