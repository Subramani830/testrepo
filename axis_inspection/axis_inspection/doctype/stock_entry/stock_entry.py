from __future__ import unicode_literals
import frappe, erpnext
from frappe.model.document import Document
from frappe import _

class StockEntry(Document):
    pass

def validate(self,method):
    parent=get_data(self)
    if self.stock_entry_type=="Material Issue":
        item_group_list=count_qty(self)
        for item_group in item_group_list:
            qty=frappe.db.get_value('Item Details',{'parent':parent,'parenttype':'Resource Planning','item_group':item_group},'qty')
            if qty:
                if item_group_list[item_group]>qty:
                    frappe.throw(_("As per Resource Planning {0} for Project {1}, a maximum of {2} {3} can be issued.").format(parent,self.project,qty,item_group))           
            else:
                frappe.throw(_("Item Group '{0}' is not defined in Resource Planing {1}.").format(item_group,parent)) 

    elif self.stock_entry_type=="Material Receipt":
        item_group_list=count_qty(self)
        for item_group in item_group_list:
            qty=frappe.db.get_value('Item Details',{'parent':parent,'parenttype':'Resource Planning','item_group':item_group},'actual_issued_quantity')
            if qty:
                if item_group_list[item_group]>qty:
                    frappe.throw(_("As per Resource Planning {0} for Project {1}, a maximum of {2} {3} can be Recieved.").format(parent,self.project,qty,item_group))
                    
            else:
                frappe.throw(_("Item Group '{0}' is not defined in Resource Planing {1}.").format(item_group,parent)) 



def on_submit(self,method):
    parent=get_data(self)
    item_group_list=count_qty_od_current_document(self)
    for item_group in item_group_list:
        val=frappe.db.get_list('Item Details',filters={'parent':parent,'parenttype':'Resource Planning','item_group':item_group},fields=['name','actual_issued_quantity'])
        if val:
            for row in val:
                doc=frappe.get_doc('Item Details',row.name)
                if self.stock_entry_type=="Material Issue":
                    quantity=row.actual_issued_quantity+item_group_list[item_group]
                    doc.db_set('actual_issued_quantity',quantity)

                elif self.stock_entry_type=="Material Receipt":
                    quantity=row.actual_issued_quantity-item_group_list[item_group]
                    doc.db_set('actual_issued_quantity',quantity)  
                        
    
def on_cancel(self,method):
    parent=get_data(self)
    item_group_list=count_qty_od_current_document(self)
    for item_group in item_group_list:
        val=frappe.db.get_list('Item Details',filters={'parent':parent,'parenttype':'Resource Planning','item_group':item_group},fields=['name','actual_issued_quantity'])
        if val:
            for row in val:
                doc=frappe.get_doc('Item Details',row.name)
                if self.stock_entry_type=="Material Issue":
                    quantity=row.actual_issued_quantity-item_group_list[item_group]
                    doc.db_set('actual_issued_quantity',quantity)

                elif self.stock_entry_type=="Material Receipt":
                    quantity=row.actual_issued_quantity+item_group_list[item_group]
                    doc.db_set('actual_issued_quantity',quantity)  


@frappe.whitelist()
def get_data(self):
    sales_order=frappe.db.get_value('Project',self.project,'sales_order')
    parent=frappe.db.get_value('Resource Planning',{'sales_order':sales_order},'name')
    return parent
    
def count_qty(self):
    count_list = {}
    item_list=frappe.db.sql("""select a.item_group,count(item_group) as count from `tabStock Entry Detail` a ,`tabStock Entry` t where t.name=a.parent and t.project=%s and t.docstatus=1 and t.stock_entry_type=%s group by a.item_group""",(self.project,self.stock_entry_type), as_dict=True)
    for val in item_list:
	    count_list[val.item_group] = val.count

    for row in self.items:
        if not row.item_group in count_list:
            count_list[row.item_group] = row.qty
        else:
            count_list[row.item_group] += row.qty
    return count_list


def count_qty_od_current_document(self):
    count_list={}
    for row in self.items:
        if not row.item_group in count_list:
            count_list[row.item_group] = row.qty
        else:
            count_list[row.item_group] += row.qty
    return count_list

