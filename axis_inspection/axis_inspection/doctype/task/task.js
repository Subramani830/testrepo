frappe.ui.form.on('Task', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 0 && frm.doc.out_sourced==1){    
            frm.page.add_inner_button('Purchase Order', function(){
		var doc = frappe.model.get_new_doc('Purchase Order');
		doc.task = frm.doc.name;
		doc.naming_series='PUR-ORD-.YYYY.-'
                frappe.set_route('Form', 'Purchase Order', doc.name);
            },'Create')
        }
	frm.set_df_property("out_sourced", "read_only", frm.is_new() ? 0 : 1);
	frm.set_df_property("in_house", "read_only", frm.is_new() ? 0 : 1);

	//$("[data-fieldname='subject'").attr("title", "Please mention the order begin date");




    },
	before_save: function(frm){
	if(frm.doc.out_sourced==1 && frm.doc.in_house==1)
		{
			frappe.throw(__('out Sourced and In house both cannot be selected'))
		}
	},
project:function(frm){
var sales_order;
var skill=[];
var employee=[]
	frappe.call({
		method: "frappe.client.get_value",
		async:false,
		args: {
			doctype: "Project",
			fieldname: "sales_order",
			filters:{
				"name":frm.doc.project,
			}
		},
		callback: function(r) {
			if(r.message.sales_order!==undefined){
				sales_order=r.message.sales_order;
			}
		}
	});
	frappe.call({
		method:"axis_inspection.axis_inspection.api.get_employee_filter",
		async:false,
		args: {
			"sales_order":sales_order	
		},
		callback: function(r){
			for(var i=0; i<r.message.length; i++){
				employee.push(r.message[i]);
			}
		}
	});
	frm.fields_dict['assign_'].grid.get_field('assign_to').get_query = function() {
						return {
							filters: {
								name:["in",employee] 
							}
						};
		};
		frappe.call({
				method:"axis_inspection.axis_inspection.api.get_skill_filter",
				async:false,
				args: {
					"sales_order":sales_order	
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						skill.push(r.message[i]);
					}
				}
			});
			frm.set_query("skill", function() {
						return {
							filters: {
									name:["in",skill] 
								}
						};
					});

					var itemList=[]
					frappe.call({
						method:"axis_inspection.axis_inspection.doctype.task.task.get_item_list",
						async:false,
						args: {
							"sales_order":sales_order	
						},
						callback: function(r){
							for(var i=0; i<r.message.length; i++){
								itemList.push(r.message[i].item_code);
							}
							frm.set_query("service", function() {
								return {
									filters: {
										"name":['in',itemList]
									}
								};
							})
								
						}
					});	
			
	frappe.db.get_value("Project",{"name":frm.doc.project},"location",(r)=>{
			frm.set_value('location',r.location)
		})
	
},
skill:function(frm){
var employee=[];
	if(frm.doc.skill!=undefined || frm.doc.skill!=null){
		frappe.call({
				method:"axis_inspection.axis_inspection.api.get_employee_list",
				args:{
		skill:frm.doc.skill
		},
			async:false,
			callback: function(r){
			for(var i=0;i<r.message.length;i++){
			employee.push(r.message[i].parent);
			}

			frm.fields_dict['assign_'].grid.get_field('assign_to').get_query = function() {
				return {
					filters: {
						name:["in",employee] 
					}
				};
			};

			}
		})
	}
}
});


frappe.ui.form.on('Assign To',{
 assign_to:function(frm,cdt, cdn){
    var task=[];
    var cur_grid =frm.get_field('assign_').grid;
    var cur_doc = locals[cdt][cdn];
    var cur_row = cur_grid.get_row(cur_doc.name);
if(cur_row.doc.assign_to!=undefined){
    frappe.call({
        method: 'axis_inspection.axis_inspection.api.count_task',
        async:false,
        args: {
            employee:cur_row.doc.assign_to
        },
        callback: function(r) {
		for(var i=0;i<r.message.length;i++){
		task.push(r.message[i][0]);
		}
            cur_doc.assigned_task=task+"";
            cur_frm.refresh_field('assigned_task')
        } 
    });
    cur_frm.refresh_field('assign_to')
}
cur_frm.refresh_field('assign_to')
}
})
