Ext.define('Msys.store.WhuMstStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
			hasAll : params.hasAll
        });
    },
    // fields: [
		
	// ],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/stock.do?method=readWhuMst'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	},
	hasNull:false,
	hasAll:false,
    listeners: {
        load: function(store, records, successful,operation, options) {
			if(this.hasNull) {
				var blank ={
                    unique_id: -1,
                    wh_name: '선택안함'
            	};
				this.add(blank);
            }

			if(this.hasAll) {
				var blank ={
                    unique_id: -1,
                    wh_name: '전체'
            	};
				this.add(blank);
            }

        },
        beforeload: function(){
        }
    }
});
