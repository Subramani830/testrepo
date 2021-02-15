// Copyright (c) 2021, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Employee Contract', {
	document_name:function(frm,cdt,cdn){
		if(frm.doc.document_type==="Job Offer" && frm.doc.document_name!=undefined){
			frappe.call({
				method:"axis_inspection.axis_inspection.api.get_job_offer_terms",
				async:false,
				args:{
					doctype:'Job Offer Term',
					parent:frm.doc.document_name,
					parenttype:'Job Offer'
				},
				callback:function(r){
					for(var i=0;i<r.message.length;i++){
						frappe.call({
							method: 'axis_inspection.axis_inspection.doctype.employee_contract.employee_contract.get_contract_term',
							async:false,
							args: {
								contract_term:r.message[i].offer_term,
								doc:frm.doc.contract_term
							},
						callback: function(c) {
							console.log(c)
							if(Object.keys(c).length === 0){
								var child = cur_frm.add_child("contract_term");
								frappe.model.set_value(child.doctype, child.name, "contract_term", r.message[i].offer_term);
								frappe.model.set_value(child.doctype, child.name, "value", r.message[i].value);
								cur_frm.refresh_field("contract_term");
								}
							else{ 
									//if(term.contract_term===c.message[0].contract_term){
									   frappe.model.set_value('Contract Term Detail', c.message, "value", r.message[i].value);
									   cur_frm.refresh_field("value");
									//}
							}
						}
					});
				}
				}
			});
			}
	},
	party_name:function(frm,cdt,cdn){
		if(frm.doc.party_type==="Employee"){
			if(frm.doc.party_name!=undefined){
				frappe.db.get_value("Employee",frm.doc.party_name,["leave_policy","holiday_list","default_shift"],(v)=>{
					frm.set_value("leave_policy", v.leave_policy);
					frm.set_value("holiday_list", v.holiday_list);
					frm.set_value("shift_type", v.default_shift);
				  })
				var  contract_term=["Nationality","Nationality (Arabic)","Passport/ID Place of Issue","Passport/ID Place of Issue (Arabic)","Designation","Designation (Arabic)","Branch","Branch (Arabic)","Contract Type","Contract Duration","Contract Duration (Arabic)","Basic Salary","Housing","Food","Transportation","Other Allowance","Total Salary","Overtime","Family Status","Airport Destination","Airport Destination (Arabic)","Notice Period","Weekend Days","Roles and Responsibilities"]					
				frappe.call({
						method: "frappe.client.get_list",
						async:false,
						args: {
							doctype: "Contract Term",
							fields: ["name"],
							filters:{
								name:["in",contract_term]
							},
						},
						callback: function(r) {
							if(r.message.length>0){
								cur_frm.clear_table("contract_term")
								for(var i=0;i<r.message.length;i++){
									var child = cur_frm.add_child("contract_term");
									  child.contract_term=r.message[i].name;
								}
							}
						}
					})
					cur_frm.refresh_field("contract_term")	
				}		  
			}

	},
	after_save:function(frm){
		if(frm.doc.party_type=="Employee"){
			frappe.call({
				method:"axis_inspection.axis_inspection.api.update_enployee",
				async:false,
				args:{
					name:frm.doc.party_name,
					contract_no:frm.doc.name,
					contract_start_date:frm.doc.start_date,
					contract_end_date:frm.doc.end_date,
					contract_date_end:frm.doc.duration
				},
				callback:function(r){
					frappe.db.get_value("Employee",frm.doc.party_name,"probation_duration",(c)=>{
						if(c.probation_duration!==null){
						var	end_date=addDays(frm.doc.start_date, c.probation_duration) 
						var dateFormated = end_date.toISOString().substr(0,10);
							frappe.call({
								"method": "frappe.client.set_value",
								"async":false,
								"args": {
								"doctype": "Employee",
								"name": frm.doc.party_name,
								"fieldname":"final_confirmation_date",
								"value":dateFormated
								}
							});
						}
						});
				}
			});
		}
	},
	start_date:function(frm){
		if(frm.doc.party_type=="Employee"){
			if(frm.doc.start_date!=undefined && frm.doc.end_date!=undefined){
				var duration=getDateDifference(new Date(frm.doc.start_date),new Date(frm.doc.end_date))
				if(duration["years"]>0&&duration["months"]==0&&duration["days"]==0){
					var duration1=duration["years"]+" Year"
					frm.set_value("duration",duration1);
				}
				else{
						frm.doc.duration='';
						cur_frm.refresh_field('duration');
						frappe.throw(('Duration will be in years only'))
				}	
			}
			else{
				frappe.throw(('Please enter start date and end date'))
			}
		}
	},
	end_date:function(frm){
		if(frm.doc.party_type=="Employee"){
			if(frm.doc.start_date!=undefined && frm.doc.end_date!=undefined){
				var duration=getDateDifference(new Date(frm.doc.start_date),new Date(frm.doc.end_date))
				if(duration["years"]>0&&duration["months"]==0&&duration["days"]==0){
					var duration1=duration["years"]+" Year"
					frm.set_value("duration",duration1);
				}
				else{
						frm.doc.duration='';
						cur_frm.refresh_field('duration');
						frappe.throw(('Duration will be in years only'))
				}		
			}
			else{
				frappe.throw(('Please enter start date and end date'))
			}
		}
	},
	duration:function(frm){
		if(frm.doc.duration!=undefined){
			$.each(frm.doc.contract_term,function(idx,term){
				if(term.contract_term=="Contract Duration"){
					frappe.model.set_value(term.doctype, term.name, "value",frm.doc.duration);
				}
			});
		}
	},
