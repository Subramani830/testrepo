frappe.ui.form.on('Asset', {
	item_code: function(frm) {
	   frm.set_query("asset_barcode",function(){
            return{
       		filters: {
                    "parent":frm.doc.item_code
                }
            }
        });
	cur_frm.refresh_field("item_code")
	}
})
