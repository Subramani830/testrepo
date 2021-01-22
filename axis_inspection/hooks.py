# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import frappe
from frappe import _
from frappe.model.mapper import get_mapped_doc
from . import __version__ as app_version
from erpnext.hr.doctype.employee_onboarding.employee_onboarding import EmployeeOnboarding
from erpnext.payroll.doctype.payroll_entry.payroll_entry import PayrollEntry

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
		"Address-po_box",
		"Contact-contact_of_procurement__team_and_email_id",
		"Contact-contact_of_accounts_team_and_email_id",
		"Opportunity-send_rci_email",
		"Opportunity-price_list",
		"Contract-maximum_value",
		"Contract-amt_left",
		"Contract-percentage_amt_left",
		"Sales Order-amt_billed_perc",
		"Sales Order-amount_left",
		"Job Applicant-age",
		"Job Applicant-nationality",
		"Job Applicant-employee_id",
		"Employee-contract_date_end",
		"Employee-bank_names",
		"Employee-personal_bank_name1",
		"Employee-insurance_class",
		"Employee-hospital_network",
		"Leave Encashment-department_manager",
		"Supplier-supplier_name_in_arabic",
		"Material Request Item-task",
		"Request for Quotation Item-task",
		"Supplier Quotation Item-task",
		"Purchase Order Item-task",
		"Purchase Receipt Item-task",
		"Purchase Invoice Item-task",
		"Employee-border_number",
		"Contract-duration",
		"Employee-reports_to_name",
		"Contract-leave_policy",
		"Contract-holiday_list",
		"Contract-shift_type",
		"Employee-nationality",
		"Employee-reports_to_id",
		"Employee-visa_type",
		"Employee-visa_number",
		"Employee-visa_expiry_date",
		"Employee-driving_license_type",
		"Employee-driving_license_number",
		"Employee-driving_license_expiry",
		"Employee-column_break_73",
		"Employee-health_insurance_expiry",
		"Leave Application-department_manager",
		"Expense Claim-department_manager",
		"Employee Advance-department_manager",
		"Shift Request-department_manager",
		"Appraisal-department_manager",
		"Job Offer-is_existing_employee",
		"Quotation-quotation_reference",
		"Sales Order-sales_order_reference",
		"Supplier Quotation-contract",
		"Job Offer-offer_confirmation_date",
		"Employee-job_offer_confirmation_date",
		"Employee-document_set",
		"Employee-contract",
		"Employee-probation_start_date",
		"Contract-contract_term",
		"Sales Order-purchase_order_attach",
		"Employee-contract_no",
		"Employee-offer_no",
		"Employee-application_date",
		"Employee-probation_duration",
		"Employee-employee_skill_map",
		"Employee-employment_status_",
		"Payroll Entry-payroll_cost_center",
		"Quotation-item_group",
		"Task-purchase_order",
		"Opportunity-customers_rfq",
		"Supplier Quotation-suppliers_quotation",
		"Payment Entry-proof_of_payment",
		"Quotation-contract_remaining_value",
		"Opportunity-customer_rfq_number",
		"Quotation-customer_rfq_number",
		"Quotation-delivery_date",
		"Quotation-location",
		"Sales Order-date_percentage",
		"Purchase Invoice-purchase_invoice",
		"Quotation-item_group", 
		"Supplier Quotaion-item_group",
		"Request for Quotation-item_group",
		"Leave Application-clearance_process",
		"Request for Quotation Item-branch",
		"Request for Quotation Item-cost_center",
		"Supplier Quotation Item-branch",
		"Supplier Quotation Item-cost_center",
		"Purchase Invoice Item-branch",
		"Quotation-subject",
		"Quotation-phone",
		"Quotation-designation",
		"Payment Entry-task",
		"Material Request-department_manager",
		"Supplier Quotation-department_manager",
		"Contract-contract_reference",
		"Supplier Quotation Item-out_sourced",
		"Purchase Order-supplier_quotation",
		"Sales Order-custom_status",
		"Contract-naming_series",
		"Opportunity Item-out_sourced",
		"Contract-attach_job_offer",
		"Supplier-priority",
		"Customer-priority_",
		"Sales Invoice-month_of_work",
		"Training Event-trainer_type",
		"Salary Slip-clearance_process",
		"Asset Movement-project",
		"Job Offer-job_offer_attachment",
		"Timesheet-timesheet_type",
		"Timesheet-timesheet_attachment",
		"Contract-contract_terms_in_arabic",
		"Contract-contract_template_for_arabic",
		"Contract-contract_terms_",
		"Contract-contract_template_",
		"Salary Slip-employee_deduction",
		"Sales Order Item-cost_center",
		"Sales Order Item-branch",
		"Sales Order Item-project",
		"Delivery Note-branch",
		"Delivery Note-cost_center",
		"Quotation-sales_order"	
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
				"Lead-company-hidden",
				"Address-county-hidden",
				"Opportunity Item-item_name-columns",
				"Purchase Receipt-project-reqd",
				"Sales Taxes and Charges-cost_center-mandatory_depends_on",
				"Lead-company_name-reqd",
				"Lead-email_id-reqd",
				"Lead-salutation-reqd",
				"Lead-designation-reqd",
				"Lead-address_type-reqd",
				"Lead-address_title-reqd",
				"Lead-state-reqd",
				"Lead-country-reqd",
				"Lead-phone-reqd",
				"Lead-mobile_no-reqd",
				"Lead-address_line1-reqd",
				"Lead-city-reqd",
				"Material Request-set_warehouse-reqd",
				"Material Request-schedule_date-reqd",
				"Material Request Item-manufacture_details-hidden",
				"Material Request Item-bom_no-hidden",
				"Supplier-pan-hidden",
				"Supplier-tax_category-hidden",
				"Supplier-tax_withholding_category-hidden",
				"Supplier-is_internal_supplier-hidden",
				"Supplier-allow_purchase_invoice_creation_without_purchase_receipt-hidden",
				"Supplier-allow_purchase_invoice_creation_without_purchase_order-hidden",
				"Supplier-warn_rfqs-hidden",
				"Supplier-prevent_rfqs-hidden",
				"Supplier-warn_pos-hidden",
				"Supplier-prevent_pos-hidden",
				"Supplier Quotation Item-lead_time_days-hidden",
				"Supplier Quotation Item-item_tax_template-hidden",
				"Supplier Quotation-taxes_section-hidden",
				"Project-project_details-read_only_depends_on",
				"Project-company-read_only_depends_on",
				"Project-estimated_costing-read_only_depends_on",
				"Project-estimated_costing-read_only_depends_on",
				"Purchase Receipt-taxes_charges_section-hidden",
				"Purchase Receipt-is_subcontracted-hidden",
				"Purchase Receipt Item-item_tax_template-hidden",
				"Purchase Receipt Item-allow_zero_valuation_rate-hidden",
				"Purchase Receipt Item-bom-hidden",
				"Purchase Receipt Item-bom-hidden",
				"Purchase Receipt Item-from_warehouse-hidden",
				"Purchase Receipt-transporter_info-hidden",
				"Purchase Receipt-printing_settings-hidden",
				"Purchase Invoice-bill_no-reqd",
				"Purchase Invoice-bill_date-reqd",
				"Purchase Invoice-apply_tds-hidden",
				"Purchase Invoice-is_subcontracted-hidden",
				"Purchase Invoice Item-manufacture_details-hidden",
				"Purchase Receipt Item-manufacture_details-hidden",
				"Purchase Invoice Item-allow_zero_valuation_rate-hidden",
				"Purchase Invoice Item-bom-hidden",
				"Job Applicant-resume_attachment-mandatory_depends_on",
				"Employee-last_name-reqd",
				"Employee-salutation-reqd",
				"Employee-employment_type-reqd",
				"Employee-final_confirmation_date-reqd",
				"Employee-notice_number_of_days-reqd",
				"Employee-notice_number_of_days-default",
				"Employee-date_of_retirement-hidden",
				"Employee-department-reqd",
				"Employee-designation-reqd",
				"Employee-reports_to-reqd",
				"Employee-grade-hidden",
				"Employee-branch-reqd",
				"Employee-expense_approver-reqd",
				"Employee-leave_approver-reqd",
				"Employee-shift_request_approver-hidden",
				"Employee-leave_policy-reqd",
				"Employee-holiday_list-reqd",
				"Employee-default_shift-reqd",
				"Employee-bank_ac_no-mandatory_depends_on",
				"Employee-salary_mode-options",
				"Employee-payroll_cost_center-reqd",
				"Employee-health_insurance_provider-reqd",
				"Employee-cell_number-reqd",
				"Employee-personal_email-reqd",
				"Employee-permanent_address-reqd",
				"Employee-prefered_contact_email-reqd",
				"Employee-current_address-reqd",
				"Employee-valid_upto-reqd",
				"Employee-marital_status-reqd",
				"Employee Advance-repay_unclaimed_amount_from_salary-hidden",
				"Purchase Order Item-manufacture_details-hidden",
				"Purchase Order Item-bom-hidden",
				"Purchase Order Item-item_tax_template-hidden",
				"Supplier Quotation Item-project-reqd",
				"Payroll Entry-payroll_frequency-default",
				"Payroll Entry-payroll_frequency-options",
				"Timesheet Detail-task-in_list_view",
				"Timesheet Detail-task-reqd",
				"Timesheet Detail-project-read_only",
				"Project-estimated_costing-depends_on",
				"Project-total_sales_amount-depends_on",
				"Project-total_billable_amount-depends_on",
				"Project-total_billed_amount-depends_on",
				"Project-total_consumed_material_cost-depends_on",
				"Project-total_costing_amount-depends_on",
				"Project-total_expense_claim-depends_on",
				"Project-total_purchase_cost-depends_on",
				"Company-sales_settings-depends_on",
				"Contract-party_user-label",
				"Contract-sb_fulfilment-hidden",
				"Contract-document_type-mandatory_depends_on",
				"Contract-document_name-mandatory_depends_on",
				"Employee-final_confirmation_date-label",
				"Employee-personal_email-mandatory_depends_on",
				"Employee-company_email-mandatory_depends_on",
				"Employee Advance-mode_of_payment-depends_on",
				"Employee Advance-repay_unclaimed_amount_from_salary-hidden",
				"Task-project-reqd",
				"Employee-health_insurance_no-mandatory_depends_on",
				"Contract-party_user-hidden",
				"Job Offer-applicant_name-depends_on",
				"Job Offer-job_applicant-depends_on",
				"Job Offer-applicant_email-depends_on",
				"Job Offer-job_applicant-mandatory_depends_on",
				"Job Offer-applicant_name-mandatory_depends_on",
				"Sales Order-order_type-options",
				"Employee-contract_end_date-read_only",
				"Quotation-order_type-options",
				"Employee-scheduled_confirmation_date-read_only",
				"Employee-contract_end_date-read_only",
				"Project-sales_order-mandatory_depends_on",
				"Timesheet Detail-billing_hours-permlevel",
				"Timesheet Detail-billing_rate-permlevel",
				"Timesheet Detail-billing_amount-permlevel",
				"Contract-contract_template-hidden",
				"Quotation Item-item_name-in_list_view",
				"Sales Order Item-item_name-in_list_view",
				"Sales Invoice Item-item_name-in_list_view",
				"Material Request Item-item_name-in_list_view",
				"Supplier Quotation Item-item_name-in_list_view",
				"Request for Quotation Item-item_name-in_list_view",
				"Purchase Order Item-item_name-in_list_view",
				"Purchase Invoice Item-item_name-in_list_view",
				"Clearance Process-purpose_of_clearance_process-options",
				"Timesheet Detail-costing_rate-permlevel",
				"Timesheet Detail-costing_amount-permlevel",
				"Employee-passport_number-reqd",
				"Supplier Quotation Item-project-mandatory_depends_on",
				"Material Request Item-uom-width",
				"Material Request Item-uom-print_width",
				"Material Request Item-item_code-columns",
				"Material Request Item-warehouse-columns",
				"Purchase Invoice Item-uom-in_list_view",
				"Purchase Invoice Item-rate-columns",
				"Purchase Invoice Item-item_code-columns",
				"Purchase Invoice Item-uom-columns",
				"Quotation Item-item_code-columns",
				"Quotation Item-uom-in_list_view",
				"Quotation Item-uom-columns",
				"Sales Order Item-uom-in_list_view",
				"Sales Order Item-item_code-columns",
				"Sales Order Item-uom-columns",
				"Sales Invoice Item-item_code-columns",
				"Sales Invoice Item-uom-in_list_view",
				"Sales Invoice Item-uom-columns",
				"Blanket Order Item-item_name-in_list_view",
				"Purchase Receipt Item-item_name-in_list_view",
				"Purchase Receipt Item-uom-in_list_view",
				"Purchase Receipt Item-item_code-columns",
				"Purchase Receipt Item-item_name-columns",
				"Purchase Receipt Item-uom-columns",
				"Purchase Receipt Item-rate-columns",
				"Opportunity Item-item_name-columns",
				"Project-cost_center-mandatory_depends_on"
			]
	]
	]
},
{"dt": "Print Format",
        "filters": [
	[
		"name","in",
 			[
			"Axis Job Offer Print Format","Axis PO Print Format","Axis PI Print Format","Axis PR Print Format","Axis SO Print Format","Axis SI Print Format","Axis DN Print Format","Axis Contract print Format","Company Contact Information Update","Universal Quotation"

]
	]
]
},
{"dt": "Role", 
		"filters":[
        [
        "name","in",["CEO", "President","General Manager","Deputy General Manager","Transportation Manager","Payroll User"]
	]
	]
},