on_submit:function(frm){
	if(frm.doc.party_type=="Employee"){
		var email;
		var employee;
		var attachment=[];
		frappe.call({
				method:"axis_inspection.axis_inspection.api.get_file_name",
				args:{
					doctype:'File',
					file_url:frm.doc.attach_job_offer,
					attached_to_field:"attach_job_offer",
					attached_to_doctype:" Employee Contract"
				},
				async:false,
				callback: function(r){
					if(r.message) {
						if(!attachment.includes(r.message)){
							attachment.push(r.message);
						}
					}
				}
			});
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_email",
			args:{
				doctype:'Employee',
				name:frm.doc.party_name
			},
			async:false,
			callback: function(r){
				for(var i=0;i<r.message.length;i++){
				email=r.message[i].user_id;
				employee=r.message[i].employee_name;

				}
			}
		});
		if(email!==undefined){
			var emailTemplate=
			'<h3>Dear ' +employee+',</h3>'+
			'<br>'+
			'<h3>Heartly Congratulations!</h3>'+
			'<br>'+
			'<h3> We are happy to welcome you as a employee  for '+frm.doc.company+' Offer letter  and contract is attached with this. </h3>'+
			'<br>'+
			'<br>'+
			'<h3>Regards</h3>'+
			'<h3>HR Team</h3>';
			sendEmail(frm.doc.name,email,emailTemplate,attachment)
		}
}
	
}
});

function addDays(start_date, days) {
	var d = new Date(start_date);
	d.setDate(d.getDate() + Number(days));
	return d
	
  }

  function sendEmail(name,email,template,attachment='[]'){
		frappe.call({
						method: "frappe.core.doctype.communication.email.make",
						args: {
							subject: name,
							communication_medium: "Email",
							recipients: email,
							content: template,
							communication_type: "Communication",
							send_email:1,
							attachments:attachment,
							print_format:"Axis Contract Print Format",
							doctype: " Employee Contract",
							name: name,
							print_letterhead: 0
						},
						callback: function(rh){
							console.log("sent");
						}   
					});
}

function getDateDifference(startDate,endDate) {
	if (startDate > endDate) {
	  console.error('Start date must be before end date');
	  return null;
	}
	var startYear = startDate.getFullYear();
	var startMonth = startDate.getMonth();
	var startDay = startDate.getDate();
  
	var endYear = endDate.getFullYear();
	var endMonth = endDate.getMonth();
	var endDay = endDate.getDate();
  
	var february = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
	var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
	var startDateNotPassedInEndYear = (endMonth < startMonth) || endMonth == startMonth && endDay < startDay;
	var years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);
  
	var months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;
  
	var days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;
	return {
	  years: years,
	  months: months,
	  days: days
	};
  }
