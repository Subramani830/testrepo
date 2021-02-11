frappe.ui.form.on('Training Event', {
	internal_trainer: function(frm) {
		if(frm.doc.internal_trainer!=null || frm.doc.internal_trainer!=undefined){
   		 frappe.model.with_doc("Employee", frm.doc.internal_trainer, function() {
     		  var transfer= frappe.model.get_doc("Employee", frm.doc.internal_trainer)
			   frm.doc.trainer_name= transfer.employee_name;
			   cur_frm.refresh_field("trainer_name");
			   frm.doc.trainer_email= transfer.prefered_email;
			   cur_frm.refresh_field("trainer_email");
          		  frm.doc.contact_number=transfer.cell_number;
           		  cur_frm.refresh_field("contact_number"); 
	 	})
		}
	},
	training_program(frm){
		if(frm.doc.training_program!=null || frm.doc.training_program!=undefined){
		  frappe.model.with_doc("Training Program", frm.doc.training_program, function() {
     		  var transfer= frappe.model.get_doc("Training Program", frm.doc.training_program)
			   frm.doc.trainer_name= transfer.trainer_name;
			   cur_frm.refresh_field("trainer_name");
			   frm.doc.trainer_email= transfer.trainer_email;
			   cur_frm.refresh_field("trainer_email");
          		  frm.doc.contact_number=transfer.contact_number;
           		  cur_frm.refresh_field("contact_number");
          		  frm.doc.supplier=transfer.supplier;
           		  cur_frm.refresh_field("supplier");
          		  frm.doc.start_time=transfer.start_date;
           		  cur_frm.refresh_field("start_time");
          		  frm.doc.end_time=transfer.end_date;
           		  cur_frm.refresh_field("end_time"); 
          		  frm.doc.introduction=transfer.description;
           		  cur_frm.refresh_field("introduction");
          		  frm.doc.location=transfer.location;
           		  cur_frm.refresh_field("location");
	 	})
		}
	},
	after_save(frm) {
		$.each(frm.doc.employees,function(idx, item){
			if(item.employee!=undefined){
    			frappe.call({
    		        "method": "frappe.client.set_value",
    		        "args": {
    		            "doctype": "Employee",
    		            "name": item.employee,
    		        "fieldname": {
    		            "safety_training_program_attended":frm.doc.name
    		        },
    		        }
    		    })
			}
		});
	}

});
