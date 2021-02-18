frappe.ui.form.on('Stock Entry', {
refresh: function(frm){
	frm.add_custom_button(__('Make Quality Inspection'), function(){
	    frappe.set_route("List", "Quality Inspection");
	   });
	if(frm.doc.to_warehouse !=undefined){
	frappe.db.get_value("Material Request",{"name":frm.doc.material_request},"set_warehouse",(c)=>{
		if(c.set_warehouse){
			frm.set_value("to_warehouse",c.set_warehouse)
		}
	})
}
if(frm.doc.from_warehouse!=undefined){
	frappe.db.get_value("Material Request",{"name":frm.doc.material_request},"set_from_warehouse",(c)=>{
		if(c.set_from_warehouse){
			frm.set_value("from_warehouse",c.set_from_warehouse)
		}
	})
}
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
        
},
project:function(frm){
var items=[];
	$.each(frm.doc.items,function(idx, item){
		if(frm.doc.project!=undefined){
		frappe.call({
				method:"axis_inspection.axis_inspection.api.get_item_list",
				async:false,
				args: {
					"project":frm.doc.project
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						items.push(r.message[i]);
					}
				}
		});
		}
	});
	frm.fields_dict['items'].grid.get_field('item_code').get_query = function() {
        return {
			filters: {
				name:["in",items] 
			}
		};
	};

	var employee=[]
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_employee_filters",
			async:false,
			args: {
				"project":frm.doc.project
			},
			callback: function(r){
				for(var i=0; i<r.message.length; i++){
					if(!employee.includes(r.message[i].assign_to)){
						employee.push(r.message[i].assign_to);
					}
					
				}
			}
		});
		frm.set_query("employee",function(){
			return{
				filters: {
					name:["in",employee] 
				}
				}
				});

}
})

