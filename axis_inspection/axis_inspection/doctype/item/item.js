frappe.ui.form.on('Item', {
	after_save(frm) {
		$.each(frm.doc.barcodes, function(idx, b){
			frappe.call({
				method:"axis_inspection.axis_inspection.api.set_barcode_name",
				args:{
					barcode:b.barcode		
				},
				async:false,
				callback: function(r){
				}
		    	});
		})
	},
	refresh:function(frm){
		frm.set_query('item_group', () => {
			return {
				filters: [
					['Item Group', 'docstatus', '!=', 2],
					['Item Group', 'is_group', '=', 0]
				]
			}
		})
	}
})
