from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
from frappe import _

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

def validate(self,method):
     if self.purpose=="Issue":
        sales_order=frappe.db.get_value('Project',self.project,'sales_order')
        parent=frappe.db.get_value('Resource Planning',{'sales_order':sales_order},'name')
        asset_category_list=count_qty(self)
        for asset_category in asset_category_list:
            qty=frappe.db.get_value('Asset Detail',{'parent':parent,'parenttype':'Resource Planning','asset_category':asset_category},'qty')
            if qty:
                if asset_category_list[asset_category]>qty:
                    frappe.throw(_("As per Resource Planning {0} for Project {1}, a maximum of {2} {3} can be issued.").format(parent,self.project,qty,asset_category)) 
            else:
                frappe.throw(_("Asset Category '{0}' is not defined in Resource Planing {1}.").format(asset_category,parent)) 
            


def count_qty(self):
    count_list = {}
    asset_category_list=frappe.db.sql("""select a.asset_category,count(asset_category) as count from `tabAsset Movement Item` a ,`tabAsset Movement` t where t.name=a.parent and t.project=%s group by a.asset_category""",(self.project), as_dict=True)
    for val in asset_category_list:
        count_list[val.asset_category] = val.count
    for row in self.assets:
        category=frappe.db.get_value('Asset',row.asset,'asset_category')
        if not category in count_list:
            count_list[category] = 1
        else:
            count_list[category] += 1
    return count_list
