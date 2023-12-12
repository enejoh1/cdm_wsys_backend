Ext.define('Msys.store.AprvTmpNameStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	aprvman_uid: params.aprvman_uid
        });
    },
    // fields: [
		
	// ],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/aprv.do?method=readAprvTmpName'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	},
	listeners: {
		beforeload: function(){
			if(this.code_group!=null) {
				this.getProxy().setExtraParam('aprvman_uid', this.aprvman_uid);
			}
		}
	}
});
