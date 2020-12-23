frappe.ui.form.on('Employee', {
	department:function(frm,cdt,cdn){
    		frappe.db.get_value("Department",frm.doc.department,"department_manager",(c)=>{
	    		if(c.department_manager!==null){
	        		var department_manager=c.department_manager;
    	   			frappe.db.get_value("Employee",department_manager,"user_id",(r)=>{
        	    		if(r.user_id===null){
        	        		frm.doc.department_manager='';
        	    		}else{
        	        		frm.doc.department_manager=r.user_id;
        	    		}
        	    		cur_frm.refresh_fields("department_manager")
    	   			});
	    		}
    		});
	},
after_save:function(frm,cdt,cdn){
	if(frm.doc.status=="Active"){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.create_warehouse",
			async:false,
			args:{
				doctype:'Warehouse',
				employee_warehouse:frm.doc.name,
				company:frm.doc.company,
				warehouse_name:frm.doc.employee_name
			}
		})	
	}
	else if(frm.doc.status=="Left"){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.delete_warehouse",
			async:false,
			args:{
				doctype:'Warehouse',
				employee_warehouse:frm.doc.name,
				company:frm.doc.company,
				warehouse_name:frm.doc.employee_name
			},
			callback:function(r){
				if(r.message!=undefined){
						frm.set_value('status','Active')
						frappe.throw(('Status cannot be "Left" as Stock is available for '+r.message+'.'))
					
				}			}
		})	
	}
	
},
validate:function(frm){
	var regex = /^[0-9]{10}$/;
	if (regex.test(frm.doc.id_number) != true && frm.doc.id_number!=undefined && frm.doc.id_number!=""){
		frappe.msgprint(__("ID number should be 10 digit."));
		frappe.validated = false;

	}
	if (regex.test(frm.doc.border_number) != true && frm.doc.border_number!=undefined && frm.doc.border_number!=""){
		frappe.msgprint(__("Border number should be 10 digit."));
		frappe.validated = false;

	}
	if (regex.test(frm.doc.visa_number) != true && frm.doc.visa_number!=undefined && frm.doc.visa_number!=""){
		frappe.msgprint(__("Visa number should be 10 digit."));
		frappe.validated = false;

	}
	if(frm.doc.id_expiry_date<=frappe.datetime.get_today()){
		frappe.msgprint(__("Id Expiry date should be greater than todays date."));
		frappe.validated = false;
	}
	if(frm.doc.valid_upto<=frappe.datetime.get_today()){
		frappe.msgprint(__("Valid Upto should be greater than todays date."));
		frappe.validated = false;
	}


},
reports_to:function(frm,cdt,cdn){
    		frappe.db.get_value("Employee",{"name":frm.doc.reports_to},"user_id",(c)=>{
	    		if(c.user_id){
	        			console.log(c.user_id)
				frm.set_value("reports_to_id",c.user_id)
	    		}
    		});
	}
});
