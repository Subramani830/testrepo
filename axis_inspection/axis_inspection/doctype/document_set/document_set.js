// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Document Set', {
	after_save: function(frm) {
		frappe.call({
			"method": "frappe.client.set_value",
			"async":false,
			"args": {
			"doctype": "Employee",
			"name": frm.doc.employee,
			"fieldname": "document_set",
			"value": frm.doc.name
			}
		});
	 }
});

frappe.ui.form.on('Document Detail', {
	expiry_date:function(frm,cdt,cdn){
		$.each(frm.doc.document_detail,function(idx,document_set){
			if(document_set.expiry_date<today){
				document_set.expiry_date='';
				cur_frm.refresh_field('expiry_date');
				frappe.throw("Expiry date cannot be before today's date.");
			}
		});
	},
	renewal_date:function(frm,cdt,cdn){
		$.each(frm.doc.document_detail,function(idx,document_set){
			if(document_set.renewal_date<document.expiry_date){
				document_set.renewal_date='';
				cur_frm.refresh_field('renewal_date');
				frappe.throw("Renewal date cannot be before expire date.");
			}
		});
	}
});
