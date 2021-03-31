frappe.ui.form.on('Project', {
	refresh(frm) {
		// your code here
	},
		before_save(frm) {
		if(frm.doc.sales_order != null){
		    frappe.db.get_value("Sales Order",{"name":frm.doc.sales_order},"delivery_date",(r)=>{
		       if(r.delivery_date<frappe.datetime.nowdate()){
		           frappe.validated=false;
		           frappe.msgprint(__("Sales Order has been expired."));
		           
		       }
		})
		}
	},
	sales_order(frm){
		if(frm.doc.sales_order != null || frm.doc.sales_order != undefined){
		    frappe.db.get_value("Sales Order",{"name":frm.doc.sales_order},["delivery_date","customers_purchase_order_valid_till","location"],(d)=>{
		frm.set_value("expected_start_date",d.customers_purchase_order_valid_till);
		cur_frm.refresh_field("expected_start_date")
		frm.set_value("expected_end_date",d.delivery_date);
		cur_frm.refresh_field("expected_end_date")	
		frm.set_value("location",d.location);
		cur_frm.refresh_field("location")
		})
		}
	}
})
