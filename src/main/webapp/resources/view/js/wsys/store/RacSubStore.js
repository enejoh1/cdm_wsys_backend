Ext.define('Msys.store.RacSubStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
        });
    },
    // fields: [
		
	// ],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/stock.do?method=readRacSub'
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
                    brack_name: '선택안함'
            	};
				this.add(blank);
            }

        },
        beforeload: function(){
        }
    }
});
