# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.utils import flt, nowdate, getdate
from frappe import _
from frappe.model.document import Document
from frappe.model.naming import make_autoname

from erpnext.controllers.selling_controller import SellingController

form_grid_templates = {
	"items": "templates/form_grid/item_grid.html"
}

class Contract(SellingController):
	pass

@frappe.whitelist()
def autoname(doc, method):
	doc.name = make_autoname(str(doc.naming_series))


@frappe.whitelist()
def make_quotation(source_name, target_doc=None):
	def update_item(obj, target, source_parent):
		target.conversion_factor = 1.0

	doclist = get_mapped_doc("Contract", source_name, {
		"Contract": {
			"doctype": "Quotation",
			"field_map": {
				"name": "contract"
			}
		},
		"Contract Item": {
			"doctype": "Quotation Item",
			"field_map": [
				["name", "contract_item"],
				["parent", "contract"],
				["uom", "stock_uom"]
			],
			"postprocess": update_item
		}
	}, target_doc)

	return doclist


@frappe.whitelist()
def make_sales_order(source_name, target_doc=None):
	def update_item(obj, target, source_parent):
		target.conversion_factor = 1.0

	doclist = get_mapped_doc("Contract", source_name, {
		"Contract": {
			"doctype": "Sales Order",
			"field_map": {
				"name": "contract"
			}
		},
		"Contract Item": {
			"doctype": "Sales Order Item",
			"field_map": [
				["name", "contract_item"],
				["parent", "contract"],
				["uom", "stock_uom"]
			],
			"postprocess": update_item
		}
	}, target_doc)

	return doclist

