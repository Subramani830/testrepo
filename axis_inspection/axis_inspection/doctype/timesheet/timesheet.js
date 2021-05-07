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
			frappe.call({
				method:"axis_inspection.axis_inspection.api.get_working_hours",
				async:false,
				args: {
					"parent":frm.doc.employee_name
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						frm.set_value('working_hour',r.message)
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
			//	frappe.throw(__("Timesheet has been already created for employee on "+ dates  +"."))
			}
		}
	})

	var absent_dates=[' '];
	if (frm.doc.absent_days > 0){
		$.each(frm.doc.time_logs,function(idx,item){
			if(frm.doc.employee!=undefined && frm.doc.timesheet_date!=undefined){
				frappe.call({
					method:"axis_inspection.axis_inspection.doctype.timesheet.timesheet.get_absent_days",
					async:false,
					args: {
						"employee":frm.doc.employee,
						"start_date":frm.doc.timesheet_date
					},
					callback: function(r){
console.log(r)
						for(var i=0; i<r.message.length; i++){
							frappe.db.get_value("Attendance",{"leave_application":r.message[i].name,"attendance_date":item.from_time},["attendance_date"],(d)=>{
							if (d.attendance_date!=undefined){
								absent_dates.push(d.attendance_date)
							}
							if(absent_dates.length>1){
								frappe.validated=false;
								frappe.throw(__("From Time cannot be on " + absent_dates+ " employee is absent on that day."))
							}

							})
						}
					}
				})

			}
			
		});
	}

}

});
frappe.ui.form.on('Timesheet Detail',{
	activity_type:function(frm,cdt,cdn){
		var basic;
		var hours;
		if(frm.doc.employee!=undefined&&frm.doc.project!=undefined){
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

			if((row.activity_type!='Standby'||row.activity_type!="Overtime")&&row.activity_type!=undefined){
				frappe.call({
					method:"axis_inspection.axis_inspection.api.get_billing_rate",
					async:false,
								args: {
								doctype: 'Activity Cost',
								employee: frm.doc.employee,
								project:frm.doc.project,
								activity_type:row.activity_type
							},
						callback: function(r){
								row.billing_rate=r.message
							//	row.costing_rate=r.message[0].costing_rate
							cur_frm.refresh_field("time_logs")
						}
				});
			}
		}
	}
});
	frappe.ui.form.on('Timesheet Detail', 'service',function(frm,cdt, cdn){
		var cur_grid =frm.get_field('time_logs').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if(cur_row.doc.activity_type=='Standby'){
			frappe.call({
				method:"axis_inspection.axis_inspection.doctype.timesheet.timesheet.get_stand_rate",
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
		else if(cur_row.doc.activity_type=='Overtime'){
			frappe.call({
				method:"axis_inspection.axis_inspection.doctype.timesheet.timesheet.get_overtime_rate",
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
