frappe.ui.form.on('Lead',{
refresh:function(frm){
    frm.set_query("contact_by", function() {
        return {
                query: "axis_inspection.axis_inspection.api.get_user_list",
                filters:{
                    "role":["in","Sales User","Sales Manager"]
                }
            
        };
    });
}
})
