Ext.define('Msys.views.stock.WearingCancelView', {
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
        this.createStore('Msys.model.WearingStateModel', gu.pageSize);

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

        // this.grid.on('edit', function(editor, e) {
        //     var rec = e.record;
        //     var unique_id = rec.get('unique_id');
        //     var req_quan = rec.get('req_quan');
        //     var pctman_uid = rec.get('sup_name');
        //     var req_date = rec.get('req_date');
        //     if(req_date==null||req_date.length<1) {
        //         gm.me().store.load();
        //         return;
        //     };
        //     req_date = Ext.Date.format(new Date(req_date), 'Y-m-d');

        //     Ext.Ajax.request({
        //         url: CONTEXT_PATH + '/prch.do?method=updateOrderComponent',
        //         params: {
        //             unique_id:unique_id,
        //             req_quan:req_quan,
        //             pctman_uid:gm.me().vPCTMAN_UID,
        //             req_date:req_date
        //         },
        //         success: function(result, request) {
        //             gm.me().store.load();
        //         },
        //         // failure: extjsUtil.failureMessage
        //     });
        // });

        this.callParent(arguments);

        // this.store.getProxy().setExtraParam('comp_type', 'PR');
        this.store.getProxy().setExtraParam('status', 'GC');
        this.store.load();
	},
})