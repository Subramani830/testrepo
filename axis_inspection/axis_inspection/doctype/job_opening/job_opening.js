frappe.ui.form.on('Job Opening', {
	designation(frm) {
		// your code here
		frm.set_value('job_title',frm.doc.designation);
	}
})
