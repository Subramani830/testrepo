# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe,erpnext
from frappe.model.document import Document
from frappe.utils import flt,cstr
import json
from frappe import _

def update_stock_ledger_entry(item_details):
    try:
        doc = json.loads(item_details)
    except:
        doc = item_details
    
    create_stock_ledger(doc)
    
def  create_stock_ledger(doc):
    actual_qty=-float(doc['actual_qty'])
    if doc['purpose'] =='Issue':
        balance_qty= get_balance_qty(doc['item_code'],doc['source_warehouse'])
        if balance_qty< doc['actual_qty']:
            frappe.throw(_("Insufficient Stock"))
        
        else:
            qty_after_transaction=balance_qty-doc['actual_qty']

            frappe.get_doc({
                'doctype' : 'Stock Ledger Entry',
                'company': doc['company'],
                'voucher_no': doc['voucher_no'],
                'voucher_type': doc['voucher_type'],
                'item_code':doc['item_code'],
                'warehouse':doc['source_warehouse'],
                'posting_date':doc['posting_date'],
                'actual_qty':actual_qty,
                'qty_after_transaction':qty_after_transaction,
                'valuation_rate':doc['valuation_rate'],
                'stock_value':doc['valuation_rate']*qty_after_transaction,
                'stock_value_difference':-float(doc['valuation_rate']*actual_qty)
            }).insert(ignore_mandatory=True)
            update_bin(doc,doc['source_warehouse'])

    if doc['purpose']=='Transfer':
        actual_qty=-float(doc['actual_qty'])
        balance_qty= get_balance_qty(doc['item_code'],doc['source_warehouse'])
        if balance_qty < doc['actual_qty']:
            frappe.throw(_("Insufficient Stock"))
        else:
            qty_after_transaction=balance_qty-doc['actual_qty']
            stock_value_difference=(doc['valuation_rate']*actual_qty)
            create_stock_ledger_entry(doc,doc['source_warehouse'],actual_qty,qty_after_transaction,stock_value_difference)
            #Update target warehouse 
            balance_qty_target= get_balance_qty(doc['item_code'],doc['target_warehouse'])
            qty_after_transaction_target=balance_qty_target+doc['actual_qty']
            stock_value_difference_target=(doc['valuation_rate']*doc['actual_qty'])
            create_stock_ledger_entry(doc,doc['target_warehouse'],float(doc['actual_qty']),qty_after_transaction_target,stock_value_difference_target)

def create_stock_ledger_entry(doc,warehouse,actual_qty,qty_after_transaction,stock_value_difference_target):
    frappe.get_doc({
            'doctype' : 'Stock Ledger Entry',
            'company': doc['company'],
            'voucher_no': doc['voucher_no'],
            'voucher_type': doc['voucher_type'],
            'item_code':doc['item_code'],
			'warehouse':warehouse,
			'posting_date':doc['posting_date'],
			'actual_qty':actual_qty,
			'qty_after_transaction':qty_after_transaction,
            'valuation_rate':doc['valuation_rate'],
            'stock_value':doc['valuation_rate']*qty_after_transaction,
            'stock_value_difference':stock_value_difference_target
        }).insert(ignore_mandatory=True)
    update_bin(doc,warehouse)

def get_balance_qty(item_code, warehouse):
	balance_qty = frappe.db.sql("""select qty_after_transaction from `tabStock Ledger Entry`
		where item_code=%s and warehouse=%s
		order by posting_date desc, posting_time desc, creation desc
		limit 1""", (item_code, warehouse))

	return flt(balance_qty[0][0]) if balance_qty else 0.0

def update_bin(doc,warehouse):
    val=frappe.get_list('Bin',filters={'item_code':doc['item_code'],'warehouse':warehouse},fields={'actual_qty','stock_value','name'})
    if val:
        for row in val:
            actual_qty=row.actual_qty-doc['actual_qty']
            stock_value=doc['valuation_rate']*actual_qty
            bin_doc=frappe.get_doc("Bin",row.name)
            bin_doc.update({
                "valuation_rate": doc['valuation_rate'],
                "actual_qty": actual_qty,
                "stock_value": stock_value
            })
            bin_doc.save(ignore_permissions=True)
    else:
        bin_doc = frappe.get_doc({
				"doctype": "Bin",
				"item_code": doc['item_code'],
				"warehouse": warehouse,
                "valuation_rate": doc['valuation_rate'],
                "actual_qty": doc['actual_qty'],
                "stock_value": doc['valuation_rate']*doc['actual_qty']
			})
        bin_doc.insert(ignore_permissions=True)