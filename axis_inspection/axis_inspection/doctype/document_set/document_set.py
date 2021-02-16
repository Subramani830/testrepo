# -*- coding: utf-8 -*-
# Copyright (c) 2020, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
# import frappe
# from frappe.model.document import Document

# class DocumentSet(Document):
#	pass

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date
from frappe import _
from six import string_types
from frappe.utils import date_diff
from frappe.core.doctype.communication.email import make


class DocumentSet(Document):
	def validate(self):
		document=frappe.db.sql("""
			select name from `tabDocument Set`
			where employee = %s
				and name != %s
		""",(self.employee, self.name))
		if document:
			frappe.throw(_("Document Set is already exists for the employee {0}.").format(self.employee))




def validate_expiry_date():
	docName=frappe.get_all("Document Set")
	for v in docName:
		docList=frappe.db.get_list("Document Set",filters={'name':v.name},fields={'*'})
		for row in docList:
				documentList=frappe.db.get_list("Document Detail",filters={'parenttype':'Document Set','parent':row.name},fields={'*'})
				for val in documentList:
					new_date=str(date.today())
					expire_date=date_diff(val.expiry_date,new_date)
					if expire_date==2:
						user=frappe.db.get_value('Employee',{'name':row.employee},'user_id')
						message="Document Set "+val.document_set_name+" will be expired in 2 days."
						if user:
							make(
									subject = row.name,
									recipients = user,
									communication_medium = "Email",
									content = message,
									send_email = True
							)
			
