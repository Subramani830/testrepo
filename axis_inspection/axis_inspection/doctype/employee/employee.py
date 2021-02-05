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


def send_daily_report():
    custom_filter = {'document': '','period':'30'}
    date_time = global_date_format(now()) + ' ' + format_time(now())
    report = frappe.get_doc('Report', "Employee Documents Expiration Report")
    columns, data = report.get_data(limit=500 or 500, filters=custom_filter,as_dict=True)
    columns.insert(0, frappe._dict(fieldname='idx', label='', width='30px'))
    for i in range(len(data)):
        data[i]['idx'] = i+1
    #columns, data = make_links(columns, data)
    if len(data)!=0:
        for userlist in frappe.db.get_list('Has Role',filters={'role':('in',('HR User','HR Manager','CEO','Deputy General Manager')),'parenttype':'User'},fields={'parent'}):
            message="Hi Documents are expiring within 30 days.Please click the below link to see the report."+frappe.render_template('frappe/templates/emails/auto_email_report.html', {
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
                reference_name = "Document Expiring in 30 Days"
            )
            print(userlist.parent)


