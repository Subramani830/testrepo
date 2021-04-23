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
get_absent_days(frm)
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
	if(frm.doc.timesheet_date == undefined){
		frm.set_value("timesheet_date",frappe.datetime.nowdate())
		}

		if(frm.doc.company){}
		else{
			frm.set_value('company','Axis Inspection Ltd.')
		}
		frappe.call({
			method: "axis_inspection.axis_inspection.api.get_user_role_billing",
			async:false,
			 callback: function(r){
				if(r.message==0){
					var df1 = frappe.meta.get_docfield("Timesheet Detail","billable", cur_frm.doc.name);
            				df1.hidden = 0;
					var df2 = frappe.meta.get_docfield("Timesheet Detail","billing_hours", cur_frm.doc.name);
            				df2.hidden = 0;
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
		frm.set_query("sales_order",function(){
					return{
						filters: {
							"project":frm.doc.project
						}
					};
				});	
		frm.fields_dict['asset_detail'].grid.get_field('asset').get_query = function() {
			return {
				filters: {
					project:frm.doc.project,
					status:"Submitted"
				}
			};
		};	
		var items=[]
		frappe.call({
			method:"axis_inspection.axis_inspection.api.validate_stock_entry",
			async:false,
			args: {
				"stock_entry_type":'Material Issue'
			},
			callback: function(r){
				for(var i=0; i<r.message.length; i++){
					items.push(r.message[i]);
				}
			}
		});
		
		frm.fields_dict['consumable_detail'].grid.get_field('item_code').get_query = function() {
			return {
				filters: {
					'item_code':['in',items],
					"is_stock_item":1,
					"is_fixed_asset":0
				}
			};
		};

		 frm.set_query("task","time_logs",function(){
		 return{
		     filters: [
		 	["Assign To","assign_to","=",frm.doc.employee]
		    
		     ]
		     };
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
	},
timesheet_date: function(frm){
	if(frm.doc.timesheet_date!=undefined){
	frappe.call({
		method: 'axis_inspection.axis_inspection.doctype.timesheet.timesheet.convertDateFormat',
		async:false,
		args: {
			start_date:frm.doc.timesheet_date
		},
		callback: function(c) {
		frm.set_value("month_and_year",c.message)

		}
	});
	}
	get_absent_days(frm)
},
before_save: function(frm){
 var dates=[' '];
	frappe.call({
		method:"axis_inspection.axis_inspection.doctype.timesheet.timesheet.get_duplicate_entry",
		async:false,
		args:{
			"doc":frm.doc
		},
		callback: function(r){
			for(var i=0;i<r.message.length;i++){
			dates.push(r.message[i][0][0])
			}
			if(dates.length>1){
				frappe.validated=false;
				frappe.throw(__("Timesheet has been already created for employee on "+ dates  +"."))
			}
		}
	})
}

});
frappe.ui.form.on('Timesheet Detail',{
	activity_type:function(frm,cdt,cdn){
		var basic;
		var hours;
		if(frm.doc.employee!=undefined){
			frappe.call({
				method:"axis_inspection.axis_inspection.api.get_employee_contract",
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
			frappe.call({
				method:"axis_inspection.axis_inspection.doctype.timesheet.timesheet.get_bill_rate",
				async:false,
				args: {
					"item_code":cur_row.doc.service,
					"project":frm.doc.project
				},
				callback: function(r){
					cur_row.doc.billing_rate=r.message
					cur_frm.refresh_fields();
				}
			});
		}


	});

	function get_absent_days(frm){
		var absent_days = 0.0;
		if(frm.doc.employee!=undefined && frm.doc.timesheet_date!=undefined){
			frappe.call({
				method:"axis_inspection.axis_inspection.doctype.timesheet.timesheet.get_absent_days",
				async:false,
				args: {
					"employee":frm.doc.employee,
					"start_date":frm.doc.timesheet_date
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						absent_days += r.message[i].total_leave_days;
					}
				frm.set_value("absent_days",absent_days)
				}
			})

		}

	}
