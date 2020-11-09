from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
import requests
import json

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


@frappe.whitelist()
def get_email_list(doctype,role,parenttype):
        return frappe.db.get_list('Has Role',filters={'role':role,'parenttype':parenttype},fields={'parent'})
