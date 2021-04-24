from __future__ import unicode_literals
import frappe, erpnext
from frappe.model.document import Document
from frappe import _

class Task(Document):
    pass

def validate(self,method):
    sales_order=frappe.db.get_value('Project',self.project,'sales_order')
    parent=frappe.db.get_value('Resource Planning',{'sales_order':sales_order},'name')
    designation_list=count_assign(self)
    for designation in designation_list:
        number_of_employee=frappe.db.get_value('Employee Details',{'parent':parent,'parenttype':'Resource Planning','designation':designation},'number_of_employee')
        if number_of_employee:
            if designation_list[designation]>number_of_employee:
                frappe.throw(_("As per Resource Planning {0} for project {1} ,a maximum of {2} employees of Designation {3} can be assigned.").format(parent,self.project,number_of_employee,designation))
        elif parent:
            frappe.throw(_("Designation '{0}' is not defined in Resource Planing {1} .").format(designation,parent)) 
    
def count_assign(self):
    count_list = {}
    designation_list=frappe.db.sql("""select a.designation,count(designation) as count from `tabAssign To` a ,`tabTask` t where a.parent=t.name and t.project=%s group by a.designation""",(self.project), as_dict=True)
    for val in designation_list :
        if val.designation!=None:
            count_list[val.designation] = val.count

    for row in self.assign_:
        if not row.designation in count_list :
            if row.designation!=None:
                count_list[row.designation] = 1
        else:
            count_list[row.designation] += 1
    return count_list

@frappe.whitelist()
def get_item_list(sales_order):
    return frappe.db.get_list("Sales Order Item",filters={"parent":sales_order},fields={"item_code"})
