from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
from frappe import _
import math
from axis_inspection.axis_inspection.doctype.stock_entry.stock_entry import get_data

def validate(self,method):
    validate_asset_category(self)

def on_submit(self,method):
    #update asset details in task
    update_asset_details(self)
    update_project(self)

def on_cancel(self,method):   
    #delete asset from task
    delete_asset_details(self)
    update_project(self)

def validate_asset_category(self):
    parent=get_data(self)
    if self.purpose=="Issue":
        asset_category_list=count_qty(self)
        for asset_category in asset_category_list:
            qty=frappe.db.get_value('Asset Detail',{'parent':parent,'parenttype':'Resource Planning','asset_category':asset_category},'qty')
            if qty:
                if asset_category_list[asset_category]>qty:
                    frappe.throw(_("As per Resource Planning {0} for Project {1}, a maximum of {2} {3} can be issued.").format(parent,self.project,qty,asset_category)) 
            elif parent:
                frappe.throw(_("Asset Category '{0}' is not defined in Resource Planing {1}.").format(asset_category,parent)) 
    
    elif self.purpose=="Receipt":
        asset_category_list=count_qty(self)
        for asset_category in asset_category_list:
            qty=frappe.db.get_value('Asset Detail',{'parent':parent,'parenttype':'Resource Planning','asset_category':asset_category},'actual_issued_quantity')
            if qty:
                if asset_category_list[asset_category]>qty:
                    frappe.throw(_("As per Resource Planning {0} for Project {1}, a maximum of {2} {3} can be Recieved.").format(parent,self.project,qty,asset_category     ))
                    
            elif parent:
                frappe.throw(_("Asset Category '{0}' is not defined in Resource Planing {1}.").format(asset_category,parent)) 


def update_asset_details(self):
    parent=get_data(self)
    asset_category_list=count_qty_od_current_document(self)
    for asset_category in asset_category_list:
        val=frappe.db.get_list('Asset Detail',filters={'parent':parent,'parenttype':'Resource Planning','asset_category':asset_category},fields=['name','actual_issued_quantity'])
        if val:
            for row in val:
                doc=frappe.get_doc('Asset Detail',row.name)
                if self.purpose=="Issue":
                    quantity=row.actual_issued_quantity+asset_category_list[asset_category]
                    doc.db_set('actual_issued_quantity',quantity) 

                elif self.purpose=="Receipt":
                    quantity=row.actual_issued_quantity-asset_category_list[asset_category]
                    doc.db_set('actual_issued_quantity',quantity)
    
    for row in self.assets:
        if row.task:
            doc1 = frappe.get_doc('Task',row.task)
            doc1.append('allocate', {
                'asset_no':row.asset,
                'asset_name':row.asset_name,
                'reference':self.name
            })
            doc1.save()

def delete_asset_details(self):
    parent=get_data(self)
    asset_category_list=count_qty_od_current_document(self)
    for asset_category in asset_category_list:
        val=frappe.db.get_list('Asset Detail',filters={'parent':parent,'parenttype':'Resource Planning','asset_category':asset_category},fields=['name','actual_issued_quantity'])
        if val:
            for row in val:
                doc=frappe.get_doc('Asset Detail',row.name)
                if self.purpose=="Issue":
                    quantity=row.actual_issued_quantity-asset_category_list[asset_category]
                    doc.db_set('actual_issued_quantity',quantity) 

                elif self.purpose=="Receipt":
                    quantity=row.actual_issued_quantity+asset_category_list[asset_category]
                    doc.db_set('actual_issued_quantity',quantity)

    for item in self.assets:
        val=frappe.db.get_list('Allocate',filters={'reference':self.name,'parent':item.task},fields={'name'})
        if val:
            for row in val:
                frappe.get_doc(dict(
                        doctype = 'Allocate',
                        name = row.name,
                        parent = item.task
                        )).delete()

def count_qty(self):
    count_list = {}
    asset_category_list=frappe.db.sql("""select a.asset_category,count(asset_category) as count from `tabAsset Movement Item` a ,`tabAsset Movement` t where t.name=a.parent and t.project=%s  and t.docstatus=1 and t.purpose=%s group by a.asset_category""",(self.project,self.purpose), as_dict=True)
    for val in asset_category_list:
        count_list[val.asset_category] = val.count
    for row in self.assets:
        if not row.asset_category in count_list:
            count_list[row.asset_category] = 1
        else:
            count_list[row.asset_category] += 1
    return count_list

def count_qty_od_current_document(self):
    count_list={}
    for row in self.assets:
        if not row.asset_category in count_list:
            count_list[row.asset_category] = 1
        else:
            count_list[row.asset_category] += 1
    return count_list

def update_project(self):
    current_project = ''
    cond = "1=1"

    for d in self.assets:
        args = {
            'company': self.company,
            'name':self.name
        }

        # latest entry corresponds to current document's location, employee when transaction date > previous dates
        # In case of cancellation it corresponds to previous latest document's location, employee
        latest_movement_entry = frappe.db.sql(
            """
            SELECT  asm.project
            FROM `tabAsset Movement` asm
            WHERE 
                asm.name=%(name)s and
                asm.company=%(company)s and 
                asm.docstatus=1 and {0}
            ORDER BY
                asm.transaction_date desc limit 1
            """.format(cond), args)
            
        if latest_movement_entry:
            current_project = latest_movement_entry

        frappe.db.set_value('Asset', d.asset, 'project', current_project)