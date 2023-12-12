Ext.define('Msys.store.EstSubStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	//account_type: params.account_type
        });
    },
	pageSize: 300,
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/sales.do?method=readEstSub'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	},
	listeners: {
		load: function(store, records, successful,operation, options) {

        },
		beforeload: function(){
			/*if(this.account_type_list!=null) {
				this.getProxy().setExtraParam('account_type_list', this.account_type_list);
			}*/
		}
	}
});
