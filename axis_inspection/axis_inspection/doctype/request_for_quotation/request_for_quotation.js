frappe.ui.form.on('Request for Quotation', {
    onload_post_render: function(frm){ 
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
                        frappe.model.set_value(item.doctype, item.name, "project_name", r.message[i].project);
                        frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
                    }
                }
            });
        }
    });
}
});
frappe.ui.form.on('Request for Quotation Item', {
    material_request: function(frm){
        console.log('rvs')
        
        }
    });