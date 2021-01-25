frappe.ui.form.on('Payment Request', {
    before_save:  function(frm) {
            frappe.db.get_value("Sales Order",{"name":frm.doc.reference_name},"delivery_date",(r)=>{
                if(r.delivery_date<=frappe.datetime.nowdate()){
                    frappe.validated=false;
                    frappe.msgprint(__("Sales Order "+frm.doc.reference_name+" has been expired."));    
                }
            });
    }
    }); 
