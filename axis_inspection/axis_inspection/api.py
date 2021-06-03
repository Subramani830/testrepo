from __future__ import unicode_literals
import frappe, erpnext
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
import requests
import json
from bs4 import BeautifulSoup
from datetime import date
from datetime import datetime, timedelta
import math
from axis_inspection.axis_inspection.doctype.job_applicant.job_applicant import send_mail_employee,send_mail_hr,sendmail_jobtitle_correction
from axis_inspection.axis_inspection.doctype.employee_deductions.employee_deductions import  convertDateFormat
from frappe.utils import flt,rounded, date_diff, money_in_words
from frappe.core.doctype.communication.email import make

@frappe.whitelist()
def get_sender_email(doctype,role,parenttype):
        return frappe.db.get_value('Has Role',{'role':role,'parenttype':parenttype},'parent')

@frappe.whitelist()
def get_reports_to(doctype,name):
        department=frappe.db.get_value(doctype,{'name':name},'Department')
        if department:
                employee_id= frappe.db.get_value('Department',{'name':department},'department_manager')
                if employee_id:
                     return frappe.db.get_value(doctype,{'name':employee_id},'user_id')

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
	previous_date = datetime.today() - timedelta(days=1)
	for item in frappe.db.get_list("Communication", filters={"sent_or_received": "Received","subject":"New Job Application","communication_date":["between",[previous_date,datetime.now()]]}, fields = {"content","communication_date"}):
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
		skill=frappe.db.get_list('Employee Skill',filters={"parent":row.item_code,"parenttype":"Item"},fields={"skill"})
		for val in skill:
			emp=frappe.db.get_list('Employee Skill',filters={"skill":val.skill,"parenttype":"Employee Skill Map"},fields={"parent"})
			for e in emp:
				if e.parent not in employee:
						employee.append(e.parent)     
			
	return employee

@frappe.whitelist()
def get_skill_filter(sales_order):
	skill_list=[]
	item=frappe.db.get_list("Sales Order Item",filters={"parent":sales_order},fields={"item_code"})
	for row in item:
		skill=frappe.db.get_list('Employee Skill',filters={"parent":row.item_code,"parenttype":"Item"},fields={"skill"})
		for val in skill:
			if val.skill not in skill_list:
				skill_list.append(val.skill)     
			
	return skill_list

@frappe.whitelist()
def get_project(employee):
	project=[]
	val=frappe.db.get_list("Assign To",filters={'assign_to':employee,'parenttype':'Task'},fields=["parent"])
	for row in val:
		project_name=frappe.db.get_value("Task",{'name':row.parent},'project')
		if project_name not in project:
			project.append(project_name)
	return project

@frappe.whitelist()
def get_item_list(project):
	item=[]
	name=frappe.db.get_value('Project',{'name':project},'sales_order')
	if name:
		itemList=frappe.db.get_list("Sales Order Item",filters={"parent":name},fields={"item_code"})
		for row in itemList:
			if frappe.db.get_value('Item',{'name':row.item_code},'is_stock_item')== 1:
				if row.item_code not in item:
					item.append(row.item_code)
		return item

@frappe.whitelist()
def set_barcode_name(barcode):
	bcode=frappe.db.get_value("Item Barcode",{'barcode':barcode},'name')
	if bcode!=barcode:
		frappe.db.sql("""update `tabItem Barcode` set name=%s where barcode=%s""",(barcode,barcode))

@frappe.whitelist()
def vehicle_log_list(doctype, txt, searchfield, start, page_len, filters):
	employee=filters['employee']
	return frappe.db.sql("""select name from `tabVehicle Log` where employee=%s""",(employee))

@frappe.whitelist()
def update_task(doctype,assign_to):
	taskList=[]
	task= frappe.db.get_list(doctype,filters={'assign_to':assign_to,'parenttype':'Task'},fields=['parent'])
	if task:
		for row in task:
			taskDetails= frappe.db.get_list("Task",filters={'name':row.parent,"status":"Open"},fields=['project','name'])
			for val in taskDetails:
				taskList.append(val)
		return taskList

@frappe.whitelist()
def update_project(doctype,name,parenttype):
	return frappe.db.get_list(doctype,filters={'parent':name,'parenttype':parenttype},fields=['project','task','branch','cost_center'])

@frappe.whitelist()
def update_project1(doctype,name):
	return frappe.db.get_list(doctype,filters={'name':name},fields=['project','branch','cost_center','contract','bank_account'])

@frappe.whitelist()
def update_project2(doctype,name,parenttype):
	return frappe.db.get_list(doctype,filters={'parent':name,'parenttype':parenttype},fields=['project','branch','cost_center'])


@frappe.whitelist()
def get_cost_center(doctype,name,parenttype):
	return frappe.db.get_value(doctype,{'parent':name,'parenttype':parenttype},'cost_center')

@frappe.whitelist()
def get_job_offer_terms(doctype,parent,parenttype):
		return frappe.db.get_list(doctype,filters={'parent':parent,'parenttype':parenttype},fields=['offer_term','value'])

@frappe.whitelist()
def update_employee(name,contract_no,contract_start_date,contract_end_date,contract_date_end,over_time):
	employee=frappe.get_doc("Employee",name)
	employee.db_set('contract_no',contract_no)
	employee.db_set('contract',contract_start_date)
	employee.db_set('probation_start_date',contract_start_date)
	employee.db_set('contract_end_date',contract_end_date)
	employee.db_set('contract_date_end',contract_date_end)
	employee.db_set('overtime',over_time)


