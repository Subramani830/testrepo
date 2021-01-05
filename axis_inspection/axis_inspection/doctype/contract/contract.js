frappe.ui.form.on('Contract', {
    refresh:  function(frm) {
        if(frm.doc.docstatus === 1 && frm.doc.party_type=='Customer'){    
		frm.add_custom_button(__('Sales Order'),
		function() {
		frm.trigger("make_sales_order")
		}, __('Create'));

		frm.add_custom_button(__('Quotation'),
		function() {
		frm.trigger("make_quotation")
		}, __('Create'));
		}
		if(frm.doc.party_type=="Customer"){
			frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
				return {
					filters: {
						selling:1
					}
				};
			});
		}
    },
	make_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "axis_inspection.axis_inspection.doctype.contract.contract.make_sales_order",
			frm: frm
		})
	},
	make_quotation: function(frm) {
		frappe.model.open_mapped_doc({
			method: "axis_inspection.axis_inspection.doctype.contract.contract.make_quotation",
			frm: frm
		})
	},
contract_terms_and_conditions:function(frm) {
	
	if(frm.doc.contract_terms_and_conditions=="Employee Contract Agreement"){
			var total=0;
			var basic=0;
			var food=0;
			var transportation=0;
			var project=0;
			var housing=0;
		frappe.db.get_value("Employee",frm.doc.party_name,["employee_name","salutation","nationality","passport_number","place_of_issue","date_of_issue","designation"],(e)=>{
		frappe.db.get_value("Salary Structure Assignment",{"employee_name":e.employee_name},"salary_structure",(s)=>{
		frappe.model.with_doc("Salary Structure", s.salary_structure, function() {
				var tabletransfer= frappe.model.get_doc("Salary Structure", s.salary_structure)
        		$.each(tabletransfer.earnings, function(index, row){
					if(row.salary_component=="Total Salary"){
					total=row.amount 
					if(row.salary_component=="Transportation"){transportation=row.amount}
					if(row.salary_component=="Housing"){housing=row.amount}
					if(row.salary_component=="Project"){project=row.amount}
					if(row.salary_component=="Food"){food=row.amount}
					if(row.salary_component=="Basic"){basic=row.amount}
					}
				})
			var data="This Employment Agreement (hereinafter referred to as the Agreement) is made on "+frm.doc.start_date+" by and between<br><br><h2>AXIS Inspection Ltd.</h2><br>(hereinafter referred to as the Employer)<br><br>having his registered office at Baghlaf Area, Al Taawn Street, Al-Khobar, Saudi Arabia,<br><br>and<br><h2>"+e.salutation+" "+e.employee_name+"</h2><br>of nationality "+e.nationality+"<br><br>bearing Passport Number/ID: "+e.passport_number+" issued at "+e.place_of_issue+" on "+e.date_of_issue+",<br><br>hereinafter referred to as Employee,<br><br>whereas the Employer desires to employ the Employee for his working sites in or out of the Kingdom of Saudi Arabia in accordance with the conditions mentioned hereinafter and whereas the Employee covenants to work faithfully and in compliance with the Employer's instructions at any assigned working site.<br><br>In consideration of the mutual covenants herein contained, both parties have agreed as follows:<br><br><h2><center>Clause 1 - Term of Employment</center></h2><br><b>Clause 1.1 - Contract Duration</b><br><br>The term of this agreement shall be "+frm.doc.duration+" years effective from "+frm.doc.start_date+" as per joining date of the Employee.<br><br><b>Clause 1.2 - Contract Renewal</b><br><br>This contract will be renewed spontaneously every time for similar period after expiration, according to the same conditions, terms and privileges; if none of the parties notifies the other by a given written notice of three months (90 days) prior to the date of current contract's expiration, considering Article (55) of Labor Law.<br><br><h2><center>Clause 2 - Probation Period</center></h2><br><b>Clause 2.1 - Probation Duration</b><br><br>The probation period shall last three months (90 days) starting from the effective date of this agreement.<br><br><b>Clause 2.2 - Termination During Probation</b><br><br>During the probation period, the Employer is entitled to terminate this agreement at any time after having given 7 days of prior notice to the Employee, if the Employee is found to be incompetent, negligent or inefficient in performing his assigned duties or unable to work due to ill health in the opinion of the Employer.<br><br><b>Clause 2.3 - Probation Evaluation</b><br><br>The evaluation of the qualification and decision of termination during the probation period shall be solely at the Employer's discretion and it shall not be subject to any dispute between the Employer and the Employee.<br><br><h2><center>Clause 3 - Work</center></h2><br>The Employee's designation shall be as"+e.designation+".<br><br><h2><center>Clause 4 - Salary and Entitlements</center></h2><br><b>Clause 4.1 - Total Monthly Salary</b><br><br>The Employee shall receive "+total+" SR total monthly salary, as specified in the salary breakup hereinafter.<br><br><b>Clause 4.2 - Basic Salary</b><br><br>The Employee's basic salary shall be "+basic+" SR.<br><br><b>Clause 4.3 - Transportation</b><br><br>The Employee shall receive "+transportation+" SR to offset transportation charges of commuting to and from the place of work, if the Employer does not provide means of transportation.<br><br><b>Clause 4.4 - Housing</b><br><br>The Employee shall receive "+housing+" SR to offset housing costs if the Employer does not provide housing.<br><br><b>Clause 4.5 - Project</b><br><br>The Employee shall receive "+project+" SR project allowance.<br><br><b>Clause 4.6 - Food</b><br><br>The Employee shall receive "+food+" SR food allowance.<br><br><b>Clause 4.7 - Incentives</b><br><br>Merit increase and incentives are subject to internal company policies based on need and the performance of the Employee.<br><br><b>Clause 4.8 - Commissions</b><br><br>[  ] Applicable [  ] Not Applicable<br><h2><center>Clause 5 - Regular Working Hours</center></h2><br><b>Clause 5.1 - Duty Hours</b><br><br>The Employer's regular working hours shall be 8 hours basic per day and 6 days a week.<br><br><b>Clause 5.2 - Considerations</b><br><br>The lunch hour and travel times are not considered part of the regular work hours, nor are they paid for.<br><br><b>Clause 5.3 - Commitments</b><br><br>The Employee commits to work two (2) hours of overtime daily to coup-up with work requirements if work dictates such need.<br><br><b>Clause 5.4 - Schedules</b><br><br>The Employee commits to work on shift schedules as assigned or dictated by work needs.<br><br><h2><center>Clause 6 - Place of Work</center></h2><br>The place of work shall be defined as within the Kingdom of Saudi Arabia. The Employer may order the relocation of the working place to another site at the necessity of the Employer, and the Employee should follow the order of such relocation.<br><br><h2><center>Clause 7 - Insurance</center></h2><br>The Employee will be given medical insurance as per Company policy.<br><br><h2><center>Clause 8 - Weekly Leave</center></h2><br><b>Clause 8.1 - Weekly Days Off</b><br><br>The Employee shall be entitled to have one (1) day of paid leave after six (6) days of consecutive service as a Weekly Leave, however if he fails to work six (6) days of continuous service, the weekly leave shall not be paid.<br><br><b>Clause 8.2 - Compensation for Official Holidays</b><br><br>The Employee shall be entitled to a full payment on official holidays as a working day.<br><br><h2><center>Clause 9 - Regular Home Leave (Vacation)</center></h2><br><b>Clause 9.1 - Vacation</b><br><br>The Employee shall be entitled to 30 days after 12 months of continuous service.<br><br><h2><center>Clause 10 - Obligations of the Employee</center></h2><br>The Employee shall:<br><br><b>Clause 10.1 - Rules and Regulations</b><br><br>strictly observe and obey the rules, regulations and instructions specified by the Employer, or his immediate leader, manager or supervisor.<br><br><b>Clause 10.2 - Health and Safety</b><br><br>keep his health in good condition and perform his work safely and in a professional manner.<br><br><b>Clause 10.3 - Work</b><br><br>complete the tasks agreed, on schedule, and guarantee the quality of the work.<br><br><b>Clause 10.4 - Honor and Dignity</b><br><br>keep his dignity and never commit any act to defame his reputation and honor or that of the Employer and his superiors.<br><br><b>Clause 10.5 - Sole Work</b><br><br>shall not render service elsewhere or hold concurrently any post with others related or unrelated to the work agreed with the Employer without his written consent, or establish his own business solely or in partnership with others.<br><br><b>Clause 10.6 - Compliance</b><br><br>shall faithfully comply with the instructions from the Employer or his superiors and must not refuse to perform his duties without a justifiable and acceptable reason.<br><br><b>Clause 10.7 - Conduct</b><br><br>shall not hold unauthorized meetings not related to the Employer's business within or outside the premises of the workplace and must not commit any collective action, such as an illegal demonstration.<br><br><b>Clause 10.8 - Company Property</b><br><br>shall not take out information or property related to the Employer such as documents, machinery, equipment or any other form of the Employer's property from the workplace without prior written consent of the Employer.<br><br><b>Clause 10.9 - Confidentiality</b><br><br>shall not divulge any kind of confidential information of the Employer to any person, nor use such Employer information for any purpose other than performing his job duties, hereunder during the term of this agreement and thereafter, and keep such Employer's information in confidence as per Labor Law Article (83)<br><br><h2><center>Clause 11 - Notice Period</center></h2><br>Unless otherwise stated in this agreement, 90 Days prior notice is required by either the Employer or the Employee to terminate this contract, in which case, the party initiating the termination shall reimburse the other party in compliance in the following manner:<br><br><b>Clause 11.1 - Termination By The Employer Without Fault</b><br><br>One month's basic salary shall be paid to the Employee in case no advance notice is given to the Employee.<br><br><b>Clause 11.2 - Termination By The Employer Due To The Employee's Fault Or Request</b><br><br>All recruitment fees including government charges along with all off and on the job training costs shall be paid by the Employee to the Employer<br><br><b>Clause 11.3 - Reimburse</b><br><br>In case the Employee is not able to reimburse the Employer, the Employee shall work until all such charges in Clause 11.2 are paid through a direct deduction system from the Employee's salary that does not exceed 50% of his salary.<br><br><b>Clause 11.4 - No Compete</b><br><br>In case the Employee decided to terminate this contract before it ends, he pledges not to work with, establish, or be a partner of any entity locally or internationally that provides services similar to those provided by AXIS Inspection Ltd. for jobs inside the Kingdom of Saudi Arabia for a period not less than the length of this contract.<br><br><h2><center>Clause 12 - Dismissal By The Employer</center></h2><br>The Employer reserves the right to dismiss the Employee and terminate this Agreement without prior notice if applicable as per Labor Law Article (80) and if the Employee violates the Labor Law Article (65). In such cases, the Employee shall not work or engage in any business activity in the Kingdom of Saudi Arabia for no less than five (5) years from the commencement of the date of termination.<br><br><h2><center>Clause 13 - Arbitration and Applicable Law</center></h2><br>This Agreement contains the entire agreement between both parties hereof and supersedes all previous negotiation, commitment and writing with respect to the subject matter.<br><br>All disputes, controversies or differences which may arise between the parties out of, in relation to, or in connection with this Agreement, or for the breach thereof, shall be finally settled by arbitration in the country of the working place.<br><br>Both parties have executed this Agreement on the date indicated below to be effective and intending to be legally binding to and in witness whereof the Employer and the Employee have appended their signatures below.<br><br>This Agreement will automatically expire when the contract ends if not otherwise spontaneously renewed as per Clause 1.1 or mutually renewed.<br><br><h2><center>Signature</center></h2><br><h2>Employer:</h2><br><b>Name: Mr. Motlaq S. Al-Motairy<br><br>Date: "+frm.doc.start_date+"<br><br>Signature:<br><br><h2>Employee:</h2><br><br>Name: "+e.employee_name+"<br><br>Date: "+frm.doc.start_date+"<br><br>Signature:<br><br>By signing this contract, we jointly agree to its terms and conditions, and pledge not to reveal its contents to any person or entity expect for legal purposes.<b>"
		frm.set_value("contract_terms",data)
		})
		})
		})	
	}
	else if(frm.doc.contract_terms_and_conditions==undefined){
		frm.set_value("contract_terms",'')
	}
	else{
	
		frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Terms and Conditions",
				fieldname: "terms",
				filters:{
					title:frm.doc.contract_terms_and_conditions		
				}
			},
			callback(r) {
			    if(r.message) {
				frm.set_value("contract_terms",r.message.terms)
			    }
			}
		});
	}
},
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
					var child = cur_frm.add_child("contract_term");
					frappe.model.set_value(child.doctype, child.name, "contract_term", r.message[i].offer_term);
					frappe.model.set_value(child.doctype, child.name, "value", r.message[i].value);
					cur_frm.refresh_field("contract_term");
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
party_type:function(frm){
	if(frm.doc.party_type=="Employee"){
		var  contract_term=["Contract Type","Contract Duration","Notice Period","Weekend Days","Destination"]
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
		frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
			return {
				filters: {
					hr:1
				}
			};
		});
	}
	else if(frm.doc.party_type=="Customer"){
		frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
			return {
				filters: {
					selling:1
				}
			};
		});
	}
	else if(frm.doc.party_type=="Supplier"){
		frm.set_query("contract_terms_and_conditions", function(frm, cdt, cdn) {
			return {
				filters: {
					buying:1
				}
			};
		});
	}
},
start_date:function(frm){
	if(frm.doc.party_type=="Employee"){
		if(frm.doc.start_date!=undefined && frm.doc.end_date!=undefined){
			var duration=updateDuration(frm.doc.start_date,frm.doc.end_date)	
			if(duration==1 ||duration==2||duration==3||duration==4||duration==5){
				var duration1=duration+" Year"
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
			var duration=updateDuration(frm.doc.start_date,frm.doc.end_date)	
			if(duration==1 ||duration==2||duration==3||duration==4||duration==5){
				var duration1=duration+" Year"
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
}
});
frappe.ui.form.on('Contract Item', 'item_code',function(frm,cdt, cdn)
{
var cur_grid =frm.get_field('items').grid;
var cur_doc = locals[cdt][cdn];
var cur_row = cur_grid.get_row(cur_doc.name);
var transfer
	 	frappe.call({
					method: "frappe.client.get",
					async:false,
					args: {
						doctype: "Item",
						name: cur_row.doc.item_code,
					},
			callback(r) {
				if(r.message) {
					transfer = r.message;
				}
			}
		});
		cur_row.doc.item_name=transfer.item_name
		cur_row.doc.description=transfer.description
		cur_row.doc.qty=1
		frappe.call({
			method: "frappe.client.get_value",
			async:false,
			args: {
				doctype: "Item Price",
				fieldname: "price_list_rate",
				filters:{
					item_code: cur_row.doc.item_code,
			    		price_list: frm.doc.price_list
				}
			},
			callback(r) {
			    if(r.message.price_list_rate) {
					cur_row.doc.rate=r.message.price_list_rate
					cur_row.doc.amount=cur_row.doc.rate*cur_row.doc.qty
				}
				else if(r.message.length==0){
					cur_row.doc.rate=0;
					cur_row.doc.amount=0;
				}
			}
		});
	$.each(transfer.uoms, function(idx, uom){
		if(transfer.stock_uom==uom.uom){
			cur_row.doc.uom=uom.uom
			cur_row.doc.conversion_factor=uom.conversion_factor
		}
	});
cur_frm.refresh_field('items')

});
frappe.ui.form.on('Contract Item', 'qty',function(frm,cdt, cdn)
{
	var cur_grid =frm.get_field('items').grid;
	var cur_doc = locals[cdt][cdn];
	var cur_row = cur_grid.get_row(cur_doc.name);
	cur_row.doc.amount=cur_row.doc.rate*cur_row.doc.qty
	cur_frm.refresh_field('items')
});
frappe.ui.form.on('Contract Item', 'rate',function(frm,cdt, cdn)
{
	var cur_grid =frm.get_field('items').grid;
	var cur_doc = locals[cdt][cdn];
	var cur_row = cur_grid.get_row(cur_doc.name);
	cur_row.doc.amount=cur_row.doc.rate*cur_row.doc.qty
	cur_frm.refresh_field('items')
});
function addDays(start_date, days) {
	var d = new Date(start_date);
	d.setDate(d.getDate() + Number(days));
	return d
	
  }

  function updateDuration(start_date,end_date){
	var date1 = new Date(start_date);
	var date2 = new Date(end_date);
	var Difference_In_Time = date2.getTime() - date1.getTime(); 
	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24); 
	var duration=Difference_In_Days/365

	return duration
	
  }
