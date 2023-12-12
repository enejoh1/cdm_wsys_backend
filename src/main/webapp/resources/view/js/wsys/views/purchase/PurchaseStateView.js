Ext.define('Msys.views.purchase.PurchaseStateView', {
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
        this.createStore('Msys.model.PurchaseStateModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });
		
		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                } else {
                    
                }
            }
        });
        this.callParent(arguments);

        this.store.getProxy().setExtraParam('comp_type', 'PR');
        // this.store.getProxy().setExtraParam('status', 'PR');
        this.store.load();
	},

})