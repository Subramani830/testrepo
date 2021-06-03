frappe.ui.form.on('Journal Entry', {
	get_employee_costs: function (frm) {
		if (frm.doc.employee != undefined) {
			frappe.call({
				method: "axis_inspection.axis_inspection.doctype.journal_entry.journal_entry.add_accounting_entries",
				async: false,
				args: {
					employee: frm.doc.employee,
					posting_date: frm.doc.posting_date
				},
				callback: function (r) {
					frm.clear_table("accounts");
				$.each(r.message, function (i, d) {
						var c = frm.add_child("accounts");
						//c.party_type = "Employee",
							//c.party = frm.doc.employee,
							c.reference_type = "Employee Costs",
							c.reference_name = d.name,
							c.debit_in_account_currency = d.total_cost
					});
					$.each(r.message, function (i, d) {
						var c = frm.add_child("accounts");
						//c.party_type = "Employee",
							//c.party = frm.doc.employee,
							c.reference_type = "Employee Costs",
							c.reference_name = d.name,
							c.credit_in_account_currency = d.total_cost
					});
					cur_frm.refresh_fields("accounts");
				}
			});
		}
	}
})

frappe.ui.form.on('Journal Entry Account', {
	accounts_add(frm, cdt, cdn) {
		var ctur_grid = frm.get_field('accounts').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if (frm.doc.reference_no != undefined) {
			cur_row.doc.reference_type = "Employee Costs"
			cur_row.doc.reference_name = frm.doc.reference_no
			cur_frm.refresh_fields();
		}
	}
})
