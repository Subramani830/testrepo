from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document

def update_asset_details(doc,method):
    for row in doc.assets:
        if row.task:
            doc1 = frappe.get_doc('Task',row.task)
            doc1.append('allocate', {
                'asset_no':row.asset,
                'asset_name':row.asset_name,
                'reference':doc.name
            })
            doc1.save()

def delete_asset_details(doc,method):
    for item in doc.assets:
        val=frappe.db.get_list('Allocate',filters={'reference':doc.name,'parent':item.task},fields={'name'})
        if val:
            for row in val:
                frappe.get_doc(dict(
                        doctype = 'Allocate',
                        name = row.name,
                        parent = item.task
                        )).delete()
