Ext.define('Msys.views.stock.OutStockRequestView', {
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

        this.execOutStockAction = Ext.create('Ext.Action', {
            iconCls: 'af-arrow-right',
            text: '불출실행',
            tooltip: '불출실행을 진행합니다.',
            disabled: true,
            handler: function () {
                gm.me().execOutStockForm();
                // Ext.MessageBox.show({
                //     title: '불출실행',
                //     msg: '선택한 항목을 불출싱행 하시겠습니까?',
                //     buttons: Ext.MessageBox.YESNO,
                //     fn: gm.me().execOutStockHandler,
                //     icon: Ext.MessageBox.QUESTION
                // });
            }
        });

        this.denyOutStockAction = Ext.create('Ext.Action', {
            iconCls: 'af-reject',
            text: '반려',
            tooltip: '반려를 진행합니다.',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '반려',
                    msg: '선택한 항목을 반려 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().denyOutStockHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        buttonToolbar.insert(1, this.execOutStockAction);
        buttonToolbar.insert(2, this.denyOutStockAction);

		//스토어 생성
        this.createStore('Msys.model.OutStockRequestModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);
        
        var cols = this.grid.columns;
        var contractStore = this.contractSupplierStore;
        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;
            var me = this;

            // switch(dataIndex) {

            // }
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

                    gm.me().execOutStockAction.enable();
                    gm.me().denyOutStockAction.enable();
                } else {
                    gm.me().execOutStockAction.disable();
                    gm.me().denyOutStockAction.disable();
                }
            }
        });

        this.callParent(arguments);

        var comp_type_list = [];
        var status_list = [];
        comp_type_list.push('PR'); comp_type_list.push('ST');
        status_list.push('GN'); status_list.push('PO'); 
        status_list.push('PY'); status_list.push('GR');
        status_list.push('CR');
        this.store.getProxy().setExtraParam('comp_type_list', comp_type_list);
        this.store.getProxy().setExtraParam('status_list', status_list);
        this.store.load();

        this.whouseStore.load();
        this.receiveUserStore.load();
        this.sendUserStore.load();
	},

    execOutStockForm: function() {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('execOutStockForm'),
            xtype: 'form',
            frame: false,
            border:true,
            width: '100%',
            bodyPadding: 10,
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items: [
                {
                    xtype:'combo',
                    id:gu.id('whouse_uid'),
                    name:'whouse_uid',
                    fieldLabel: '인계창고',
                    anchor: '100%',
                    allowBlank:false,
                    displayField:'wh_name',
                    valueField:'unique_id',
                    minChars: 1,
                    value:0,
                    store:gm.me().whouseStore,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{wh_name}</div>';
                        }			                	
                    },
                }, {
                    xtype:'datefield',
                    id:gu.id('stock_out_date'),
                    name:'stock_out_date',
                    fieldLabel: '불출일',
                    anchor: '100%',
                    allowBlank:false,
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    value:Ext.Date.format(new Date(), 'Y-m-d')
                }, {
                    xtype:'combo',
                    id:gu.id('receive_user'),
                    name:'receive_user',
                    fieldLabel: '인수자',
                    anchor: '100%',
                    allowBlank:false,
                    displayField:'user_name',
                    valueField:'unique_id',
                    minChars: 1,
                    store:gm.me().receiveUserStore,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{user_name}</div>';
                        }			                	
                    },
                }, {
                    xtype:'combo',
                    id:gu.id('send_user'),
                    name:'send_user',
                    fieldLabel: '인계자',
                    anchor: '100%',
                    allowBlank:false,
                    displayField:'user_name',
                    valueField:'unique_id',
                    minChars: 1,
                    value:gUSER_UID,
                    store:gm.me().sendUserStore,
                    listConfig:{
                        loadingText: '검색중...',
                        emptyText: '일치하는 항목 없음.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{user_name}</div>';
                        }			                	
                    },
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: '불출 실행',
            width: 400,
            height: 250,
            plain: true,
            layout:'hbox',
            items: form,
            buttons: [{
                text: '확인',
                handler: function(btn) {
                     if (btn == "no") {
                        win.close();
                    } else {
                        Ext.MessageBox.show({
                            title: '불출실행',
                            msg: '선택한 항목을 불출싱행 하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function(btn) {
                                if(btn == 'yes') {
                                    var form = Ext.getCmp(gu.id('execOutStockForm')).getForm();
                                    if(form.isValid()) {
                                        var val = form.getValues(false);
                                        
                                        var selections = gm.me().grid.getSelectionModel().getSelection();
                                        var uids = [];
                                        for(var i=0; i<selections.length; i++) {
                                            var select = selections[i];
                                            var uid = select.get('unique_id');
                                            uids.push(uid);
                                        };

                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/stock.do?method=execStockOutEvent',
                                            params:{
                                                unique_id_list:uids,
                                                whouse_uid:val['whouse_uid'],
                                                stock_out_date:val['stock_out_date'],
                                                receive_user:val['receive_user'],
                                                send_user:val['send_user'],
                                            },
                                            success: function(val, action) {
                                                gm.me().store.load();
                                                win.close();
                                            },
                                        });
                                        
                                    } else {
                                        Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                                    }
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                        
                    }
                }
            }, {
                text: '취소',
                handler: function(btn) {
                    win.close();
                }
            }]
        });win.show();
    },

    execOutStockHandler: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/stock.do?method=execOutStockHandler',
                params:{
                    unique_id_list:uids
                },
                success: function(){
                    gm.me().eventNotice('결과', uids.length + ' 건 실행완료.' );
                    gm.me().store.load();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '실행실패' );
                }
             });
        }
    },

    denyOutStockHandler: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/stock.do?method=denyOutStockHandler',
                params:{
                    unique_id_list:uids
                },
                success: function(){
                    gm.me().eventNotice('결과', uids.length + ' 건 반려완료.' );
                    gm.me().store.load();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '반려실패' );
                }
             });
        }
    },

    whouseStore:Ext.create('Msys.store.WhuMstStore', {}),
    receiveUserStore:Ext.create('Msys.store.UserStore', {}),
    sendUserStore:Ext.create('Msys.store.UserStore', {}),
})