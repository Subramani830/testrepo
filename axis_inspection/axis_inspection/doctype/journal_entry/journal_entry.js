frappe.ui.form.on('Journal Entry', {
	refresh(frm) {
		// your code here
	}
})

frappe.ui.form.on('Journal Entry Account', {
	accounts_add(frm,cdt,cdn) {
	    var cur_grid =frm.get_field('accounts').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if (frm.doc.reference_no!=undefined){
    		cur_row.doc.reference_type="Employee Costs"
    		cur_row.doc.reference_name=frm.doc.reference_no
    		cur_frm.refresh_fields();
		}
	}
})
