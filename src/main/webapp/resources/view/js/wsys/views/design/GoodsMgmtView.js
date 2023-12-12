Ext.define('Msys.views.design.GoodsMgmtView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
	
        console.log('MSYS Views design GoodsMgmtView', this.columns);

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

		//스토어 생성
        this.createStore('Msys.model.GoodsMgmtModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

		
        /*var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'col1':
                    col['align']  = 'center';
                    col['style']  = 'text-align:center;';
                    break;
            }
        });*/

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });

        this.callParent(arguments);

        var account_type_list = [];
        account_type_list.push('G');
        this.store.getProxy().setExtraParam('account_type_list', account_type_list);

        this.store.load();
    }
})