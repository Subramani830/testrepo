// Copyright (c) 2020, veena and contributors
// For license information, please see license.txt
frappe.ui.form.on('Asset Movement',{
    refresh:function(frm,cdt,cdn){
        frm.fields_dict['assets'].grid.get_field('task').get_query = function() {
                                return {
                                    filters: {
                                       status:["!=","Completed"] 
                                    }
                                };
                            };
    }
});
frappe.ui.form.on('Asset Movement Item', {
task:function(frm,cdt,cdn){
    var employee=[]
    $.each(frm.doc.assets, function(idx, item){
        if(frm.doc.purpose === 'Issue'){
            frappe.call({
                    method:"axis_inspection.axis_inspection.api.get_employee",
                    async:false,
                    args: {
                        "task":item.task
                    },
                    callback: function(r){
                        for(var i=0; i<r.message.length; i++){
                            employee.push(r.message[i]);
                        }
                        frm.fields_dict['assets'].grid.get_field('to_employee').get_query = function() {
                            return {
                                filters: {
                                    name:["in",employee] 
                                }
                            };
                        };
                    }
            });
        }
    });
    
    
}
    
});
