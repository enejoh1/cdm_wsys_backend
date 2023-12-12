Ext.define('Msys.store.OrderCompStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	
        });
    },
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/stock.do?method=readWearingWait'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	},
    listeners: {
		
    }
});
