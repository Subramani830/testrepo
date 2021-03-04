frappe.ui.form.on('Contract', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 1 && frm.doc.party_type=='Customer'){    
		frm.add_custom_button(__('Sales Order'),
		function() {
				if(frm.doc.end_date<=frappe.datetime.nowdate()){
					frappe.validated=false;
					frappe.msgprint(__("Contract "+frm.doc.name+" has been expired.")); 
				}
				else{
				frm.trigger("make_sales_order")
			}
		}, __('Create'));
	

		frm.add_custom_button(__('Quotation'),
		function() {
			if(frm.doc.end_date<=frappe.datetime.nowdate()){
				frappe.validated=false;
				frappe.msgprint(__("Contract "+frm.doc.name+" has been expired.")); 
			}
			else{
		frm.trigger("make_quotation")
			}
		}, __('Create'));
		}
		if(frm.doc.party_type=="Customer"){
			frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
				return {
					filters: {
						selling:1
					}
				};
			});
		}
		frm.set_query("item_group",function(){
			return{
				filters: {
				"parent_item_group":'Billing Items'
				}
			};
		});
		apply_filter(frm)
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
party_type:function(frm){
	if(frm.doc.party_type=="Customer"){
		frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
			return {
				filters: {
					selling:1
				}
			};
		});
		frm.set_query("contract_template_", function() {
			return {
				filters: {
					"language":"en",
					"contract_type":"Customer"
				}
			};
		});
		frm.set_query("contract_template_for_arabic", function() {
			return {
				filters: {
					"language":"ar",
					"contract_type":"Customer"
				}
			};
		});
	}
	else if(frm.doc.party_type=="Supplier"){
		frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
			return {
				filters: {
					buying:1
				}
			};
		});
		frm.set_query("contract_template_", function() {
			return {
				filters: {
					"language":"en",
					"contract_type":"Supplier"
				}
			};
		});
		frm.set_query("contract_template_for_arabic", function() {
			return {
				filters: {
					"language":"ar",
					"contract_type":"Supplier"
				}
			};
		});
	}
},
contract_template_:function(frm){
	if(frm.doc.contract_template_!=undefined){ 	
		frappe.call({
			method: 'axis_inspection.axis_inspection.doctype.contract_terms_template.contract_terms_template.get_contract_terms',
			args: {
				template_name: frm.doc.contract_template_,
				doc: cur_frm.doc
			},
			callback: function(r) {
				if(!r.exc) {
					frm.set_value("contract_terms_", r.message);
				}
			}
		});		
	}
	},
contract_template_for_arabic:function(frm){
	if(frm.doc.contract_template_for_arabic!=undefined){ 
		frappe.call({
			method: 'axis_inspection.axis_inspection.doctype.contract_terms_template.contract_terms_template.get_contract_terms',
			args: {
				template_name:  frm.doc.contract_template_for_arabic,
				doc: cur_frm.doc
			},
			callback: function(r) {
				if(!r.exc) {
					frm.set_value("contract_terms_in_arabic", r.message);
				}
			}
		});			
	}
},
item_group(frm){
	apply_filter(frm)
	}
	
});
frappe.ui.form.on('Contract Item', 'item_code',function(frm,cdt, cdn)
{
var cur_grid =frm.get_field('items').grid;
var cur_doc = locals[cdt][cdn];
var cur_row = cur_grid.get_row(cur_doc.name);
var transfer
	 	frappe.call({
					method: "frappe.client.get",
					async:false,
					args: {
						doctype: "Item",
						name: cur_row.doc.item_code,
					},
			callback(r) {
				if(r.message) {
					transfer = r.message;
				}
			}
		});
		cur_row.doc.item_name=transfer.item_name
		cur_row.doc.description=transfer.description
		cur_row.doc.qty=1
		frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Item Price",
				fieldname: "price_list_rate",
				filters:{
					item_code: cur_row.doc.item_code,
			    		price_list: frm.doc.price_list
				}
			},
			callback(r) {
			    if(r.message.price_list_rate) {
					cur_row.doc.rate=r.message.price_list_rate
					cur_row.doc.amount=cur_row.doc.rate*cur_row.doc.qty
				}
				else if(r.message.length==0){
					cur_row.doc.rate=0;
					cur_row.doc.amount=0;
				}
			}
		});
	$.each(transfer.uoms, function(idx, uom){
		if(transfer.stock_uom==uom.uom){
			cur_row.doc.uom=uom.uom
			cur_row.doc.conversion_factor=uom.conversion_factor
		}
	});
cur_frm.refresh_field('items')

});
frappe.ui.form.on('Contract Item', 'qty',function(frm,cdt, cdn)
{
	var cur_grid =frm.get_field('items').grid;
	var cur_doc = locals[cdt][cdn];
	var cur_row = cur_grid.get_row(cur_doc.name);
	cur_row.doc.amount=cur_row.doc.rate*cur_row.doc.qty
	cur_frm.refresh_field('items')
});
frappe.ui.form.on('Contract Item', 'rate',function(frm,cdt, cdn)
{
	var cur_grid =frm.get_field('items').grid;
	var cur_doc = locals[cdt][cdn];
	var cur_row = cur_grid.get_row(cur_doc.name);
	cur_row.doc.amount=cur_row.doc.rate*cur_row.doc.qty
	cur_frm.refresh_field('items')
});

function apply_filter(frm){
	var item_groups=[];
		if(frm.doc.item_group!=undefined || frm.doc.item_group!=null){
			frappe.call({
					method:"axis_inspection.axis_inspection.doctype.quotation.quotation.get_item_group",
					args:{
			item_group:frm.doc.item_group
			},
				async:false,
				callback: function(r){
				for(var i=0;i<r.message.length;i++){
				item_groups.push(r.message[i].name);
				}
	
				frm.fields_dict['items'].grid.get_field('item_code').get_query = function() {
					return {
						filters: {
							item_group:["in",item_groups] 
						}
					};
				};
	
				}
			})
		}
}