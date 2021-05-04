# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
import json
import frappe.utils
from frappe import _
from frappe.model.utils import get_fetch_values
from frappe.model.mapper import get_mapped_doc
from erpnext.controllers.selling_controller import SellingController
from datetime import date
from datetime import timedelta
import datetime


class SalesOrder(SellingController):
    pass

def validate(self,document):
    validate_po_no_duplicate(self)

def validate_po_no_duplicate(self):
    if self.po_no:
       duplicate = frappe.db.sql("""select po_no from `tabSales Order` where po_no = %s and docstatus != 2 and name!=%s """, (self.po_no,self.name))
       if duplicate:
           frappe.throw(_("Customer's Purchase order No {0} already used").format(self.po_no, duplicate[0][0]))

@frappe.whitelist()
def get_delivery_date_list():
    for n in frappe.db.get_list('Sales Order', filters={'delivery_date': [">=", datetime.date.today()], 'docstatus': 1}, fields={'name', 'transaction_date', 'delivery_date'}):
        total = n.delivery_date - n.transaction_date
        a = total.days
        remaining = n.delivery_date - datetime.date.today()
        b = remaining.days
        c = (b/a)*100
        pi_doc = frappe.get_doc("Sales Order", n.name)
        pi_doc.db_set('date_percentage', c)


@frappe.whitelist()
def set_reason_for_extension(reason, document, date):
    sales_order_doc = frappe.get_doc('Sales Order', document)
    sales_order_doc.reason_for_extension = reason
    sales_order_doc.delivery_date = date
    for item in sales_order_doc.items:
        item.delivery_date=date
    sales_order_doc.submit()

