frappe.ui.form.on('Attendance', {
	employee: function(frm) {
		// your code here
		frappe.db.get_value("Employee",frm.doc.employee,"default_shift",(s)=>{
					frm.doc.shift = s.default_shift;
					cur_frm.refresh_field("shift"); 
				  }) 
	}
})