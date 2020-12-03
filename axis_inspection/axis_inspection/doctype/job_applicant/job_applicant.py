from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.core.doctype.communication.email import make


class JobApplicant(Document):
		pass

@frappe.whitelist()
def send_mail_employee(name,email,job_title,apply_for):
	msg="Hi "+name+", \r\nyour appling for the second time for the new job "+apply_for+" \r\nThank You"

	try:
		make(subject = "Candidate applying for the second time for new position", content=msg, recipients='thananSubramani1@gmail.com', send_email=True)
	  
		msg = """Email send successfully to Employee"""
		print(msg)
	except:
		print("could not send")

@frappe.whitelist()
def send_mail_hr(name,job_title,apply_for):
	for hr_list in frappe.db.get_list('Has Role',filters={'role':'HR Manager','parenttype':'User'},fields={'parent'}):
		if hr_list.parent != 'Administrator':
			msg="Hi, \r\nCandidate "+name+" has already applied for "+job_title+"  and now appling for the second time for the new job "+apply_for+" \r\nThank You"

			try:
				make(subject = "Candidate applying for the second time for new position", content=msg, recipients='thananSubramani1@gmail.com', send_email=True)
			  
				msg = """Email send successfully to Employee"""
				print(msg)
			except:
				print("could not send")

@frappe.whitelist()
def sendmail_jobtitle_correction(name,email,apply_for):
	msg="Hi "+name+", \r\nThe job title "+apply_for+" which you have selected is not there in the Job Openings list please create a new one or select the correct position.  \r\nThank You"

	try:
		make(subject = "Candidate applying for the second time for new position", content=msg, recipients='thananSubramani1@gmail.com', send_email=True)
	  
		msg = """Email send successfully to Employee"""
		print(msg)
	except:
		print("could not send")

