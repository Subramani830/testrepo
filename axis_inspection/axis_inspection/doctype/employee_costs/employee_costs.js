// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Costs', {
	// refresh: function(frm) {

	// }

});
frappe.ui.form.on('Employee Cost Details' , {
 cost:function(frm,cdt,cdn){
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




