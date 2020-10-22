frappe.ui.form.on("Employee Separation", {
	employee_resignation: function(frm) {

   		 frappe.model.with_doc("Employee Resignation", frm.doc.employee_resignation, function() {
     		  var transfer= frappe.model.get_doc("Employee Resignation", frm.doc.employee_resignation)
         		   frm.doc.employee_separation_template=transfer.employee_separation_template;
         		   cur_frm.refresh_field("employee_separation_template");
          		  frm.doc.department=transfer.department;
           		  cur_frm.refresh_field("department");
          		  frm.doc.designation=transfer.designation;
          		  cur_frm.refresh_field("designation");
            	})       
	 },
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
})

