from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
import json
from datetime import datetime, timedelta, date
import re, datetime, math, time
import babel.dates
from babel.core import UnknownLocaleError
from dateutil import parser
from num2words import num2words
from six.moves import html_parser as HTMLParser
from six.moves.urllib.parse import quote, urljoin
from html2text import html2text
from markdown2 import markdown, MarkdownError
from six import iteritems, text_type, string_types, integer_types

class TrainingProgram(Document):
	pass

DATE_FORMAT = "%Y-%m-%d"
TIME_FORMAT = "%H:%M:%S.%f"
DATETIME_FORMAT = DATE_FORMAT + " " + TIME_FORMAT


def is_invalid_date_string(date_string):
	# dateutil parser does not agree with dates like "0001-01-01" or "0000-00-00"
	return (not date_string) or (date_string or "").startswith(("0001-01-01", "0000-00-00"))

# datetime functions
def getdate(string_date=None):
	"""
	Converts string date (yyyy-mm-dd) to datetime.date object
	"""

	if not string_date:
		return get_datetime().date()
	if isinstance(string_date, datetime.datetime):
		return string_date.date()

	elif isinstance(string_date, datetime.date):
		return string_date

	if is_invalid_date_string(string_date):
		return None
	try:
		return parser.parse(string_date).date()
	except ParserError:
		frappe.throw(frappe._('{} is not a valid date string.').format(
			frappe.bold(string_date)
		), title=frappe._('Invalid Date'))

def get_datetime(datetime_str=None):
	if datetime_str is None:
		return now_datetime()

	if isinstance(datetime_str, (datetime.datetime, datetime.timedelta)):
		return datetime_str

	elif isinstance(datetime_str, (list, tuple)):
		return datetime.datetime(datetime_str)

	elif isinstance(datetime_str, datetime.date):
		return datetime.datetime.combine(datetime_str, datetime.time())

	if is_invalid_date_string(datetime_str):
		return None

	try:
		return datetime.datetime.strptime(datetime_str, DATETIME_FORMAT)
	except ValueError:
		return parser.parse(datetime_str)

def to_timedelta(time_str):
	if isinstance(time_str, string_types):
		t = parser.parse(time_str)
		return datetime.timedelta(hours=t.hour, minutes=t.minute, seconds=t.second, microseconds=t.microsecond)

	else:
		return time_str

def add_to_date(date, years=0, months=0, weeks=0, days=0, hours=0, minutes=0, seconds=0, as_string=False, as_datetime=False):
	"""Adds `days` to the given date"""
	from dateutil.relativedelta import relativedelta

	if date==None:
		date = now_datetime()

	if hours:
		as_datetime = True

	if isinstance(date, string_types):
		as_string = True
		if " " in date:
			as_datetime = True
		try:
			date = parser.parse(date)
		except ParserError:
			frappe.throw(frappe._("Please select a valid date filter"), title=frappe._("Invalid Date"))

	date = date + relativedelta(years=years, months=months, weeks=weeks, days=days, hours=hours, minutes=minutes, seconds=seconds)

	if as_string:
		if as_datetime:
			return date.strftime(DATETIME_FORMAT)
		else:
			return date.strftime(DATE_FORMAT)
	else:
		return date

def add_days(date, days):
	return add_to_date(date, days=days)

def add_months(date, months):
	return add_to_date(date, months=months)

def add_years(date, years):
	return add_to_date(date, years=years)

def date_diff(string_ed_date, string_st_date):
	return (getdate(string_ed_date) - getdate(string_st_date)).days




@frappe.whitelist()
def auto_create_training_event(doc,method):
	if doc.number_of_frequency <= 1:
		if doc.training_frequency!='Every Day':
			name=doc.name
			start=doc.start_date
			end=doc.end_date
			create_event(name,start,end,doc,method)
		else:
			name=doc.name
			start=doc.start_date
			end=add_days(doc.start_date, 1)
			create_event(name,start,end,doc,method)
	else:
		if doc.training_frequency=='Weekly':
			s_day = doc.start_date
			e_day = doc.end_date 
			for i in range(doc.number_of_frequency):
				name=doc.name+str(i+1)
				start = s_day 
				end = e_day
				s_day= add_days(start, 7)
				e_day = add_days(end, 7)
				create_event(name,start,end,doc,method)

		elif doc.training_frequency=='Monthly':
			s_day = doc.start_date
			e_day = doc.end_date 
			for i in range(doc.number_of_frequency):
				name=doc.name+str(i+1)
				start = s_day
				end = e_day
				s_day = add_months(start, 1)
				e_day = add_months(end, 1)
				create_event(name,start,end,doc,method)


		elif doc.training_frequency=='Bi Monthly':
			s_day = doc.start_date
			e_day = doc.end_date 
			for i in range(doc.number_of_frequency):
				name=doc.name+str(i+1)
				start = s_day 
				end = e_day 
				s_day = add_months(start, 2)
				e_day = add_months(end, 2)
				create_event(name,start,end,doc,method)


		elif doc.training_frequency=='Quarterly':
			s_day = doc.start_date
			e_day = doc.end_date 
			for i in range(doc.number_of_frequency):
				name=doc.name+str(i+1)
				start = s_day 
				end = e_day
				s_day = add_months(start, 3)
				e_day = add_months(end, 3)
				create_event(name,start,end,doc,method)

		elif doc.training_frequency=='Half Annually':
			s_day = doc.start_date
			e_day = doc.end_date 
			for i in range(doc.number_of_frequency):
				name=doc.name+str(i+1)
				start = s_day 
				end = e_day
				s_day = add_months(start, 6)
				e_day = add_months(end, 6)
				create_event(name,start,end,doc,method)

		elif doc.training_frequency=='Every Day':
			s_day = doc.start_date
			#e_day = doc.end_date 
			for i in range(doc.number_of_frequency):
				name=doc.name+str(i+1)
				start = s_day 
				end = add_days(s_day,1)
				s_day = add_days(start, 1)
				#e_day = add_months(end, 6)
				create_event(name,start,end,doc,method)

def create_event(name,start,end,doc,method):
	docVal=frappe.db.get_list("Training Event", filters={"name":name})
	if not docVal:
		frappe.get_doc(dict(doctype = 'Training Event',
		event_name = name,
	    	training_program = doc.name,
		company = doc.company,
		trainer_name = doc.trainer_name,
		trainer_email = doc.trainer_email,
		supplier = doc.supplier,
		contact_number = doc.contact_number,
		location = doc.location,
		start_time = start,
		end_time = end,
		introduction = doc.description)).insert()
		frappe.db.commit()
	else:
		frappe.delete_doc('Training Event', name)
		frappe.get_doc(dict(doctype = 'Training Event',
		event_name = name,
	    	training_program = doc.name,
		company = doc.company,
		trainer_name = doc.trainer_name,
		trainer_email = doc.trainer_email,
		supplier = doc.supplier,
		contact_number = doc.contact_number,
		location = doc.location,
		start_time = start,
		end_time = end,
		introduction = doc.description)).insert()
		frappe.db.commit()







