frappe.ui.form.on('Material Request', {
	onload_post_render: function(frm) {
		// your code here
		frm.remove_custom_button("Bill of Materials", 'Get items from');
		frm.remove_custom_button("Product Bundle", 'Get items from');
	var bt = ['Pick List']
        bt.forEach(function(bt){
        frm.page.remove_inner_button(bt, 'Create')
            });
	},
	after_save:function(frm){
		location.reload()
	},
	requested_for:function(frm) {
				if(frm.doc.requested_for!==undefined){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_reports_to",
			async:false,
					args: {
						doctype: 'Employee',
						name: frm.doc.requested_for
					},
				callback: function(r){
					frm.set_value('department_manager',r.message)
				}
			});
			}
	},
before_save:function(frm) {
  $.each(frm.doc.items,function(idx,item){
	if(item.sales_order!=undefined){
        frappe.db.get_value("Sales Order",{"name":item.sales_order},"delivery_date",(r)=>{
            if(r.delivery_date<=frappe.datetime.nowdate()){
                frappe.validated=false;
                frappe.msgprint(__("Sales Order "+item.sales_order+" has been expired."));    
            }
        });
	}
  });
}
});
