frappe.ui.form.on('Sales Invoice', {
	on_submit:function(frm){

		$.each(frm.doc.items, function(idx, item){
		frappe.db.get_value("Sales Order",item.sales_order,["per_billed","name"],(s)=>{
		if(s.per_billed >= 70)
			{
            		var salesperson;
			var emailTemplate=
			'<h3>Hi,</h3>'+
			'<p>70% of the Sales Order has been consumed for the Document Number'+ s.name+'.</p>'+
			'<h3>Thank You</h3>';

		    	frappe.call({
			method:"axis_inspection.axis_inspection.api.get_email_list",
			async:false,
			args: {
			    doctype: "Has Role",
			    role:"Sales Manager",
			    parenttype:"User"
			},
			args: {
			    doctype: "Has Role",
			    role:"Projets Manager",
			    parenttype:"User"
			},
			args: {
			    doctype: "Has Role",
			    role:"Accounts Manager",
			    parenttype:"User"
			},
			    callback: function(r) {
				
				for(var i=0;i < r.message.length;i++){

				 if(r.message[i].parent !="Administrator"){
					salesperson = r.message[i].parent;

			  frappe.call({
                    method: "frappe.core.doctype.communication.email.make",
                    args: {
		
              subject: 'Sales Order Consumption for '+ s.name,
              communication_medium: "Email",
              recipients:salesperson,
              content: emailTemplate,
              communication_type: "Communication",
              send_email:1
              },
              callback: function(rh){
                console.log("Email sent successfully")
              }
            });
				} }
			    }

			  })
			
	}
})
})
}

});

