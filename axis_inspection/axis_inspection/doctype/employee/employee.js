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
	}
});
