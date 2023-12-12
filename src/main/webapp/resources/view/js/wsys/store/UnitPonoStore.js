Ext.define('Msys.store.UnitPonoStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
			abroad_yn : params.abroad_yn
			
        });
    },
    // fields: [
		
	// ],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/prch.do?method=getAbroadPoNo'
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
			if(this.abroad_yn!=null) {
				this.getProxy().setExtraParam('abroad_yn', this.abroad_yn);
			}
        }
    }
});
