# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe,erpnext
from frappe.model.document import Document
from frappe.utils import flt,cstr
from axis_inspection.axis_inspection.utils.stock_ledger_entry_util import update_stock_ledger_entry

class StockMovement(Document):
	#pass


	def on_submit(self):
		for item in self.items:
			item_details={
				'company':self.company,
				'voucher_no':self.name,
				'voucher_type':self.doctype,
				'item_code':item.item,
				'source_warehouse':item.source_warehouse,
				'target_warehouse':item.target_warehouse,
				'posting_date':self.transaction_date,
				'actual_qty':item.qty,
				'purpose':self.purpose,
				'valuation_rate':item.valuation_rate
			}
			update_stock_ledger_entry(item_details)