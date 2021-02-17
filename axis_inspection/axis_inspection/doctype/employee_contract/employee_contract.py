# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json

class EmployeeContract(Document):
	#def validate(self):
	pass


@frappe.whitelist()
def get_contract_term(contract_term,doc):
	contract_list=json.loads(doc)
	for row in contract_list:
		if contract_term==row['contract_term']:
			return row['name']
