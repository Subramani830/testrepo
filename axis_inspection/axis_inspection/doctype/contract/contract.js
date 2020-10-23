frappe.ui.form.on('Contract', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 1 && frm.doc.party_type=='Customer'){    
            frm.page.add_inner_button('Sales Order', function(){
                var doc = frappe.model.get_new_doc('Sales Order');
                doc.contract = frm.doc.name;
                frappe.set_route('Form', 'Sales Order', doc.name);
            },'Create'),
            frm.page.add_inner_button('Quotation', function(){
                var doc = frappe.model.get_new_doc('Quotation');
		doc.quotation_to='Customer'
		doc.contract = frm.doc.name;
                frappe.set_route('Form', 'Quotation', doc.name);
            },'Create')
        }
    }
})
