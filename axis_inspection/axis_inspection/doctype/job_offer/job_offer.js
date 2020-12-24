frappe.ui.form.on('Job Offer', {
after_save:function(frm,cdt,cdn){
    var sender;
    frappe.call({
        method:"axis_inspection.axis_inspection.api.get_sender_email",
        async:false,
        args: {
            doctype: "Has Role",
            role:"HR Manager",
            parenttype:"User"
        },
            callback: function(r) {
                if(r.message!==undefined){
                    sender=r.message;
                }
            }
    });
    if(frm.doc.status=="Accepted"){
        var emailTemplate=
        '<h3>Dear ' +frm.doc.applicant_name+ ',</h3>'+
        '<br>'+
        '<h3>Heartly Congratulations!</h3>'+
        '<br>'+
        '<h3> We are happy to offer you the position '+frm.doc.designation+' in '+frm.doc.company+' Offer letter is attached with this. </h3>'+
        '<br>'+
        '<h3>Please Send your acceptance   after going through the offer.</h3>'+
        '<br>'+
        '<h3>Regards</h3>'+
        '<h3>HR Team</h3>';
        sendEmail(sender,frm.doc.name,frm.doc.applicant_email,emailTemplate)
    }
},
job_applicant:function(frm,cdt,cdn){
    if(frm.doc.job_applicant!=undefined){
	    frappe.call({
		method:"axis_inspection.axis_inspection.api.get_designation",
		async:false,
		args: {
		    doctype: "Job Applicant",
		    name: frm.doc.job_applicant
		},
		    callback: function(r) {
		        if(r.message!==undefined){
		            frm.set_value("designation",r.message)
		        }
			else{
				frm.set_value("designation","")
			}
		    }
	    });
}
},
is_existing_employee:function(frm){
	if(frm.doc.is_existing_employee==1){
		frm.set_value("job_applicant","Generic - generic@gmail.com")
	}
}
});

function sendEmail(sender,name,email,template){
    frappe.call({
        method: "frappe.core.doctype.communication.email.make",
        args: {
            sender:sender,
            subject: name,
            communication_medium: "Email",
            recipients: email,
            content: template,
            communication_type: "Communication",
            send_email:1,
            attachments:[],
            print_format:"Axis Job Offer Print Format",
            doctype: "Job Offer",
            name: name,
            print_letterhead: 0
        },
        callback: function(rh){
            console.log("sent");
        }   
    });

}
