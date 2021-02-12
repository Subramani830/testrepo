# -*- coding: utf-8 -*-
# Copyright (c) 2021, veena and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ResourcePlanning(Document):
	pass

@frappe.whitelist()
def get_item_group_list(item_group):
	lft,rgt=frappe.db.get_value('Item Group',{'item_group_name':item_group},['lft','rgt'])
	retrieved_item_group_list=frappe.db.get_list('Item Group',filters={'lft':['>',lft],'rgt':['<=',rgt]},fields={'name'})
	return retrieved_item_group_list