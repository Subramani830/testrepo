from __future__ import unicode_literals
from frappe import _


def get_dashboard_data(data):
	return {
		'fieldname': 'material_request',
		'transactions': [
			{
				'label': _('Related'),
				'items': ['Request for Quotation', 'Supplier Quotation', 'Purchase Order']
			},
			{
				'label': _('Stock'),
				'items': ['Stock Entry', 'Purchase Receipt']

			}
		]
	}