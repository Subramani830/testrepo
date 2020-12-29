frappe.ui.form.on('Purchase Order', {
	onload_post_render: function(frm) {
	    setTimeout(() => {
		frm.remove_custom_button('Product Bundle','Get items from');
		frm.remove_custom_button('Update Items');
		frm.remove_custom_button('Subscription','Create');
		}, 10);
	    },
after_save: function(frm){
	location.reload()
},
	after_workflow_action:function(frm,cdt,cdn){
	    if(frm.doc.workflow_state=="Approved")
	        {
			frappe.db.get_value("Address",frm.doc.supplier_address, "email_id",(c)=>{
				var email=c.email_id;
				var emailTemplate='<h3><strong> Dear '+frm.doc.supplier_name+',</strong></h3><br><br>'+
				'<h3>This is to inform that the Purchase Order has been created. You can find your purchase information below.<br><br>'+
				'Thanks,<br><br></h3>';
				sendEmail(frm.doc.name,email,emailTemplate);
			})
			location.reload()
	}
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

