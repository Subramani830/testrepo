frappe.ui.form.on('Purchase Order', {
refresh(frm){
		if(frm.doc.supplier_quotation!=undefined){
			frappe.db.get_value("Supplier Quotation",frm.doc.supplier_quotation, "taxes_and_charges",(t)=>{
				frm.set_value("taxes_and_charges",t.taxes_and_charges);
				cur_frm.refresh_field("taxes_and_charges");
			})
		}
},
	onload_post_render: function(frm) {
	    setTimeout(() => {
		frm.remove_custom_button('Product Bundle','Get items from');
		frm.remove_custom_button('Update Items');
		frm.remove_custom_button('Subscription','Create');
		}, 10);


		$.each(frm.doc.items,function(idx, item){
		if(item.supplier_quotation!=undefined){
		    frappe.call({
		        method:"axis_inspection.axis_inspection.api.update_project",
		        async:false,
		        args:{
		            doctype:'Supplier Quotation Item',
		            name:item.supplier_quotation,
		            parenttype:'Supplier Quotation'
		        },
		        callback:function(r){
		            for(var i=0;i<r.message.length;i++){
		                frappe.model.set_value(item.doctype, item.name, "project", r.message[i].project);
		                frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
				frappe.model.set_value(item.doctype, item.name, "cost_center", r.message[i].cost_center);
                        	frappe.model.set_value(item.doctype, item.name, "branch", r.message[i].branch);
		            }
		        }
		    });
		}
	});
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

