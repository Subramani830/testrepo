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

@frappe.whitelist()
def get_employee_list(doctype, txt, searchfield, start, page_len, filters):
	user_id=filters['user_id']
	return frappe.db.sql(""" select name from `tabEmployee` where user_id=%s""",(user_id))

@frappe.whitelist()
def update_status(doc,status):
        quotation_doc=frappe.get_doc("Quotation",doc) 
        quotation_doc.db_set('workflow_state',status)

@frappe.whitelist()
def get_user_list(doctype, txt, searchfield, start, page_len, filters):
        return frappe.db.sql("""
                select u.name, concat(u.first_name, ' ', u.last_name)
                from tabUser u, `tabHas Role` r
                where u.name = r.parent and (r.role = 'Sales User' or r.role = 'Sales Manager')
                and u.enabled = 1 and u.name like %s
        """, ("%" + txt + "%"))

@frappe.whitelist()
def get_employee_filter(sales_order):
	employee=[]
	item=frappe.db.get_list("Sales Order Item",filters={"parent":sales_order},fields={"item_code"})
	for row in item:
		v=frappe.db.get_list('Employee Skill',filters={"parent":row.item_code,"parenttype":"Item"},fields={"skill"})
		for val in v:
			emp=frappe.db.get_list('Employee Skill',filters={"skill":val.skill,"parenttype":"Employee Skill Map"},fields={"parent"})
			for e in emp:
				if e.parent not in employee:
						employee.append(e.parent)     
			
	return employee

@frappe.whitelist()
def get_project_list(employee):
	project=[]
	skills=frappe.db.get_list('Employee Skill',filters={"parent":employee,"parenttype":"Employee Skill Map"},fields={"skill"})
	for skill in skills:
		items=frappe.db.get_list('Employee Skill',filters={"skill":skill.skill,"parenttype":"Item"},fields={"parent"})
		for item in items:
			so=frappe.db.get_list("Sales Order Item",filters={"parenttype":"Sales Order","item_code":item.parent,"docstatus":1},fields={"parent"})
			for s in so:
				pro=frappe.db.get_list("Sales Order",filters={"name":s.parent},fields={"project"})
				for e in pro:
					if e.project not in project:
						project.append(e.project)     
			
	return project