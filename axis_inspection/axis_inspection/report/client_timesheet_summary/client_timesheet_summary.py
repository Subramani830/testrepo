# Copyright (c) 2013, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cstr, cint, getdate
from frappe import msgprint, _
from calendar import monthrange
from datetime import datetime as dt

status_map = {
	"Absent": "A",
	"Half Day": "HD",
	"Holiday": "<b>H</b>",
	"Weekly Off": "<b>WO</b>",
	"On Leave": "L",
	"Present": "P",
	"Work From Home": "WFH"
	}

day_abbr = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
]

def execute(filters=None):
	data = []
	conditions, filters = get_conditions(filters)
	columns, days = get_columns(filters)
	emp_map = get_employee_details(filters.company)
	holiday_list = [emp_map[d]["holiday_list"] for d in emp_map if emp_map[d]["holiday_list"]]
	default_holiday_list = frappe.get_cached_value('Company',  filters.get("company"),  "default_holiday_list")
	holiday_list.append(default_holiday_list)
	holiday_list = list(set(holiday_list))
	holiday_map = get_holiday(holiday_list, filters["month"])
	
	data = get_data(filters,holiday_map)
	return columns, data, None

def get_columns(filters):
	columns = []

	columns += [
		_("Description") + ":Link/Shift Type:120"#,_("Employee") + ":Link/Employee:120"
	]
	days = []
	for day in range(filters["total_days_in_month"]):
		date = str(filters.year) + "-" + str(filters.month)+ "-" + str(day+1)
		day_name = day_abbr[getdate(date).weekday()]
		days.append(cstr(day+1) +"::65")
	columns += days
	columns += [_("Total") + ":Data/:120"]

	return columns, days

def get_data(filters,holiday_map):
	weak_off = []
	record = []
	total_w = 0.0
	print(holiday_map)
	query="""SELECT DISTINCT td.activity_type as description from `tabTimesheet` t \
		LEFT JOIN `tabTimesheet Detail` td ON t.name = td.parent \
		where t.employee='{employee}' and t.customer='{customer}' and month(t.timesheet_date)='{month}' and year(t.timesheet_date)='{year}' """.format(employee=filters.get('employee'),customer=filters.get('customer'),year=filters.get('year'),month=cint(filters.month))
	description_data=frappe.db.sql(query, as_dict=True)


	query = """select day(attendance_date) as day_of_month from `tabAttendance` where docstatus = 1 and status='On Leave' and month(attendance_date) = '{month}' and year(attendance_date) = '{year}' and employee='{employee}' order by shift, attendance_date""".format(
	employee=filters.get('employee'), year=filters.get('year'),month=cint(filters.month))
	leaves = frappe.db.sql(query , as_dict=1)
	print(leaves)

	query="""SELECT td.activity_type as description, day(td.from_time) as day, td.hours as hours from `tabTimesheet` t \
	LEFT JOIN `tabTimesheet Detail` td ON t.name = td.parent \
	where t.employee='{employee}' and t.customer='{customer}' and month(t.timesheet_date)='{month}' and year(t.timesheet_date)='{year}' """.format(employee=filters.get('employee'),customer=filters.get('customer'),year=filters.get('year'),month=cint(filters.month))
	timesheet_data=frappe.db.sql(query, as_dict=True)

	for hm in holiday_map['holiday list 1']:
		weak_off.append(hm[0])
	filters["total_days_in_month"] = monthrange(cint(filters.year), cint(filters.month))[1]

	for data in description_data:
		total_w = 0.0
		for wo in weak_off:
			day_o={cstr(wo):"WO"}
			data.update(day_o)
		for l in leaves:
			day={cstr(l['day_of_month']):"L"}
			data.update(day)

		for work_hour in timesheet_data:
			if(data['description'] == work_hour['description']):
				day_p={cstr(work_hour['day']):cstr(work_hour['hours'])}
				total_w += float(work_hour['hours'])
				total = {"total":total_w}
				data.update(day_p)
				data.update(total)
		record.append(data)
	
	print(record)

	return record#description_data

def get_conditions(filters):
	if not (filters.get("month") and filters.get("year")):
		msgprint(_("Please select month and year"), raise_exception=1)

	filters["total_days_in_month"] = monthrange(cint(filters.year), cint(filters.month))[1]

	conditions = " and month(attendance_date) = %(month)s and year(attendance_date) = %(year)s"

	if filters.get("company"): conditions += " and company = %(company)s"
	if filters.get("employee"): conditions += " and employee = %(employee)s"

	return conditions, filters

def get_employee_details( company):
	emp_map = {}
	query = """select name, employee_name, designation, department, branch, company,
		holiday_list from `tabEmployee` where company = %s """ % frappe.db.escape(company)

	employee_details = frappe.db.sql(query , as_dict=1)

	for d in employee_details:
		emp_map[d.name] = d

	return emp_map

def get_holiday(holiday_list, month):
	holiday_map = frappe._dict()
	for d in holiday_list:
		if d:
			holiday_map.setdefault(d, frappe.db.sql('''select day(holiday_date), weekly_off from `tabHoliday`
				where parent=%s and month(holiday_date)=%s''', (d, month)))

	return holiday_map
