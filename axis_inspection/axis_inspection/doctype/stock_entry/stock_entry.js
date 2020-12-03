frappe.ui.form.on('Stock Entry', {
refresh: function(frm){
	frm.add_custom_button(__('Make Quality Inspection'), function(){
	    //frappe.route_options = {"company": frm.doc.company, "blanket_order_type": "Purchasing","item_code":item.item_code}
	    frappe.set_route("List", "Quality Inspection");
	   });
}
})
