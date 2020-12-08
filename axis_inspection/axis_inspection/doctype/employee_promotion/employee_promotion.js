frappe.ui.form.on('Employee Promotion', {
	employee: function(frm) {
		// your code here
		frappe.db.get_value("Employee",{name:frm.doc.employee},"company",(s)=>{
					frm.set_value('company',s.company);
				  }) 
	}
})
