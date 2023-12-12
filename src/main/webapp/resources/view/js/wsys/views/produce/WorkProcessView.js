Ext.define('Msys.views.produce.WorkProcessView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Produce WorkProcessView');

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridMenuList(this).showAt(e.getXY());
                    return false;
                },
            }
        };

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.startWorkAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: '시작',
            tooltip: '해당 항목의 작업을 시작합니다.',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title:'시작',
                    msg: '해당 항목의 작업을 시작하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().workStartHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.pauseWorkAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-rotate-left',
            text: '정지',
            tooltip: '해당 항목의 작업을 정지합니다.',
            disabled: true,
            handler: function() {
                gm.me().workEventForm('PAUSE');
            }
        });

        // this.stopWorkAction = Ext.create('Ext.Action', {
        //     xtype : 'button',
        //     iconCls: 'af-rotate-left',
        //     text: '중지',
        //     tooltip: '해당 항목의 작업을 중지합니다.',
        //     disabled: true,
        //     handler: function() {
        //         gm.me().workEventForm('STOP');
        //     }
        // });

        this.completeWorkAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '완료',
            tooltip: '해당 항목의 작업을 완료합니다.',
            disabled: true,
            handler: function() {
                gm.me().workEventForm('COMPLETE');
            }
        });

        buttonToolbar.insert(1, this.startWorkAction);
        buttonToolbar.insert(2, this.pauseWorkAction);
        // buttonToolbar.insert(3, this.stopWorkAction);
        buttonToolbar.insert(3, this.completeWorkAction);
        buttonToolbar.insert(4, this.detailWorkFn());

        this.createStore('Msys.model.WorkProcessModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'status_kr':
                    col['align'] = 'center';
                    col['renderer'] = function(value, meta, record) {
                        gm.me().setStatusStyle(value, meta, record);
                        return value;
                    }
                    break;
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.createMtrlDetailTab()]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];

                    gm.me().startWorkAction.enable();
                    gm.me().pauseWorkAction.enable();
                    // gm.me().stopWorkAction.enable();
                    gm.me().completeWorkAction.enable();

                    gm.me().detailMtrlAction.enable();

                    var parent_id = select.get('bommst_uid');
                    gm.me().detailStore.getProxy().setExtraParam('parent_id', parent_id);
                    gm.me().detailStore.load();
                } else {
                    gm.me().startWorkAction.disable();
                    gm.me().pauseWorkAction.disable();
                    // gm.me().stopWorkAction.disable();
                    gm.me().completeWorkAction.disable();

                    gm.me().detailMtrlAction.disable();

                    gm.me().detailStore.removeAll();
                }
            }
        });

        this.callParent(arguments);
    },

    createMtrlDetailTab: function() {
        this.detailTab = Ext.create('Ext.panel.Panel', {
            frame: true,
            activeTab: 1,
            region:'east',
            width: '40%',
            collapsed: true,
            title:  '자재 상세보기',
            layout: 'card',
            items: [
                this.createDetailGrid()
            ],
            listeners: {
                
            },
            tools:  [
                {
                    xtype: 'tool',
                    type: 'right',
                    qtip: "접기",
                    handler: function(e, target, header, tool){
                        gm.me().detailTab.collapsed ? gm.me().detailTab.expand() : gm.me().detailTab.collapse();
                    }
                }
            ]
        });

        return this.detailTab;
    },
    detailWorkFn: function() {
        this.detailMtrlAction = Ext.create('Ext.Action', {
            iconCls: 'fa-typcn-th-list-outline_14_0_5395c4_none',
            id: 'detailMtrlAction',
            text:'자재 상세보기',
            disabled:true,
            handler: function(widget, event) {
                gm.me().detailTab.collapsed ? gm.me().detailTab.expand() : gm.me().detailTab.collapse();
            }
        });

        return this.detailMtrlAction;
    },
    detailStore:Ext.create('Msys.store.PartBomStore', {} ),
    createDetailGrid: function() {
        this.detailGrid =  Ext.create('Ext.grid.Panel', {
            store: this.detailStore,
            collapsible: false,
            multiSelect: false,
            autoScroll: true,
            autoHeight: true,
            // bbar: getPageToolbar(this.detailStore),
            frame: false,
            layout: 'fit',
            forceFit: true,
            width: '100%',
            sorters: [],
            columns: [
                {
                    text: '상태',
                    width: 80,
                    sortable: true,
                    style: 'text-align:center',
                    align: "center",
                    dataIndex: 'status_kr',
                    renderer: function(value, meta, record) {
                        gm.me().setStatusStyle(value, meta, record);
                        return value;
                    }
                }, {
                    text: '품번',
                    width: 80,
                    sortable: true,
                    style: 'text-align:center',
                    align: "left",
                    dataIndex: 'item_code'
                }, {
                    text: '품명',
                    width: 80,
                    sortable: true,
                    style: 'text-align:center',
                    align: "left",
                    dataIndex: 'item_name'
                }, {
                    text: '규격',
                    width: 100,
                    sortable: true,
                    style: 'text-align:center',
                    align: "left",
                    dataIndex: 'specification'
                }, {
                    text: '필요량',
                    width: 60,
                    sortable: true,
                    style: 'text-align:center',
                    align: "right",
                    dataIndex: 'req_quan'
                }
            ],
            viewConfig: {
                
            },
        });

        return this.detailGrid;
    },
    workStartHandler: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                var status = select.get('status');
                switch(status) {
                    case 'WN':
                    case 'WP':
                        break;
                    default:
                        Ext.Msg.alert('알림', '진행상태를 확인해주세요.');
                        return;
                };
                uids.push(uid);
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=workStartHandler',
                params:{
                    unique_id_list : uids,
                    type:'START'
                },
                success: function(){
                    gm.me().eventNotice('결과', '작업시작 성공' );
                    gm.me().store.load();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '작업시작 실패' );
                    gm.me().store.load();
                }
            });
            
        }
    },

    workEventForm: function(type) {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        var req_quan = select.get('req_quan');
        var pcs_quan = select.get('pcs_quan');
        var err_quan = select.get('err_quan');

        if(pcs_quan==null) pcs_quan=0;
        if(err_quan==null) err_quan=0;

        var type_kr = '';
        switch(type) {
            case 'PAUSE':
                type_kr = '정지';
                break;
            case 'STOP':
                type_kr = '중지';
                break;
            case 'COMPLETE':
                type_kr = '완료';
                break;
        }

        var remain_quan = req_quan-pcs_quan-err_quan;

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('work_handler_form'),
            xtype: 'form',
            frame: false,
            width: 300,
            height: 200,
            border:true,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            // bodyPadding: 10,
            // fieldDefaults: {
            //     labelAlign: 'right',
            //     msgTarget: 'side'
            // },
            items: [
                {
                    xtype:'numberfield',
                    id:gu.id('pcs_quan'),
                    name:'pcs_quan',
                    fieldLabel:'완료수량',
                    value:remain_quan,
                    minValue:0,
                    maxValue:remain_quan,
                    // listeners: {
                    //     change: function(field, value, oldValue) {
                    //         var err_quan = remain_quan - value;
                    //         Ext.getCmp(gu.id('err_quan')).setValue(err_quan);
                    //     }
                    // }
                }, {
                    xtype:'numberfield',
                    id:gu.id('err_quan'),
                    name:'err_quan',
                    fieldLabel:'불량수량',
                    value:0,
                    minValue:0,
                    maxValue:remain_quan,
                    // listeners: {
                    //     change: function(field, value, oldValue) {
                    //         var pcs_quan = remain_quan - value;
                    //         Ext.getCmp(gu.id('pcs_quan')).setValue(pcs_quan);
                    //     }
                    // }
                }, {
                    xtype:'datefield',
                    id:gu.id('end_date'),
                    name:'end_date',
                    fieldLabel:'처리날짜',
                    // fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:Ext.Date.format(new Date(), 'Y-m-d'),
                    format:'Y-m-d',
                    dateFormat:'Y-m-d',
                    submitFormat:'Y-m-d'
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: type_kr,
            width: 300,
            height: 200,
            plain: true,
            autoScroll : true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('work_handler_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
						
                        Ext.MessageBox.show({
                            title:type_kr,
                            msg: '해당 항목의 작업을 '+type_kr+'하시겠습니까?',
                            buttons: Ext.MessageBox.YESNO,
                            fn: function(btn) {
                                if(btn == 'yes') {
                                    gm.me().workEventHandler(type, win, val);
                                }
                            },
                            icon: Ext.MessageBox.QUESTION
                        });
                    } else {
                        Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                    };
                }
            }, {
                text: '취소',
                handler: function(btn) {
                    win.close();
                }
            }]
        });win.show();
    },

    workEventHandler: function(type, win, val) {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        var uid = select.get('unique_id');
        var status = select.get('status');
        var uids = [];

        switch(type) {
            case 'PAUSE':
                switch(status) {
                    case 'WR':
                        break;
                    default:
                        Ext.Msg.alert('알림', '진행상태를 확인해주세요.');
                        return;
                };
                break;
            case 'STOP':
                switch(status) {
                    case 'WR':
                        break;
                    default:
                        Ext.Msg.alert('알림', '진행상태를 확인해주세요.');
                        return;
                };
                break;
            case 'COMPLETE':
                switch(status) {
                    case 'WR':
                        var mtrlDatas = gm.me().detailStore.data.items;
                        for(var i=0; i<mtrlDatas.length; i++) {
                            var data = mtrlDatas[i];
                            var status = data.get('status');
                            if(status != 'GY' && status != 'WY') {
                                Ext.Msg.alert('알림', '자재 불출상태를 확인해주세요.');
                                return;
                            };
                        };
                        break;
                    default:
                        Ext.Msg.alert('알림', '진행상태를 확인해주세요.');
                        return;
                };
                break;
        };

        uids.push(uid);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/produce.do?method=workProduceHandler',
            params:{
                unique_id_list : uids,
                type:type,
                pcs_quan:val['pcs_quan'],
                err_quan:val['err_quan'],
                end_date:val['end_date'],
            },
            success: function(){
                gm.me().eventNotice('결과', '작업시작 성공' );
                if(win) win.close();
                gm.me().store.load();
            },
            failure: function(){
                gm.me().eventNotice('결과', '작업시작 실패' );
                if(win) win.close();
                gm.me().store.load();
            }
        });
    },
})