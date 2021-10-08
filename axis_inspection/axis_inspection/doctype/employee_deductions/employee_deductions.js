// Copyright (c) 2021, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Deductions', {
	refresh: function(frm) {
		frm.fields_dict['deduction_detail'].grid.get_field('salary_component_name').get_query = function(doc, cdt, cdn) {
			return {    
				filters: {
					type: 'Deduction'
				}
			}
		}
		frm.add_custom_button(__('Refersh Deduction Calculation'), function(){
			update_deduction_table(frm)
		})	
	},
	validate:function(frm){
		update_deduction_table(frm)
	}
});
frappe.ui.form.on('Deduction Detail', {
	end_date:function(frm,cdt,cdn){
		$.each(frm.doc.deduction_detail,function(idx,deduction){
				if(deduction.end_date<deduction.start_date){
					deduction.end_date='';
					cur_frm.refresh_field('end_date');
					frappe.throw("End date cannot be before Start date.");
				}
				else if(deduction.start_date==undefined){
					deduction.end_date='';
					cur_frm.refresh_field('end_date');
					frappe.throw("Please specify: Start Date First.");
				}
			});
		},
	start_date:function(frm,cdt,cdn){
		var cur_grid =frm.get_field('deduction_detail').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if(cur_row.doc.deduction_type=="One Time"){
			var date=endOfMonth(cur_row.doc.start_date)
			var mm=date.getMonth() + 1
			var end_date=date.getFullYear()+'-'+mm+'-'+date.getDate();
			cur_row.doc.end_date=end_date
			cur_frm.refresh_field('deduction_detail')
		}
	}
});

function endOfMonth(start_date){  
	var date=new Date(start_date)
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
	 
function update_deduction_table(frm){
	if(frm.doc.deduction_detail){
		cur_frm.clear_table("deduction_calculation")
		cur_frm.refresh_field("deduction_calculation")
		$.each(frm.doc.deduction_detail,function(idx,deduction){
			if(deduction.deduction_type=='One Time'){
				frappe.call({
					method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.convertDateFormat',
					async:false,
					args: {
						start_date:deduction.start_date
					},
					callback: function(r) {	
						var month=r.message
						frappe.call({
							method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.fetch_salary_slip_amount',
							async:false,
							args: {
								start_date:deduction.start_date,
								end_date:deduction.end_date,
								employee:frm.doc.employee
							},
							callback: function(r) {	
								var already_exists=false
								var paid_amount=r.message
								for(var l=0;l<frm.doc.deduction_calculation.length;l++){
									if(frm.doc.deduction_calculation[l].month==month){
										already_exists=true
										var existing_onetime_amount=0
										if(frm.doc.deduction_calculation[l].one_time){
											existing_onetime_amount=frm.doc.deduction_calculation[l].one_time
										}
										frappe.model.set_value(frm.doc.deduction_calculation[l].doctype, frm.doc.deduction_calculation[l].name, "one_time",existing_onetime_amount+deduction.retention_amount);
										cur_frm.refresh_field("deduction_calculation");
										already_exists=true
									}
								}
								if(already_exists==false){
									var child = cur_frm.add_child("deduction_calculation");
									frappe.model.set_value(child.doctype, child.name, "month",month);
									frappe.model.set_value(child.doctype, child.name, "one_time",deduction.retention_amount);
									frappe.model.set_value(child.doctype, child.name, "actual_paid",paid_amount);
									cur_frm.refresh_field("deduction_calculation");
								}
							}
						})			
					}
				})
			}
			else if(deduction.deduction_type=="Recurring"){
				var rentation_amount_per_month;
				frappe.call({
					method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.updateDeductionCalculation',
					async:false,
					args: {
						start_date:deduction.start_date,
						end_date:deduction.end_date,
						amount:deduction.retention_amount,
						employee:frm.doc.employee
					},
					callback: function(r) {
						rentation_amount_per_month=r.message.deduction_amount
						for(var i=0;i<r.message.month_list.length;i++){
							for(var j=0;j<r.message.paid_amount.length;j++){
								if(i==j){
									var existing_flag=false
									for(var k=0;k<frm.doc.deduction_calculation.length;k++){
										if(frm.doc.deduction_calculation[k].month==r.message.month_list[i]){
											var existing_recurring_amount=0
											if(frm.doc.deduction_calculation[k].recurring){
												existing_recurring_amount=frm.doc.deduction_calculation[k].recurring
											}
											frappe.model.set_value(frm.doc.deduction_calculation[k].doctype, frm.doc.deduction_calculation[k].name, "recurring",existing_recurring_amount+rentation_amount_per_month);
											cur_frm.refresh_field("deduction_calculation");
											existing_flag=true
										}
									}
									if(existing_flag==false){
										var child = cur_frm.add_child("deduction_calculation");
										frappe.model.set_value(child.doctype, child.name, "month",r.message.month_list[i]);
										frappe.model.set_value(child.doctype, child.name, "actual_paid",r.message.paid_amount[j]);
										frappe.model.set_value(child.doctype, child.name, "recurring",rentation_amount_per_month);
										cur_frm.refresh_field("deduction_calculation");
									}
								}	
							}
						}
					}
				})
			}
		})
	}
	if(frm.doc.deduction_calculation){
		for(var m=0;m<frm.doc.deduction_calculation.length;m++){
			frm.doc.deduction_calculation[m].total=frm.doc.deduction_calculation[m].recurring+frm.doc.deduction_calculation[m].one_time
			if(m!=0){
				var previous_month_paid_amount=0
				if(frm.doc.deduction_calculation[m-1].actual_paid){
					previous_month_paid_amount=frm.doc.deduction_calculation[m-1].actual_paid
				}
				frm.doc.deduction_calculation[m].previous_month_balance=frm.doc.deduction_calculation[m-1].total-previous_month_paid_amount
			}
			frm.doc.deduction_calculation[m].total=frm.doc.deduction_calculation[m].recurring+frm.doc.deduction_calculation[m].one_time+frm.doc.deduction_calculation[m].previous_month_balance
		}
	}
}