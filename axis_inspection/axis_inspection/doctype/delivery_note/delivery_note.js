frappe.ui.form.on('Delivery Note', {
before_save:  function(frm) {
    $.each(frm.doc.items,function(idx,item){
	if(item.against_sales_order!=undefined){
        frappe.db.get_value("Sales Order",{"name":item.against_sales_order},"delivery_date",(r)=>{
            if(r.delivery_date<=frappe.datetime.nowdate()){
                frappe.validated=false;
                frappe.msgprint(__("Sales Order "+item.against_sales_order+" has been expired."));    
            }
        });
	}
    }); 
}
}); 
