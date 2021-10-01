from __future__ import unicode_literals
import frappe, erpnext
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
import json

@frappe.whitelist()
def create_payment_entry_record(doc):
    pcr_record = json.loads(doc)
    payment_entry_record = frappe.new_doc('Payment Entry')
    payment_entry_record.payment_type='Internal Transfer'
    payment_entry_record.paid_to=pcr_record['petty_cash_account']
    payment_entry_record.petty_cash_request=pcr_record['name']
    payment_entry_record.insert(ignore_mandatory=True)
    return payment_entry_record.name

def update_petty_cash_request_status(doc,method=None):
    if doc.petty_cash_request:
        frappe.db.set_value('Petty Cash Request',doc.petty_cash_request,{'status':'Paid'})