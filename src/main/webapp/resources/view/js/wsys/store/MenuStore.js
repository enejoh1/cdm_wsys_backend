Ext.define('Msys.store.MenuStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
			type: params.type,
			orderBy: params.orderBy
        });
    },
    // fields: [
		
	// ],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/master.do?method=readMenu'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	},
	hasNull:false,
    listeners: {
        load: function(store, records, successful,operation, options) {
			if(this.hasNull) {
				var blank ={
                    unique_id: -1,
                    menu_code: '',
                    menu_name: '선택안함'
            	};
				this.add(blank);
            }

        },
        beforeload: function(){
			this.getProxy().setExtraParam('type', this.type);
			this.getProxy().setExtraParam('orderBy', this.orderBy);
        }
    }
});
