frappe.ui.form.on("Quotation", {
	party_name: function(frm) {
		frm.set_query("contract",function(){
            return{
       		filters: [
                    ["Contract","party_name", "in",[frm.doc.party_name]]
                ]
    }
    });
	},
	contract: function(frm) {

		if(frm.doc.contract!=undefined){
   		 frappe.model.with_doc("Contract", frm.doc.contract, function() {
     		  var transfer= frappe.model.get_doc("Contract", frm.doc.contract)
			  frm.doc.selling_price_list=transfer.price_list;
         		   cur_frm.refresh_field("price_list");

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
			    cur_frm.refresh_field("items");
			})     	 
	 })
	}
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

