// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Timesheet', {
employee:function(frm,cdt,cdn){
console.log('hhg')
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
