frappe.ui.form.on('Sales Invoice', {
	after_workflow_action: (frm) =>{
	    var rem;
	    var percent;
	    if(frm.doc.workflow_state=="Approved")
        {
		frappe.db.get_value("Sales Order",{"name":frm.doc.sales_order},["rounded_total","amount_left"],(v)=>{
		    if(v.amount_left == null || v.amount_left == ""){
		        rem=v.rounded_total-frm.doc.rounded_total;
		        percent=(rem/v.rounded_total)*100;
		    }else{
		        rem=v.amount_left-frm.doc.rounded_total;
		        percent=(rem/v.rounded_total)*100;
		    }
		    frappe.call({
                "method": "frappe.client.set_value",
                "args": {
                    "doctype": "Sales Order",
                    "name": frm.doc.sales_order,
                "fieldname": {
                    "amount_left":rem,
                    "amt_billed_perc":percent
                },
                }
            })
		})
	}
	}

});

