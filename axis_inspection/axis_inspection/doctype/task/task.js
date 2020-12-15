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
	},
project:function(frm){
var sales_order;
var employee=[];
	frappe.call({
		method: "frappe.client.get_value",
		async:false,
		args: {
			doctype: "Project",
			fieldname: "sales_order",
			filters:{
				"name":frm.doc.project,
			}
		},
		callback: function(r) {
			if(r.message.sales_order!==undefined){
				sales_order=r.message.sales_order;
			}
		}
	});
	frappe.call({
		method:"axis_inspection.axis_inspection.api.get_employee_filter",
		async:false,
		args: {
			"sales_order":sales_order	
		},
		callback: function(r){
			for(var i=0; i<r.message.length; i++){
				employee.push(r.message[i]);
			}
			frm.fields_dict['assign_'].grid.get_field('assign_to').get_query = function() {
				return {
					filters: {
						name:["in",employee] 
					}
				};
			};
						
		}
	});
	
	
}
});
