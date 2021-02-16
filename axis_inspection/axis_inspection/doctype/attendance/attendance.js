frappe.ui.form.on('Attendance', {
	employee: function(frm) {
		// your code here
		frappe.db.get_value("Employee",frm.doc.employee,"default_shift",(s)=>{
					frm.set_value("shift",s.default_shift);
					cur_frm.refresh_field("shift"); 
				  }) 
	},
	shift:function(frm){
		if (frm.doc.shift != null || frm.doc.shift != undefined){
			frappe.db.get_value("Shift Type",frm.doc.shift,["start_time","end_time"],(t)=>{
				var in_times = parseFloat(t.start_time);
				var out_times = parseFloat(t.end_time);
				var total = parseFloat(out_times - in_times)
				frm.set_value("shift_time", total);
				cur_frm.refresh_field("shift_time"); 
			  })
		}
	}
})
