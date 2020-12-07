from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
import requests
import json
from bs4 import BeautifulSoup
import datetime
from datetime import date
from axis_inspection.axis_inspection.doctype.job_applicant.job_applicant import send_mail_employee,send_mail_hr,sendmail_jobtitle_correction

@frappe.whitelist()
def get_sender_email(doctype,role,parenttype):
        return frappe.db.get_value('Has Role',{'role':role,'parenttype':parenttype},'parent')

@frappe.whitelist()
def get_reports_to(doctype,name):
        reports_to=frappe.db.get_value(doctype,{'name':name},'reports_to')
        if reports_to:
            return frappe.db.get_value(doctype,{'name':reports_to},'user_id')


@frappe.whitelist()
def get_email_list(doctype,role,parenttype):
        return frappe.db.get_list('Has Role',filters={'role':role,'parenttype':parenttype},fields={'parent'})


@frappe.whitelist()
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

		openings=frappe.db.get_list("Job Opening", filters={"name":apply_for},fields={"name"})
		if openings:
			docVal=frappe.db.get_list("Job Applicant", filters={"applicant_name":aname,"email_id":mail,"job_title":apply_for})
			if not docVal:
				for val in frappe.db.get_list("Job Applicant", filters={"applicant_name":aname,"email_id":mail},fields= {"job_title","applicant_name","email_id"}):
					send_mail_employee(val.applicant_name,val.email_id,val.job_title,apply_for)
					send_mail_hr(val.applicant_name,val.job_title,apply_for)

				frappe.get_doc(dict(doctype = 'Job Applicant',
		   		applicant_name = aname,
			    	email_id = mail,
		    		phone_number=phone,
				job_title=apply_for,
				current_position=curr_position,
				current_company=curr_company,
				experiences=exp)).insert()
				frappe.db.commit()
		else:
			sendmail_jobtitle_correction(aname,mail,apply_for)


@frappe.whitelist()
def create_warehouse(doctype,employee_warehouse,company,warehouse_name):
        val=frappe.db.get_list(doctype,filters={'employee_warehouse':employee_warehouse},fields={'warehouse_name','name'})
        if not val:
                frappe.get_doc(dict(doctype=doctype,
                        company=company,
                        employee_warehouse=employee_warehouse,
                        warehouse_name=warehouse_name)).insert()
        else:
                if val!=warehouse_name:
                        for row in val:
                                doc= frappe.get_doc('Warehouse',row.name)
                                doc.warehouse_name=warehouse_name
                                doc.save()

@frappe.whitelist()
def get_designation(doctype,name):
	job_title=frappe.db.get_value(doctype,{'name':name},'job_title')
	if job_title:
		return frappe.db.get_value("Job Opening",{'name':job_title},'designation')


