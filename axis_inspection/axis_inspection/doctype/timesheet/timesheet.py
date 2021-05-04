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
from datetime import date
from datetime import datetime
import calendar
from datetime import date, timedelta

class OverlapError(frappe.ValidationError): pass
class OverWorkLoggedError(frappe.ValidationError): pass

class Timesheet(Document):
	pass

def on_submit(self,method):
	for row in self.time_logs:
		task=row.task
		if task!=None:break
	update_asset_details(self,task)
	update_consumable_item_details(self,task)

def on_cancel(self,method):
	delete_asset_and_consumable_detail(self)

def update_asset_details(self,task):
	doc=frappe.get_doc('Task',task)
	for val in self.asset_detail:
		name=frappe.db.get_value('Asset Item',{'parent':task,'parenttype':'Task','asset':val.asset},'name')
		if name:
			hours=frappe.db.get_value('Asset Item',{'parent':task,'parenttype':'Task','asset':val.asset},'hours')
			total_hours=hours+val.hours
			asset_detail_doc=frappe.get_doc("Asset Item",name)
			asset_detail_doc.update({
				'hours':total_hours
			})
			asset_detail_doc.save()
		else:
			doc.append('asset_detail', {
				'asset': val.asset,
				'hours': val.hours
			})
			doc.save()

def update_consumable_item_details(self,task):
	doc=frappe.get_doc('Task',task)
	for val in self.consumable_detail:
		name=frappe.db.get_value('Consumable Detail',{'parent':task,'parenttype':'Task','item_code':val.item_code},['name'])
		if name:
			qty=frappe.db.get_value('Consumable Detail',{'parent':task,'parenttype':'Task','item_code':val.item_code},['quantity'])
			total_qty=qty+val.quantity
			item_detail_doc=frappe.get_doc("Consumable Detail",name)
			item_detail_doc.update({
				'quantity':total_qty
			})
			item_detail_doc.save()
		else:
			doc.append('consumable_detail', {
			'item_code': val.item_code,
			'quantity':val.quantity
			})
			doc.save()

def delete_asset_and_consumable_detail(self):
	for row in self.time_logs:
		task=row.task
		if task!=None:break
	for val in self.asset_detail:
		name,hours=frappe.db.get_value('Asset Item',{'parent':task,'parenttype':'Task','asset':val.asset},['name','hours'])
		if val.hours==hours:
			frappe.db.delete("Asset Item",name)
		else:
			total_hours=hours-val.hours
			asset_detail_doc=frappe.get_doc("Asset Item",name)
			asset_detail_doc.update({
				'hours':total_hours
			})
			asset_detail_doc.save()
		
	for val in self.consumable_detail:
		name,qty=frappe.db.get_value('Consumable Detail',{'parenttype':'Task','parent':task,'item_code':val.item_code},['name','quantity'])
		if val.quantity==qty:
			frappe.db.delete("Consumable Detail",name)
		else:
			total_qty=qty-val.quantity
			item_detail_doc=frappe.get_doc("Consumable Detail",name)
			item_detail_doc.update({
				'quantity':total_qty
			})
			item_detail_doc.save()


@frappe.whitelist()
def get_project_timesheet_data(project, parent=None):
	cond = ''
	if parent:
		cond = "and parent = %(parent)s"

	return frappe.db.sql("""select td.name, td.parent, td.billing_hours, td.billing_amount as billing_amt
			from `tabTimesheet Detail` td LEFT JOIN `tabTimesheet` t ON t.name=td.parent where td.parenttype = 'Timesheet' and td.docstatus=1 and td.project = %(project)s {0} and td.billable = 1
			and td.sales_invoice is null and t.timesheet_type= 'Client' """.format(cond), {'project': project, 'parent': parent}, as_dict=1)


@frappe.whitelist()
def get_stand_rate(item_code,project):
	sales_order=frappe.db.get_value('Project',{'name':project},'sales_order')
	return frappe.db.get_value('Sales Order Item',{'parent':sales_order,'item_code':item_code},'standby_rate')


@frappe.whitelist()
def get_overtime_rate(item_code,project):
	sales_order=frappe.db.get_value('Project',{'name':project},'sales_order')
	return frappe.db.get_value('Sales Order Item',{'parent':sales_order,'item_code':item_code},'overtime_rate')


@frappe.whitelist()
def convertDateFormat(start_date):
	start_date=str(start_date)
	date=datetime.strptime(start_date, '%Y-%m-%d')
	return date.strftime('%B-%Y')


@frappe.whitelist()
def get_absent_days(employee,start_date):
	date=start_date
	convert_date = datetime.strptime(date, '%Y-%m-%d')
	month_start_date = convert_date.replace(day=1)
	months=month_start_date.month
	month_end_date = month_start_date.replace(month=months+1)  - timedelta(1)
	
	days=frappe.db.get_list("Leave Application",filters={"employee":employee,"from_date":["between",[month_start_date,month_end_date]],"status":"Approved"},fields={"name","total_leave_days"})

	return days


@frappe.whitelist()
def get_duplicate_entry(doc):
	days = []
	result=json.loads(doc)
	for time_sheet in frappe.db.get_list("Timesheet", filters={"employee":result['employee'],"month_and_year":result['month_and_year'],"customer":result['customer'],"name":["!=",result['name']]},fields=["name"]):
		if(time_sheet):
			for i in result['time_logs']:
				f_time = i['from_time']
				day= datetime.strptime(f_time,'%Y-%m-%d %H:%M:%S')
				dt=day.date()
				day_time=frappe.db.sql("""select date(from_time) from `tabTimesheet Detail` where parent = '{name}' and date(from_time)='{dates}' """.format(name=time_sheet['name'],dates=dt))
				for time in day_time:
					days.append(day_time)
				
	return days




