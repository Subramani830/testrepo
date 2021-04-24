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
	group=frappe.db.get_value('Item Group',{'item_group_name':item_group},'item_group_name')
	if group:
		lft,rgt=frappe.db.get_value('Item Group',{'item_group_name':item_group},['lft','rgt'])
		retrieved_item_group_list=frappe.db.get_list('Item Group',filters={'lft':['>',lft],'rgt':['<=',rgt]},fields={'name'})
		return retrieved_item_group_list


@frappe.whitelist()
def get_resource_planning_employee_detail(sales_order,name):
	emp_detail = []
	desig = []
	rpc = []
	result = []
	for item in frappe.db.get_list('Sales Order Item',filters={'parent':sales_order},fields=['item_code']):
		for rpc_list in frappe.db.get_list('Resource Planning Configuration', filters={'item_code':item.item_code},fields={'name'}):
			rpc.append(rpc_list.name)
			for details in frappe.db.get_list('Employee Details', filters={'parent':rpc_list.name,'parenttype':'Resource Planning Configuration'},fields={'designation','number_of_employee'}):
				emp_detail.append(details)
			for designation in frappe.db.get_list('Employee Details', filters={'parent':rpc_list.name,'parenttype':'Resource Planning Configuration'},fields={'designation'}):
				desig.append(designation)
	[result.append(x) for x in desig if x not in result]
	for data in result:
		total_e = 0
		for emp in emp_detail:
			if(data['designation'] == emp['designation']):
				total_e += emp['number_of_employee']
				total = {"no_emp":total_e}
				data.update(total)
	return result

@frappe.whitelist()
def get_resource_planning_asset_detail(sales_order,name):
	asset_detail = []
	asset_category = []
	rpc = []
	result = []
	for item in frappe.db.get_list('Sales Order Item',filters={'parent':sales_order},fields=['item_code']):
		for rpc_list in frappe.db.get_list('Resource Planning Configuration', filters={'item_code':item.item_code},fields={'name'}):
			rpc.append(rpc_list.name)
			for details in frappe.db.get_list('Asset Detail', filters={'parent':rpc_list.name,'parenttype':'Resource Planning Configuration'},fields={'asset_category','qty'}):
				asset_detail.append(details)
			for category in frappe.db.get_list('Asset Detail', filters={'parent':rpc_list.name,'parenttype':'Resource Planning Configuration'},fields={'asset_category'}):
				asset_category.append(category)
	[result.append(x) for x in asset_category if x not in result]
	for data in result:
		total_e = 0
		for asset in asset_detail:
			if(data['asset_category'] == asset['asset_category']):
				total_e += asset['qty']
				total = {"qty":total_e}
				data.update(total)
	return result


@frappe.whitelist()
def get_resource_planning_item_detail(sales_order,name):
	item_detail = []
	i_group = []
	rpc = []
	result = []
	for item in frappe.db.get_list('Sales Order Item',filters={'parent':sales_order},fields=['item_code']):
		for rpc_list in frappe.db.get_list('Resource Planning Configuration', filters={'item_code':item.item_code},fields={'name'}):
			rpc.append(rpc_list.name)
			for details in frappe.db.get_list('Item Details', filters={'parent':rpc_list.name,'parenttype':'Resource Planning Configuration'},fields={'item_group','qty'}):
				item_detail.append(details)
			for item_group in frappe.db.get_list('Item Details', filters={'parent':rpc_list.name,'parenttype':'Resource Planning Configuration'},fields={'item_group'}):
				i_group.append(item_group)
	[result.append(x) for x in i_group if x not in result]
	for data in result:
		total_e = 0
		for items in item_detail:
			if(data['item_group'] == items['item_group']):
				total_e += items['qty']
				total = {"qty":total_e}
				data.update(total)
	return result
