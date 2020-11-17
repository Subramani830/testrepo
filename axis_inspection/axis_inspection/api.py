from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
import requests
import json
from bs4 import BeautifulSoup
import datetime
from datetime import date

@frappe.whitelist()
def get_sender_email(doctype,role,parenttype):
        return frappe.db.get_value('Has Role',{'role':role,'parenttype':parenttype},'parent')

@frappe.whitelist()
def get_department_manager(doctype,name):
        department=frappe.db.get_value(doctype,{'name':name},'Department')
        if department:
                employee_id= frappe.db.get_value('Department',{'name':department},'department_manager')
                if employee_id:
                     return frappe.db.get_value(doctype,{'name':employee_id},'user_id')


@frappe.whitelist()
def get_email_list(doctype,role,parenttype):
        return frappe.db.get_list('Has Role',filters={'role':role,'parenttype':parenttype},fields={'parent'})



def get_applicant_list():
	previous_date = datetime.datetime.today() - datetime.timedelta(days=1)
	for item in frappe.db.get_list("Communication", filters={"sent_or_received": "Received","subject":"New Job Application","communication_date":["between",[previous_date,datetime.datetime.now()]]}, fields = {"content","communication_date"}):
		soup = BeautifulSoup(item.content)
		values=soup.get_text('\n')
		z = values.split("\n")
		aname=z[1]
		phone=z[3]
		mail=z[5]
		apply_for=z[7]
		curr_position=z[9]
		curr_company=z[11]
		exp=z[13]

		docVal=frappe.db.get_list("Job Applicant", filters={"applicant_name":aname,"email_id":mail,"job_title":apply_for})
		if not docVal:
			frappe.get_doc(dict(doctype = 'Job Applicant',
	   		applicant_name = aname,
		    	email_id = mail,
	    		phone_number=phone,
			job_title=apply_for,
			current_position=curr_position,
			current_company=curr_company,
			experience=exp)).insert()
			frappe.db.commit()

