frappe.ui.form.on('Sales Invoice', {
refresh(frm) {
		// your code here
if(frm.doc.month_of_work==""){
	var today = new Date();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var n = month[today.getMonth()];
        frm.set_value("month_of_work", n);
}
},
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
	},
before_save:  function(frm) {
    $.each(frm.doc.items,function(idx,item){
	if(item.sales_order!=undefined){
        frappe.db.get_value("Sales Order",{"name":item.sales_order},"delivery_date",(r)=>{
            if(r.delivery_date<=frappe.datetime.nowdate()){
                frappe.validated=false;
                frappe.msgprint(__("Sales Order "+item.sales_order+" has been expired."));    
            }
        });
	}
    }); 
},
ses_number:function(frm){
    if(frm.doc.ses_number){
        if(frm.doc.docstatus==1){
            frappe.confirm('Are you sure to update the SES Number?',
            () => {
                // action to perform if Yes is selected
                frappe.call({
                    "method": "axis_inspection.axis_inspection.doctype.sales_invoice.sales_invoice.submit_SI_record",
                    "args": {
                          "doctype": frm.doc.doctype,
                          "docname": frm.doc.name,
                          "ses_no":frm.doc.ses_number
                    },
                    callback:function(){
                        frm.reload_doc()
                    }
                })
            }, () => {
                // action to perform if No is selected
            })
        }
    }
},
po_no:function(frm){
    if(frm.doc.po_no=="Proforma"){
        frm.set_df_property("timesheets", "reqd", 1);
    }
}

});

