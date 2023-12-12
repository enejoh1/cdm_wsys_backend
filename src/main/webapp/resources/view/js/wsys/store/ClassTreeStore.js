Ext.define('Msys.store.ClassTreeStore', {
	extend: 'Ext.data.TreeStore',
	model:'Msys.model.TreeModelClassCode',
	initComponent: function(params) {
        Ext.apply(this, {
            lang: params.lang
        });

    },
	listeners: {
		beforeload: function(sender,node,records){
			var id = node.node.data.id;
			var lv = node.node.data.depth;

			this.getProxy().setExtraParam('lv', lv);
            this.getProxy().setExtraParam('parent_id', id);
		},

		load: function(store, records) {
			for(var i=0; i<records.length; i++) {
				var record = records[i];
				var class_code = record.get('class_code');
				var class_name = record.get('class_name');
				var class_lv = record.get('class_lv');

				item_code = '<font color="#163F69">' + class_code + '</font>';
				item_name = '<font color="#E6474E">' + class_name + '</font>';
				var text = class_lv + ' ' + item_code + '-' + item_name;

				record.set('text', text);
			};
			
			gm.me().classGrid.getSelectionModel().select(0);
			gm.me().classGrid.expandAll();
		}
	}
});
