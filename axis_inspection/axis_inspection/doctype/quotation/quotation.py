from __future__ import unicode_literals
from frappe import _
import frappe
from frappe.model.document import Document

@frappe.whitelist()
def get_user_role():
	q1=frappe.db.sql("""
		select count(r.parent)
		from tabUser u,`tabHas Role` r where 
		u.name=%s and
		u.name = r.parent and r.role = 'Sales Manager'
		and u.enabled = 1
	""",(frappe.session.user))
	
	for q in q1:
		return q[0]
		
		
			
	
