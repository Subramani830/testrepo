frappe.ui.form.on('Training Event', {
	internal_trainer: function(frm) {

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

});
