from __future__ import unicode_literals
import frappe
from frappe.frappeclient import FrappeClient
from frappe.model.document import Document
from frappe import _
import math
import datetime
from datetime import timedelta
from frappe.utils import cint


class Attendance(Document):
    pass
def validate(self,document):
    calculate_late_entry_early_entry(self)

def calculate_late_entry_early_entry(self):
    if self.in_time!=None and self.out_time!=None:
        date = datetime.date(1, 1, 1)
        late_entry=0
        early_exit=0
        if  self.late_entry==1:   
            in_time=self.in_time.time()   
            shift_time, late_entry_grace_period=frappe.db.get_value('Shift Type',{'name':self.shift},['start_time','late_entry_grace_period'])
            shift_start_time= shift_time+timedelta(minutes=cint(late_entry_grace_period))
            start_time= (datetime.datetime.min + shift_start_time).time()
            shift_time = datetime.datetime.combine(date,start_time)
            checkin_time = datetime.datetime.combine(date,in_time)
            time_difference = checkin_time - shift_time
            late_entry=time_difference
            late_time=(datetime.datetime.min + time_difference).time()
            self.late_entry_duration=late_time
        else:
            time1=datetime.time(0,0,0)
            self.late_entry_duration=time1
            late_entry=datetime.timedelta(0,0)

        if self.early_exit==1:
            date = datetime.date(1, 1, 1)
            out_time=self.out_time.time()   
            shift_time,early_exit_grace_period=frappe.db.get_value('Shift Type',{'name':self.shift},['end_time','early_exit_grace_period'])
            shift_end_time= shift_time-timedelta(minutes=cint(early_exit_grace_period))
            end_time= (datetime.datetime.min + shift_end_time).time()
            shift_time = datetime.datetime.combine(date,end_time)
            checkout_time = datetime.datetime.combine(date,out_time)
            time_difference = shift_time-checkout_time
            early_exit=time_difference
            late_time=(datetime.datetime.min + time_difference).time()
            self.early_exit_duration=late_time
        else:
            time1=datetime.time(0,0,0)
            self.early_exit_duration=time1
            early_exit=datetime.timedelta(0,0)

        total_duration=late_entry+early_exit
        self.total_delay_duration=(datetime.datetime.min + total_duration).time()
    
    else:
        time1=datetime.time(0,0,0)
        self.late_entry_duration=0
        self.early_exit_duration=0
        self.total_delay_duration=0