frappe.ui.form.on("Quality Inspection", {
reference_type:function(frm){
    if(frm.doc.reference_type=="Asset Movement"){
        frm.set_query("item_code", function() {
            return {
                filters: {
                    "is_fixed_asset":1
                }
            };
        });
    }
    else{
        frm.set_query("item_code", function() {
            return {
                filters: {
                    "is_stock_item":1
                }
            };
        });
    }

}
});