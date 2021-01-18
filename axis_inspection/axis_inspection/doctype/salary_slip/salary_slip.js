frappe.ui.form.on("Salary Slip", {
    validate: function(frm) {
        if(frm.doc.employee!=undefined){
            var month_val=get_month_name(frm.doc.start_date);
            var year=get_year(frm.doc.start_date);
            var month=month_val+1;
            var name=[]
            frappe.call({
                method:"axis_inspection.axis_inspection.api.update_clearance_process",
                async:false,
                args:{
                    doctype:'Clearance Process',
                    employee:frm.doc.employee,
                    month:month,
                    year:year
                },
                callback:function(r){
                    for (var i=0;i<r.message.length;i++){
                        name.push(r.message[i]);
                        frm.set_value("clearance_process",r.message[i])
                    }
                }
            });
            frm.set_query( "clearance_process", function(frm, cdt, cdn) {
                return {
                    filters: {
                        "name":["in",name] 
                    }
                };
            })
        }
    },
before_submit:function(frm){
    if(frm.doc.status==="Draft"){
        frm.set_df_property("clearance_process", "reqd", 1);
    }
    
},
after_save:function(frm){
    console.log('ddd')
    frappe.call({
        method:"axis_inspection.axis_inspection.api.update_actual_paid",
        async:false,
        args:{
          doctype:'Deduction Calculation',
            employee:frm.doc.employee,
            start_date:frm.doc.start_date,
            actual_paid:frm.doc.employee_deduction
        },
       callback:function(r){
            console.log(r)
            frappe.call({
                "method": "frappe.client.set_value",
                "async":false,
                "args": {
                "doctype": "Deduction Calculation",
                "name": r.message,
                "fieldname": "actual_paid",
                "value":frm.doc.employee_deduction
                }
            });
        }
    });
   // location.reload()
},
employee_deduction:function(frm){
    update_total_deduction(frm)
}
});


function get_month_name(start_date){
    var date=new Date(start_date)
    return date.getMonth()
}
function get_year(start_date){
    var date=new Date(start_date)
    return date.getFullYear()
}

function update_total_deduction(frm){
   var total_deduction=frm.doc.employee_deduction
    $.each(frm.doc.deductions,function(idx,deduction){
        total_deduction+=deduction.amount
    });
  var net_pay=flt(frm.doc.gross_pay) - (flt(total_deduction) + flt(frm.doc.total_loan_repayment))
  frm.doc.rounded_total=Math.round(net_pay)
    frm.set_value('total_deduction',total_deduction)
    frm.set_value('net_pay',net_pay)
    frm.set_value('rounded_total',frm.doc.rounded_total)
    frm.refresh_fields();
    
}