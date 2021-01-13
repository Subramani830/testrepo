# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
from frappe.utils.jinja import validate_template

class ContractTermsTemplate(Document):
	pass

@frappe.whitelist()
def get_contract_terms(template_name,doc):
	doc = json.loads(doc)

	contract_terms = frappe.get_doc("Contract Terms Template", template_name)
	return frappe.render_template(contract_terms.content, doc) 


