frappe.ui.form.on('Purchase Order', {
	on_submit:function(frm,cdt,cdn){
			frappe.db.get_value("Address",frm.doc.supplier_address, "email_id",(c)=>{
				var email=c.email_id;
				var emailTemplate='<h3><strong> Dear '+frm.doc.supplier_name+',</strong></h3><br><br>'+
				'<h3>This is to inform that the Purchase Order has been created. You can find your purchase information below.<br><br>'+
				'Thanks,<br><br></h3>';
				sendEmail(frm.doc.name,email,emailTemplate);
			})
	}
});

function sendEmail(name,email,template){
    frappe.call({
        method: "frappe.core.doctype.communication.email.make",
        args: {
            subject: name,
            communication_medium: "Email",
            recipients: email,
            content: template,
            communication_type: "Communication",
            send_email:1,
            attachments:[],
            print_format:"Standard",
            doctype: "Purchase Order",
            name: name,
            print_letterhead: 0
        },        
        callback: function(rh){
            console.log("sent");
        }   
    });
}

