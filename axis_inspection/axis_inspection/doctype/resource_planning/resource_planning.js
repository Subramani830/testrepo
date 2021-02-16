// Copyright (c) 2021, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Resource Planning', {
refresh: function(frm) {
	var  item_group=[]
	frappe.call({
		method:"axis_inspection.axis_inspection.doctype.resource_planning.resource_planning.get_item_group_list",
		args:{
			item_group:'Products and Consumables'
		},
	async:false,
	callback: function(r){
		console.log(r)
	for(var i=0;i<r.message.length;i++){
			item_group.push(r.message[i].name);
	}

	frm.fields_dict['item_detail'].grid.get_field('item_group').get_query = function() {
		return {
			filters: {
				name:["in",item_group] 
			}
		};
	};

	}
})
},
customer:function(frm){
	frm.set_query("quotation", function() {
		return {
			filters: {
				"party_name":frm.doc.customer
			}
		};
	})
	frm.set_query("sales_order", function() {
		return {
			filters: {
				"customer":frm.doc.customer
			}
		};
	})
},
quotation:function(frm){
	frappe.db.get_value("Quotation",{"name":frm.doc.quotation},"status",(r)=>{
		frm.set_value('quotation_status',r.status)
	})
	if(frm.doc.quotation!=undefined){
		frm.set_query("sales_order", function() {
			return {
				filters: {
					"customer":frm.doc.customer,
					"quotation":frm.doc.quotation
				}
			};
		})
	}
},
sales_order:function(frm){
	frappe.db.get_value("Sales Order",{"name":frm.doc.sales_order},"status",(r)=>{
		frm.set_value('sales_order_status',r.status)
	})
}
});

