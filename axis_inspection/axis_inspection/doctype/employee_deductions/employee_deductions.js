// Copyright (c) 2021, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Deductions', {
refresh: function(frm) {
	if(frm.doc.employee!=undefined){
		frappe.call({
			method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.update_balance',
			async:false,
			args: {
				docList:frm.doc
			},
			callback: function(r) {
				frappe.call({
					"method": "frappe.client.set_value",
					"async":false,
					"args": {
					"doctype":'Employee Deductions',
					"name": frm.doc.name,
					"fieldname": "current_month_balance",
					"value": r.message.current_month_balance
					}
				});
				frappe.call({
					"method": "frappe.client.set_value",
					"async":false,
					"args": {
					"doctype":'Employee Deductions',
					"name": frm.doc.name,
					"fieldname": "total_balance",
					"value": r.message.total_balance
					}
				});
				cur_frm.refresh_fields("total_balance ","current_month_balance")
			}
		})
	}
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
		}
});
frappe.ui.form.on('Deduction Detail', 'retention_amount',function(frm,cdt, cdn){
	var cur_grid =frm.get_field('deduction_detail').grid;
	var cur_doc = locals[cdt][cdn];
	var cur_row = cur_grid.get_row(cur_doc.name);
	if(cur_row.doc.retention_amount<0){
		cur_row.doc.retention_amount='';
		cur_frm.refresh_field('retention_amount');
		frappe.throw(" Retention Amount should be postive");
	}
	else if(cur_row.doc.deduction_type=="Recurring"&&(cur_row.doc.start_date!=undefined)){
		frappe.call({
			method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.updateDeductionCalculation',
			async:false,
			args: {
				start_date: cur_row.doc.start_date,
				end_date:cur_row.doc.end_date,
				amount:cur_row.doc.retention_amount
			},
			callback: function(r) {
				for(var i=0;i<r.message.month_list.length;i++){
					frappe.call({
						method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.get_month',
						async:false,
						args: {
							month:r.message.month_list[i],
							name:frm.doc.name
						},
						callback: function(c) {
							if(c.message["length"]>0){
								frappe.model.set_value("Deduction Calculation",c.message[0].name,"recurring",r.message.deduction_amount+c.message[0].recurring);
								frappe.model.set_value("Deduction Calculation",c.message[0].name,"total",r.message.deduction_amount+c.message[0].total);
								frappe.model.set_value("Deduction Calculation",c.message[0].name,"balance",r.message.deduction_amount+c.message[0].balance);
							}
							else{							
							var child = cur_frm.add_child("deduction_calculation");
							frappe.model.set_value(child.doctype, child.name, "month",r.message.month_list[i]);
							frappe.model.set_value(child.doctype, child.name, "recurring",r.message.deduction_amount);
							frappe.model.set_value(child.doctype, child.name, "total",r.message.deduction_amount);
							frappe.model.set_value(child.doctype, child.name, "balance",r.message.deduction_amount);
							cur_frm.refresh_field("deduction_calculation");
							}
						}
					});
				}
			}
		});
	}
	else if(cur_row.doc.deduction_type=="One Time"&&(cur_row.doc.start_date!=undefined)){
		frappe.call({
			method: 'axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions.updateDeduction',
			async:false,
			args: {
				start_date:cur_row.doc.start_date
			},
			callback: function(r) {
				$.each(frm.doc.deduction_calculation,function(idx,deduction){
					if(deduction.month==r.message){
						deduction.one_time+=cur_row.doc.retention_amount
						deduction.total+=cur_row.doc.retention_amount
						deduction.balance=deduction.total-deduction.actual_paid
					}
				});
					cur_frm.refresh_field('deduction_calculation')
			}
		});

	}
});

frappe.ui.form.on('Deduction Detail', 'start_date',function(frm,cdt, cdn){
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

})

function endOfMonth(start_date){  
	var date=new Date(start_date)
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
	 