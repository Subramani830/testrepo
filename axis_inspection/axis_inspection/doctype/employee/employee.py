from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.core.doctype.communication.email import make
from datetime import timedelta
from frappe.utils import (format_time, get_url_to_report,get_link_to_form,
	global_date_format, now, now_datetime, validate_email_address, today, add_to_date)
from frappe.utils.nestedset import NestedSet

class Employee(NestedSet):
		pass

def safety_program_not_attended():
	employee = ""
	for userlist in frappe.db.get_list('Has Role',filters={'role':('in',('Safety Manager')),'parenttype':'User'},fields={'parent'}):
		docVal = frappe.db.get_list("Employee", filters={"safety_training_program_attended":("=","")},fields=["name"])
		for row in docVal:
			employee +=row.name+','
		msg="Hi, \r\nEmployees "+employee+" has no training Event, please create the training events. \r\nThank You"

		try:
			make(subject = "Employees haveing no training event", content=msg, recipients=userlist.parent, send_email=True)
		  
			msg = """Email send successfully to Employee"""
			print(msg)
		except:
			print("could not send")
		print(employee)
		print(userlist.parent)





def send_daily_report():
    custom_filter = {'document': '','period':'90'}
    date_time = global_date_format(now()) + ' ' + format_time(now())
    report = frappe.get_doc('Report', "Employee Documents Expiration Report")
    columns, data = report.get_data(limit=500 or 500, filters=custom_filter,as_dict=True)
    columns.insert(0, frappe._dict(fieldname='idx', label='', width='30px'))
    for i in range(len(data)):
        data[i]['idx'] = i+1
    #columns, data = make_links(columns, data)
    if len(data)!=0:
        for userlist in frappe.db.get_list('Has Role',filters={'role':('in',('HR User','HR Manager','CEO','Deputy General Manager')),'parenttype':'User'},fields={'parent'}):
            message="Hi, Documents are expiring within 90 days.Please click the below link to see the report."+frappe.render_template('frappe/templates/emails/auto_email_report.html', {
            'columns': columns,
            'data': data,
            'title':'',
            'date_time': date_time,
            'report_url': get_url_to_report('Employee Documents Expiration Report','Script Report','Employee'),
            'report_name': 'Employee Documents Expiration Report'})
            frappe.sendmail(
                recipients=[userlist.parent],
                subject='Employee Documents Expiration Report',
                message=message,
                reference_doctype = "Employee",
                reference_name = "Document Expiring in 90 Days"
            )
            print(userlist.parent)


