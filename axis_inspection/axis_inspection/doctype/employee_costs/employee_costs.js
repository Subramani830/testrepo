// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Costs', {
	refresh: function(frm) {
	if(frm.doc.docstatus === 0 && frm.doc.__islocal==1){
	    	frappe.call({
            method: "frappe.client.get_list",
		async:false,
            args: {
                doctype: "Documents",
                fields: ["name"],
                filters:{
                },
            },
            callback: function(r) {
                if(r.message.length>0){
                    cur_frm.clear_table("employee_cost_details")
                for(var i=0;i<r.message.length;i++){
                    if(r.message[i].name == "IQAMA Transfer"||r.message[i].name == "Labor Documents"||r.message[i].name == "Medical Insurance"||r.message[i].name == "Medical Test"||r.message[i].name == "IQAMA"||r.message[i].name == "Visa"||r.message[i].name == "Exit/Re-Entry Visa"||r.message[i].name == "Agent Documents"||r.message[i].name == "Technical License"||r.message[i].name == "Flight Ticket"||r.message[i].name == "GRO"){
         
                    var child = cur_frm.add_child("employee_cost_details");
                    child.document_name=r.message[i].name;
                
                    }
                    }
                }
            }
			         })
	cur_frm.refresh_field("employee_cost_details")
}

		if(frm.doc.docstatus === 1){    
            frm.page.add_inner_button('Journal Entry', function(){
                var doc = frappe.model.get_new_doc('Journal Entry');
                doc.reference_no = frm.doc.name;
		doc.company=frm.doc.company;
		doc.voucher_type="Journal Entry";
		doc.naming_series='ACC-JV-.YYYY.-';
                frappe.set_route('Form', 'Journal Entry', doc.name);
            },'Create')
            frm.page.add_inner_button('Purchase Invoice', function(){
                var doc = frappe.model.get_new_doc('Purchase Invoice');
                doc.reference_no = frm.doc.name;
		doc.company=frm.doc.company;
		doc.naming_series='ACC-PINV-.YYYY.-';
                frappe.set_route('Form', 'Purchase Invoice', doc.name);
            },'Create')
            frm.page.add_inner_button('Material Request', function(){
                var doc = frappe.model.get_new_doc('Material Request');
                doc.reference_no = frm.doc.name;
		doc.company=frm.doc.company;
		doc.requested_for=frm.doc.employee;
		doc.material_request_type = "Purchase";
		doc.transaction_date = frappe.datetime.get_today();
		doc.naming_series='MAT-MR-.YYYY.-';
                frappe.set_route('Form', 'Material Request', doc.name);
            },'Create')
	}
},
onload: function(frm){

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




