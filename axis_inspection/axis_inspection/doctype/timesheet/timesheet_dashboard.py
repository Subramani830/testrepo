
from __future__ import unicode_literals
from frappe import _
import frappe

def get_dashboard_data(data):
	return {
        'heatmap': True,
		'fieldname': 'name',
		'transactions': [
			{
				'label': _('References'),
				'items': ['Sales Invoice', 'Salary Slip','Delivery Note']
			}
		]
	}