{"dt": "Address Template",
        "filters": [
	[
		"name","in",
 			[
			"India","Saudi Arabia"

]
	]
]
},
{"dt": "Report",
		"filters": [
         [
             "name", "in", [
		"Employee CTC"
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
	"Leave Encashment" : "axis_inspection/doctype/leave_encashment/leave_encashment.js",
	"Request for Quotation" : "axis_inspection/doctype/request_for_quotation/request_for_quotation.js",
	"Purchase Receipt" : "axis_inspection/doctype/purchase_receipt/purchase_receipt.js",
	"Purchase Invoice" : "axis_inspection/doctype/purchase_invoice/purchase_invoice.js",
	"Leave Application" : "axis_inspection/doctype/leave_application/leave_application.js",
	"Expense Claim" : "axis_inspection/doctype/expense_claim/expense_claim.js",
	"Employee Advance" : "axis_inspection/doctype/employee_advance/employee_advance.js",
	"Shift Request" : "axis_inspection/doctype/shift_request/shift_request.js",
	"Appraisal" : "axis_inspection/doctype/appraisal/appraisal.js",
	"Employee Skill Map" : "axis_inspection/doctype/employee_skill_map/employee_skill_map.js",
	"Project" : "axis_inspection/doctype/project/project.js",
	"Payment Entry" : "axis_inspection/doctype/payment_entry/payment_entry.js",
	"Skill" : "axis_inspection/doctype/skill/skill.js",
	"Salary Slip" : "axis_inspection/doctype/salary_slip/salary_slip.js"
}
scheduler_events = {
	"daily":  [
		"axis_inspection.axis_inspection.doctype.document_set.document_set.validate_expiry_date",
		"axis_inspection.axis_inspection.doctype.sales_order.sales_order.get_delivery_date_list"
	],
 	"hourly": [
		"axis_inspection.axis_inspection.api.get_applicant_list"
	],
	"weekly": [
		"axis_inspection.axis_inspection.doctype.sales_invoice.sales_invoice.validate_due_date"
 	 ]
}

override_doctype_dashboards = {
	"Employee": ["axis_inspection.axis_inspection.doctype.employee.employee_dashboard.get_dashboard_data"],
	"Contract": ["axis_inspection.axis_inspection.doctype.contract.contract_dashboard.get_dashboard_data"],
	"Supplier Quotation":["axis_inspection.axis_inspection.doctype.supplier_quotation.supplier_quotation_dashboard.get_dashboard_data"],
	"Sales Order": ["axis_inspection.axis_inspection.doctype.sales_order.sales_order_dashboard.get_dashboard_data"],
	"Material Request":["axis_inspection.axis_inspection.doctype.material_request.material_request_dashboard.get_dashboard_data"],
	"Company":["axis_inspection.axis_inspection.doctype.company.company_dashboard.get_dashboard_data"]
}

doc_events = {
    	"Asset Movement": {
		"on_submit": ["axis_inspection.axis_inspection.doctype.asset_movement.asset_movement.update_asset_details"],
		"on_cancel": ["axis_inspection.axis_inspection.doctype.asset_movement.asset_movement.delete_asset_details"]
    },
	"Contract":{
		"autoname": ["axis_inspection.axis_inspection.doctype.contract.contract.autoname"]
	},
	"Salary Slip":{
		"validate":["axis_inspection.axis_inspection.doctype.salary_slip.salary_slip.update_salary_slip"],
		"on_submit":["axis_inspection.axis_inspection.doctype.salary_slip.salary_slip.update_actual_paid"],
		"on_cancel":["axis_inspection.axis_inspection.doctype.salary_slip.salary_slip.remove_actual_paid"]
	}
}


def validate_duplicate_employee_onboarding(self):
	pass

def get_filter_condition(self):
	self.check_mandatory()
	cond = ''
	for f in ['company', 'branch', 'department', 'designation', 'payroll_cost_center']:
		if self.get(f):
			cond += " and t1." + f + " = " + frappe.db.escape(self.get(f))
	return cond

def fill_employee_details(self):
		self.set('employees', [])
		employees = self.get_emp_list()
		if not employees:
			error_msg = _("No employees found for the mentioned criteria:<br>Company: {0}<br> Currency: {1}<br>Payroll Payable Account: {2}").format(
				frappe.bold(self.company), frappe.bold(self.currency), frappe.bold(self.payroll_payable_account))
			if self.branch:
				error_msg += "<br>" + _("Branch: {0}").format(frappe.bold(self.branch))
			if self.department:
				error_msg += "<br>" + _("Department: {0}").format(frappe.bold(self.department))
			if self.designation:
				error_msg += "<br>" + _("Designation: {0}").format(frappe.bold(self.designation))
			if self.start_date:
				error_msg += "<br>" + _("Start date: {0}").format(frappe.bold(self.start_date))
			if self.end_date:
				error_msg += "<br>" + _("End date: {0}").format(frappe.bold(self.end_date))
			if self.payroll_cost_center:
				error_msg += "<br>" + _("Payroll Cost Center: {0}").format(frappe.bold(self.payroll_cost_center))
			frappe.throw(error_msg, title=_("No employees found"))

		for d in employees:
			self.append('employees', d)

		self.number_of_employees = len(employees)
		if self.validate_attendance:
			return self.validate_employee_attendance()

PayrollEntry.get_filter_condition=get_filter_condition
PayrollEntry.fill_employee_details=fill_employee_details
EmployeeOnboarding.validate_duplicate_employee_onboarding = validate_duplicate_employee_onboarding



app_include_js = "/assets/js/axis_inspection.min.js"
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

