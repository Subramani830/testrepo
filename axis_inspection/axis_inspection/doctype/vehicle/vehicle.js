frappe.ui.form.on('Vehicle', {
	refresh: function(frm) {
        frm.set_query("asset",function(){
            return{
       filters: [
                    ["Asset","asset_category", "in",["Vehicle"]]
                ]
    }
    });
	}
})
