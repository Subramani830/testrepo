frappe.ui.form.on('Supplier Quotation', {
    on_submit: function(frm){
	location.reload()
	},
    onload_post_render: function(frm){ 
	var bt = ['Quotation', 'Subscription']
        bt.forEach(function(bt){
        frm.page.remove_inner_button(bt, 'Create')
            });
            $.each(frm.doc.items,function(idx, item){
		if(item.material_request!=undefined){
		    frappe.call({
		        method:"axis_inspection.axis_inspection.api.update_project",
		        async:false,
		        args:{
		            doctype:'Material Request Item',
		            name:item.material_request,
		            parenttype:'Material Request'
		        },
		        callback:function(r){
		            for(var i=0;i<r.message.length;i++){
		                frappe.model.set_value(item.doctype, item.name, "project", r.message[i].project);
		                frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
		            }
		        }
		    });
		}
	});
	
   }
})
