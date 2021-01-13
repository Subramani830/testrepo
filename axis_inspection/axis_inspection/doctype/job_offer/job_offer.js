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
    if(frm.doc.status=="Applicant Accepted"){
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
    var  offer_term=["Designation","Total Salary","Basic Salary","Transportation","Housing","Communication","Food","Medical Insurance","Vacation Due After","Overtime","Vacation Days","Ticket","Travel Class","Family Status","Probationary Period","Other term & Conditions","Main Duties","Validity","Working Hours"]
    frappe.call({
        method: "frappe.client.get_list",
        async:false,
        args: {
            doctype: "Offer Term",
            fields: ["name"],
            filters:{
                name:["in",offer_term]
            },
        },
        callback: function(r) {
            if(r.message.length>0){
                cur_frm.clear_table("offer_terms")
                for(var i=0;i<r.message.length;i++){
                    var child = cur_frm.add_child("offer_terms");
                    child.offer_term=r.message[i].name;
                }
            }
        }
    })
    }
cur_frm.refresh_field("offer_terms")
},
designation:function(frm,cdt,cdn){
    if(frm.doc.designation!=undefined){
        $.each(frm.doc.offer_terms,function(idx,term){
			if(term.offer_term=="Designation"){
                frappe.model.set_value(term.doctype, term.name, "value",frm.doc.designation);
            }
        });
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


frappe.listview_settings['Job Offer'] = {
	add_fields: ["company", "designation", "job_applicant", "status"],
	get_indicator: function (doc) {
		if (doc.status == "Applicant Accepted") {
			return [__(doc.status), "green", "status,=," + doc.status];
		} else if (doc.status == "Awaiting Response") {
			return [__(doc.status), "orange", "status,=," + doc.status];
		} else if (doc.status == "Not Sent") {
			return [__(doc.status), "orange", "status,=," + doc.status];
		} else if (doc.status == "Applicant Rejected") {
			return [__(doc.status), "red", "status,=," + doc.status];
		}
	}
};
