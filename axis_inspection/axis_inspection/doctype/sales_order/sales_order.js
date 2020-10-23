frappe.ui.form.on('Sales Order', {
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
    }
});
