// Copyright (c) 2021, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('End of Service Calculator', {
	setup: function(frm) {
		$.each(["earnings", "deductions"], function(i, table_fieldname) {
			frm.get_field(table_fieldname).grid.editable_fields = [
				{fieldname: 'salary_component', columns: 6},
				{fieldname: 'amount', columns: 4}
			];
		});
},
employee:function(frm){
  if(frm.doc.employee!=undefined){
	frappe.call({
		                    method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_salary_slip",
                    async:false,
                    args:{
                        employee:frm.doc.employee
                    },
                    callback:function(r){ //console.log(r.message);
			//for(var i=0;i<r.message.length;i++){	
			cur_frm.clear_table("earnings");
			cur_frm.clear_table("deductions");
			if(r.message.length!=0){//console.log(r.message[0].name);
				frappe.call({
						    method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.update_earnings_and_deductions",
					async:false,
					    args:{
					        parent:r.message[0].name,
						parenttype:'Salary Slip'
					    },
					    callback:function(r){
						for(var i=0;i<r.message.length;i++){
							//console.log(r.message[i]);
							if(r.message[i].parentfield=="earnings"){
							var child = cur_frm.add_child("earnings");
                    					child.salary_component=r.message[i].salary_component;
							child.amount=r.message[i].amount;
							}else if(r.message[i].parentfield=="deductions"){
							var child = cur_frm.add_child("deductions");
                    					child.salary_component=r.message[i].salary_component;
							child.amount=r.message[i].amount;
							}
					    } cur_frm.refresh_field("earnings");
						cur_frm.refresh_field("deductions");
					    }
						
				});
		}
                    //}
		}
	});
            }
},
type_of_contract(frm){
	var earn=0;
	var deduct=0;
	var salary;
	$.each(frm.doc.earnings,function(idx,amt){
		if(amt.amount!= undefined){
			earn=earn+amt.amount;
		}
	});
	$.each(frm.doc.deductions,function(idx,amt){
		if(amt.amount!= undefined){
			deduct=deduct+amt.amount;
		}
	});
	salary=earn-deduct;
	frm.set_value("salary",salary);


},
	equals:function(frm){
	    var reason1="Termination of the contract by the employer for one of the terms and conditions stated in Article (80).";
	    var reason2="The worker leaves work without submitting his/her resignation, other than the conditions stated in Article (81).";
	    var reason3="The resignation of a worker.";
  	    if(frm.doc.type_of_contract!=""&&(frm.doc.end_of_service_reason==reason1 ||frm.doc.end_of_service_reason==reason2 || frm.doc.end_of_service_reason==reason3)){
    	        frm.set_value("amount",0);
    	    }else{
    	        if(frm.doc.type_of_contract!=""){
        	       // frm.set_value("amount",100);
			if(frm.doc.salary!=undefined && frm.doc.duration_of_service!=undefined && frm.doc.number_of_months==undefined && frm.doc.number_of_days==undefined){
			        if(frm.doc.duration_of_service<=5){
			            //var amt=frm.doc.salary*frm.doc.duration_of_service*0.5;
			           // frm.set_value("amount",amt);
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_small",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
			        }else{
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_large",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
				}
			}else if(frm.doc.salary!=undefined && frm.doc.duration_of_service!=undefined && frm.doc.number_of_months!=undefined && frm.doc.number_of_days==undefined){
			        if(frm.doc.duration_of_service<=5){
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_month_small",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service,
					month:frm.doc.number_of_months
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
			        }else{
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_month_large",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service,
					month:frm.doc.number_of_months
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
				}
			}else if(frm.doc.salary!=undefined && frm.doc.duration_of_service!=undefined && frm.doc.number_of_months!=undefined && frm.doc.number_of_days!=undefined){
			        if(frm.doc.duration_of_service<=5){
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_month_days_small",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service,
					month:frm.doc.number_of_months,
					days:frm.doc.number_of_days
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
			        }else{
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_month_days_large",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service,
					month:frm.doc.number_of_months,
					days:frm.doc.number_of_days
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
				}

			}else if(frm.doc.salary!=undefined && frm.doc.duration_of_service!=undefined && frm.doc.number_of_months==undefined && frm.doc.number_of_days!=undefined){
			        if(frm.doc.duration_of_service<=5){
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_days_small",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service,
					days:frm.doc.number_of_days
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
			        }else{
					frappe.call({
							method:"axis_inspection.axis_inspection.doctype.end_of_service_calculator.end_of_service_calculator.get_amt_salary_year_days_large",
							args:{
					salary:frm.doc.salary,
					year:frm.doc.duration_of_service,
					days:frm.doc.number_of_days
					},
							async:false,
							callback: function(r){
								frm.set_value("amount",r.message);
						       }
					})
				}

			}
    	        }
    	    }  
	}
});
