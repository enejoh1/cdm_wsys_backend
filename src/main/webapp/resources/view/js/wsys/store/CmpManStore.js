Ext.define('Msys.store.CmpManStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
		
    },
	pageSize: 300,
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/prch.do?method=readSaveItems'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	}
});
