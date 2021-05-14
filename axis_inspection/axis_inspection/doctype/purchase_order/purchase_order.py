from __future__ import unicode_literals
import frappe, erpnext
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document

@frappe.whitelist()
def set_reason_for_update_items(reason, document):
    purchase_order_doc = frappe.get_doc('Purchase Order', document)
    purchase_order_doc.reason_for_update_items = reason
    purchase_order_doc.submit()