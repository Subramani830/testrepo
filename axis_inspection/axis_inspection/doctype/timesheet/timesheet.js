// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Timesheet', {
employee:function(frm,cdt,cdn){
	var project=[];
	if(frm.doc.employee!==undefined){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_reports_to",
			async:false,
					args: {
						doctype: 'Employee',
						name: frm.doc.employee
					},
				callback: function(r){
					frm.set_value('department_manager',r.message)
				}
			});

			frappe.call({
				method:"axis_inspection.axis_inspection.api.get_project",
				async:false,
				args: {
					"employee":frm.doc.employee
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						project.push(r.message[i]);
					}
				}
			});
			frm.set_query("project","time_logs",function(){
				return{
					filters: {
						name:["in",project] 
					}
					}
					});
}
},
before_workflow_action: (frm) => {
	if(frm.doc.workflow_state=="Draft")
	{
	$.each(frm.doc.time_logs,function(idx,time){
		if(time.completed==0){
			frappe.throw("Please Compeleted the Activity type " + time.activity_type+ " by checking Completed checkbox.")
		}
	});
	}
},
	refresh:function(frm){
		if(frm.doc.company){}
		else{
			frm.set_value('company','Axis Inspection Ltd.')
		}

		// frm.set_query("task","time_logs",function(){
		// return{
		//     filters: [
		// 	["Assign To","assign_to","=",frm.doc.employee]
		    
		//     ]
		//     };
        // 	});
		frappe.call({
			method: "axis_inspection.axis_inspection.api.get_user_role_billing",
			async:false,
			 callback: function(r){
				if(r.message==0){
					var df1 = frappe.meta.get_docfield("Timesheet Detail","billable", cur_frm.doc.name);
            				df1.hidden = 1;
					var df2 = frappe.meta.get_docfield("Timesheet Detail","billing_hours", cur_frm.doc.name);
            				df2.hidden = 1;
					var df3 = frappe.meta.get_docfield("Timesheet Detail","billing_rate", cur_frm.doc.name);
            				df3.hidden = 1;
					var df4 = frappe.meta.get_docfield("Timesheet Detail","billing_amount", cur_frm.doc.name);
            				df4.hidden = 1;
					var df5 = frappe.meta.get_docfield("Timesheet Detail","costing_rate", cur_frm.doc.name);
            				df5.hidden = 1;
					var df6 = frappe.meta.get_docfield("Timesheet Detail","costing_amount", cur_frm.doc.name);
            				df6.hidden = 1;	    
				}
				
				
                }
		   });			
		
	},
timesheet_type:function(frm){
	if(frm.doc.timesheet_type=='Overtime'){
		frm.set_query("employee",function(){
			return{
				filters: {
					"overtime":"Applicable"
				}
			};
		});
	}
	else if(frappe.user_roles.includes('System Manager')&& frappe.session.user=='Administrator'){
		frm.set_query("employee",function(){
			return{
				filters: {
					"status":"Active"
				}
			};
		});
   }
	else if(frappe.user_roles.includes('Department Manager')&&frappe.user_roles.includes('Employee')){
		frm.set_query("employee",function(){
			return{
				query: "axis_inspection.axis_inspection.api.employee_filter_based_on_department",
				filters: {
					"user":frappe.session.user
				}
			};
		});
   }
   else if(frappe.user_roles.includes('Employee')){
	user=frappe.db.get_value('Employee',{'user_id':frappe.session.user},'name')
	console.log(user)
		if(user!=undefined)	{
			frm.set_query("employee",function(){
				return{
					filters: {
						"user_id":user
					}
				};
			});
		}
   }

},
	project:function(frm){
		frappe.db.get_value("Project",{"name":frm.doc.project},"location",(r)=>{
			frm.set_value('location',r.location)
		})
	}

});
frappe.ui.form.on('Timesheet Detail',{
	activity_type:function(frm,cdt,cdn){
		var basic;
		var hours;
		if(frm.doc.employee!=undefined){
			frappe.call({
				method:"axis_inspection.axis_inspection.api.get_contract",
				async:false,
						args: {
							doctype: 'Employee',
							name: frm.doc.employee
						},
					callback: function(r){
						for (var i=0;i<r.message.length;i++){
							if(r.message[i].contract_term=='Basic Salary'){
								basic=r.message[i].value
							}
							else if(r.message[i].contract_term=='Working Hours'){
								hours=r.message[i].value
							}
						}
					}
				});
			var	overtime=(basic/30)/hours
			var row = locals[cdt][cdn];
			row.costing_rate=overtime;
			cur_frm.refresh_field("time_logs")
		}
		
	}
});
frappe.ui.form.on('Timesheet Detail', 'task',function(frm,cdt, cdn){
	var cur_grid =frm.get_field('time_logs').grid;
	var cur_doc = locals[cdt][cdn];
	var cur_row = cur_grid.get_row(cur_doc.name);
		var task=[]
		if(cur_row.doc.project!=undefined &&frm.doc.employee!=undefined){
			frappe.call({
				method:"axis_inspection.axis_inspection.api.get_task",
				async:false,
				args: {
					"employee":frm.doc.employee,
					"project":cur_row.doc.project
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						task.push(r.message[i]);
					}
				}
			});
			frm.fields_dict['time_logs'].grid.get_field('task').get_query = function() {
				return {
					filters: {
						name:["in",task] 
					}
				};
			};

		}

	});

	frappe.ui.form.on('Timesheet Detail', 'service',function(frm,cdt, cdn){
		var cur_grid =frm.get_field('time_logs').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if(cur_row.doc.activity_type=='Standby' || cur_row.doc.activity_type=='Overtime'){
			frappe.db.get_value('Item Price',{'item_code':cur_row.doc.service,'price_list':'Standard Selling'},'price_list_rate',(r)=>{
				cur_row.doc.billing_rate=r.price_list_rate
				cur_frm.refresh_fields();
			});
		}


	});