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
                            $.each(frm.doc.assets, function(idx, item){
                                frm.fields_dict['assets'].grid.get_field('quality_inspection').get_query = function() {
                                    return {
                                        filters: {
                                        reference_name:frm.doc.name,
                                        reference_type:cdt,
                                        status:"Accepted",
                                        item_code:item.item_code
                                        }
                                    };
                                };
                            });
                    
    },
    before_submit:function(frm,cdt,cdn){
        $.each(frm.doc.assets, function(idx, item){
            if(item.quality_inspection==undefined){
                frappe.throw(__('Quality Inspection is required for Item '+item.item_code+' to submit.'))
            }
        });
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
},
	asset:function(frm,cdt,cdn){
		var row = locals[cdt][cdn];
		frappe.db.get_value("Asset",{"name":row.asset}, "asset_barcode",(c)=>{
		row.asset_barcode=c.asset_barcode
		})
		cur_frm.refresh_field("assets")
	}  
});
