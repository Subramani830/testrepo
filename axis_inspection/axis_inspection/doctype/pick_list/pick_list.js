frappe.ui.form.on('Pick List', {
    before_save:  function(frm) {
        $.each(frm.doc.items,function(idx,item){
	if(item.sales_order!=undefined){
            frappe.db.get_value("Sales Order",{"name":item.sales_order},"delivery_date",(r)=>{
                if(r.delivery_date<=frappe.datetime.nowdate()){
                    frappe.validated=false;
                    frappe.msgprint(__("Sales Order "+item.sales_order+" has been expired."));    
                }
            });
        }); 
}
    }
    }); 
