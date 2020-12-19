frappe.ui.form.on('Leave Encashment', {
	refresh(frm) {
		// your code here
	},
	employee:function(frm,cdt,cdn){
	if(frm.doc.employee!==undefined){
		frappe.call({
			method:"axis_inspection.axis_inspection.api.get_reports_to",
			async:false,
					args: {
						doctype: 'Employee',
						name: frm.doc.employee
					},
				callback: function(r){
					frm.set_value('department_manager',r.message)
				}
			});
	}
    }
})
