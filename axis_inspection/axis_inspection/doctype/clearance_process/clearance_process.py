# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ClearanceProcess(Document):
	def validate(self):
		self.pending_penalties=frappe.db.get_value('Employee Deductions',{'employee':self.employee},'total_balance')

