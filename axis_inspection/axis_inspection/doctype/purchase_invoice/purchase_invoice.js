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
