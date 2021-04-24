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
	if(r.message!=null){
	for(var i=0;i<r.message.length;i++){
			item_group.push(r.message[i].name);
	}
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
	if(frm.doc.prevdoc_docname!=undefined){
		frappe.db.get_value("Quotation",{"name":frm.doc.prevdoc_docname},"status",(r)=>{
			frm.set_value('quotation_status',r.status)
		})
		frm.set_query("sales_order", function() {
			return {
				filters: {
					"customer":frm.doc.customer,
					"quotation":frm.doc.prevdoc_docname
				}
			};
		})
	}
},
sales_order:function(frm){
	if(frm.doc.sales_order!=undefined){
		frappe.db.get_value("Sales Order",{"name":frm.doc.sales_order},"status",(r)=>{
			frm.set_value('sales_order_status',r.status)
		})
	}

	if(frm.doc.sales_order!=undefined && frm.doc.sales_order!=null){
	frappe.call({
		method:"axis_inspection.axis_inspection.doctype.resource_planning.resource_planning.get_resource_planning_employee_detail",
		async:false,
		args:{
			sales_order:frm.doc.sales_order,
			name:frm.doc.name
		},
		callback:function(r){
		cur_frm.clear_table("employee_detail");
		if(r.message.length!=0){
			for(var i=0;i<r.message.length;i++){
			var child = cur_frm.add_child("employee_detail");
		        child.designation=r.message[i].designation;
			child.number_of_employee=r.message[i].no_emp;
			} cur_frm.refresh_field("employee_detail");
		}
		}
	})
	frappe.call({
		method:"axis_inspection.axis_inspection.doctype.resource_planning.resource_planning.get_resource_planning_asset_detail",
		async:false,
		args:{
			sales_order:frm.doc.sales_order,
			name:frm.doc.name
		},
		callback:function(r){
		cur_frm.clear_table("asset_detail");
		if(r.message.length!=0){
			for(var i=0;i<r.message.length;i++){
			var child = cur_frm.add_child("asset_detail");
		        child.asset_category=r.message[i].asset_category;
			child.qty=r.message[i].qty;
			} cur_frm.refresh_field("asset_detail");
		}
		}
	})
	frappe.call({
		method:"axis_inspection.axis_inspection.doctype.resource_planning.resource_planning.get_resource_planning_item_detail",
		async:false,
		args:{
			sales_order:frm.doc.sales_order,
			name:frm.doc.name
		},
		callback:function(r){
		cur_frm.clear_table("item_detail");
		if(r.message.length!=0){
			for(var i=0;i<r.message.length;i++){
			var child = cur_frm.add_child("item_detail");
		        child.item_group=r.message[i].item_group;
			child.qty=r.message[i].qty;
			} cur_frm.refresh_field("item_detail");
		}
		}
	})

	}
}
});

