from __future__ import unicode_literals
from frappe import _

def get_data():
	return {
		'fieldname': 'reference_no',
		'transactions': [
			{
				'items': ['Journal Entry']
			},
			{
				'items': ['Purchase Invoice','Material Request']
			},
		]
	}
