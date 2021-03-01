from __future__ import unicode_literals
from frappe import _
import frappe

def get_dashboard_data(data):
	return {
		'fieldname': 'prevdoc_docname',
		'non_standard_fieldnames': {
			'Auto Repeat': 'reference_document',
		},
		'transactions': [
			{
				'label': _('Sales Order'),
				'items': ['Sales Order']
			},
			{
				'label': _('Subscription'),
				'items': ['Auto Repeat']
			},
            {
				'label': _('Resource Planning'),
				'items': ['Resource Planning']
			},
		]
	}