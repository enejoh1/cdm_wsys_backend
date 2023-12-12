Ext.define('Msys.store.ClassStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // Ext.apply(this, {
        // 	hasNull: params.hasNull,
        // });
    },
	pageSize: 300,
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/itemmst.do?method=readClassData'
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
            // if(this.hasNull) {
            //     var blank ={
            //         unique_id: -1,
            //         item_name: '선택안함'
            //     };
            //     this.add(blank);
            // }
        },
		beforeload: function(){
			
		}
	}
});
