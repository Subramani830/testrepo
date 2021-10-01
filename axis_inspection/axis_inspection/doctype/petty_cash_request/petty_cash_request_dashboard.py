from __future__ import unicode_literals
from frappe import _
import frappe

def get_dashboard_data(data):
	return {
        'heatmap': True,
		'fieldname': 'name',
		'non_standard_fieldnames': {
			'Payment Entry': 'petty_cash_request',
		},
		'transactions': [
			{
				'label': _('Payment Entry'),
				'items': ['Payment Entry']
			}
		]
	}