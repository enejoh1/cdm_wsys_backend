Ext.define('Msys.store.RecvPrdItemStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	// account_type_list: params.account_type_list,
        	// account_type: params.account_type
        });
    },
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/design.do?method=readRecvItems'
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
			// if(this.account_type_list!=null) {
			// 	this.getProxy().setExtraParam('account_type_list', this.account_type_list);
			// }
			// if(this.account_type!=null) {
			// 	this.getProxy().setExtraParam('account_type', this.account_type);
			// }
		}
	}
});
