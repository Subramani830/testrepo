frappe.ui.form.on("Quotation", {
	contract: function(frm) {

   		 frappe.model.with_doc("Contract", frm.doc.contract, function() {
     		  var transfer= frappe.model.get_doc("Contract", frm.doc.contract)
			   frm.doc.transaction_date= frappe.datetime.get_today();
			   cur_frm.refresh_field("transaction_date");
			   frm.doc.naming_series='SAL-QTN-.YYYY.-';
			   cur_frm.refresh_field("naming_series");
          		  frm.doc.party_name=transfer.party_name;
           		  cur_frm.refresh_field("party_name");
			  frm.doc.order_type='Sales';
         		  cur_frm.refresh_field("order_type");
			  frm.doc.customer_name=transfer.party_name;
         		  cur_frm.refresh_field("customer_name");
			  frappe.db.get_value("Address",frm.doc.customer,"name",(s)=>{
				frm.doc.customer_address = s.name;
				cur_frm.refresh_field("customer_address");
			  })
			frappe.db.get_value("Customer",frm.doc.customer_name,"customer_primary_contact",(a)=>{
			frm.doc.contact_person = a.customer_primary_contact;
			cur_frm.refresh_field("contact_person");
            		})       
	 })
	}
})
