frappe.ui.form.on('Purchase Invoice', {
    refresh:function(frm){
        $.each(frm.doc.items,function(idx, item){
            if(item.purchase_receipt!=undefined){
                frappe.call({
                    method:"axis_inspection.axis_inspection.api.get_cost_center",
                    async:false,
                    args:{
                        doctype:'Purchase Receipt Item',
                        name:item.purchase_receipt,
                        parenttype:'Purchase Receipt'
                    },
                    callback:function(r){
                        frm.set_value("cost_center",r.message)
                    }
                });
            }
        });
    }
});

frappe.ui.form.on('Purchase Invoice Item', {
	items_add(frm,cdt,cdn) {
	    var cur_grid =frm.get_field('items').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if (frm.doc.reference_no!=undefined){
    		cur_row.doc.reference_no=frm.doc.reference_no
    		cur_frm.refresh_fields();
		}
	}
})
