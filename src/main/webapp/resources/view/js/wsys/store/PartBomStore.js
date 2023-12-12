Ext.define('Msys.store.PartBomStore', {
	extend : 'Ext.data.Store',
	pageSize:300,
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/produce.do?method=readMtrlForProduce'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	}
});
