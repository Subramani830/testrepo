frappe.ui.form.on('Job Applicant', {
refresh:function(frm,cdt,cdn){
    var sender=get_sender();
    if(frm.doc.status=="Accepted"){
        var emailTemplate=
        '<h3>Dear ' +frm.doc.applicant_name+ ',</h3>'+
        '<h3>    Your Job application for '+frm.doc.job_title+' has been accepted. Please note the interview date and details as scheduled below.</h3>'+
        '<h3>1. Interview date:'+moment(frm.doc.interview_date).format('DD-MM-YYYY')+'</h3>'+
        '<h3>2. Interview time:'+frm.doc.interview_time+'</h3>'+
        '<h3>Please confirm receipt and your attendance.</h3>'+
        '<br>'+
        '<h3>Regards</h3>'+
        '<h3>HR Team</h3>';
        sendEmail(sender,frm.doc.name,frm.doc.email_id,emailTemplate)
    }
    else if(frm.doc.status=="Rejected"){
        var emailTemplate=
        '<h3>Dear ' +frm.doc.applicant_name+ ',</h3>'+
        '<h3>This is regarding your job application '+frm.doc.job_title+' . We are sorry to inform you that at this time, we will not be able consider your application for the post. we will revert back when a suitable position is available. we are keeping the record of your data in our database.</h3>'+
        '<br>'+
        '<h3>Thanks and Regards</h3>'+
        '<h3>HR Team</h3>';
        sendEmail(sender,frm.doc.name,frm.doc.email_id,emailTemplate)
    }
},
interview_date:function(frm,cdt,cd){
    var today = new Date().toISOString().slice(0, 10)
        if(frm.doc.interview_date<today){
            frm.doc.interview_date='';
            cur_frm.refresh_field('interview_date)');
            frappe.throw("Interview date cannot be before today's date.");
        }
},
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
                send_email:1
                },
            callback: function(rh){
                console.log("sent");
             }   
    });
}

function  get_sender(){
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
    return sender
}
