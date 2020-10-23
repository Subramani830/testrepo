# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "axis_inspection"
app_title = "Axis Inspection"
app_publisher = "veena"
app_description = "Axis Inspection"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "veena.h@promantia.com"
app_license = "MIT"

fixtures = ["Workflow","Workflow State","Workflow Action Master",
{"dt": "Custom Field",
		"filters": [
         [
             "name", "in", [
		"Job Applicant-interview_date",
		"Job Applicant-interview_time",
		"Job Applicant-department",
		"Job Applicant-department_manager",
		"Department-department_manager",
		"Employee Separation-department_manager",
		"Employee Separation-employee_resignation",
		"Employee Onboarding-probation",
		"Customer-blacklisted"
		]
	]
]
},
{"dt": "Notification", 
		"filters": [
		"is_standard != 1"	
		]
}
]
doctype_js = {
	"Job Applicant" : "axis_inspection/doctype/job_applicant/job_applicant.js",
	"Employee Costs" : "axis_inspection/doctype/employee_costs/employee_costs.js",
	"Clearance Process" : "axis_inspection/doctype/clearance_process/clearance_process.js",
	"Employee Separation" : "axis_inspection/doctype/employee_separation/employee_separation.js",
	"Sales Order" : "axis_inspection/doctype/sales_order/sales_order.js"
}
scheduler_events = {
	"daily":  ["axis_inspection.axis_inspection.doctype.certificates.certificates.validate_expiry_date"
	]
}

override_doctype_dashboards = {
	"Employee": ["axis_inspection.axis_inspection.doctype.employee.employee_dashboard.get_dashboard_data"]
}
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/axis_inspection/css/axis_inspection.css"
# app_include_js = "/assets/axis_inspection/js/axis_inspection.js"

# include js, css files in header of web template
# web_include_css = "/assets/axis_inspection/css/axis_inspection.css"
# web_include_js = "/assets/axis_inspection/js/axis_inspection.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "axis_inspection/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "axis_inspection.install.before_install"
# after_install = "axis_inspection.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "axis_inspection.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"axis_inspection.tasks.all"
# 	],
# 	"daily": [
# 		"axis_inspection.tasks.daily"
# 	],
# 	"hourly": [
# 		"axis_inspection.tasks.hourly"
# 	],
# 	"weekly": [
# 		"axis_inspection.tasks.weekly"
# 	]
# 	"monthly": [
# 		"axis_inspection.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "axis_inspection.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "axis_inspection.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "axis_inspection.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

