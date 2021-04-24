// Copyright (c) 2021, veena and contributors
// For license information, please see license.txt

frappe.ui.form.on('Resource Planning Configuration', {
	setup: function(frm) {
		$.each(["item_details"], function(i, table_fieldname) {
			frm.get_field(table_fieldname).grid.editable_fields = [
				{fieldname: 'item_group', columns: 6},
				{fieldname: 'qty', columns: 4}
			];
		});
		$.each(["asset_detail"], function(i, table_fieldname) {
			frm.get_field(table_fieldname).grid.editable_fields = [
				{fieldname: 'asset_category', columns: 6},
				{fieldname: 'qty', columns: 4}
			];
		});
}
});
