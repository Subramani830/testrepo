from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

@frappe.whitelist()
def get_sender_email(doctype,role,parenttype):
        return frappe.db.get_value('Has Role',{'role':role,'parenttype':parenttype},'parent')
         