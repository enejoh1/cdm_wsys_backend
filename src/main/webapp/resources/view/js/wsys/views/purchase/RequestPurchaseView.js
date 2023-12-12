Ext.define('Msys.views.purchase.RequestPurchaseView', {
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

        this.acceptReqAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
            text: '요청접수',
            disabled: true,
            tooltip: '해당 항목의 요청을 접수합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'요청접수',
                    msg: '선택하신 항목들을 요청접수 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().acceptReqHandler,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.denyReqAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '반려',
            disabled: true,
            tooltip: '해당 항목의 요청을 반려합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'요청반려',
                    msg: '선택하신 항목들을 요청반려 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().denyReqHandler,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });
        
        buttonToolbar.insert(1, this.acceptReqAction);
        buttonToolbar.insert(2, this.denyReqAction);

		//스토어 생성
        this.createStore('Msys.model.RequestPurchaseModel', gu.pageSize);

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
                    
                    gm.me().acceptReqAction.enable();
                    gm.me().denyReqAction.enable();
                } else {
                    gm.me().acceptReqAction.disable();
                    gm.me().denyReqAction.disable();
                }
            }
        });
        this.callParent(arguments);

        this.store.getProxy().setExtraParam('comp_type', 'PR');
        this.store.getProxy().setExtraParam('status', 'PR');
        this.store.load();
	},

    acceptReqHandler: function(btn) {
        if(btn=='yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];

            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            if(uids!=null && uids.length>0) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/prch.do?method=acceptRequst',
                    params: {
                        unique_id_list:uids,
                        status:'PY'
                    },
                    success: function(result, request) {
                       gm.me().store.load();
                    },
                    // failure: extjsUtil.failureMessage
                });
            }
        }
    },

    denyReqHandler: function(btn) {
        if(btn=='yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];

            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            if(uids!=null && uids.length>0) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/prch.do?method=denyRequst',
                    params: {
                        unique_id_list:uids,
                        status:'DE'
                    },
                    success: function(result, request) {
                       gm.me().store.load();
                    },
                    // failure: extjsUtil.failureMessage
                });
            }
        }
    },
})