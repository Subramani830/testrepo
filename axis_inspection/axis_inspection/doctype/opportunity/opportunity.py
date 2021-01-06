


# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.utils import flt, nowdate, getdate
from frappe import _
from frappe.model.document import Document
from erpnext.accounts.party import get_party_account_currency
from erpnext.setup.utils import get_exchange_rate
from erpnext.controllers.selling_controller import SellingController



@frappe.whitelist()
def make_request_for_quotation(source_name, target_doc=None):	
	doclist = get_mapped_doc("Opportunity", source_name, {
		"Opportunity": {
			"doctype": "Request for Quotation"
		}
	}, target_doc)

	op_items_list = frappe.db.sql("""
			SELECT
				item.item_code,item.item_name,item.qty,item.uom,item.description
			FROM
				`tabOpportunity Item` as item
			WHERE item.parent=%s
				AND item.out_sourced=1""", (source_name),as_dict=1)
	for val in op_items_list:
		doclist.append('items', {
			'item_code': val.item_code,
			'item_name': val.item_name,
			'description':val.description,
			'qty': val.qty,
			'uom':val.uom,
			'stock_uom':val.uom,
			'conversion_factor':1
		})

	return doclist

@frappe.whitelist()
def make_supplier_quotation(source_name, target_doc=None):
	doclist = get_mapped_doc("Opportunity", source_name, {
		"Opportunity": {
			"doctype": "Supplier Quotation",
			"field_map": {
				"name": "opportunity"
			}
		}
	}, target_doc)

	sq_items_list = frappe.db.sql("""
			SELECT
				item.item_code,item.item_name,item.qty,item.uom,item.description
			FROM
				`tabOpportunity Item` as item
			WHERE item.parent=%s
				AND item.out_sourced=1""", (source_name),as_dict=1)
	for val in sq_items_list:
		doclist.append('items', {
			'item_code': val.item_code,
			'item_name': val.item_name,
			'description':val.description,
			'qty': val.qty,
			'uom':val.uom,
			'stock_uom':val.uom
		})

	return doclist

@frappe.whitelist()
def make_quotation(source_name, target_doc=None):
	
	def set_missing_values(source, target):
		from erpnext.controllers.accounts_controller import get_default_taxes_and_charges
		quotation = frappe.get_doc(target)

		company_currency = frappe.get_cached_value('Company',  quotation.company,  "default_currency")

		if quotation.quotation_to == 'Customer' and quotation.party_name:
			party_account_currency = get_party_account_currency("Customer", quotation.party_name, quotation.company)
		else:
			party_account_currency = company_currency

		quotation.currency = party_account_currency or company_currency

		if company_currency == quotation.currency:
			exchange_rate = 1
		else:
			exchange_rate = get_exchange_rate(quotation.currency, company_currency,
				quotation.transaction_date, args="for_selling")

		quotation.conversion_rate = exchange_rate

		# get default taxes
		taxes = get_default_taxes_and_charges("Sales Taxes and Charges Template", company=quotation.company)
		if taxes.get('taxes'):
			quotation.update(taxes)

		quotation.run_method("set_missing_values")
		quotation.run_method("calculate_taxes_and_totals")
		if not source.with_items:
			quotation.opportunity = source.name

	doclist = get_mapped_doc("Opportunity", source_name, {
		"Opportunity": {
			"doctype": "Quotation",
			"field_map": {
				"opportunity_from": "quotation_to",
				"opportunity_type": "order_type",
				"name": "enq_no",
			}
		}
	}, target_doc,set_missing_values)

	quotation_items_list = frappe.db.sql("""
			SELECT
				*
			FROM
				`tabOpportunity Item` as item
			WHERE item.parent=%s
				AND item.out_sourced=1""", (source_name),as_dict=1)
	for val in quotation_items_list:
		warehouse=frappe.db.get_value('Item Default',{'parent':val.item_code},'default_warehouse')
		valuation_rate=frappe.db.get_value('Bin',{'item_code':val.item_code,'warehouse':warehouse},'valuation_rate')
		doclist.append('items', {
			'item_code': val.item_code,
			'item_name': val.item_name,
			'description':val.description,
			'qty': val.qty,
			'stock_qty':val.qty,
			'uom':val.uom,
			'stock_uom':val.uom,
			'conversion_factor':1,
			'valuation_rate':valuation_rate,
			'gross_profit':-(valuation_rate),
			'warehouse':warehouse,
			'projected_qty':frappe.db.get_value('Bin',{'item_code':val.item_code,'warehouse':warehouse},'projected_qty'),
			'actual_qty':frappe.db.get_value('Bin',{'item_code':val.item_code,'warehouse':warehouse},'actual_qty'),
			'prevdoc_docname': val.parent,
			'prevdoc_doctype':val.parenttype
		})

	return doclist