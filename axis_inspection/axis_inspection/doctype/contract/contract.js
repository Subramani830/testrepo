frappe.ui.form.on('Contract', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 1 && frm.doc.party_type=='Customer'){    
		frm.add_custom_button(__('Sales Order'),
		function() {
		frm.trigger("make_sales_order")
		}, __('Create'));

		frm.add_custom_button(__('Quotation'),
		function() {
		frm.trigger("make_quotation")
		}, __('Create'));
		}
    },
	make_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "axis_inspection.axis_inspection.doctype.contract.contract.make_sales_order",
			frm: frm
		})
	},
	make_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "axis_inspection.axis_inspection.doctype.contract.contract.make_quotation",
			frm: frm
		})
	},
contract_terms_and_conditions:function(frm) {
frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Terms and Conditions",
				fieldname: "terms",
				filters:{
					title:frm.doc.contract_terms_and_conditions		
				}
			},
			callback(r) {
			    if(r.message) {
				frm.set_value("contract_terms",r.message.terms)
			    }
			}
		    });
},
document_name:function(frm,cdt,cdn){
	if(frm.doc.document_type==="Job Offer" && frm.doc.document_name!=undefined){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_job_offer_terms",
			async:false,
			args:{
				doctype:'Job Offer Term',
				parent:frm.doc.document_name,
				parenttype:'Job Offer'
			},
			callback:function(r){
				for(var i=0;i<r.message.length;i++){
					var child = cur_frm.add_child("contract_term");
					frappe.model.set_value(child.doctype, child.name, "contract_term", r.message[i].offer_term);
					frappe.model.set_value(child.doctype, child.name, "value", r.message[i].value);
					cur_frm.refresh_field("contract_term");
				}
			}
		});
		}
},
party_name:function(frm,cdt,cdn){
	if(frm.doc.party_type==="Employee"){
		if(frm.doc.party_name!=undefined){
			frappe.db.get_value("Employee",frm.doc.party_name,["leave_policy","holiday_list","default_shift"],(v)=>{
				frm.set_value("leave_policy", v.leave_policy);
				frm.set_value("holiday_list", v.holiday_list);
				frm.set_value("shift_type", v.default_shift);
			  })		  
		}
	}
},
after_save:function(frm){
	if(frm.doc.party_type=="Employee"){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.update_enployee",
			async:false,
			args:{
				name:frm.doc.party_name,
				contract_no:frm.doc.name,
				contract_start_date:frm.doc.start_date,
				contract_end_date:frm.doc.end_date,
				contract_date_end:frm.doc.duration
			},
			callback:function(r){
				frappe.db.get_value("Employee",frm.doc.party_name,"probation_duration",(c)=>{
		    		if(c.probation_duration!==null){
					var	end_date=addDays(frm.doc.start_date, c.probation_duration) 
					var dateFormated = end_date.toISOString().substr(0,10);
						frappe.call({
							"method": "frappe.client.set_value",
							"async":false,
							"args": {
							"doctype": "Employee",
							"name": frm.doc.party_name,
							"fieldname":"final_confirmation_date",
							"value":dateFormated
							}
						});
					}
					});
			}
		});
	}
},
party_type:function(frm){
	if(frm.doc.party_type=="Employee"){
		var  contract_term=["Contract Type","Contract Duration","Notice Period","Weekend Days","Destination"]
		frappe.call({
			method: "frappe.client.get_list",
			async:false,
			args: {
				doctype: "Contract Term",
				fields: ["name"],
				filters:{
					name:["in",contract_term]
				},
			},
			callback: function(r) {
				if(r.message.length>0){
					cur_frm.clear_table("contract_term")
					for(var i=0;i<r.message.length;i++){
						var child = cur_frm.add_child("contract_term");
						  child.contract_term=r.message[i].name;
					}
				}
			}
		})
		cur_frm.refresh_field("contract_term")
	}
},
start_date:function(frm){
	if(frm.doc.party_type=="Employee"){
		if(frm.doc.start_date!=undefined && frm.doc.end_date!=undefined){
			var duration=updateDuration(frm.doc.start_date,frm.doc.end_date)	
			if(duration==1 ||duration==2||duration==3||duration==4||duration==5){
				var duration1=duration+" Year"
				frm.set_value("duration",duration1);
			}
			else{
					frm.doc.duration='';
					cur_frm.refresh_field('duration');
					frappe.throw(('Duration will be in years only'))
			}	
		}
		else{
			frappe.throw(('Please enter start date and end date'))
		}
	}
},
end_date:function(frm){
	if(frm.doc.party_type=="Employee"){
		if(frm.doc.start_date!=undefined && frm.doc.end_date!=undefined){
			var duration=updateDuration(frm.doc.start_date,frm.doc.end_date)	
			if(duration==1 ||duration==2||duration==3||duration==4||duration==5){
				var duration1=duration+" Year"
				frm.set_value("duration",duration1);
			}
			else{
					frm.doc.duration='';
					cur_frm.refresh_field('duration');
					frappe.throw(('Duration will be in years only'))
			}		
		}
		else{
			frappe.throw(('Please enter start date and end date'))
		}
	}
},
duration:function(frm){
	if(frm.doc.duration!=undefined){
        $.each(frm.doc.contract_term,function(idx,term){
			if(term.contract_term=="Contract Duration"){
                frappe.model.set_value(term.doctype, term.name, "value",frm.doc.duration);
            }
        });
    }
}
});


frappe.ui.form.on('Contract Item', {
    item_code:  function(frm,cdt,cdn) {
	$.each(frm.doc.items, function(idx, item){
	 var transfer
		frappe.call({
			method: "frappe.client.get",
			async:false,
			args: {
			    doctype: "Item",
			    name: item.item_code,
			},
			callback(r) {
			    if(r.message) {
			        transfer = r.message;
			    }
			}
		    });
		item.item_name=transfer.item_name
		item.description=transfer.description
		item.qty=1
		frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Item Price",
				fieldname: "price_list_rate",
				filters:{
					item_code: item.item_code,
			    		price_list: frm.doc.price_list
				}
			},
			callback(r) {
			    if(r.message) {
				item.rate=r.message.price_list_rate
				item.amount=item.rate*item.qty
			    }
			}
		    });
	$.each(transfer.uoms, function(idx, uom){
		if(transfer.stock_uom==uom.uom){
			item.uom=uom.uom
			item.conversion_factor=uom.conversion_factor
		}
	});
cur_frm.refresh_field('items')
});
},
qty:  function(frm,cdt,cdn) {
	$.each(frm.doc.items, function(idx, item){
			item.amount=item.rate*item.qty
		});
cur_frm.refresh_field('items')
},
rate:  function(frm,cdt,cdn) {
	$.each(frm.doc.items, function(idx, item){
			item.amount=item.rate*item.qty
		});
cur_frm.refresh_field('items')
}
});

function addDays(start_date, days) {
	var d = new Date(start_date);
	d.setDate(d.getDate() + Number(days));
	return d
	
  }

  function updateDuration(start_date,end_date){
	var date1 = new Date(start_date);
	var date2 = new Date(end_date);
	var Difference_In_Time = date2.getTime() - date1.getTime(); 
	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
	var duration=Difference_In_Days/365

	return duration
	
  }