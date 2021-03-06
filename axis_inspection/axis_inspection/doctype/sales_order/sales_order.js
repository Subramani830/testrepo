frappe.ui.form.on('Sales Order', {
refresh(frm) {
	frm.fields_dict['taxes'].grid.get_field('account_head').get_query = function(doc, cdt, cdn) {
        return {    
            filters: {
                company: frm.doc.company
            }
        }
    }
	if(frm.doc.status=="Closed"){
        frappe.call({
                method:"axis_inspection.axis_inspection.api.update_workflow_status",
                async:false,
                args:{
                    name:frm.doc.name,
                },
            callback:function(r){
                cur_frm.refresh_fields("workflow_state");
            }
        });
        cur_frm.add_custom_button(__('Re-open'), function() {
            frappe.call({
                method:"axis_inspection.axis_inspection.api.update__workflow_state",
                async:false,
                args:{
                    name:frm.doc.name,
		    status:frm.doc.custom_status
                },
            callback:function(r){
                cur_frm.refresh_fields("workflow_state");
            }
        });
        }, __("Status"));
    }


    setTimeout(() => {
	frm.remove_custom_button('Work Order', 'Create');
	frm.remove_custom_button('Request for Raw Materials', 'Create');
	frm.remove_custom_button('Subscription', 'Create');
	frm.remove_custom_button('Update Items');
        }, 10);

	if(frm.doc.quotation != null){
		    var df1 = frappe.meta.get_docfield("Sales Order Item","item_code", cur_frm.doc.name);
            df1.read_only = 1;
		    var df2 = frappe.meta.get_docfield("Sales Order Item","item_name", cur_frm.doc.name);
            df2.read_only = 1;
		    var df3 = frappe.meta.get_docfield("Sales Order Item","rate", cur_frm.doc.name);
            df3.read_only = 1;
		    var df4 = frappe.meta.get_docfield("Sales Order Item","qty", cur_frm.doc.name);
            df4.read_only = 1;
		    var df5 = frappe.meta.get_docfield("Sales Order Item","uom", cur_frm.doc.name);
            df5.read_only = 1;
		    var df6 = frappe.meta.get_docfield("Sales Order Item","description", cur_frm.doc.name);
            df6.read_only = 1;
		    var df7 = frappe.meta.get_docfield("Sales Order Item","item_tax_template", cur_frm.doc.name);
            df7.read_only = 1;
		    var df8 = frappe.meta.get_docfield("Sales Order Item","weight_per_unit", cur_frm.doc.name);
            df8.read_only = 1;
		    var df9 = frappe.meta.get_docfield("Sales Order Item","weight_uom", cur_frm.doc.name);
            df9.read_only = 1;
		    var df10 = frappe.meta.get_docfield("Sales Order Item","warehouse", cur_frm.doc.name);
            df10.read_only = 1;
		    var df11 = frappe.meta.get_docfield("Sales Taxes and Charges","account_head", cur_frm.doc.name);
            df11.read_only = 1;
		    var df12 = frappe.meta.get_docfield("Sales Taxes and Charges","charge_type", cur_frm.doc.name);
            df12.read_only = 1;
		    var df13 = frappe.meta.get_docfield("Sales Taxes and Charges","description", cur_frm.doc.name);
            df13.read_only = 1;
		    var df14 = frappe.meta.get_docfield("Sales Taxes and Charges","cost_center", cur_frm.doc.name);
            df14.read_only = 1;
		    var df15 = frappe.meta.get_docfield("Sales Taxes and Charges","rate", cur_frm.doc.name);
            df15.read_only = 1;
		    var df16 = frappe.meta.get_docfield("Payment Schedule","payment_term", cur_frm.doc.name);
            df16.read_only = 1;
		    var df17 = frappe.meta.get_docfield("Payment Schedule","description", cur_frm.doc.name);
            df17.read_only = 1;
		    var df18 = frappe.meta.get_docfield("Payment Schedule","due_date", cur_frm.doc.name);
            df18.read_only = 1;
		    var df19 = frappe.meta.get_docfield("Payment Schedule","invoice_portion", cur_frm.doc.name);
            df19.read_only = 1;
		    var df20 = frappe.meta.get_docfield("Payment Schedule","payment_amount", cur_frm.doc.name);
            df20.read_only = 1;
	}

	frm.set_query("contract",function(){
		return{
			filters: {
			"party_type":'Customer',
			"docstatus": [0,1],
			"party_name":frm.doc.customer
			}
		};
	});
	if(frm.doc.docstatus === 1 && frm.doc.status !== 'Closed'
			&& flt(frm.doc.per_delivered, 6) < 100 && flt(frm.doc.per_billed, 6) < 100) {
				frm.add_custom_button(__('Update items'), () => {
					let d = new frappe.ui.Dialog({
						title: 'Enter Reason',
						fields: [
							{
								label: 'Reason',
								fieldname: 'reason',
								fieldtype: 'Small Text',
								reqd:1
							}
						],
						primary_action_label: 'Submit',
						primary_action(values) {
							frappe.call({
								"method": "axis_inspection.axis_inspection.doctype.sales_order.sales_order.set_reason_for_update_items",
								"args": {
									  "reason": values["reason"],
									  "document":frm.doc.name
								}
							})
							frm.refresh_field('reason_for_update_items')
							window.location.reload();
							d.hide();
						}
					});
					
					d.show();
				erpnext.utils.update_child_items({
					frm: frm,
					child_docname: "items",
					child_doctype: "Sales Order Detail",
					cannot_add_row: false,
				})
			});
		}
    },
after_save(frm){
	if(frm.doc.status!="Closed" && frm.doc.status!="Draft" ){
			frappe.call({
		        "method": "frappe.client.set_value",
		        "args": {
		            "doctype": "Sales Order",
		            "name": frm.doc.name,
		        "fieldname": {
		            "custom_status":frm.doc.status
		        },
		        }
		    })
			cur_frm.refresh_fields("custom_status");
		}
},
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
		if(frm.doc.contract!=undefined){
	   		 frappe.model.with_doc("Contract", frm.doc.contract, function() {
	     		  var transfer= frappe.model.get_doc("Contract", frm.doc.contract)
				  // frm.doc.naming_series='SAL-ORD-.YYYY.-';
				   //cur_frm.refresh_field("naming_series");
				   frm.doc.order_type='Sales'; 
				   cur_frm.refresh_field("order_type");
				   frm.doc.selling_price_list=transfer.price_list
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
				    cur_frm.refresh_field("items");
				})


		    	})    
	}   
	 },
	after_workflow_action: (frm) =>{
	    var rem;
	    var percent;
	    if(frm.doc.workflow_state=="Approved" && frm.doc.contract != undefined)
        {
		// your code here
		frappe.db.get_value("Contract",{"name":frm.doc.contract},["maximum_value","amt_left"],(v)=>{
		    if(v.amt_left == null || v.amt_left == ""){
		        rem=v.maximum_value-frm.doc.rounded_total;
		        percent=(rem/v.maximum_value)*100;
		    }else{
		        rem=v.amt_left-frm.doc.rounded_total;
		        percent=(rem/v.maximum_value)*100;
		    }
		    frappe.call({
                "method": "frappe.client.set_value",
                "args": {
                    "doctype": "Contract",
                    "name": frm.doc.contract,
                "fieldname": {
                    "amt_left":rem,
                    "percentage_amt_left":percent
                },
                }
            })
	if(frm.doc.quotation!=undefined){
		    frappe.call({
                "method": "frappe.client.set_value",
                "args": {
                    "doctype": "Quotation",
                    "name": frm.doc.quotation,
                "fieldname": {
                    "contract_remaining_value":rem
                },
                }
            })
}
		})
	}
	},
	quotation: function(frm) {
		frappe.db.get_value("Quotation",{"name":frm.doc.quotation},"order_type",(r)=>{
			frm.set_value('order_type',r.order_type)
		})
		frappe.db.get_value("Quotation",{"name":frm.doc.quotation},"location",(r)=>{
			frm.set_value('location',r.location)
		})
		frappe.db.get_value("Quotation",{"name":frm.doc.quotation},"subject",(r)=>{
			frm.set_value('subject',r.subject)
		})
	},
	before_save:function(frm){
		if(frm.doc.contract != undefined){
		frappe.db.get_value("Contract",{"name":frm.doc.contract},"percentage_amt_left",(a)=>{
			if(a.percentage_amt_left < 10){
		           frappe.validated=false;
		           frappe.msgprint(__("90% of the Contract amount has been consumed. It cannot be used."));
			}
		})
		}
		if(frm.doc.contract != null){
		    frappe.db.get_value("Contract",{"name":frm.doc.contract},"end_date",(r)=>{
		       if(r.end_date<=frappe.datetime.nowdate()){
		           frappe.validated=false;
		           frappe.msgprint(__("Contract "+frm.doc.contract+" has been expired."));
		           
		       }
		})
		}
	},
	delivery_date:function(frm){
		if(frm.doc.workflow_state=="Approved"){
			let d = new frappe.ui.Dialog({
				title: 'Enter Reason',
				fields: [
					{
						label: 'Reason',
						fieldname: 'reason',
						fieldtype: 'Small Text',
						reqd:1
					}
				],
				primary_action_label: 'Submit',
				primary_action(values) {
					frappe.call({
						"method": "axis_inspection.axis_inspection.doctype.sales_order.sales_order.set_reason_for_extension",
						"args": {
							  "reason": values["reason"],
							  "document":frm.doc.name,
							  "date":frm.doc.delivery_date
						}
					})
					frm.refresh_field('reason_for_extension')
					frm.refresh_field('delivery_date')
					window.location.reload();
					d.hide();
				}
			});
			
			d.show();
		}
	}
});
