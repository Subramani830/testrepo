frappe.ui.form.on('Contract', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 1 && frm.doc.party_type=='Customer'){    
            frm.page.add_inner_button('Sales Order', function(){
                var doc = frappe.model.get_new_doc('Sales Order');
                doc.contract = frm.doc.name;
		doc.company = frm.doc.company;
		doc.price_list=frm.doc.price_list
                frappe.set_route('Form', 'Sales Order', doc.name);
            },'Create'),
            frm.page.add_inner_button('Quotation', function(){
                var doc = frappe.model.get_new_doc('Quotation');
		doc.quotation_to='Customer';
		doc.contract = frm.doc.name;
		doc.company = frm.doc.company;
		doc.price_list=frm.doc.price_list
                frappe.set_route('Form', 'Quotation', doc.name);
            },'Create')
        }
    }
});

frappe.ui.form.on('Contract Item', {
    item_code:  function(frm,cdt,cdn) {
	$.each(frm.doc.items, function(idx, item){
	 var transfer
		frappe.call({
			method: "frappe.client.get",
			async:false,
			args: {
			    doctype: "Item",
			    name: item.item_code,
			},
			callback(r) {
			    if(r.message) {
			        transfer = r.message;
			    }
			}
		    });
		item.item_name=transfer.item_name
		item.description=transfer.description
		item.qty=1
		frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Item Price",
				fieldname: "price_list_rate",
				filters:{
					item_code: item.item_code,
			    		price_list: frm.doc.price_list
				}
			},
			callback(r) {
			    if(r.message) {
				item.rate=r.message.price_list_rate
				item.amount=item.rate*item.qty
			    }
			}
		    });
	$.each(transfer.uoms, function(idx, uom){
		if(transfer.stock_uom==uom.uom){
			item.uom=uom.uom
			item.conversion_factor=uom.conversion_factor
		}
	});
cur_frm.refresh_field('items')
});
},
qty:  function(frm,cdt,cdn) {
	$.each(frm.doc.items, function(idx, item){
			item.amount=item.rate*item.qty
		});
cur_frm.refresh_field('items')
},
rate:  function(frm,cdt,cdn) {
	$.each(frm.doc.items, function(idx, item){
			item.amount=item.rate*item.qty
		});
cur_frm.refresh_field('items')
}
});


