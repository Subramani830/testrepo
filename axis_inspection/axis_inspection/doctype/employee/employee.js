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
	
}
});
