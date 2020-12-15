from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document

def update_asset(doc,method):
    for row in doc.assets:
        if row.task:
            doc1 = frappe.get_doc('Task',row.task)
            doc1.append('allocate', {
                'asset_no':row.asset,
                'asset_name':row.asset_name
            })
            doc1.save()

