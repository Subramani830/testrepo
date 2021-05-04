from __future__ import unicode_literals
from frappe import _

def get_data():
	return {
		'fieldname': 'reference_no',
		'non_standard_fieldnames': {
			'Payment Entry': 'employee_costs'
		},
		'transactions': [
			{
				'items': ['Journal Entry','Payment Entry']
			},
			{
				'items': ['Purchase Invoice','Material Request']
			},
		]
	}
