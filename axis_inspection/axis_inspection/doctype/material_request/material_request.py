from __future__ import unicode_literals
from frappe import _
import frappe

@frappe.whitelist()
def get_reports_to(name):
    reports_to=None
    emp_rec=frappe.get_doc('Employee',name)
    if emp_rec:
        if emp_rec.reports_to:
            reports_to=emp_rec.reports_to
    return reports_to