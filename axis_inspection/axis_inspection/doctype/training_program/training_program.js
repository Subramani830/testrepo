/*frappe.ui.form.on('Training Program', {
	start_date(frm) {

		if((frm.doc.training_frequency!=undefined || frm.doc.training_frequency!=null) && frm.doc.start_date!=undefined){
		    if(frm.doc.training_frequency=="Every Day"){
		        var enddate1;
		        enddate1= frappe.datetime.add_days(frm.doc.start_date, 1);
		        frm.set_value('end_date',enddate1);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Weekly"){
		        var enddate7;
		        enddate7= frappe.datetime.add_days(frm.doc.start_date, 7);
		        frm.set_value('end_date',enddate7);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Monthly"){
		        var end;
		        end= frappe.datetime.add_months(frm.doc.start_date, 1);
		        frm.set_value('end_date',end);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Bi Monthly"){
		        var enddate2;
		        enddate2= frappe.datetime.add_months(frm.doc.start_date, 2);
		        frm.set_value('end_date',enddate2);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Quarterly"){
		        var enddate3;
		        enddate3= frappe.datetime.add_months(frm.doc.start_date, 3);
		        frm.set_value('end_date',enddate3);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Half Annually"){
		        var enddate6;
		        var start6=frappe.datetime.year_start(frm.doc.start_date)
		        enddate6= frappe.datetime.add_months(start6, 6);
		        frm.set_value('end_date',enddate6);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Annually"){
		        var enddate;
		        var start=frappe.datetime.year_start(frm.doc.start_date);
		        enddate= frappe.datetime.year_end(start);
		        frm.set_value('end_date',enddate);
		        cur_frm.refresh_field('end_date');
		    }
		}
	},
	training_frequency(frm) {

		if((frm.doc.training_frequency!=undefined || frm.doc.training_frequency!=null) && frm.doc.start_date!=undefined){
		    if(frm.doc.training_frequency=="Every Day"){
		        var enddate1;
		        enddate1= frappe.datetime.add_days(frm.doc.start_date, 1);
		        frm.set_value('end_date',enddate1);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Weekly"){
		        var enddate7;
		        enddate7= frappe.datetime.add_days(frm.doc.start_date, 7);
		        frm.set_value('end_date',enddate7);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Monthly"){
		        var end;
		        end= frappe.datetime.add_months(frm.doc.start_date, 1);
		        frm.set_value('end_date',end);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Bi Monthly"){
		        var enddate2;
		        enddate2= frappe.datetime.add_months(frm.doc.start_date, 2);
		        frm.set_value('end_date',enddate2);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Quarterly"){
		        var enddate3;
		        enddate3= frappe.datetime.add_months(frm.doc.start_date, 3);
		        frm.set_value('end_date',enddate3);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Half Annually"){
		        var enddate6;
		        var start6=frappe.datetime.year_start(frm.doc.start_date)
		        enddate6= frappe.datetime.add_months(start6, 6);
		        frm.set_value('end_date',enddate6);
		        cur_frm.refresh_field('end_date');
		    }
		    else if(frm.doc.training_frequency=="Annually"){
		        var enddate;
		        var start=frappe.datetime.year_start(frm.doc.start_date);
		        enddate= frappe.datetime.year_end(start);
		        frm.set_value('end_date',enddate);
		        cur_frm.refresh_field('end_date');
		    }
		}
	}
})*/
