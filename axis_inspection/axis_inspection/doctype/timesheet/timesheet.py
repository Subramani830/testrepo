from __future__ import unicode_literals
import frappe
from frappe import _

import json
from datetime import timedelta
from erpnext.controllers.queries import get_match_cond
from frappe.utils import flt, time_diff_in_hours, get_datetime, getdate, cint, date_diff, add_to_date
from frappe.model.document import Document
from erpnext.manufacturing.doctype.workstation.workstation import (check_if_within_operating_hours,
	WorkstationHolidayError)
from erpnext.manufacturing.doctype.manufacturing_settings.manufacturing_settings import get_mins_between_operations

class OverlapError(frappe.ValidationError): pass
class OverWorkLoggedError(frappe.ValidationError): pass

class Timesheet(Document):
	pass

def on_submit(self,method):
	total_hours=0
	total_qty=0
	for val in self.asset_detail:
		total_hours+=val.hours

	for val in self.consumable_detail:
		total_qty+=val.quantity

	for row in self.time_logs:
		task=row.task
		if task!=None:break
	doc=frappe.get_doc('Task',task)
	doc.db_set('total_hours',total_hours)
	doc.db_set('total_qty',total_qty)
	

@frappe.whitelist()
def get_project_timesheet_data(project, parent=None):
	cond = ''
	if parent:
		cond = "and parent = %(parent)s"

	return frappe.db.sql("""select td.name, td.parent, td.billing_hours, td.billing_amount as billing_amt
			from `tabTimesheet Detail` td LEFT JOIN `tabTimesheet` t ON t.name=td.parent where td.parenttype = 'Timesheet' and td.docstatus=1 and td.project = %(project)s {0} and td.billable = 1
			and td.sales_invoice is null and t.timesheet_type= 'Client' """.format(cond), {'project': project, 'parent': parent}, as_dict=1)


@frappe.whitelist()
def get_bill_rate(item_code,project):
	sales_order=frappe.db.get_value('Project',{'name':project},'sales_order')
	return frappe.db.get_value('Sales Order Item',{'parent':sales_order,'item_code':item_code},'rate')

