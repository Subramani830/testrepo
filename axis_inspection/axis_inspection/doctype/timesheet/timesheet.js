// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Timesheet', {
employee:function(frm,cdt,cdn){
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
var employee=[];
if(frm.doc.company){}
	else{
	frm.set_value('company','Axis Inspection Ltd.')
	}
$.each(frm.doc.time_logs,function(idx, item){
	if(item.task!=undefined){
		frappe.call({
				method:"axis_inspection.axis_inspection.api.get_employee",
				async:false,
				args: {
					"task":item.task
				},
				callback: function(r){
					for(var i=0; i<r.message.length; i++){
						employee.push(r.message[i]);
					}
				}
		});
	}
});
	frm.set_query("employee", function(frm, cdt, cdn) {
		return {
			filters: {
				name:["in",employee] 
			}
		};
		});
	}

});

