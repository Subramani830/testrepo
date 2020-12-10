frappe.ui.form.on('Contract', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 1 && frm.doc.party_type=='Customer'){    
		frm.add_custom_button(__('Sales Order'),
		function() {
		frm.trigger("make_sales_order")
		}, __('Create'));

		frm.add_custom_button(__('Quotation'),
		function() {
		frm.trigger("make_quotation")
		}, __('Create'));
        }
    },
	make_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "axis_inspection.axis_inspection.doctype.contract.contract.make_sales_order",
			frm: frm
		})
	},
	make_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "axis_inspection.axis_inspection.doctype.contract.contract.make_quotation",
			frm: frm
		})
	},
contract_terms_and_conditions:function(frm) {
frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Terms and Conditions",
				fieldname: "terms",
				filters:{
					title:frm.doc.contract_terms_and_conditions		
				}
			},
			callback(r) {
			    if(r.message) {
				frm.set_value("contract_terms",r.message.terms)
			    }
			}
		    });
},
party_user:function(frm,cdt,cdn){
	if(frm.doc.party_type==="Employee"){
		if(frm.doc.party_user!=undefined){
			frm.set_query("party_name",function(){
				return{
				 query: "axis_inspection.axis_inspection.api.get_employee_list",
				    filters: {
				        "user_id":frm.doc.party_user
				    }
				};
			     });
		}
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
