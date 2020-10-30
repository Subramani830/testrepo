# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.utils import flt, nowdate, getdate
from frappe import _
from frappe.model.document import Document

from erpnext.controllers.selling_controller import SellingController

form_grid_templates = {
	"items": "templates/form_grid/item_grid.html"
}

class Contract(SellingController):
	pass
