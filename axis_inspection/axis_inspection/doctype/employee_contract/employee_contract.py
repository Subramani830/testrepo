# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

#example of the cherry pick

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
from frappe import _

class EmployeeContract(Document):
	def validate(self):
		validate_contract_term(self)
		for row in self.contract_term:
			if row.contract_term=="Overtime":
				if row.value=="Not Applicable" or row.value=="Applicable":
					pass
				#	value=frappe.db.get_value('Employee',{'name':self.party_name},'overtime')
				#	if row.value!=value:
				#		frappe.throw(_("For the employee {0} overtime value should be {1} only.").format(self.party_name,value))

				elif row.value!="Not Applicable" or row.value!="Applicable":
					frappe.throw(_('Overtime value should be either "Not Applicable" or "Applicable"'))
					
	def on_cancel(self):
		self.remove_employee_contract()
		
	def on_trash(self):
		self.remove_employee_contract()
		
	def remove_employee_contract(self):
		if self.party_type=="Employee":
			frappe.db.set_value('Employee', self.party_name,{ 'contract_no': None, 'contract':None,'contract_end_date':None,'contract_date_end':None})


@frappe.whitelist()
def get_contract_term(contract_term,doc):
	contract_list=json.loads(doc)
	for row in contract_list:
		if contract_term==row['contract_term']:
			return row['name']

def validate_contract_term(self):
	contract_term_list=["Nationality","Nationality (Arabic)","Passport/ID Place of Issue","Passport/ID Place of Issue (Arabic)","Profession","Profession (Arabic)","Branch","Branch (Arabic)","Contract Duration","Overtime","Working Hours","Basic Salary","Housing Allowance","Food Allowance","Transportation Allowance","Other Allowance","Total","Airport Destination","Airport Destination (Arabic)"]	
	for term in self.contract_term:
		if (term.contract_term not in contract_term_list): 
			frappe.throw(_('You cannot enter new contract term'))

@frappe.whitelist()
def create_salary_structure(doc,method):
	contract_terms=frappe.db.get_list("Contract Term Detail",filters={'parent':doc.name,'parenttype':'Employee Contract'},fields={'*'})
	employee_name=frappe.db.get_value("Employee",{'name':doc.party_name},'employee_name')
	pi_doc=frappe.get_doc(dict(doctype = 'Salary Structure',
		name=employee_name,
		employee=doc.name,
		contract_date_start=doc.start_date,
		company=doc.company
	)).insert(ignore_mandatory=True)
	for term in contract_terms:
		salary_component_type=frappe.db.get_value("Salary Component",{'name':term.contract_term},'type')
		if salary_component_type:
			if salary_component_type=="Earning":
				pi_doc.append('earnings',{
					'salary_component':term.contract_term,
					'amount':term.value
				})
			else:
				pi_doc.append('deductions',{
					'salary_component':term.contract_term,
					'amount':term.value
				})
	pi_doc.save()
