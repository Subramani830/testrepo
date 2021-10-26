
from __future__ import unicode_literals
from frappe import _
import frappe

def get_dashboard_data(data):
	return {
		'fieldname': 'time_sheet',
		'transactions': [
			{
				'label': _('References'),
				'items': ['Sales Invoice', 'Salary Slip','Delivery Note']
			}
		]
	}