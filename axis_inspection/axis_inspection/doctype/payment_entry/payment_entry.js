frappe.ui.form.on('Payment Entry', {
    refresh:function(frm){
	console.log("refresh")
        $.each(frm.doc.references,function(idx, item){
            if(item.reference_doctype=="Purchase Invoice"){
                frappe.call({
                    method:"axis_inspection.axis_inspection.api.update_project",
                    async:false,
                    args:{
                        doctype:'Purchase Invoice Item',
                        name:item.reference_name,
                        parenttype:'Purchase Invoice'
                    },
                    callback:function(r){
			var project;
			var task;
			var branch;
			var cost_center;
			for(var i=0;i<r.message.length;i++){
				if(r.message[i].project){project=r.message[i].project}
				if(r.message[i].task){task=r.message[i].task}
				if(r.message[i].cost_center){cost_center=r.message[i].cost_center}
				if(r.message[i].branch){branch=r.message[i].branch}
			console.log(r.message[i].project)
			
                        //frappe.model.set_value(item.doctype, item.name, "project_name", r.message[i].project);
                        //frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
			//frappe.model.set_value(item.doctype, item.name, "cost_center"r.message[i].task);
                        //frappe.model.set_value(item.doctype, item.name, "branch", r.message[i].branch);
                    }
                        if(frm.doc.cost_center){}
			else{console.log("modifying");
			frm.set_value("cost_center",cost_center)}
			if(frm.doc.project){}
			else{frm.set_value("project",project)}
			if(frm.doc.branch){}
			else{frm.set_value("branch",branch)}
			if(frm.doc.task){}
			else{frm.set_value("task",task)}
                    }
                });
            }
	else if(item.reference_doctype=="Purchase Order"){
                frappe.call({
                    method:"axis_inspection.axis_inspection.api.update_project",
                    async:false,
                    args:{
                        doctype:'Purchase Order Item',
                        name:item.reference_name,
                        parenttype:'Purchase Order'
                    },
                    callback:function(r){
			var project;
			var task;
			var branch;
			var cost_center;
			for(var i=0;i<r.message.length;i++){
				if(r.message[i].project){project=r.message[i].project}
				if(r.message[i].task){task=r.message[i].task}
				if(r.message[i].cost_center){cost_center=r.message[i].cost_center}
				if(r.message[i].branch){branch=r.message[i].branch}
			console.log(r.message[i].project)
			
                        //frappe.model.set_value(item.doctype, item.name, "project_name", r.message[i].project);
                        //frappe.model.set_value(item.doctype, item.name, "task", r.message[i].task);
			//frappe.model.set_value(item.doctype, item.name, "cost_center"r.message[i].task);
                        //frappe.model.set_value(item.doctype, item.name, "branch", r.message[i].branch);
                    }
                        if(frm.doc.cost_center){}
			else{console.log("modifying");
			frm.set_value("cost_center",cost_center)}
			if(frm.doc.project){}
			else{frm.set_value("project",project)}
			if(frm.doc.branch){}
			else{frm.set_value("branch",branch)}
			if(frm.doc.task){}
			else{frm.set_value("task",task)}
                    }
                });
            }
	else if(item.reference_doctype=="Sales Invoice"){
                frappe.call({
                    method:"axis_inspection.axis_inspection.api.update_project1",
                    async:false,
                    args:{
                        doctype:'Sales Invoice',
                        name:item.reference_name
                    },
                    callback:function(r){
			var project;
			var task;
			var branch;
			var cost_center;
			for(var i=0;i<r.message.length;i++){
				if(r.message[i].project){project=r.message[i].project}
				if(r.message[i].cost_center){cost_center=r.message[i].cost_center}
				if(r.message[i].branch){branch=r.message[i].branch}
                    }
                        if(frm.doc.cost_center){}
			else{console.log("modifying");
			frm.set_value("cost_center",cost_center)}
			if(frm.doc.project){}
			else{frm.set_value("project",project)}
			if(frm.doc.branch){}
			else{frm.set_value("branch",branch)}
                    }
                });
            }
else if(item.reference_doctype=="Sales Order"){
                frappe.call({
                    method:"axis_inspection.axis_inspection.api.update_project2",
                    async:false,
                    args:{
                        doctype:'Sales Order Item',
                        name:item.reference_name,
                        parenttype:'Sales Order'
                    },
                    callback:function(r){
			var project;
			var task;
			var branch;
			var cost_center;
			for(var i=0;i<r.message.length;i++){
				if(r.message[i].project){project=r.message[i].project}
				if(r.message[i].task){task=r.message[i].task}
				if(r.message[i].cost_center){cost_center=r.message[i].cost_center}
				if(r.message[i].branch){branch=r.message[i].branch}
                    }
                        if(frm.doc.cost_center){}
			else{console.log("modifying");
			frm.set_value("cost_center",cost_center)}
			if(frm.doc.project){}
			else{frm.set_value("project",project)}
			if(frm.doc.branch){}
			else{frm.set_value("branch",branch)}
                    }
                });
            }
        });
    },
before_save:  function(frm) {
console.log('r')
    $.each(frm.doc.references,function(idx,item){
        frappe.db.get_value("Sales Order",{"name":item.reference_name},"delivery_date",(r)=>{
            if(r.delivery_date<=frappe.datetime.nowdate()){
                frappe.validated=false;
                frappe.msgprint(__("Sales Order "+item.reference_name+" has been expired."));    
            }
        });
    }); 
}
});
