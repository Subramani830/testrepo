# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
from frappe import _

class EmployeeContract(Document):
	def validate(self):
		for row in self.contract_term:
			if row.contract_term=="Overtime":
				if row.value=="Not Applicable" or row.value=="Applicable":
					value=frappe.db.get_value('Employee',{'name':self.party_name},'overtime')
					if row.value!=value:
						frappe.throw(_("For the employee {0} overtime value should be {1} only.").format(self.party_name,value))

				elif row.value!="Not Applicable" or row.value!="Applicable":
					frappe.throw(_('Overtime value should be either "Not Applicable" or "Applicable"'))


@frappe.whitelist()
def get_contract_term(contract_term,doc):
	contract_list=json.loads(doc)
	for row in contract_list:
		if contract_term==row['contract_term']:
			return row['name']
