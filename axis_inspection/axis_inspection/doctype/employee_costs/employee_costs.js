// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Costs', {
	refresh: function(frm) {
		if(frm.doc.docstatus === 1){    
            frm.page.add_inner_button('Journal Entry', function(){
                var doc = frappe.model.get_new_doc('Journal Entry');
                doc.reference_no = frm.doc.name;
		doc.company=frm.doc.company;
		doc.voucher_type="Journal Entry";
		doc.naming_series='ACC-JV-.YYYY.-';
                frappe.set_route('Form', 'Journal Entry', doc.name);
            },'Create')
	}
}

});
frappe.ui.form.on('Employee Cost Details' , {
 cost:function(frm,cdt,cdn){
	 $.each(frm.doc.employee_cost_details,function(idx,cost){
		if(cost.cost<0){
			cost.cost=0;
			frappe.throw("Cost should be greater than 0")
		}
	 });
	
            set_total_cost(frm,cdt,cdn);
},
 employee_cost_details_remove:function(frm,cdt,cdn){
            set_total_cost(frm,cdt,cdn);
}
});

function set_total_cost(frm,cdt,cdn){
	var cost_details=frm.doc.employee_cost_details;
	var total_cost=0;
	for(var i=0;i<cost_details.length;i++){
		total_cost=total_cost+Math.round(parseFloat(cost_details[i].cost));
	}
	
	frappe.model.set_value(frm.doc.doctype,frm.doc.name, "total_cost", total_cost);
}




