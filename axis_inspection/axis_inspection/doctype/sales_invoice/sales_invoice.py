# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import date
from frappe import _
from six import string_types
from frappe.utils import date_diff
from frappe.core.doctype.communication.email import make
from erpnext.controllers.selling_controller import SellingController


class SalesInvoice(SellingController):
	pass

def validate_due_date():
	docName=frappe.get_all("Sales Invoice")
	for s in docName:
		docList=frappe.db.get_list("Sales Invoice",filters={'name':s.name,'docStatus':1},fields={'*'})
		for row in docList:
			documentList=frappe.db.get_list("Payment Schedule",filters={'parenttype':'Sales Invoice','parent':row.name},fields={'*'})
			for val in documentList:
				if val.due_date>(date.today()):
					q1=frappe.db.sql("""
					select u.email
					from tabUser u,`tabHas Role` r where 
					u.name = r.parent and r.role = 'Sales Manager'
					and u.enabled = 1
					""")
					if q1:
						for q in q1:
							for user in q:
								message="Payment to be done for Sales Invoice "+row.name
								make(
												subject = row.name,
												recipients = user,
												communication_medium = "Email",
												content = message,
												send_email = True
								)

@frappe.whitelist()
def submit_SI_record(docname,doctype,ses_no):
	frappe.db.set_value('Sales Invoice',docname,{'ses_number':ses_no})