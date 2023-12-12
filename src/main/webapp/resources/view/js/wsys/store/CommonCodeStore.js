Ext.define('Msys.store.CommonCodeStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	code_group: params.code_group
        });
    },
    // fields: [
		
	// ],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/codes.do?method=read'
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
				this.getProxy().setExtraParam('code_group', this.code_group);
			}
		}
	}
});
