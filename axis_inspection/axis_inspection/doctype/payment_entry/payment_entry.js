frappe.ui.form.on('Payment Entry', {
	refresh: function (frm) {
		if(frm.doc.references.length<3){
			$.each(frm.doc.references, function (idx, item) {
				if (item.reference_doctype == "Purchase Invoice") {
					frappe.call({
						method: "axis_inspection.axis_inspection.api.update_project",
						async: false,
						args: {
							doctype: 'Purchase Invoice Item',
							name: item.reference_name,
							parenttype: 'Purchase Invoice'
						},
						callback: function (r) {
							var project;
							var task;
							var branch;
							var cost_center;
							for (var i = 0; i < r.message.length; i++) {
								if (r.message[i].project) { project = r.message[i].project }
								if (r.message[i].task) { task = r.message[i].task }
								if (r.message[i].cost_center) { cost_center = r.message[i].cost_center }
								if (r.message[i].branch) { branch = r.message[i].branch }
	
	
								//frappe.model.set_value(item.doctype, item.name, "project_name", r.message[i].project);
								//frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
								//frappe.model.set_value(item.doctype, item.name, "cost_center"r.message[i].task);
								//frappe.model.set_value(item.doctype, item.name, "branch", r.message[i].branch);
							}
							if (frm.doc.cost_center) { }
							else {
								frm.set_value("cost_center", cost_center)
							}
							if (frm.doc.project) { }
							else { frm.set_value("project", project) }
							if (frm.doc.branch) { }
							else { frm.set_value("branch", branch) }
							if (frm.doc.task) { }
							else { frm.set_value("task", task) }
						}
					});
					if (frm.doc.division == undefined) {
						frappe.db.get_value("Purchase Invoice", { "name": item.reference_name }, "division", (d) => {
							if(frm.doc.division!=d.division){
								frm.set_value("division", d.division)
							}
						})
					}
				}
				else if (item.reference_doctype == "Purchase Order") {
					frappe.call({
						method: "axis_inspection.axis_inspection.api.update_project",
						async: false,
						args: {
							doctype: 'Purchase Order Item',
							name: item.reference_name,
							parenttype: 'Purchase Order'
						},
						callback: function (r) {
							var project;
							var task;
							var branch;
							var cost_center;
							for (var i = 0; i < r.message.length; i++) {
								if (r.message[i].project) { project = r.message[i].project }
								if (r.message[i].task) { task = r.message[i].task }
								if (r.message[i].cost_center) { cost_center = r.message[i].cost_center }
								if (r.message[i].branch) { branch = r.message[i].branch }
	
	
								//frappe.model.set_value(item.doctype, item.name, "project_name", r.message[i].project);
								//frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
								//frappe.model.set_value(item.doctype, item.name, "cost_center"r.message[i].task);
								//frappe.model.set_value(item.doctype, item.name, "branch", r.message[i].branch);
							}
							if (frm.doc.cost_center) { }
							else {
								frm.set_value("cost_center", cost_center)
							}
							if (frm.doc.project) { }
							else { frm.set_value("project", project) }
							if (frm.doc.branch) { }
							else { frm.set_value("branch", branch) }
							if (frm.doc.task) { }
							else { frm.set_value("task", task) }
						}
					});
				}
				else if (item.reference_doctype == "Sales Invoice") {
					frappe.call({
						method: "axis_inspection.axis_inspection.api.update_project1",
						async: false,
						args: {
							doctype: 'Sales Invoice',
							name: item.reference_name
						},
						callback: function (r) {
							var project;
							var task;
							var branch;
							var cost_center;
							var contract
							for (var i = 0; i < r.message.length; i++) {
								if (r.message[i].project) { project = r.message[i].project }
								if (r.message[i].cost_center) { cost_center = r.message[i].cost_center }
								if (r.message[i].branch) { branch = r.message[i].branch }
								if (r.message[i].contract) { contract = r.message[i].contract }
							}
							if (frm.doc.cost_center) { }
							else {
								frm.set_value("cost_center", cost_center)
							}
							if (frm.doc.project) { }
							else { frm.set_value("project", project) }
							if (frm.doc.branch) { }
							else { frm.set_value("branch", branch) }
							if (frm.doc.contract) { }
							else { frm.set_value("contract", contract) }
						}
					});
				}
				else if (item.reference_doctype == "Sales Order") {
					frappe.call({
						method: "axis_inspection.axis_inspection.api.update_project2",
						async: false,
						args: {
							doctype: 'Sales Order Item',
							name: item.reference_name,
							parenttype: 'Sales Order'
						},
						callback: function (r) {
							var project;
							var task;
							var branch;
							var cost_center;
							for (var i = 0; i < r.message.length; i++) {
								if (r.message[i].project) { project = r.message[i].project }
								if (r.message[i].task) { task = r.message[i].task }
								if (r.message[i].cost_center) { cost_center = r.message[i].cost_center }
								if (r.message[i].branch) { branch = r.message[i].branch }
							}
							if (frm.doc.cost_center) { }
							else {
								frm.set_value("cost_center", cost_center)
							}
							if (frm.doc.project) { }
							else { frm.set_value("project", project) }
							if (frm.doc.branch) { }
							else { frm.set_value("branch", branch) }
						}
					});
				}
				var bank_account = get_bank_account(item.reference_doctype, item.reference_name)
				//frappe.db.get_value(item.reference_doctype, { 'name': item.reference_name }, "bank_account", (r) => {
				if (item.reference_doctype == "Purchase Invoice") {
					if(frm.doc.bank_account!=bank_account){
						frm.set_value("bank_account", bank_account)
					}
				}
				else if (item.reference_doctype == "Sales Invoice") {
					if(frm.doc.bank_account!=bank_account){
						frm.set_value("bank_account", bank_account)
					}
				}
				// });
			});
		}
	},
	before_save: function (frm) {
		var bank_account;
		$.each(frm.doc.references, function (idx, item) {
			if (item.reference_name != undefined) {
				frappe.db.get_value("Sales Order", { "name": item.reference_name }, "delivery_date", (r) => {
					if (r.delivery_date <= frappe.datetime.nowdate()) {
						frappe.validated = false;
						frappe.msgprint(__("Sales Order " + item.reference_name + " has been expired."));
					}
				});
				if (item.reference_doctype == "Sales Invoice" || item.reference_doctype == "Purchase Invoice") {
					if (bank_account == undefined) {
						bank_account = get_bank_account(item.reference_doctype, item.reference_name)
						frm.set_value("bank_account", bank_account)
					}
					else {
						var account,is_opening = get_bank_account(item.reference_doctype, item.reference_name)
						if (bank_account != account && is_opening=='No') {
							frappe.throw(item.reference_doctype + ' ' + item.reference_name + ' should be allow for bank_Account  "' + account + '".');
						}
					}
				}
			}

		});
	},
	employee_costs: function (frm) {
		if (frm.doc.employee_costs != undefined && frm.doc.party == undefined) {
			frappe.db.get_value("Employee Costs", { "name": frm.doc.employee_costs }, "employee", (e) => {
				frm.set_value("party_type", "Employee")
				frm.set_value("party", e.employee)
				cur_frm.refresh_field("party");
				frm.set_value("payment_type", "Pay")
			});
		}
	},
	on_submit: function (frm) {
		if (frm.doc.employee_costs != undefined && frm.doc.employee_costs != null) {
			frappe.call({
				"method": "frappe.client.set_value",
				"args": {
					"doctype": "Employee Costs",
					"name": frm.doc.employee_costs,
					"fieldname": {
						"status": "Paid"
					},
				}
			})
		}
	}
});

frappe.ui.form.on('Payment Entry Reference', {
	references_add(frm, cdt, cdn) {
		var cur_grid = frm.get_field('references').grid;
		var cur_doc = locals[cdt][cdn];
		var cur_row = cur_grid.get_row(cur_doc.name);
		if (frm.doc.employee_costs != undefined) {
			cur_row.doc.employee_costs = frm.doc.employee_costs
			cur_frm.refresh_fields();
		}
	}
})

function get_bank_account(doctype, name) {
	var account;
	var is_opening;
	frappe.call({
		method: 'frappe.client.get_value',
		"async": false,
		args: {
			'doctype': doctype,
			'filters': {
				'name': name
			},
			'fieldname': [
				"bank_account","is_opening"
			]
		},
		callback: function (r) {
			account = r.message.bank_account
			is_opening = r.message.is_opening
		}
	});
	return account,is_opening
}