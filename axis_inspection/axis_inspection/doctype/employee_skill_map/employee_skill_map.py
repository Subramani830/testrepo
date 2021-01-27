from __future__ import unicode_literals
from frappe import _
import frappe
from frappe.model.document import Document
from datetime import date
from frappe import _
from six import string_types
from frappe.utils import date_diff
from frappe.core.doctype.communication.email import make

class EmployeeSkillMap(Document):
	pass

def validate_expiry_date():
	docName=frappe.get_all("Employee Skill Map")
	for v in docName:
		docList=frappe.db.get_list("Employee Skill Map",filters={'name':v.name},fields={'*'})
		for row in docList:
				documentList=frappe.db.get_list("Employee Skill",filters={'parenttype':'Employee Skill Map','parent':row.name},fields={'*'})
				for val in documentList:
					new_date=str(date.today())
					expire_date=date_diff(val.expiration_date,new_date)
					if expire_date==2:
						userList=[]
						message="Employee Skill '"+val.skill+"' will be expired in 2 days."
						user=frappe.db.get_value('Employee',{'name':row.employee},'user_id')
						userList.append(user)
						manager=get_department_manager('Employee',row.employee)
						if manager not in userList:
							userList.append(manager)
						q1=frappe.db.sql("""
							select u.email
							from tabUser u,`tabHas Role` r where 
							u.name = r.parent and r.role = 'HR User'
							and u.enabled = 1
							""")
						if q1:
							for q in q1:
								for user in q:
									if user not in userList:
										userList.append(user)
						for user in userList:
							make(
									subject = row.name,
									recipients = user,
									communication_medium = "Email",
									content = message,
									send_email = True
							)
			
def get_department_manager(doctype,name):
        department=frappe.db.get_value(doctype,{'name':name},'Department')
        if department:
                employee_id= frappe.db.get_value('Department',{'name':department},'department_manager')
                if employee_id:
                     return frappe.db.get_value(doctype,{'name':employee_id},'user_id')