# -*- coding: utf-8 -*-
# Copyright (c) 2019, Frappe Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Skill(Document):
	pass

@frappe.whitelist()
def update_skill_name(name, skill_name, from_descendant=False):
	frappe.db.set_value("Skill", name, "skill_name", skill_name.strip())
	frappe.db.sql("""update `tabSkill` set name=%s where name=%s""",(skill_name.strip(),name))
	return skill_name.strip()
