from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _
from datetime import date
from datetime import datetime
import datetime
import json
import pandas as pd
from frappe.utils import flt

class DeliveryNote(Document):
    pass


def validate_minimum_charge(doc,method):
    for row in doc.items:
        parent=frappe.db.get_value('Sales Order',{'name':row.against_sales_order},'contract')
        minimum_charge=frappe.db.get_value('Contract Item',{'parent':parent,'item_code':row.item_code},'minimum_charge')
        if minimum_charge:
            if minimum_charge>row.amount:
                frappe.throw('Item '+row.item_code+' amount is less than minimum charge')
    
    set_billing_hours_and_amount(doc)

def set_billing_hours_and_amount(doc):
    for timesheet in doc.timesheets:
        ts_doc = frappe.get_doc('Timesheet', timesheet.time_sheet)
        if not timesheet.billing_hours and ts_doc.total_billable_hours:
            timesheet.billing_hours = ts_doc.total_billable_hours

        if not timesheet.billing_amount and ts_doc.total_billable_amount:
            timesheet.billing_amount = ts_doc.total_billable_amount

@frappe.whitelist()
def get_timesheets_check(doc,method=None):
    if doc.timesheets:
        for rec in doc.timesheets:
            timesheets = frappe.db.sql("""
            SELECT
                `tabSales Invoice Timesheet`.time_sheet
            FROM
                `tabDelivery Note`, `tabSales Invoice Timesheet`
            WHERE
                `tabDelivery Note`.name = `tabSales Invoice Timesheet`.parent
                AND `tabDelivery Note`.status not in ('Cancelled','Return Issued')
                AND `tabSales Invoice Timesheet`.time_sheet= %(time_sheet)s
            """, {
                'time_sheet': rec.time_sheet
            },as_dict=True)

            if len(timesheets)>1:
                frappe.throw('Timesheet {0} is already used.So please remove it'.format(rec.time_sheet))