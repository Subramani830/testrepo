frappe.ui.form.on('Job Offer', {
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
