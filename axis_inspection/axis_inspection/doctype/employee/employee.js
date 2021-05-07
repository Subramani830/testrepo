frappe.ui.form.on('Employee', {
	department:function(frm,cdt,cdn){
    		frappe.db.get_value("Department",frm.doc.department,"department_manager",(c)=>{
	    		if(c.department_manager!==null){
	        		var department_manager=c.department_manager;
    	   			frappe.db.get_value("Employee",department_manager,"user_id",(r)=>{
        	    		if(r.user_id===null){
        	        		frm.doc.department_manager='';
        	    		}else{
        	        		frm.doc.department_manager=r.user_id;
        	    		}
        	    		cur_frm.refresh_fields("department_manager")
    	   			});
	    		}
    		});
	},
validate:function(frm){
	var regex = /^[0-9]{10}$/;
	if (regex.test(frm.doc.id_number) != true && frm.doc.id_number!=undefined && frm.doc.id_number!=""){
		frappe.msgprint(__("ID number should be 10 digit."));
		frappe.validated = false;

	}
	if (regex.test(frm.doc.border_number) != true && frm.doc.border_number!=undefined && frm.doc.border_number!=""){
		frappe.msgprint(__("Border number should be 10 digit."));
		frappe.validated = false;

	}
	if (regex.test(frm.doc.visa_number) != true && frm.doc.visa_number!=undefined && frm.doc.visa_number!=""){
		frappe.msgprint(__("Visa number should be 10 digit."));
		frappe.validated = false;

	}
	if(frm.doc.id_expiry_date<=frappe.datetime.get_today()){
		frappe.msgprint(__("Id Expiry date should be greater than todays date."));
		frappe.validated = false;
	}
	if(frm.doc.valid_upto<=frappe.datetime.get_today()){
		frappe.msgprint(__("Valid Upto should be greater than todays date."));
		frappe.validated = false;
	}


},
reports_to:function(frm,cdt,cdn){
    		frappe.db.get_value("Employee",{"name":frm.doc.reports_to},"user_id",(c)=>{
	    		if(c.user_id){
	        			console.log(c.user_id)
				frm.set_value("reports_to_id",c.user_id)
	    		}
    		});
	},
job_applicant:function(frm){
		frappe.db.get_value("Job Offer",{"job_applicant":frm.doc.job_applicant},["offer_date","offer_confirmation_date","name","designation"],(e)=>{
			frm.set_value("scheduled_confirmation_date", e.offer_date);
			frm.set_value("offer_no",e.name)
			frm.set_value("job_offer_confirmation_date", e.offer_confirmation_date);
			frm.set_value("designation",e.designation);
		});
		frappe.db.get_value("Job Applicant",{"name":frm.doc.job_applicant},["interview_date",],(e)=>{
			frm.set_value("application_date", e.interview_date);
		});
},
probation_duration:function(frm){
	var end_date;
	if(frm.doc.probation_duration!=undefined){
		 end_date=addDays(frm.doc.probation_start_date, frm.doc.probation_duration) 	 
	}
	frm.set_value("final_confirmation_date",end_date);
}
});

function addDays(start_date, days) {
	var d = new Date(start_date);
	d.setDate(d.getDate() + Number(days));
	return d
	
  }
