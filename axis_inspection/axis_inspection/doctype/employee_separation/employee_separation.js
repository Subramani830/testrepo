frappe.ui.form.on("Employee Separation", {
	employee_resignation: function(frm) {

   		 frappe.model.with_doc("Employee Resignation", frm.doc.employee_resignation, function() {
     		  var transfer= frappe.model.get_doc("Employee Resignation", frm.doc.employee_resignation)
         		   frm.doc.employee_separation_template=transfer.employee_separation_template;
         		   cur_frm.refresh_field("employee_separation_template");
          		  frm.doc.department=transfer.department;
           		  cur_frm.refresh_field("department");
          		  frm.doc.designation=transfer.designation;
          		  cur_frm.refresh_field("designation");
            	})       
	 },
	employee:function(frm) {
				if(frm.doc.employee!=undefined){
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
	}
})

