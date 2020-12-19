// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Clearance Process', {
	 refresh: function(frm,cdt,cdn) {
		
	 },
	before_save:function(frm,cdt,cdn){
		var status="Cleared"
		$.each(frm.doc.clearance_process_detail,function(idx, item){
			if(item.asset_status=="Open"){
				status="Open"
			}
			if(item.asset_status=='Cleared' && !(frappe.user_roles.includes('Assets Manager'))){
				frappe.throw('Assets Status should be updated by Assets Manager')
			}
		frm.set_value('status',status)
		});
		$.each(frm.doc.task_detail,function(idx, item){
			if(item.task_status=='Cleared' && !(frappe.session.user==frm.doc.department_manager)){
				frappe.throw('Task Status should be updated by Department Manager')
			}
		});
},
employee:function(frm,cdt,cdn){
	if(frm.doc.employee!=undefined){
	frappe.call({
		method:"axis_inspection.axis_inspection.api.get_department_manager",
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
			method: "frappe.client.get_list",
			"async":false,
		args: {
			doctype: 'Loan',
			fields: ["name"],
			filters:{
			"applicant":frm.doc.employee,
			"company":frm.doc.company,
			"status":["!=","Closed"]
			},
			"limit_page_length":0
		},	
		callback:function(r){
			$.each( r,function(idx,loanList){
				$.each(loanList,function(idx,loan){
					var child = cur_frm.add_child("account_detail");
					frappe.model.set_value(child.doctype, child.name, "loan", loan.name);
					cur_frm.refresh_field("account_detail");
				});
			});
		}
		});

		frappe.call({
			method:"axis_inspection.axis_inspection.api.update_task",
			async:false,
			args:{
				doctype:'Assign To',
				assign_to:frm.doc.employee
			},
			callback:function(r){
				for(var i=0;i<r.message.length;i++){
						var child = cur_frm.add_child("task_detail");
						frappe.model.set_value(child.doctype, child.name, "task", r.message[i].name);
						frappe.model.set_value(child.doctype, child.name, "project", r.message[i].project);
						cur_frm.refresh_field("task_detail");
				}
			}
		});
	}
},	
employee_name:function(frm,cdt,cdn){
	if(frm.doc.employee!=undefined){
		frm.set_query("vehicle_log", function() {
			return {
				query: "axis_inspection.axis_inspection.api.vehicle_log_list",
				filters: {
					"employee":frm.doc.employee
				}
			};
			});
			
			}
},
license_plate:function(frm,cdt,cdn){
	frappe.db.get_value("Vehicle",frm.doc.license_plate,"chassis_no",(c)=>{
	    		if(c.chassis_no!==null){
				frm.set_value("chassis_no",c.chassis_no)
			}
	});
},
transport_status:function(frm,cdt,cdn){
	if(frm.doc.transport_status=='Cleared' && !(frappe.user_roles.includes('Transportation Manager'))){
		frm.set_value("transport_status","Pending")
		frappe.throw('Transport Status should be updated by Transportation Manager')
	}
}
});