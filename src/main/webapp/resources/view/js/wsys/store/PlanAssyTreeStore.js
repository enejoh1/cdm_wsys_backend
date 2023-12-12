Ext.define('Msys.store.PlanAssyTreeStore', {
	extend: 'Ext.data.TreeStore',
	model:'Msys.model.TreeModelProduceBom',
	initComponent: function(params) {
        Ext.apply(this, {
            lang: params.lang
        });

    },
	// root    : {
    //     expanded: false
    // },
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
				if(bom_lv!=null&&bom_lv==1) {
					console.log('====bom lv ====> ',bom_lv)
					record.set('icon', 'x-grid-tree-node-expanded x-tree-icon-parent-top');
					record.set('iconCls', "x-grid-tree-node-expanded x-tree-icon-parent-top");
					console.log('==record', record);
				}
				// record.set('leaf', true);
			};
			
			gm.me().assyGrid.getSelectionModel().select(0);
			gm.me().assyGrid.expandAll();
		}
	}
});
