Ext.define('Msys.views.stock.OutStockStateView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

       (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

		//스토어 생성
        this.createStore('Msys.model.OutStockStateModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);
        
        var cols = this.grid.columns;
        var contractStore = this.contractSupplierStore;
        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;
            var me = this;
        });

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });
		
		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    console.log('=======select', select);

                } else {
                }
            }
        });

        this.callParent(arguments);

        var comp_type_list = [];
        var status_list = [];
        comp_type_list.push('PR'); comp_type_list.push('ST');
        status_list.push('GY'); status_list.push('DE');
        this.store.getProxy().setExtraParam('comp_type_list', comp_type_list);
        this.store.getProxy().setExtraParam('status_list', status_list);
        this.store.load();
	},

})