frappe.ui.form.on('Material Request', {
	onload_post_render: function(frm) {

		frm.remove_custom_button("Bill of Materials", 'Get Items From');
		frm.remove_custom_button("Product Bundle", 'Get Items From');
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
				if(frm.doc.requested_for!==undefined&&frm.doc.department_manager==undefined){
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
		if(frm.doc.requested_for){
			frappe.call({
				method:"axis_inspection.axis_inspection.doctype.material_request.material_request.get_reports_to",
				async:false,
					args: {
						name: frm.doc.requested_for
					},
				callback: function(r){
					frm.set_value('reports_to',r.message[0])
					frm.set_value('reports_to_employee_name',r.message[1])
					frm.set_value('prefered_email',r.message[2])
				}
			});
		}
	},
refresh:function(frm){
	frm.set_query( "tc_name", function() {
		        return {
		            filters: {
		                "buying":1
		            }
		        };
		    })
	frm.fields_dict['items'].grid.get_field('warehouse').get_query = function() {
					return {
						filters: {
							is_group:0,
							company:frm.doc.company
						}
					};
				};
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


frappe.ui.form.on('Material Request Item', {
	items_add(frm,cdt,cdn) {
	    var cur_grid =frm.get_field('items').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if (frm.doc.reference_no!=undefined){
    		cur_row.doc.reference_no=frm.doc.reference_no
    		cur_frm.refresh_fields();
		}
	}
})
