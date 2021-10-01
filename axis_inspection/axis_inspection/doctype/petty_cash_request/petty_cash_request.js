frappe.ui.form.on('Petty Cash Request', {
	refresh: function (frm) {
        frm.set_query('petty_cash_account', () => {
			return {
				filters: {
					parent_account: 'Petty Cash - AXIS'
				}
			}
		})
        if(frm.doc.docstatus==1){
            frm.add_custom_button(__('Payment Entry'), function(){
                frappe.call({
                    method:"axis_inspection.axis_inspection.doctype.petty_cash_request.petty_cash_request.create_payment_entry_record",
                    args: {
                        'doc': frm.doc
                    },
                    callback: function(r) {
                        var payment_entry_record_name=r.message
                        frappe.set_route("Form", "Payment Entry",payment_entry_record_name);
                    }
                })
            }, __("Create"));
        }
    }
});