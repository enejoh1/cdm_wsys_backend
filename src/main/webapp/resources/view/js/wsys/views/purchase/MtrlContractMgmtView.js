Ext.define('Msys.views.purchase.MtrlContractMgmtView', {
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
        this.createStore('Msys.model.MtrlContractModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    frame: true,
                    region:'center',
                    width:'60%',
                    layout:'fit',
                    items: this.grid
                }, {
                    frame: true,
                    region:'east',
                    width:'40%',
                    layout:'fit',
                    title:'계약 업체 리스트',
                    items: this.createContractList()
                }
            ]
        });

		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    console.log('=-==select', select);
                    var unique_id = select.get('unique_id');

                    gm.me().addContractAction.enable();

                    gm.me().contractSupMstStore.getProxy().setExtraParam('item_id', unique_id);
                    gm.me().contractSupMstStore.load();

                } else {
                    gm.me().addContractAction.disable();

                    gm.me().contractSupMstStore.removeAll();
                }
            }
        });
        this.callParent(arguments);

        var account_type_list = [];
        account_type_list.push('R'); account_type_list.push('G');
        this.store.getProxy().setExtraParam('account_type_list', account_type_list);
        this.store.load();

        this.contractSupMstStore.getProxy().setExtraParam('limit', 300);
        this.contractSupMstStore.getProxy().setExtraParam('orderBy', 'sort_no ASC');
        this.currencyStore.load();
	},

    addContractAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-plus-circle',
        text: '계약사 추가',
        tooltip: '자재 계약 업체를 등록합니다.',
        disabled:true,
        handler: function() {
            gm.me().addContractHandler();
        }
    }),

    removeContractAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-remove',
        text: '삭제',
        tooltip: '자재 계약 업체를 삭제합니다.',
        disabled:true,
        handler: function() {
            Ext.MessageBox.show({
                title:'계약사 삭제',
                msg: '해당 계약사를 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().removeContractHandler,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    createContractList: function() {

        this.contractGrid = Ext.create('Ext.grid.Panel', {
            cls: 'rfx-panel',
            id: gu.id('contractGrid'),
            store: this.contractSupMstStore,
            viewConfig:{
                markDirty:false
            },
            collapsible: false,
            multiSelect: false,
            region: 'center',
            autoScroll: true,
            autoHeight: true,
            border: true,
            layout: 'fit',
            forceFit: false,
            plugins: {
                ptype: 'cellediting',
                clicksToEdit: 1
            },
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.addContractAction, 
                    {
                        text: '▲',
                        listeners: [
                            {
                                click:function() {
                                    var select = gm.me().contractGrid.getSelectionModel().getSelection()[0];
                                    var unique_id = select.get('unique_id');
                                    var sort_no = select.get('sort_no');
                                    if(sort_no==10) {
                                        Ext.MessageBox.alert('알림', '가장 최상위 값입니다.');
                                        return;
                                    };

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/prch.do?method=updateContractSortNo',
                                        params: {
                                            unique_id:unique_id,
                                            type:'UP'
                                        },
                                        success: function(result, request) {
                                            gm.me().contractSupMstStore.load();
                                        },
                                    });
                                }
                            }
                        ]
                    }, {
                        text: '▼',
                        listeners: [
                            {
                                click:function() {
                                    var select = gm.me().contractGrid.getSelectionModel().getSelection()[0];
                                    var unique_id = select.get('unique_id');

                                    Ext.Ajax.request({
                                        url: CONTEXT_PATH + '/prch.do?method=updateContractSortNo',
                                        params: {
                                            unique_id:unique_id,
                                            type:'DOWN'
                                        },
                                        success: function(result, request) {
                                            gm.me().contractSupMstStore.load();
                                        },
                                    });
                                }
                            }
                        ]
                    },
                    this.removeContractAction
                ]
            }],
            margin: '0 0 0 0',
            columns: [
                {text: '순번', width: 50, dataIndex: 'sort_no', sortable: false, align: 'center'},
                {text: '계약업체', width: 250, dataIndex: 'supmst_name', sortable: false, style: 'text-align:center', align: 'left'},
                {text: '통화', width:60, dataIndex:'currency', sortable:true, align:'center',
                    editor: {
                        xtype:'combo',
                        displayField : 'codeName',
                        valueField : 'systemCode',
                        store: this.currencyStore,
                        listeners: {
                            select : function(combo, record) {
                                console_logs('>> combo', combo);
                                console_logs('>> record', record);
                            }
                        }
                    }
                },
                // {text:'외자구분', width:60, dataIndex:'abroad_flag', sortable:true, align:'center' },
                {text: '계약단가', width: 100, dataIndex: 'pur_price', sortable: false, style: 'text-align:center', 
                 align: 'right', editor: 'textfield',
                 renderer: function(value) {
                    value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                    return value;
                 }
                },
                {text: '계약시작일', width: 100, dataIndex: 'start_date', sortable: false, align: 'center',
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
                {text: '계약종료일', width: 100, dataIndex: 'end_date', sortable: false, align: 'center',
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
            ],
        });

        this.contractGrid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    var unique_id = select.get('unique_id');
                    gm.me().removeContractAction.enable();
                } else {
                    gm.me().removeContractAction.disable();
                }
            }
        });

        return this.contractGrid;
    },

    addContractHandler: function() {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('addContractForm'),
            xtype: 'form',
            frame: false,
            width: 500,
            height: 300,
            border:true,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    id:gu.id('item_code'),
                    name:'item_code',
                    xtype:'textfield',
                    fieldLabel:'품번',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:select.get('item_code')
                }, {
                    id:gu.id('item_name'),
                    name:'item_name',
                    xtype:'textfield',
                    fieldLabel:'품명',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:select.get('item_name')
                }, {
                    id:gu.id('specification'),
                    name:'specification',
                    xtype:'textfield',
                    fieldLabel:'규격',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:select.get('specification')
                }, {
                    id:gu.id('maker_name'),
                    name:'maker_name',
                    xtype:'textfield',
                    fieldLabel:'제조사',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:select.get('maker_name')
                }, {
                    id:gu.id('supmst_uid'),
                    name:'supmst_uid',
                    xtype:'combo',
                    fieldLabel:'공급사',
                    allowBlank: false,
                    store:gm.me().supmstStore,
                    displayField:'sup_name',
                    valueField:'unique_id',
                    minChars: 1,
                    listConfig:{
                        loadingText: 'Searching...',
                        emptyText: 'No matching posts found.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{sup_name}</div>';
                        }			                	
                    },
                    listeners: {
                        select:function(combo, record) {
                            var sup_code = record.get('sup_code');
                            var sup_name = record.get('sup_name');

                            Ext.getCmp(gu.id('supmst_code')).setValue(sup_code);
                            Ext.getCmp(gu.id('supmst_name')).setValue(sup_name);
                        }
                    }
                }, {
                    id:gu.id('currency'),
                    name:'currency',
                    xtype:'combo',
                    fieldLabel:'통화',
                    allowBlank: false,
                    store:gm.me().currencyStore,
                    displayField:'code_name',
                    valueField:'code_value',
                    minChars: 1,
                    value:'KRW',
                    listConfig:{
                        loadingText: 'Searching...',
                        emptyText: 'No matching posts found.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{code_value}">{code_name}</div>';
                        }			                	
                    },
                }, {
                    id:gu.id('pur_price'),
                    name:'pur_price',
                    xtype:'numberfield',
                    minValue:0,
                    fieldLabel:'계약단가',
                    decimalPrecision: 2,
                    allowBlank: false,
                }, {
                    id:gu.id('start_date'),
                    name:'start_date',
                    xtype:'datefield',
                    fieldLabel:'계약시작일',
                    value: Ext.Date.format(new Date(),'Y-m-d'),
                    format: 'Y-m-d',
                }, {
                    id:gu.id('end_date'),
                    name:'end_date',
                    xtype:'datefield',
                    fieldLabel:'계약종료일',
                    name: 'end_date',
                    format: 'Y-m-d',
                },
                new Ext.form.Hidden({
                    id:gu.id('supmst_code'),
                    name: 'supmst_code',
                }),
                new Ext.form.Hidden({
                    id:gu.id('supmst_name'),
                    name: 'supmst_name',
                })
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '계약사 추가',
            width: 500,
            height: 400,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('addContractForm')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        var item_id = select.get('unique_id');
                        var item_code = select.get('item_code');
                        var sort_no = 10;
                        
                        var contractDatas = gm.me().contractSupMstStore.data.items;
                        if(contractDatas.length>0) {
                            sort_no = (contractDatas.length + 1) * 10;
                        }
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/prch.do?method=addContractSupMst',
                            params:{
                                item_id:item_id,
                                item_code:item_code,
                                currency:val['currency'],
                                pur_price:val['pur_price'],
                                start_date:val['start_date'],
                                end_date:val['end_date'],
                                supmst_uid:val['supmst_uid'],
                                supmst_code:val['supmst_code'],
                                supmst_name:val['supmst_name'],
                                sort_no:sort_no
                            },
                            success: function(val, action) {
                                gm.me().contractSupMstStore.load();
                                win.close();
                            },
                            // failure: extjsUtil.failureMessage
                        });
                    } else {
                        Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
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

    removeContractHandler: function(btn) {
        if(btn=='yes') {
            var selections = gm.me().contractGrid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0;i <selections.length; i++) {
                var unique_id = selections[i].get('unique_id');
                uids.push(unique_id);
            }
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/prch.do?method=removeContractSupMst',
                params:{
                    unique_id_list:uids
                },
                success: function(val, action) {
                    gm.me().contractSupMstStore.load();
                },
                // failure: extjsUtil.failureMessage
            });
        }
    },

    contractSupMstStore:Ext.create('Msys.store.PctManStore'),
    supmstStore:Ext.create('Msys.store.SupMstStore'),
    currencyStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'CURRENCY'}),
})