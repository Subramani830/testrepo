frappe.ui.form.on('Stock Entry', {
refresh: function(frm){
	frm.add_custom_button(__('Make Quality Inspection'), function(){
	    //frappe.route_options = {"company": frm.doc.company, "blanket_order_type": "Purchasing","item_code":item.item_code}
	    frappe.set_route("List", "Quality Inspection");
	   });
	frappe.db.get_value("Material Request",{"name":frm.doc.material_request},"set_warehouse",(c)=>{
		if(c.set_warehouse){
			frm.set_value("to_warehouse",c.set_warehouse)
		}
	})
	frappe.db.get_value("Material Request",{"name":frm.doc.material_request},"set_from_warehouse",(c)=>{
		if(c.set_from_warehouse){
			frm.set_value("from_warehouse",c.set_from_warehouse)
		}
	})
}
})
