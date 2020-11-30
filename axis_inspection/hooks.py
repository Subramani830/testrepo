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
		"Customer-blacklisted",
		"Sales Order-contract",
		"Quotation-contract",
		"Employee-department_manager",
		"Journal Entry-reference_no",
		"Contract-items",
		"Contract-currency",
		"Contract-conversion_rate",
		"Contract-column_break_14",
		"Contract-price_list",
		"Contract-currency_and_price_list_details",
		"Contract-company",
		"Task-clt_number",
		"Timesheet-department_manager",
		"Job Offer-reason_for_rejection",
		"Training Event-internal_trainer",
		"Employee Boarding Activity-status",
		"Vehicle-asset",
		"Purchase Order-task",
		"Task-in_house",
		"Task-out_sourced",
		"Quotation-request_customer_quotation",
		"Quotation-request_customer_information",
		"Supplier Quotation-request_customer_quotation",
		"Training Event Employee-equipment",
		"Item-child_item",
		"Item-child_items",
		"Sales Invoice-ses_number",
		"Employee-old_employee_id",
		"Employee-id_expiry_date",
		"Job Applicant-phone_number",
		"Job Applicant-current_position",
		"Job Applicant-current_company",
		"Job Applicant-experience"
		]
	]
]
},
{"dt": "Notification", 
		"filters": [
		"is_standard != 1"	
		]
},
{"dt": "Property Setter",
        "filters": [
	[
		"name","in",
 			[
				"Job Offer-status-options",
				"Training Event-trainer_email-options"
				
			]
	]
	]
},
{"dt": "Print Format",
        "filters": [
	[
		"name","in",
 			[
			"Axis Job Offer Print Format"
]
	]
]
}
]
doctype_js = {
	"Job Applicant" : "axis_inspection/doctype/job_applicant/job_applicant.js",
	"Job Offer" : "axis_inspection/doctype/job_offer/job_offer.js",
	"Employee Separation" : "axis_inspection/doctype/employee_separation/employee_separation.js",
	"Sales Order" : "axis_inspection/doctype/sales_order/sales_order.js",
	"Contract" : "axis_inspection/doctype/contract/contract.js",
	"Quotation" : "axis_inspection/doctype/quotation/quotation.js",
	"Timesheet" : "axis_inspection/doctype/timesheet/timesheet.js",
	"Training Event" : "axis_inspection/doctype/training_event/training_event.js",
	"Vehicle" : "axis_inspection/doctype/vehicle/vehicle.js",
	"Task" : "axis_inspection/doctype/task/task.js",
	"Sales Invoice" : "axis_inspection/doctype/sales_invoice/sales_invoice.js",
	"Purchase Order" : "axis_inspection/doctype/purchase_order/purchase_order.js",
	"Employee" : "axis_inspection/doctype/employee/employee.js"
}
scheduler_events = {
	"daily":  ["axis_inspection.axis_inspection.doctype.document_set.document_set.validate_expiry_date"
	],
 	"hourly": ["axis_inspection.axis_inspection.api.get_applicant_list"
 	]
}

override_doctype_dashboards = {
	"Employee": ["axis_inspection.axis_inspection.doctype.employee.employee_dashboard.get_dashboard_data"],
	"Contract": ["axis_inspection.axis_inspection.doctype.contract.contract_dashboard.get_dashboard_data"]
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

