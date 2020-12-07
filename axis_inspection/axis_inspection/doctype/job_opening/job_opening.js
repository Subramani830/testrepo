frappe.ui.form.on('Job Opening', {
	designation(frm) {
		// your code here
		frm.doc.job_title = frm.doc.designation;
		cur_frm.refresh_field("job_title");
	}
})
