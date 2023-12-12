Ext.define('Msys.store.PcsMstStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
		Ext.apply(this, {
        	hasNull: params.hasNull,
        });
    },
	pageSize: 300,
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/produce.do?method=readPcsMst'
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
                    parent_id: -1,
					pcs_code: 'TOP',
                    pcs_name: '최상위공정',
					pcs_lv : 0
            	};
				this.add(blank);
            }
        },
		beforeload: function(){
			
		}
	}
});
