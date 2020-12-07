frappe.ui.form.on('Stock Entry', {
refresh: function(frm){
	frm.add_custom_button(__('Make Quality Inspection'), function(){
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
},
before_save:function(frm,cdt,cdn){
	var count=0;
	$.each(frm.doc.items, function(idx, item){     
	    frappe.db.get_value("Item",item.item_code,"inspection_required_before_stock_entry",(a)=>{
	        if(a.inspection_required_before_stock_entry==1){
			frappe.db.get_value("Quality Inspection",{item_code:item.item_code},"item_code",(i)=>{
				if(i.item_code==null)
		                {
		                    frappe.validated=false;
		                    frappe.throw('Quality Inspection required for item '+item.item_code);
		                }
			})
	        }
	    });


        })
        
}
})

