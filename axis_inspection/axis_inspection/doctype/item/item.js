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
	}
})
