// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Stock Movement', {
	// refresh: function(frm) {

	// }
before_save:function(frm,cdt,cdn){
	$.each(frm.doc.items,function(idx,item){
		if(item.source_warehouse!==undefined && item.to_employee==undefined){
			frappe.throw('Please enter the value for to employee')
		}
		else if(item.from_employee!==undefined && item.target_warehouse==undefined){
			frappe.throw('Please enter target warehouse')
		}
	});
}
});

frappe.ui.form.on('Stock Movement Item', {
source_warehouse:function(frm,cdt,cdn){
	$.each(frm.doc.items,function(idx,item){
		frappe.db.get_value('Warehouse',{'name':item.source_warehouse},'employee_warehouse',(r)=>{
			if(r.employee_warehouse){
				console.log(r.employee_warehouse)
				frappe.model.set_value(item.doctype,item.name,'from_employee',r.employee_warehouse)
				
				
			}
		})
	});
	frm.refresh_fields('items')
},
to_employee:function(frm,cdt,cdn){
	console.log('ggg')
		$.each(frm.doc.items,function(idx,item){
			frappe.db.get_value('Warehouse',{'employee_warehouse':item.to_employee},'name',(r)=>{
				if(r.name){
					frappe.model.set_value(item.doctype,item.name,'target_warehouse',r.name)		
				}
			})
		});
		frm.refresh_fields('items')
		frm.set_query("to_employee", "items", function(frm, cdt, cdn) {
			return {
				filters: {
					"status": "Active"
				}
			};
		});
		
},
basic_rate:function(frm,cdt,cdn){
	$.each(frm.doc.items,function(idx,item){
		frappe.model.set_value(item.doctype,item.name,'valuation_rate',item.basic_rate)
		frappe.model.set_value(item.doctype,item.name,'basic_amount',item.basic_rate*item.qty)
	});
},
qty:function(frm,cdt,cdn){
	$.each(frm.doc.items,function(idx,item){
		frappe.model.set_value(item.doctype,item.name,'basic_amount',item.basic_rate*item.qty)
	});
},
item:function(frm,cdt,cdn){
	$.each(frm.doc.items,function(idx,item){
		frappe.db.get_value("Item Price",{item_code:item.item}, "price_list_rate",(r)=>{
			    if (r && r.price_list_rate){
					frappe.model.set_value(item.doctype,item.name,'basic_rate',r.price_list_rate)
		 			frappe.model.set_value(item.doctype,item.name,'valuation_rate',r.price_list_rate)
				}
		});
	});
}

});
