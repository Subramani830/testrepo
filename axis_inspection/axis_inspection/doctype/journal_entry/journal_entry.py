# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.document import Document


class JournalEntry(Document):
    pass


@frappe.whitelist()
def add_accounting_entries(employee, posting_date):
    employee_list = []
    date = posting_date.split('-')[1]
    employee_cost_list = frappe.db.sql(
        """select name,total_cost from `tabEmployee Costs` where employee=%s and month(posting_date)=%s""", (employee, date), as_dict=True)
    for employee_cost in employee_cost_list:
        employee_list.append(employee_cost)

    return employee_list
