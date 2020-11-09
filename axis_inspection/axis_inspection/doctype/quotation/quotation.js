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
			  frm.doc.price_list=transfer.price_list
         		   cur_frm.refresh_field("price_list");
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

			cur_frm.clear_table("items");
			$.each(transfer.items, function(index, row){
			    var d=frm.add_child("items");
			    d.item_code = row.item_code;
			    d.delivery_date = row.delivery_date;
			    d.item_name = row.item_name;
			    d.description = row.description;
			    d.item_group = row.item_group;
			    d.brand = row.brand;
			    d.image = row.image;
			    d.rate = row.rate;
			    d.image_view = row.image_view;
			    d.qty = row.qty;
			    d.stock_uom = row.stock_uom;
			    d.uom = row.uom;
			})      
	 })
	},
	refresh: function(frm){
	if (frm.doc.docstatus===0) {
			frm.add_custom_button(__('Request Customer Information'),
					function() {
						erpnext.utils.map_current_doc({
						method: "axis_inspection.axis_inspection.doctype.request_customer_information.request_customer_information.make_quotation",
						source_doctype: "Request Customer Information",
						target: me.frm,
						setters: [
							{
								label: "Party",
								fieldname: "party_name",
								fieldtype: "Link",
								options: me.frm.doc.quotation_to,
								default: me.frm.doc.party_name || undefined
							},
							{
								label: "Opportunity Type",
								fieldname: "opportunity_type",
								fieldtype: "Link",
								options: "Opportunity Type",
								default: me.frm.doc.order_type || undefined
							}
						],
						get_query_filters: {
							status: ["not in", ["Lost", "Closed"]],
							company: me.frm.doc.company
						}
					})
					}, __("Get items from"), "btn-default");
	}
	}
});


