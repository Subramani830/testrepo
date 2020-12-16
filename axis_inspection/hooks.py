# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.mapper import get_mapped_doc
from . import __version__ as app_version
from erpnext.hr.doctype.employee_onboarding.employee_onboarding import EmployeeOnboarding

app_name = "axis_inspection"
app_title = "Axis Inspection"
app_publisher = "veena"
app_description = "Axis Inspection"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "veena.h@promantia.com"
app_license = "MIT"

fixtures = ["Desk Page","Workflow","Workflow State","Workflow Action Master","Letter Head",
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
		"Quotation-request_customer_information",
		"Training Event Employee-equipment",
		"Item-child_item",
		"Item-child_items",
		"Sales Invoice-ses_number",
		"Employee-old_employee_id",
		"Employee-id_expiry_date",
		"Job Applicant-phone_number",
		"Job Applicant-current_position",
		"Job Applicant-current_company",
		"Job Applicant-experiences",
		"Warehouse-employee_warehouse",
		"Item-inspection_required_before_stock_entry",
		"Purchase Order-vat_section",
		"Sales Order-vat_section",
		"Purchase Invoice-vat_section",
		"Sales Invoice-vat_section",
		"Purchase Receipt-vat_section",
		"Delivery Note-vat_section",
		"Material Request-requested_for",
		"Contract-contract_terms_and_conditions",
		"Purchase Receipt Item-branch",
		"Purchase Order Item-branch",
		"Delivery Note Item-branch",
		"Payment Entry-branch",
		"Journal Entry Account-branch",
		"Purchase Invoice-branch",
		"Sales Invoice-branch",
		"Stock Entry Detail-branch",
		"Material Request Item-branch",
		"Employee-sponsor",
		"Company-company_registration",
		"Purchase Invoice-ses_number",
		"Employee-personal_bank_name",
		"Employee-personal_bank_ac_no",
		"Asset-asset_barcode",
		"Asset Movement Item-asset_barcode",
		"Sales Order-quotation",
		"Customer-company_registration",
		"Customer-our_vendor_number",
		"Task-assign_",
		"Item-skills_details",
		"Item-skills",
		"Employee-nationality",
		"Employee-id_number",
		"Asset-skill_details",
		"Asset-skill",
		"Task-allocate",
		"Asset Movement Item-task",
		"Task-allocation",
		"Task-assign",
		"Task-email"

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
				"Training Event-trainer_email-options",
				"Sales Order-sec_warehouse-hidden",
				"Sales Order-set_warehouse-hidden",
				"Sales Order-taxes_section-hidden",
				"Sales Order-inter_company_order_reference-hidden",
				"Sales Order-sales_team_section_break-hidden",
				"Sales Order-section_break1-hidden",
				"Lead-type-options",
				"Sales Order-tax_id-hidden",
				"Sales Invoice-tax_id-hidden",
				"Delivery Note-tax_id-hidden",
				"Lead-status-options",
				"Sales Invoice-sales_team_section_break-hidden",
				"Sales Invoice-section_break2-hidden",
				"Customer-so_required-hidden",
				"Customer-dn_required-hidden",
				"Customer-is_internal_customer-hidden",
				"Lead-unsubscribed-hidden",
				"Lead-blog_subscriber-hidden",
				"Quotation-taxes_section-hidden",
				"Sales Order-subscription_section-hidden",
				"Purchase Order-subscription_section-hidden",
				"Purchase Invoice-subscription_section-hidden",
				"Sales Invoice-subscription_section-hidden",
				"Timesheet-allow_copy",
				"Purchase Order-inter_company_order_reference-hidden",
				"Purchase Order-taxes_section-hidden",
				"Sales Invoice-inter_company_invoice_reference-hidden",
				"Sales Invoice-shipping_rule-hidden",
				"Sales Invoice-tax_category-hidden",
				"Purchase Invoice-inter_company_invoice_reference-hidden",
				"Purchase Invoice-taxes_section-hidden",
				"Opportunity-first_response_time-hidden",
				"Purchase Order-is_subcontracted-hidden",
				"Sales Order-scan_barcode-hidden",
				"Purchase Order-scan_barcode-hidden",
				"Sales Invoice-scan_barcode-hidden",
				"Material Request-scan_barcode-hidden",
				"Stock Entry-scan_barcode-hidden",
				"Purchase Invoice-scan_barcode-hidden",
				"Job Opening-job_title-hidden",
				"Job Opening-job_title-default",
				"Purchase Order Item-cost_center-reqd",
				"Purchase Receipt Item-cost_center-reqd",
				"Delivery Note Item-cost_center-reqd",
				"Payment Entry-cost_center-reqd",
				"Journal Entry Account-cost_center-reqd",
				"Purchase Invoice-cost_center-reqd",
				"Sales Invoice-cost_center-reqd",
				"Stock Entry Detail-cost_center-reqd",
				"Material Request Item-cost_center-reqd",
				"Contract-document_type-options",
				"Customer-sales_team_section_break-hidden",
				"Customer-sales_team_section-hidden",
				"Employee-permanent_accommodation_type-hidden",
				"Employee-current_accommodation_type-hidden",
				"Item-item_tax_section_break-hidden",
				"Item-manufacturing-hidden",
				"Item-website_section-hidden",
				"Item-hub_publishing_sb-hidden",
				"Item Barcode-title_field",
				"Sales Order-customer-read_only_depends_on",
				"Sales Order-order_type-read_only_depends_on",
				"Sales Order-customer_address-read_only_depends_on",
				"Sales Order-contact_person-read_only_depends_on",
				"Sales Order-shipping_address_name-read_only_depends_on",
				"Sales Order-currency-read_only_depends_on",
				"Sales Order-selling_price_list-read_only_depends_on",
				"Sales Order-items-read_only_depends_on",
				"Sales Order-taxes_and_charges-read_only_depends_on",
				"Sales Order-taxes-read_only_depends_on",
				"Sales Order-tc_name-read_only_depends_on",
				"Sales Order-terms-read_only_depends_on",
				"Sales Order-territory-read_only_depends_on",
				"Sales Order-payment_terms_template-read_only_depends_on",
				"Sales Order-payment_schedule-read_only_depends_on",
				"Project-sales_order-reqd",
				"Sales Order-po_no-reqd",
				"Purchase Order Item-project-reqd",
				"Purchase Receipt Item-project-reqd",
				"Delivery Note Item-project-reqd",
				"Payment Entry-project-reqd",
				"Journal Entry Account-project-reqd",
				"Purchase Invoice-project-reqd",
				"Sales Invoice-project-reqd",
				"Stock Entry Detail-project-reqd",
				"Material Request Item-project-reqd",
				"Sales Taxes and Charges-cost_center-depends_on",
				"Lead-county-hidden",
				"Opportunity Item-uom-in_list_view",
				"Quotation-referral_sales_partner-hidden",
				"Loan Application-is_secured_loan-depends_on",
				"Delivery Note-project-reqd",
				"Delivery Note-sec_warehouse-hidden",
				"Delivery Note-taxes_section-hidden",
				"Delivery Note-campaign-hidden",
				"Delivery Note-source-hidden",
				"Delivery Note-is_internal_customer-hidden",
				"Delivery Note-inter_company_reference-hidden",
				"Delivery Note-per_billed-hidden",
				"Delivery Note-sales_team_section_break-hidden",
				"Delivery Note-section_break1-hidden",
				"Project-customer-fetch_from",
				"Stock Entry-project-reqd",
				"Lead-company-hidden"
			]
	]
	]
},
{"dt": "Print Format",
        "filters": [
	[
		"name","in",
 			[
			"Axis Job Offer Print Format","Axis PO Print Format","Axis PI Print Format","Axis PR Print Format","Axis SO Print Format","Axis SI Print Format","Axis DN Print Format","Axis Contract print Format"

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
	"Employee" : "axis_inspection/doctype/employee/employee.js",
	"Material Request" : "axis_inspection/doctype/material_request/material_request.js",
	"Supplier Quotation" : "axis_inspection/doctype/supplier_quotation/supplier_quotation.js",
	"Attendance" : "axis_inspection/doctype/attendance/attendance.js",
	"Stock Entry" : "axis_inspection/doctype/stock_entry/stock_entry.js",
	"Job Opening" : "axis_inspection/doctype/job_opening/job_opening.js",
	"Employee Promotion" : "axis_inspection/doctype/employee_promotion/employee_promotion.js",
	"Opportunity" : "axis_inspection/doctype/opportunity/opportunity.js",
	"Asset" : "axis_inspection/doctype/asset/asset.js",
	"Lead" :  "axis_inspection/doctype/lead/lead.js",
	"Asset Movement" : "axis_inspection/doctype/asset_movement/asset_movement.js",
	"Item" : "axis_inspection/doctype/item/item.js",
}
scheduler_events = {
	"daily":  ["axis_inspection.axis_inspection.doctype.document_set.document_set.validate_expiry_date"
	],
 	"hourly": ["axis_inspection.axis_inspection.api.get_applicant_list"
 	]
}

override_doctype_dashboards = {
	"Employee": ["axis_inspection.axis_inspection.doctype.employee.employee_dashboard.get_dashboard_data"],
	"Contract": ["axis_inspection.axis_inspection.doctype.contract.contract_dashboard.get_dashboard_data"],
	"Supplier Quotation": ["axis_inspection.axis_inspection.doctype.supplier_quotation.supplier_quotation_dashboard.get_dashboard_data"],
	"Sales Order": ["axis_inspection.axis_inspection.doctype.sales_order.sales_order_dashboard.get_dashboard_data"]
}

doc_events = {
    	"Asset Movement": {
		"on_submit": ["axis_inspection.axis_inspection.doctype.asset_movement.asset_movement.update_asset"]
    }
}


def validate_duplicate_employee_onboarding(self):
	pass

EmployeeOnboarding.validate_duplicate_employee_onboarding = validate_duplicate_employee_onboarding

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

