frappe.ui.form.on('Asset', {
	item_code: function(frm) {
	    frm.set_query("asset_barcode",function(){
            return{
       		filters: [
                    ["Item Barcode","parent", "in",[frm.doc.item_code]]
                ]
            }
        });
	}
})
