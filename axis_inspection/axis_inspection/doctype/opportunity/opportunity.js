{% include 'erpnext/selling/sales_common.js' %}
frappe.provide("erpnext.crm");

frappe.ui.form.on('Opportunity', {
	refresh(frm,doc) {
    frm.set_query("converted_by", function() {
        return {
                query: "axis_inspection.axis_inspection.api.get_user_list",
                filters:{
                    "role":["in","Sales User","Sales Manager"]
                }
            
        };
    });
		// your code here
		var bt = ['Request For Quotation']
        bt.forEach(function(bt){
            frm.page.remove_inner_button(bt, 'Create')
            });
		if(!doc.__islocal && doc.status!=="Lost") {
			if(frm.doc.with_items){		
		frm.add_custom_button(__('Request For Supplier Quotation'),
			function() {
				frm.trigger("make_request_for_quotation")
			}, __('Create'));
			}
		}
		},
	make_request_for_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "erpnext.crm.doctype.opportunity.opportunity.make_request_for_quotation",
			frm: frm
		})
	}
})
