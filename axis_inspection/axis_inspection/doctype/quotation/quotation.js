frappe.ui.form.on("Quotation", {
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
				d.minimum_charge=row.minimum_charge;
				d.standby_rate=row.standby_rate;
				d.overtime_rate=row.overtime_rate;
			    cur_frm.refresh_field("items");
			})     	 
	 })
	}
	},

refresh: function(frm){
	if(frm.doc.status=="Lost"){
		frappe.call({
		        method:"axis_inspection.axis_inspection.api.update_status",
		        args:{
				doc:cur_frm.doc.name,
				status:	cur_frm.doc.status
			},
		        async:false,
		        callback: function(r){
		        }
		    });
	}
	
	

		    setTimeout(() => {
	frm.remove_custom_button('Subscription', 'Create');
        }, 10);

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

			frm.add_custom_button(__('Supplier Quotation'),
					function() {
						erpnext.utils.map_current_doc({
							method: "erpnext.buying.doctype.supplier_quotation.supplier_quotation.make_quotation",
							source_doctype: "Supplier Quotation",
							target: me.frm,
							setters: {},
							get_query_filters: {
								docstatus: 1,
								status: ["!=", "Stopped"],
							}
						})
					}, __("Get items from"));
	}

	
	frappe.call({
			method: "axis_inspection.axis_inspection.doctype.quotation.quotation.get_user_role",
			async:false,
			 callback: function(r){
				if(r.message==0){
					var df1 = frappe.meta.get_docfield("Quotation Item","rate", cur_frm.doc.name);
            				df1.read_only = 1;	
					var df2 = frappe.meta.get_docfield("Quotation","selling_price_list", cur_frm.doc.name);
            				df2.read_only = 1;			
				}
				
                }
    });

		frm.set_query("contract",function(){
			return{
				filters: {
				"party_type":'Customer',
				"docstatus": [0,1],
				"party_name":frm.doc.party_name
				}
			};
		});
		frm.set_query("item_group",function(){
			return{
				filters: {
				"parent_item_group":'Billing Items'
				}
			};
		});
		var bt = ['Opportunity']
        bt.forEach(function(bt){
            frm.page.remove_inner_button(bt, 'Get items from')
			});	
		apply_filter(frm)	
},
before_save:function(frm){
if(frm.doc.contract != null){
		    frappe.db.get_value("Contract",{"name":frm.doc.contract},"end_date",(r)=>{
		       if(r.end_date<=frappe.datetime.nowdate()){
		           frappe.validated=false;
		           frappe.msgprint(__("Contract "+frm.doc.contract+" has been expired."));
		           
		       }
		})
			var count = 0;
			var num = 0;
                       frappe.model.with_doc("Contract", frm.doc.contract, function() {
                            var tabletransfer= frappe.model.get_doc("Contract", frm.doc.contract)
                            $.each(frm.doc.items, function(idx, item){
				count++;
				num=0;
                                $.each(tabletransfer.items, function(index, row){
					num++;
                                    if(item.item_code== row.item_code){ 
					if(item.item_code!= row.item_code || item.qty != row.qty || item.uom != row.uom || item.rate != row.rate){
		          		 frappe.validated=false;
		          		 frappe.msgprint(__("Quotation items doesnot match with Contract."));
					}
                                    }
                                })
                            })
				if(count != num){
		          		 frappe.validated=false;
		          		 frappe.msgprint(__("Quotation items doesnot match with Contract."));
                                    }
                        })
		}

},
item_group(frm){
	apply_filter(frm)
}

});
function apply_filter(frm){
	var item_groups=[];
		if(frm.doc.item_group!=undefined || frm.doc.item_group!=null){
			frappe.call({
					method:"axis_inspection.axis_inspection.doctype.quotation.quotation.get_item_group",
					args:{
			item_group:frm.doc.item_group
			},
				async:false,
				callback: function(r){
				for(var i=0;i<r.message.length;i++){
				item_groups.push(r.message[i].name);
				}
	
				frm.fields_dict['items'].grid.get_field('item_code').get_query = function() {
					return {
						filters: {
							item_group:["in",item_groups],
							is_sales_item:1 
						}
					};
				};
	
				}
			})
		}
}