@frappe.whitelist()
def get_user_role_billing():
	q1=frappe.db.sql("""
		select count(r.parent)
		from tabUser u,`tabHas Role` r where
		u.name=%s and
		u.name = r.parent and r.role in ('Projects Manager','System Manager')
		and u.enabled = 1
		""",(frappe.session.user))

	for q in q1:
		return q[0]
	
@frappe.whitelist()
def update_workflow_status(name):
    so=frappe.get_doc("Sales Order",name)
    so.db_set('workflow_state',"Closed")
    
@frappe.whitelist()
def update__workflow_state(name,status):
    so=frappe.get_doc("Sales Order",name)
    so.db_set('status',status)
    so.db_set('workflow_state',"Approved")

@frappe.whitelist()
def get_email(doctype,name):
	return frappe.db.get_list(doctype,filters={'name':name},fields=["user_id","employee_name"])

@frappe.whitelist()
def get_file_name(doctype,file_url,attached_to_field,attached_to_doctype):
		return frappe.db.get_value(doctype,{"attached_to_field":attached_to_field,"attached_to_doctype":attached_to_doctype},'name')

@frappe.whitelist()
def update_clearance_process(doctype,employee,month,year):
	nameList=[]
	start_date_list= frappe.db.get_list(doctype,filters={'employee':employee},fields=['start_date','name'])
	for row in start_date_list:
		if row.start_date.month==int(month) and row.start_date.year==int(year):
			if row.name not in nameList:
				nameList.append(row.name)
	return nameList

@frappe.whitelist()
def get_balance(doctype,employee,start_date):
	month=convertDateFormat(start_date)
	parent=frappe.db.get_value('Employee Deductions',{'employee':employee},'name')
	if parent:
		return frappe.db.get_value(doctype,{'parenttype':'Employee Deductions','month':month,'parent':parent},'balance')
		
@frappe.whitelist()
def count_task(employee):
	docname=frappe.db.sql(""" 
	select parent from `tabAssign To` 
	where assign_to=%s
	""",(employee))
	return docname   


@frappe.whitelist()
def get_employee_list(skill):
	parent=frappe.db.get_list("Employee Skill",filters={'skill':skill,'parenttype':'Employee Skill Map'},fields=["parent"])
	return parent
	
@frappe.whitelist()
def get_employee_contract(doctype,name):
	docVal=frappe.db.get_value(doctype,{'name':name},'contract_no')
	val=frappe.db.get_list('Contract Term Detail',filters={'parent':docVal,'parenttype':'Employee Contract','contract_term':['in',['Basic Salary','Working Hours']]},fields=['contract_term','value'])
	return val


@frappe.whitelist()
def get_task(employee,project):
	return frappe.db.sql("""select t.name from `tabTask` t,`tabAssign To` a where t.name=a.parent and t.project=%s and a.assign_to=%s""",(project,employee), as_dict=True)

@frappe.whitelist()
def get_employee_filters(project):
	return frappe.db.sql("""select a.assign_to from `tabTask` t,`tabAssign To` a where t.name=a.parent and t.project=%s """,(project), as_dict=True)

@frappe.whitelist()
def employee_filter_based_on_department(doctype, txt, searchfield, start, page_len, filters):
	user=filters['user']
	q1=frappe.db.get_value('Employee',{'user_id':user},'department')
	if q1:
		return frappe.db.sql("""select name from `tabEmployee` where department=%s""",(q1))

@frappe.whitelist()
def get_employee(task):
	employee=[]
	assign_to_list=frappe.db.get_list("Assign To",filters={'parent':task},fields=["assign_to"])
	for row in assign_to_list:
		if row.assign_to not in employee:
			employee.append(row.assign_to)
	return employee

@frappe.whitelist()
def validate_stock_entry(stock_entry_type):
	items=[]
	stock_entry=frappe.db.get_list("Stock Entry",filters={'stock_entry_type':'Material Issue','docstatus':1},fields=["name"])
	for row in stock_entry:
		item_list=frappe.db.get_list('Stock Entry Detail',filters={'parent':row.name,'parenttype':'Stock Entry'},fields=['item_code'])
		for val in item_list:
			if val.item_code not in items:
				items.append(val.item_code)
	return items

@frappe.whitelist()
def get_working_hours(employee_name):
	parent=frappe.db.get_value('Employee Contract',{'employee_name':employee_name,'docstatus':1},'name')
	if parent:
		return frappe.db.get_value('Contract Term Detail',{'parent':parent,'parenttype':'Employee Contract','contract_term':'Working Hours'},'value')

@frappe.whitelist()
def get_billing_rate(doctype,employee,project,activity_type):
	name=frappe.db.get_value(doctype,{'employee':employee,'activity_type':activity_type},'name')
	if name:
		billing_rate=frappe.db.get_value('Activity Cost Detail',{'parent':name,'parenttype':'Activity Cost','project':project},'name')
		if not billing_rate:
			billing_rate=frappe.db.get_value(doctype,{'employee':employee,'name':name,'activity_type':activity_type},'billing_rate')
			if not billing_rate:
				return frappe.db.get_value('Activity Type',{'activity_type':activity_type},'billing_rate')
			else:
				return billing_rate
		else:
			return billing_rate