Ext.define('Msys.store.OrderDetailStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	
        });
    },
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/prch.do?method=readOrderDetail'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success',
			keepRawData: true
		}
	},
    listeners: {
		
    }
});
