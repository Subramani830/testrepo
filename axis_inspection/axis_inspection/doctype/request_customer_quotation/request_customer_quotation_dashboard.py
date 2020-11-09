from __future__ import unicode_literals
from frappe import _

def get_data():
	return {
		'fieldname': 'request_customer_quotation',
		'transactions': [
			{
				'items': ['Quotation', 'Supplier Quotation','Request Customer Information']
			},
		]
	}
