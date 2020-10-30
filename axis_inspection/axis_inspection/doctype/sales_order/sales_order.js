frappe.ui.form.on('Sales Order', {
    customer: function(frm,cdt,cdn) {
        frappe.call({
            method: "frappe.client.get_value",
            async:false,
            args: {
                doctype: "Customer",
                fieldname: "blacklisted",
                filters:{
                    "name":frm.doc.customer
                }
            },
            callback(r){
                if(r.message.blacklisted==1){
                    frappe.confirm(
                        __(frm.doc.customer+" is blacklisted.Do you want to continue?"),
                        function () {
                        },
                        function(){
                            frm.doc.customer="";
                            frm.doc.customer_name="";
                            cur_frm.refresh_fields("customer","customer_name");
                        }
                        )
                }
            }
        });
    },
	contract: function(frm) {

   		 frappe.model.with_doc("Contract", frm.doc.contract, function() {
     		  var transfer= frappe.model.get_doc("Contract", frm.doc.contract)
			   frm.doc.naming_series='SAL-ORD-.YYYY.-';
			   cur_frm.refresh_field("naming_series");
			   frm.doc.order_type='Sales'; 
			   cur_frm.refresh_field("order_type");
			   frm.doc.price_list=transfer.price_list
         		   cur_frm.refresh_field("price_list");

			  frappe.db.get_value("Address",frm.doc.customer,"name",(s)=>{
				frm.doc.customer_address = s.name;
				cur_frm.refresh_field("customer_address");
			  })
			frappe.db.get_value("Customer",frm.doc.customer_name,"customer_primary_contact",(a)=>{
				frm.doc.contact_person = a.customer_primary_contact;
				cur_frm.refresh_field("contact_person");
            		})
			frm.doc.customer=transfer.party_name;
         		   cur_frm.refresh_field("customer");
			cur_frm.clear_table("items");
			$.each(transfer.items, function(index, row){
			    var d=frm.add_child("items");
			    d.item_code = row.item_code;
			    d.customer_item_code = row.customer_item_code;
			    d.ensure_delivery_based_on_produced_serial_no = row.ensure_delivery_based_on_produced_serial_no;
			    d.delivery_date = row.delivery_date;
			    d.item_name = row.item_name;
			    d.description = row.description;
			    d.item_group = row.item_group;
			    d.rate = row.rate;

			    d.brand = row.brand;
			    d.image = row.image;
			    d.image_view = row.image_view;
			    d.qty = row.qty;
			    d.stock_uom = row.stock_uom;
			    d.uom = row.uom;
			})


            	})       
	 }
});
