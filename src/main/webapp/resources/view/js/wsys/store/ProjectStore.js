Ext.define('Msys.store.ProjectStore', {
	extend : 'Ext.data.Store',
    // fields: [
		
	// ],
	pageSize:300,
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/sales.do?method=read'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	}
});
