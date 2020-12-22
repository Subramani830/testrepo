frappe.ui.form.on('Purchase Receipt Item', {
    onload_post_render: function(frm){ 
    $.each(frm.doc.items,function(idx, item){
        frm.set_value("project",item.project)
            });
    }
});
