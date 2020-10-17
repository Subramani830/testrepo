// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

var today = new Date().toISOString().slice(0, 10)
frappe.ui.form.on('Certificates', {
	//refresh: function(frm) {
	//}
});
frappe.ui.form.on('Document Detail', {
	expiry_date:function(frm,cdt,cdn){
		$.each(frm.doc.document_detail,function(idx,document){
			if(document.expiry_date<today){
				document.expiry_date='';
				cur_frm.refresh_field('expiry_date');
				frappe.throw("Expiry date cannot be before today's date.");
			}
		});
	},
	renewal_date:function(frm,cdt,cdn){
		$.each(frm.doc.document_detail,function(idx,document){
			if(document.renewal_date<document.expiry_date){
				document.renewal_date='';
				cur_frm.refresh_field('renewal_date');
				frappe.throw("Renewal date cannot be before expire date.");
			}
		});
	}
});