frappe.ui.form.on("Salary Slip", {
    employee: function(frm) {
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