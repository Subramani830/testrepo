from __future__ import unicode_literals
import frappe, erpnext
from frappe.model.document import Document
from frappe import _

class StockEntry(Document):
    pass

def validate(self,method):
    if self.stock_entry_type=="Material Issue":
        sales_order=frappe.db.get_value('Project',self.project,'sales_order')
        parent=frappe.db.get_value('Resource Planning',{'sales_order':sales_order},'name')
        item_group_list=count_qty(self)
        for item_group in item_group_list:
            qty=frappe.db.get_value('Item Details',{'parent':parent,'parenttype':'Resource Planning','item_group':item_group},'qty')
            if qty:
                if item_group_list[item_group]>qty:
                    frappe.throw(_("Item Group '{0}' quantity should not be greater than {1}.").format(item_group,qty)) 
            else:
                frappe.throw(_("Item Group '{0}' is not defined in Resource Planing {1}.").format(item_group,parent)) 
            


def count_qty(self):
    count_list = {}
    for row in self.items:
        if not row.item_group in count_list:
            count_list[row.item_group] = row.qty
        else:
            count_list[row.item_roup] += row.qty
    return count_list

