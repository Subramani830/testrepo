frappe.ui.form.on('Delivery Note', {
    before_save:  function(frm) {
        $.each(frm.doc.items,function(idx,item){
        if(item.against_sales_order!=undefined){
            frappe.db.get_value("Sales Order",{"name":item.against_sales_order},"delivery_date",(r)=>{
                if(r.delivery_date<=frappe.datetime.nowdate()){
                    frappe.validated=false;
                    frappe.msgprint(__("Sales Order "+item.against_sales_order+" has been expired."));    
                }
            });
        }
        }); 
    },
    refresh:function(frm,cdt,cdn){
        timesheet_filter(frm, cdt, cdn)
    },
    onload:function(frm,cdt,cdn){
        timesheet_filter(frm, cdt, cdn)
    }

}); 

function timesheet_filter(frm, cdt, cdn){
	frappe.call({
		method: 'axis_inspection.axis_inspection.doctype.delivery_note.delivery_note.get_timesheets',
		callback: function(response){
            if(response.message){
                var timesheet_list=[];
                for(var i=0; i<response.message.length; i++){
                    timesheet_list.push(response.message[i].name)
                }
                timesheet_list.push('')
                frm.set_query("time_sheet", "time_sheets", function(doc, cdt, cdn) {
                    return {
                        filters: {
                            time_sheet: ['not in',comp_list]
                        }
                    };
                });
            }
		}
	})
}