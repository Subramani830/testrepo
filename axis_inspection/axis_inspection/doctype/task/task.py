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
                frappe.throw(_("Number of Assign To,for designation '{0}' should not be greater than {1}.").format(designation,number_of_employee)) 
        else:
            frappe.throw(_("Designation '{0}' is not defined in Resource Planing {1}.").format(designation,parent)) 
        


def count_assign(self):
    count_list = {}
    for row in self.assign_:
        if not row.designation in count_list:
            count_list[row.designation] = 1
        else:
            count_list[row.designation] += 1
    return count_list
