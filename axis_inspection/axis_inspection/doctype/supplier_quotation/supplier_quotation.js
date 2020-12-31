frappe.ui.form.on('Supplier Quotation', {
	item_group: function(frm) {
	frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Item",
                fields: ["item_code","item_group","item_name"],
                filters:{
                    "item_group":frm.doc.item_group
                },
            },
            callback: function(r) {
		var count=0;
		$.each(frm.doc.items, function(idx, item){
			if(item.item_code){}
			else{count++;}	
		})
		
		if(count>0){
			cur_frm.clear_table("items");
		}
		for(var i=0;i<r.message.length;i++){
			var child = cur_frm.add_child("items");
                    	child.item_code=r.message[i].item_code;
			child.item_name=r.message[i].item_name;
			cur_frm.refresh_field("items")
		}
		}
	})
},
    on_submit: function(frm){
	location.reload()
	},
    onload_post_render: function(frm){ 
	var bt = ['Quotation', 'Subscription']
        bt.forEach(function(bt){
        frm.page.remove_inner_button(bt, 'Create')
            });
            $.each(frm.doc.items,function(idx, item){
		if(item.material_request!=undefined){
		    frappe.call({
		        method:"axis_inspection.axis_inspection.api.update_project",
		        async:false,
		        args:{
		            doctype:'Material Request Item',
		            name:item.material_request,
		            parenttype:'Material Request'
		        },
		        callback:function(r){
		            for(var i=0;i<r.message.length;i++){
		                frappe.model.set_value(item.doctype, item.name, "project", r.message[i].project);
		                frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
				frappe.model.set_value(item.doctype, item.name, "cost_center", r.message[i].cost_center);
                        	frappe.model.set_value(item.doctype, item.name, "branch", r.message[i].branch);
		            }
		        }
		    });
		}
	});
	
   },
	refresh:function(frm,cdt,cdn){
		frm.set_query("contract",function(){
			return{
				filters: {
				"party_type":'Supplier',
				"party_name":frm.doc.supplier
				}
			};
		});
		
		frm.set_query("item_code","items",function(){
			return{
				filters: {
				"item_group":frm.doc.item_group
				
				}
			};
		});

		
	},
	before_save:function(frm,cdt,cdn){
		if(frm.doc.department_manager){}
		else{
			$.each(frm.doc.items,function(idx, item){
				if(item.material_request){
					frappe.db.get_value("Material Request",item.material_request,"department_manager",(s)=>{
						frm.set_value("department_manager",s.department_manager)	

					})		
				}
			})
		}
	}
})
