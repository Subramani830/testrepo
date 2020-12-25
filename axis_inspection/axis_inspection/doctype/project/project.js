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
	}
})
