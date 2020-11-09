frappe.ui.form.on('Task', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 0 && frm.doc.out_sourced==1){    
            frm.page.add_inner_button('Purchase Order', function(){
		var doc = frappe.model.get_new_doc('Purchase Order');
		doc.task = frm.doc.name;
		doc.naming_series='PUR-ORD-.YYYY.-'
                frappe.set_route('Form', 'Purchase Order', doc.name);
            },'Create')
        }
	frm.set_df_property("out_sourced", "read_only", frm.is_new() ? 0 : 1);
	frm.set_df_property("in_house", "read_only", frm.is_new() ? 0 : 1);
    },
	before_save: function(frm){
	if(frm.doc.out_sourced==1 && frm.doc.in_house==1)
		{
			frappe.throw(__('out Sourced and In house both cannot be selected'))
		}
	}
});
