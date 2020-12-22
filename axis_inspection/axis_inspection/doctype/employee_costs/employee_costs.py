# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc

class IncompleteTaskError(frappe.ValidationError): pass

class EmployeeCosts(Document):
	def validate(self):
		self.validate_duplicate_employee_costs()

	def validate_duplicate_employee_costs(self):
		emp_costs = frappe.db.exists("Employee Costs",{"employee": self.employee})
		if emp_costs and emp_costs != self.name:
			frappe.throw(_("Employee Costs: {0} is already for Employee: {1}").format(frappe.bold(emp_costs), frappe.bold(self.employee)))
