frappe.ui.form.on('Leave Application', {
	employee:function(frm) {
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
	refresh:function(frm) {
		frm.set_query("clearance_process",function(){
                return{
                    filters: {
                        "employee":frm.doc.employee
                    }
                };
             });
	},
	before_workflow_action: (frm) => {
		if(frm.doc.workflow_state=="First Approval"){
		if(frm.doc.clearance_process){}
		else{frappe.throw("Clearance Process is mandatory field")
		}
		}
	}
})
