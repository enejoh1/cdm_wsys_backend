Ext.define('Msys.views.purchase.GeneralPurchaseView', {
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
        
        this.savePurItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '항목담기',
            disabled: true,
            // tooltip: '',
            handler: function() {
                gm.me().savePurItemHandler();
            }
        });

        this.showSavedItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: '요청진행',
            handler: function() {
                gm.me().showSavedItemHandler();
            }
        });

        buttonToolbar.insert(1, this.savePurItemAction);
        buttonToolbar.insert(2, this.showSavedItemAction);

		//스토어 생성
        this.createStore('Msys.model.GeneralPurchaseModel', gu.pageSize);

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
                    
                    gm.me().savePurItemAction.enable();
                } else {
                    gm.me().savePurItemAction.disable();
                }
            }
        });
        this.callParent(arguments);

        var account_type_list = [];
        account_type_list.push('R'); account_type_list.push('G');
        this.store.getProxy().setExtraParam('account_type_list', account_type_list);
        // this.store.getProxy().setExtraParam('status', 'PR');
        this.store.load();
	},

    savePurItemHandler: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uids = [];
        for(var i=0; i<selections.length; i++) {
            uids.push(selections[i].get('unique_id'));
        };

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/prch.do?method=saveGeneralPurItems',
            params:{
                unique_id_list:uids
            },
            success: function (result, request) {
                gm.me().eventNotice('결과', '저장 성공');
            },
            // failure: extjsUtil.failureMessage
        });
    },

    showSavedItemHandler: function() {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('save_item_form'),
            xtype: 'form',
            frame: false,
            border:true,
            width: '100%',
            bodyPadding: 10,
            items: gm.me().createSavePanel()
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            id: gu.id('save_item_win'),
            title: '요청진행',
            width: 800,
            height: 500,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    if(win)  win.close();
                }
            }]
        });win.show();
    },

    createSavePanel: function() {
        this.saveItemStore.load();
        this.saveItemPanel = Ext.create('Ext.grid.Panel', {
            store: this.saveItemStore,
            multiSelect: true,
            layout:'fit',
            height:400,
            stateId: 'saveItemPanel',
            dockedItems: [{
                dock : 'top',
                xtype : 'toolbar',
                items : [
                    this.searchSaveItemAction,
                    this.execPurReqAction,
                    this.removeSaveItemAction
                ]
            }],
            selModel: {
                selType: 'checkboxmodel',
                mode: 'multi',
                allowDeselect: true
            },
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            columns: [
                {
                    text     : '품번',
                    width     : '20%',
                    sortable : true,
                    dataIndex: 'item_code',
                    align:'left',
                    style:'text-align:center'
                },{
                    text     : '품명',
                    width     : '20%',
                    sortable : true,
                    dataIndex: 'item_name',
                    align:'left',
                    style:'text-align:center'
                },{
                    text     : '규격',
                    width     : '30%',
                    sortable : true,
                    dataIndex: 'specification',
                    align:'left',
                    style:'text-align:center'
                },{
                    text     : '요청량',
                    width     : '10%',
                    sortable : true,
                    dataIndex: 'req_quan',
                    align:'right',
                    style:'text-align:center',
                    editor:{
                        xtype:'numberfield',
                        minValue:1
                    }, 
                    renderer: function(value, meta, record) {
                        meta.css = 'edit-column';
                        if(value==null||value==0) {
                            record.set('req_quan', 1);
                            record.commit();
                            value = 1;
                        }
                        return value;
                    }
                },{
                    text     : '납기요청일',
                    width     : '15%',
                    sortable : true,
                    dataIndex: 'req_date',
                    align:'left',
                    style:'text-align:center',
                    editor:{
                        xtype:'datefield',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    }, 
                    renderer: function(value, meta, record) {
                        meta.css = 'edit-column';
                        if(value==null) {
                            value = Ext.Date.add( new Date(), Ext.Date.DAY, 7);
                            record.set('req_date', new Date(value));
                            record.commit();
                        };
                        value = Ext.Date.format(new Date(value), 'Y-m-d');
                        return value;
                    }
                }
            ]
        });

        this.saveItemPanel.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length>0) {
                    gm.me().removeSaveItemAction.enable();
                } else {
                    gm.me().removeSaveItemAction.disable();
                }
            }
        });

        this.saveItemPanel.on('edit', function(editor, e) {
            var rec = e.record;
            var unique_id = rec.get('unique_id');
            var req_quan = rec.get('req_quan');
            var req_date = rec.get('req_date');
            req_date = Ext.Date.format(new Date(req_date), 'Y-m-d');
            
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/prch.do?method=editSaveItem',
                params:{
                    unique_id:unique_id,
                    req_quan:req_quan,
                    req_date:req_date,
                },
                success: function(){
                    gm.me().saveItemStore.load();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '요청 실패' );
                    gm.me().saveItemStore.load();
                }
            });
        });

        return this.saveItemPanel;
    },

    searchSaveItemAction:Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-search',
        text: '검색',
        handler: function() {
            gm.me().saveItemStore.load();
        }
    }),

    execPurReqAction:Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-arrow-right',
        text: '구매요청',
        handler: function() {
            Ext.MessageBox.show({
                title: '구매요청',
                msg: '선택한 항목을 구매요청 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().execPurReqHandler,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    execPurReqHandler: function(btn) {
        if(btn == 'yes') {
            var items = gm.me().saveItemStore.data.items;
            if(items.length<1) {
                Ext.MessageBox.alert('알림', '진행할 항목이 없습니다.');
                return;
            };
    
            var uids = [];
            for(var i=0; i<items.length; i++) {
                uids.push(items[i].get('unique_id'));
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/prch.do?method=execPurReqHandler',
                params:{
                    unique_id_list:uids
                },
                success: function(){
                    gm.me().eventNotice('결과', '요청 성공' );
                    gm.me().saveItemStore.load();
                    var win = Ext.getCmp(gu.id('save_item_win'));
                    if(win) win.close();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '요청 실패' );
                    gm.me().saveItemStore.load();
                }
            });
        }
    },

    removeSaveItemAction:Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-remove',
        text: '삭제',
        disabled:true,
        handler: function() {
            var selections = gm.me().saveItemPanel.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                uids.push(selections[i].get('unique_id'));
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/prch.do?method=removeSaveItem',
                params:{
                    unique_id_list:uids
                },
                success: function(){
                    gm.me().eventNotice('결과', '삭제 성공' );
                    gm.me().saveItemStore.load();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '삭제 실패' );
                }
             });
        }
    }),

    saveItemStore:Ext.create('Msys.store.CmpManStore', {}),
})