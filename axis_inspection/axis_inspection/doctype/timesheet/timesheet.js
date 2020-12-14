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
		var project=[]	
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_project_list",
			async:false,
			args: {
				"employee":frm.doc.employee	
			},
			callback: function(r){
				for(var i=0; i<r.message.length; i++){
					project.push(r.message[i]);
				}
				frm.fields_dict['time_logs'].grid.get_field('project').get_query = function() {
					return{
						filters: {
							name:["in",project] 
						}
					};
				};
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
}
});

frappe.ui.form.on('Timesheet Detail', {
activity_type:function(frm){
console.log('dds')

}
});
