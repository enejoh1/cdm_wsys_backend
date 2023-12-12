Ext.define('Msys.store.OrgnTreeStore', {
	extend: 'Ext.data.TreeStore',
	model:'Msys.model.OrganTreeModel',
	initComponent: function(params) {//추후 조직도 트리구조 만들때 개발
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
				var item_code = record.get('item_code');
				var item_name = record.get('item_name');
				var bom_lv = record.get('bom_lv');
				var bom_no = record.get('bom_no');

				item_code = '<font color="#163F69">' + item_code + '</font>';
				item_name = '<font color="#E6474E">' + item_name + '</font>';
				var text = /*bom_lv + '-'*/ + bom_no + ' ' + item_code + '-' + item_name;

				record.set('text', text);
				// record.set('leaf', true);
			};

			gm.me().assyGrid.getSelectionModel().select(0);
			gm.me().assyGrid.expandAll();
		}
	}
});
