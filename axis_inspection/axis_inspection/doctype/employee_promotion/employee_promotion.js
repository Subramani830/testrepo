frappe.ui.form.on('Employee Promotion', {
	employee: function(frm) {
		// your code here
		frappe.db.get_value("Employee",frm.doc.employee,"company",(s)=>{
					frm.doc.company = s.company;
					cur_frm.refresh_field("company"); 
				  }) 
	}
})
