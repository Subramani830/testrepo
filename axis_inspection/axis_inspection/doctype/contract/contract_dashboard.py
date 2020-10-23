from __future__ import unicode_literals
from frappe import _

def get_dashboard_data(data):
	return {
		'fieldname': 'contract',
		'transactions': [
			{
				'label': _('Quotation'),
				'items': ['Quotation']
			},
			{
				'label': _('Sales Order'),
				'items': ['Sales Order']
			}
		]
	}
