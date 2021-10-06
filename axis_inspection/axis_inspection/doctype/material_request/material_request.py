from __future__ import unicode_literals
from frappe import _
import frappe

@frappe.whitelist()
def get_reports_to(name):
    reports_to=None
    Employee_name=None
    email=None
    emp_rec=frappe.get_doc('Employee',name)
    if emp_rec:
        if emp_rec.reports_to:
            reports_to=emp_rec.reports_to
            reports_to_rec=frappe.get_doc('Employee',reports_to)
            Employee_name=reports_to_rec.employee_name
            email=reports_to_rec.prefered_email
    return reports_to,Employee_name,email