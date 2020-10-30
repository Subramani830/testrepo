from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

@frappe.whitelist()
def get_sender_email(doctype,role,parenttype):
        return frappe.db.get_value('Has Role',{'role':role,'parenttype':parenttype},'parent')

@frappe.whitelist()
def get_department_manager(doctype,name):
        department=frappe.db.get_value(doctype,{'name':name},'Department')
        if department:
                employee_id= frappe.db.get_value('Department',{'name':department},'department_manager')
                if employee_id:
                     return frappe.db.get_value(doctype,{'name':employee_id},'user_id')
