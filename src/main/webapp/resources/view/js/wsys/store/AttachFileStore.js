Ext.define('Msys.store.AttachFileStore', {
    extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	fileobject_uid: params.fileobject_uid
        });

    },
	/*fields:[
		{ name: 'id', 			  type: "int" 	 },
	    { name: 'unique_id', 	  type: "string" },
		{ name: 'fileobject_uid', type: "string" },
		{ name: 'file_name', 	  type: "string" },
		{ name: 'file_ext', 	  type: "string" },
		{ name: 'file_size', 	  type: "long"   },
		{ name: 'file_path', 	  type: "string" },
		{ name: 'protect_yn', 	  type: "string" },
		{ name: 'remark', 		  type: "string" }
	],*/
	proxy: {
		type: 'ajax',
		url: CONTEXT_PATH + '/fileAttach.do?method=readAtcMan',
		reader: {
			type:'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		},
		autoLoad: true
	},
	fileobject_uid:null,
	listeners: {
		load: function(store, records, successful,operation, options) {
			
		},
		beforeload: function(){
			if(this.fileobject_uid!=null) {
				this.getProxy().setExtraParam('fileobject_uid', this.fileobject_uid);
			}
		}
	}
});