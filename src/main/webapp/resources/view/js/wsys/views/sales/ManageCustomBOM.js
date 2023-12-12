Ext.define('Msys.views.sales.ManageCustomBOM', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Sales ManageCustomBOM');

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridMenuList(this).showAt(e.getXY());
                    return false;
                }
            }
        };

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addPartAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '추가',
            disabled: true,
            tooltip: 'Part를 등록합니다.',
            handler: function() {
                gm.me().addPartHandler();
            }
        });

        this.editPartAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: '수정',
            disabled: true,
            tooltip: 'Part를 수정합니다.',
            handler: function() {
                gm.me().editPartHandler();
            }
        });

        this.removePartAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '삭제',
            disabled: true,
            tooltip: 'Part를 삭제합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().removePartHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        buttonToolbar.insert(1, this.addPartAction);
        buttonToolbar.insert(2, this.editPartAction);
        buttonToolbar.insert(3, this.removePartAction);

        this.createStore('Msys.model.ManageCustomBomModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'col1':
                    col['align']  = 'center';
                    col['style']  = 'text-align:center;';
                    break;
            }
        });

        Ext.apply(this, {
            layout: 'border',
            // items:[this.createAssy(), this.grid]
            items: [
                {
					region: 'center',
                    width: '60%',
                    layout:'fit',
                    resizable: true,
					items: this.grid
                }, {
                    id:gu.id('assyLayout'),
					region: 'west',
					layout: 'fit',
					width: '40%',
                    resizable: true,
					items: this.createAssy()
                }
            ]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];
                    
                    // 제품(1레벨)의 Part 만 관리 가능
                    var assyRec = gm.me().assyGrid.getSelectionModel().getSelection()[0];
                    var bom_lv = assyRec.get('bom_lv');
                    // if(bom_lv == 1) {
                    //     this.editPartAction.enable();
                    //     this.removePartAction.enable();
                    // } else {
                    //     this.editPartAction.disable();
                    //     this.removePartAction.disable();
                    // }

                    gm.me().editPartAction.enable();
                    gm.me().removePartAction.enable();
                } else {
                    gm.me().editPartAction.disable();
                    gm.me().removePartAction.disable();
                }
            }
        });
        
        var account_type_list = ['R','E'];
        this.store.getProxy().setExtraParam('account_type_list', account_type_list);

        // this.searchAssyStore.getProxy().setExtraParam('limit', 300);
        this.searchAssyStore.getProxy().setExtraParam('account_type_list', ['P']);
        
        this.callParent(arguments);
    },

    createAssy: function() {
        var assy_account_type_list = ['P','O','T'];
        this.assyTreeStore.getProxy().setExtraParam('account_type_list', assy_account_type_list);
        // this.assyTreeStore.getProxy().setExtraParam('item_id', 1);
        // this.assyTreeStore.getProxy().setExtraParam('pj_uid', -1);
        // this.assyTreeStore.load({
        //     callback: function(records) {
        //         gm.me().assyGrid.getSelectionModel().select(0);
        //         gm.me().assyGrid.expandAll();
        //     }
        // });

        this.srchProjectStore.getProxy().setExtraParam('status', 'CR');

        this.assyGrid = Ext.create('Ext.tree.Panel', {
            id:gu.id('assyGrid'),
            store:this.assyTreeStore,
            useArrows: true,
            rootVisible: false,
            forceFit: true,
            rowLines: true,
            // selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            // multiSelect: true,
            viewConfig: {
                getRowClass : function(record, index) {
                    var bom_lv = record.get('bom_lv');
                    switch(bom_lv) {
                        case 1:
                            return 'blue-row';
                        // default:
                        //     return 'gray2-row';
                    }
                },
                enableTextSelection: true
            },
            listeners: {
                cellkeydown:  function(table, td, columnIndex, record, tr, rowIndex, e)  {
                    if (e.getKey() == 67) {
                        var value = td.innerText;

                        var tempElem = document.createElement('textarea');
                        tempElem.value = value;  
                        document.body.appendChild(tempElem);

                        tempElem.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempElem);
                    }
                }
            },
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.addAssyAction, this.editAssyAction, this.removeAssyAction,
                        '->', this.confirmBomAction
                        // '->', this.searchItemAction
                    ],
                }, {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items:[
                        {
                            xtype:'combo',
                            id:'srch_pj_code',
                            name:'srch_pj_code',
                            store: this.srchProjectStore,
                            width:'100%',
                            emptyText:'프로젝트 검색',
                            displayField: 'pj_name',
                            valueField: 'unique_id',
                            listConfig: {
                                maxHeight:500,
                                getInnerTpl: function() {
                                    return '<div data-qtip="{unique_id}"><small><font color=blue>[{pj_code}]</font> {pj_name}</small></div>';
                                }
                            },
                            pageSize: 100,
                            triggerAction: 'all',
                            listeners: {
                                select: function(combo, record) {
                                    console.log('=== srch_pj_code combo', combo);
                                    console.log('=== srch_pj_code record', record);

                                    this.vPJ_UID = record.get('unique_id');
                                    this.vTOP_BOM_ID = record.get('top_bom_id');
                                    this.vTOP_ITEM_ID = record.get('item_id');

                                    // this.assyTreeStore.getProxy().setExtraParam('item_id', 1);
                                    gm.me().assyTreeStore.getProxy().setExtraParam('pj_uid', this.vPJ_UID);
                                    gm.me().assyTreeStore.getProxy().setExtraParam('item_id', this.vTOP_ITEM_ID);
                                    gm.me().assyTreeStore.load({
                                        callback: function(records) {
                                            gm.me().assyGrid.getSelectionModel().select(0);
                                            gm.me().assyGrid.expandAll();
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ],
            columns:[
                {
                    xtype: 'treecolumn',
                    id:gu.id('assy_bom'),
                    text: 'BOM',
                    width: 570,
                    autoSizeColumn: true,
                    sortable: true,
                    dataIndex: 'text'
                }, {
                    xtype: 'checkcolumn',
                    text: 'BOM확정',
                    dataIndex: 'is_close',
                    width: 80,
                    disabled: true,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: true,
                    listeners: {
                        checkchange: {
                            fn: function(obj, rowIndex, checked, record) {
                                var is_close = record.get('is_close');
                                var status = record.get('status');

                                if(is_close == 'Y') {
                                    Ext.MessageBox.alert('경고','이미 확정 및 진행된 항목입니다.');
                                    return;
                                }
                            }
                        }
                    }
                }, {
                    text: '상태',
                    dataIndex: 'status_kr',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                    // renderer: function(value, meta) {
                    //     return gm.me().getAssyStatus(value, meta);
                    // }
                }
            ]
        });

        this.assyGrid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    console.log('==== assy grid select', select);
                    var unique_id = select.get('unique_id');
                    var pj_uid = select.get('pj_uid');
                    var bom_lv = select.get('bom_lv');

                    gm.me().store.getProxy().setExtraParam('parent_id', unique_id);
                    gm.me().store.getProxy().setExtraParam('pj_uid', pj_uid);

                    gm.me().store.load();

                    gm.me().editAssyAction.enable();
                    gm.me().removeAssyAction.enable();

                    gm.me().addPartAction.enable();

                    if(bom_lv == 1) {
                        gm.me().confirmBomAction.enable();
                    } else {
                        gm.me().confirmBomAction.disable();
                    }
                    
                } else {
                    gm.me().editAssyAction.disable();
                    gm.me().removeAssyAction.disable();
                    gm.me().addPartAction.disable();
                    gm.me().confirmBomAction.disable();
                }
            }
        });

        return this.assyGrid;
    },

    addAssyAction: Ext.create('Ext.Action', {
        iconCls: 'af-plus-circle',
        text: '추가',
        tooltip: '어셈블리 추가',
        handler: function(widget, event) {
            gm.me().addAssyHandler();
        }
    }),

    editAssyAction: Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: '수정',
        tooltip: '어셈블리 수정',
        disabled: true,
        handler: function(widget, event) {
            gm.me().editAssyHandler();
        }
    }),

    removeAssyAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '삭제',
        tooltip: '어셈블리 삭제',
        disabled: true,
        handler: function(widget, event) {
            Ext.MessageBox.show({
                title: '항목삭제',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().removeAssyHandler,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    confirmBomAction: Ext.create('Ext.Action', {
        iconCls: 'af-arrow-right',
        text: 'BOM 확정',
        tooltip: '제품별 구성된 BOM을 확정됩니다.',
        disabled: true,
        handler: function(widget, event) {
            Ext.MessageBox.show({
                title: 'BOM 확정',
                msg: '해당 항목을 확정 하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().confirmBomHandler,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    searchItemAction: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: '프로젝트 검색',
        tooltip: '프로젝트를 검색합니다.',
        handler: function(widget, event) {
            var form = Ext.create('Ext.form.Panel', {
                id: gu.id('search_item_form'),
                xtype: 'form',
                frame: false,
                border: false,
                // width: '60%',
                // layout:'column',
                bodyPadding: 10,
                fieldDefaults: {
                    labelAlign: 'right',
                    msgTarget: 'side'
                },
                items: [
                    gm.me().searchAssyFn()
                ]
            });

            var win = Ext.create('Ext.Window', {
                modal: false,
                title: '프로젝트 검색',
                width: 900,
                height: 800,
                plain: true,
                layout:'fit',
                items: [
                    form
                ],
                buttons: [{
                    text: '확인',
                    handler: function(btn) {
                        gm.me().searchItemClick();
                    }
                }, {
                    text: '취소',
                    handler: function(btn) {
                        win.close();
                    }
                }]
            });win.show();
        }
    }),

    searchAssyFn: function() {
        this.searchAssyGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().searchAssyStore,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: false,
            height: 700,
            padding: '0 0 5 0',
            // flex: 1,
            layout: 'fit',
            forceFit: true,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.searchAssyStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }
            }),
            listeners: {
                itemdblclick: function(view, record) {
                    gm.me().searchItemClick();
                }
            },
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
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style: 'background-color: #EFEFEF;',
                    items: [ 
                        {
                            xtype:'button',
                            text:'검색',
                            iconCls: 'af-search',
                            handler: function() {
                                gm.me().searchAssyStore.load();
                            }
                        },{
                            field_id: 'search_item_code',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_code_part'),
                            name: 'search_item_code',
                            margin: '3 3 3 3',
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');

                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchStorePart.getProxy().setExtraParam('item_code', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchStorePart.proxy.extraParams.item_code;
                                    }
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchStorePart.load();
                                        }
                                    }
                                }
                            }
                        },
                        {
                            field_id:  'search_item_name',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_item_name_part'),
                            name: 'search_item_name',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchStorePart.getProxy().setExtraParam('item_name', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchStorePart.proxy.extraParams.item_name;
                                    }
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchStorePart.load();
                                        }
                                    }
                                }
                            }
                        },
                        {
                            field_id: 'search_specification',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_specification_part'),
                            name: 'search_specification',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchStorePart.getProxy().setExtraParam('specification', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchStorePart.proxy.extraParams.specification;
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchStorePart.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchStorePart.load();
                                        }
                                    }
                                }
                            }
                        },
                        '->',
                        // this.itemSearchAction
                    ]
                }
            ]
        });

        return this.searchAssyGrid;
    },

    searchAddAssyFn: function() {
        gm.me().searchAddAssyStore.getProxy().setExtraParam('account_type_list', ['P', 'O']);
        this.searchAddAssyGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().searchAddAssyStore,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: false,
            height: '100%',
            padding: '0 0 5 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            listeners: {
                select: function(view, data) {
                    var item_code = data.get('item_code');
                    var item_name = data.get('item_name');
                    var specification = data.get('specification');
                    var item_id = data.get('unique_id');

                    Ext.getCmp(gu.id('addAssyForm_item_code')).setValue(item_code);
                    Ext.getCmp(gu.id('addAssyForm_item_name')).setValue(item_name);
                    Ext.getCmp(gu.id('addAssyForm_specification')).setValue(specification);
                    Ext.getCmp(gu.id('addAssyForm_item_id')).setValue(item_id);
                }
            },
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
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style: 'background-color: #EFEFEF;',
                    items: [
                        // {
                        //     xtype:'checkboxfield',
                        //     align:'left',
                        //     fieldLabel:'화면유지',
                        //     labelWidth: 60,
                        //     id: 'win_check',
                        //     checked: gm.me().win_check == true ? true : false,
                        //     inputValue: '-1',
                        //     listeners:{
                        //         change:function(checkbox, checked){
                        //             if(checked) {
                        //                 gm.me().win_check = true;
                        //             } else {
                        //                 gm.me().win_check = false;
                        //             }
                        //         }
                        //     }
                        // }, 
                        {
                            xtype:'button',
                            text:'검색',
                            iconCls: 'af-search',
                            handler: function() {
                                gm.me().searchAddAssyStore.load();
                            }
                        },{
                            field_id: 'search_add_item_code',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_add_item_code_assy'),
                            name: 'item_code',
                            margin: '3 3 3 3',
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');

                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchAddAssyStore.getProxy().setExtraParam('item_code', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchAddAssyStore.proxy.extraParams.item_code;
                                    }
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchAddAssyStore.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchAddAssyStore.load();
                                        }
                                    }
                                }
                            }
                        },
                        {
                            field_id:  'search_add_item_name',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_add_item_name_assy'),
                            name: 'item_name',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchAddAssyStore.getProxy().setExtraParam('item_name', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchAddAssyStore.proxy.extraParams.item_name;
                                    }
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchAddAssyStore.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchAddAssyStore.load();
                                        }
                                    }
                                }
                            }
                        },
                        {
                            field_id: 'search_add_specification',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_add_specification_assy'),
                            name: 'specification',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchAddAssyStore.getProxy().setExtraParam('specification', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchAddAssyStore.proxy.extraParams.specification;
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchAddAssyStore.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchAddAssyStore.load();
                                        }
                                    }
                                }
                            }
                        },
                        '->',
                        // this.itemSearchAction
                    ]
                }
            ]
        });

        return this.searchAddAssyGrid;
    },

    addAssyFn: function() {
        this.addAssyForm = Ext.create('Ext.form.Panel', {
            id: gu.id('addAssyForm'),
            xtype: 'form',
            frame: false,
            border: false,
            // width: 800,
            // height: 600,
            bodyPadding: 10,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    id:gu.id('addAssyForm_item_code'),
                    name:'item_code',
                    xtype:'textfield',
                    fieldLabel:'품번',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                }, {
                    id:gu.id('addAssyForm_item_name'),
                    name:'item_name',
                    xtype:'textfield',
                    fieldLabel:'품명',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                }, {
                    id:gu.id('addAssyForm_specification'),
                    name:'specification',
                    xtype:'textfield',
                    fieldLabel:'규격',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                }, {
                    id:gu.id('addAssyForm_bom_no'),
                    name:'bom_no',
                    xtype:'textfield',
                    fieldLabel:'순번',
                    allowBlank: false,
                }, {
                    id:gu.id('addAssyForm_unit_quan'),
                    name:'unit_quan',
                    xtype:'numberfield',
                    minValue:0,
                    value:1,
                    fieldLabel:'소요량',
                    decimalPrecision: 2,
                    allowBlank: false,
                }, {
                    id:gu.id('addAssyForm_bom_lv'),
                    name:'bom_lv',
                    xtype:'textfield',
                    hidden:true
                }, {
                    id:gu.id('addAssyForm_item_id'),
                    name:'item_id',
                    xtype:'numberfield',
                    hidden:true
                }, {
                    id:gu.id('addAssyForm_parent_id'),
                    name:'parent_id',
                    xtype:'numberfield',
                    hidden:true
                }
            ]
        });

        return this.addAssyForm;
    },

    searchItemClick: function() {
        var rec = gm.me().searchAssyGrid.getSelectionModel().getSelection()[0];
        console.log('=== srch item click', rec);
        var item_id = rec.get('unique_id');

        this.assyTreeStore.getProxy().setExtraParam('item_id', item_id);
        this.assyTreeStore.load({
            callback: function(records) {
                gm.me().assyGrid.getSelectionModel().select(0);
                gm.me().assyGrid.expandAll();
            }
        });
    },

    addAssyHandler: function() {
        
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('add_assy_form'),
            xtype: 'form',
            frame: false,
            width: 700,
            height: 700,
            // width: '60%',
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
                    region:'center',
                    width:'100%',
                    height:'70%',
                    resizable:true,
                    frame:true,
                    items:gm.me().searchAddAssyFn()
                }, {
                    region:'south',
                    width:'100%',
                    height:'30%',
                    resizable:true,
                    frame:true,
                    items:gm.me().addAssyFn()
                }
            ]
        });

        var assyStore = gm.me().assyTreeStore;
        var assy = assyStore.data.items;
        var next_assy_no = null;
        var next_assy_lv = null;
        var cur_parent_id = null;
        var top_bom_id = null;
        var pj_uid = null;
        if(assy==null || assy.length<1) {
            next_assy_no = 1;
            next_assy_lv = 1;
            cur_parent_id = -1;
            top_bom_id = -1;
        } else {
            var arr = [];
            var selectAssy = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var uid = selectAssy.get('unique_id');
            var lv = selectAssy.get('bom_lv');
            if(lv == 1) {
                top_bom_id = selectAssy.get('unique_id');
            } else {
                top_bom_id = selectAssy.get('top_id');
            }
            for(var i=0; i<assy.length; i++) {
                var a = assy[i];
                var p_id = a.get('parent_id');
                if(uid == p_id) {
                    arr.push(a);
                }
            }
            next_assy_no = arr.length + 1;
            next_assy_lv = lv+1;
            cur_parent_id = selectAssy.get('unique_id');
            pj_uid = selectAssy.get('pj_uid');
        };

        Ext.getCmp(gu.id('addAssyForm_bom_no')).setValue(next_assy_no);
        Ext.getCmp(gu.id('addAssyForm_bom_lv')).setValue(next_assy_lv);
        Ext.getCmp(gu.id('addAssyForm_parent_id')).setValue(cur_parent_id);

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '추가',
            width: 700,
            height: 700,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('add_assy_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design.do?method=addAssyData',
                            params:{
                                item_id:val['item_id'],
                                bom_lv:val['bom_lv'],
                                bom_no:val['bom_no'],
                                unit_quan:val['unit_quan'],
                                parent_id:val['parent_id'],
                                top_bom_id:top_bom_id,
                                pj_uid:pj_uid
                            },
                            success: function(val, action) {
                                gm.me().assyTreeStore.load();
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

    editAssyHandler: function() {
        var assy = gm.me().assyGrid.getSelectionModel().getSelection()[0];
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('edit_assy_form'),
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
                    id:gu.id('editAssyForm_item_code'),
                    name:'item_code',
                    xtype:'textfield',
                    fieldLabel:'품번',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:assy.get('item_code')
                }, {
                    id:gu.id('editAssyForm_item_name'),
                    name:'item_name',
                    xtype:'textfield',
                    fieldLabel:'품명',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:assy.get('item_name')
                }, {
                    id:gu.id('editAssyForm_specification'),
                    name:'specification',
                    xtype:'textfield',
                    fieldLabel:'규격',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:assy.get('specification')
                }, {
                    id:gu.id('editAssyForm_bom_no'),
                    name:'bom_no',
                    xtype:'textfield',
                    fieldLabel:'순번',
                    allowBlank: false,
                    value:assy.get('bom_no')
                }, {
                    id:gu.id('editAssyForm_unit_quan'),
                    name:'unit_quan',
                    xtype:'numberfield',
                    minValue:0,
                    value:1,
                    fieldLabel:'소요량',
                    decimalPrecision: 2,
                    allowBlank: false,
                    value:assy.get('unit_quan')
                }, {
                    id:gu.id('editAssyForm_req_quan'),
                    name:'req_quan',
                    xtype:'numberfield',
                    minValue:0,
                    value:1,
                    fieldLabel:'필요량',
                    decimalPrecision: 2,
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:assy.get('req_quan')
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '수정',
            width: 500,
            height: 300,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('edit_assy_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        var unique_id = assy.get('unique_id');
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design.do?method=editAssyData',
                            params:{
                                unique_id:unique_id,
                                bom_no:val['bom_no'],
                                unit_quan:val['unit_quan'],
                            },
                            success: function(val, action) {
                                gm.me().assyTreeStore.load();
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

    removeAssyHandler: function(btn) {
        if(btn=='yes') {
            var select = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design.do?method=removeAssyData',
                params:{
                    unique_id:unique_id
                },
                success: function(val, action) {
                    gm.me().assyTreeStore.load();
                },
                // failure: extjsUtil.failureMessage
            });
        }
    },

    confirmBomHandler: function(btn) {
        if(btn == 'yes') {
            var select = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');
    
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=confirmBom',
                params:{
                    unique_id:unique_id
                },
                success: function(val, action) {
                    gm.me().assyTreeStore.load();
                },
            });
        }
    },

    removePartHandler: function(btn) {
        if(btn=='yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design.do?method=removeAssyData',
                params:{
                    unique_id:unique_id
                },
                success: function(val, action) {
                    gm.me().assyTreeStore.load();
                },
                // failure: extjsUtil.failureMessage
            });
        }
    },

    searchAddPartFn: function() {
        gm.me().searchAddPartStore.getProxy().setExtraParam('account_type_list', ['R', 'E']);
        this.searchAddPartGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().searchAddPartStore,
            multiSelect: false,
            autoScroll : true,
            autoHeight: true,
            border: false,
            height: '100%',
            padding: '0 0 5 0',
            flex: 1,
            layout: 'fit',
            forceFit: true,
            listeners: {
                select: function(view, data) {
                    var item_code = data.get('item_code');
                    var item_name = data.get('item_name');
                    var specification = data.get('specification');
                    var item_id = data.get('unique_id');

                    Ext.getCmp(gu.id('addPartForm_item_code')).setValue(item_code);
                    Ext.getCmp(gu.id('addPartForm_item_name')).setValue(item_name);
                    Ext.getCmp(gu.id('addPartForm_specification')).setValue(specification);
                    Ext.getCmp(gu.id('addPartForm_item_id')).setValue(item_id);
                }
            },
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
                }
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style: 'background-color: #EFEFEF;',
                    items: [
                        // {
                        //     xtype:'checkboxfield',
                        //     align:'left',
                        //     fieldLabel:'화면유지',
                        //     labelWidth: 60,
                        //     id: 'win_check',
                        //     checked: gm.me().win_check == true ? true : false,
                        //     inputValue: '-1',
                        //     listeners:{
                        //         change:function(checkbox, checked){
                        //             if(checked) {
                        //                 gm.me().win_check = true;
                        //             } else {
                        //                 gm.me().win_check = false;
                        //             }
                        //         }
                        //     }
                        // }, 
                        {
                            xtype:'button',
                            text:'검색',
                            iconCls: 'af-search',
                            handler: function() {
                                gm.me().searchAddPartStore.load();
                            }
                        },{
                            field_id: 'search_add_item_code',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_add_item_code_part'),
                            name: 'item_code',
                            margin: '3 3 3 3',
                            xtype: 'triggerfield',
                            emptyText: '품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');

                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchAddPartStore.getProxy().setExtraParam('item_code', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchAddPartStore.proxy.extraParams.item_code;
                                    }
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchAddPartStore.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchAddPartStore.load();
                                        }
                                    }
                                }
                            }
                        },
                        {
                            field_id:  'search_add_item_name',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_add_item_name_part'),
                            name: 'item_name',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchAddPartStore.getProxy().setExtraParam('item_name', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchAddPartStore.proxy.extraParams.item_name;
                                    }
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchAddPartStore.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchAddPartStore.load();
                                        }
                                    }
                                }
                            }
                        },
                        {
                            field_id: 'search_add_specification',
                            width: 150,
                            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
                            id: gu.id('search_add_specification_part'),
                            name: 'specification',
                            xtype: 'triggerfield',
                            margin: '3 3 3 3',
                            emptyText: '규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click: function () {
                                this.setValue('');
                            },
                            listeners: {
                                change: function (fieldObj, e) {
                                    if (e.trim().length > 0) {
                                        gm.me().searchAddPartStore.getProxy().setExtraParam('specification', '%'+e+'%');
                                    } else {
                                        delete gm.me().searchAddPartStore.proxy.extraParams.specification;
                                    }
                                },
                                render: function (c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                },
                                specialkey: function(f, e) {
                                    if (e.getKey() == Ext.EventObject.ENTER) {
                                        var extraParams = gm.me().searchAddPartStore.getProxy().getExtraParams();
                
                                        if (Object.keys(extraParams).length == 0) {
                                            Ext.Msg.alert('', '검색 키워드를 입력하시기 바랍니다.');
                                        } else {
                                            gm.me().searchAddPartStore.load();
                                        }
                                    }
                                }
                            }
                        },
                        '->',
                        // this.itemSearchAction
                    ]
                }
            ]
        });

        return this.searchAddPartGrid;
    },

    addPartFn: function() {
        this.addPartForm = Ext.create('Ext.form.Panel', {
            id: gu.id('addPartForm'),
            xtype: 'form',
            frame: false,
            border: false,
            // width: 800,
            // height: 600,
            bodyPadding: 10,
            layout: {
                type: 'vbox',
                align: 'stretch' // Child items are stretched to full width
            },
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    id:gu.id('addPartForm_item_code'),
                    name:'item_code',
                    xtype:'textfield',
                    fieldLabel:'품번',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                }, {
                    id:gu.id('addPartForm_item_name'),
                    name:'item_name',
                    xtype:'textfield',
                    fieldLabel:'품명',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                }, {
                    id:gu.id('addPartForm_specification'),
                    name:'specification',
                    xtype:'textfield',
                    fieldLabel:'규격',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                }, {
                    id:gu.id('addPartForm_bom_no'),
                    name:'bom_no',
                    xtype:'textfield',
                    fieldLabel:'순번',
                    allowBlank: false,
                }, {
                    id:gu.id('addPartForm_unit_quan'),
                    name:'unit_quan',
                    xtype:'numberfield',
                    minValue:0,
                    value:1,
                    fieldLabel:'소요량',
                    decimalPrecision: 2,
                    allowBlank: false,
                }, {
                    id:gu.id('addPartForm_bom_lv'),
                    name:'bom_lv',
                    xtype:'textfield',
                    hidden:true
                }, {
                    id:gu.id('addPartForm_item_id'),
                    name:'item_id',
                    xtype:'numberfield',
                    hidden:true
                }, {
                    id:gu.id('addPartForm_parent_id'),
                    name:'parent_id',
                    xtype:'numberfield',
                    hidden:true
                }
            ]
        });

        return this.addPartForm;
    },

    addPartHandler: function() {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('add_part_form'),
            xtype: 'form',
            frame: false,
            width: 700,
            height: 700,
            // width: '60%',
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
                    region:'center',
                    width:'100%',
                    height:'70%',
                    resizable:true,
                    frame:true,
                    items:gm.me().searchAddPartFn()
                }, {
                    region:'south',
                    width:'100%',
                    height:'30%',
                    resizable:true,
                    frame:true,
                    items:gm.me().addPartFn()
                }
            ]
        });

        var partStore = gm.me().store;
        var part = partStore.data.items;
        var next_assy_no = null;
        var next_assy_lv = null;
        var cur_parent_id = null;
        var top_bom_id = null;
        if(part==null || part.length<1) {
            next_assy_no = 1;
        } else {
            next_assy_no = part.length + 1;
        };

        var assyStore = gm.me().assyTreeStore;
        var assy = assyStore.data.items;
        var selectAssy = gm.me().assyGrid.getSelectionModel().getSelection()[0];
        var lv = selectAssy.get('bom_lv');
        var pj_uid = selectAssy.get('pj_uid');
        next_assy_lv = lv+1;

        for(var i=0; i<assy.length; i++) {
            var a = assy[i];
            var lev = a.get('bom_lv');
            if(lev == 1) {
                top_bom_id = a.get('unique_id');
            }
        }
        cur_parent_id = selectAssy.get('unique_id');

        Ext.getCmp(gu.id('addPartForm_bom_no')).setValue(next_assy_no);
        Ext.getCmp(gu.id('addPartForm_bom_lv')).setValue(next_assy_lv);
        Ext.getCmp(gu.id('addPartForm_parent_id')).setValue(cur_parent_id);

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '추가',
            width: 700,
            height: 700,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('add_part_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design.do?method=addPartData',
                            params:{
                                item_id:val['item_id'],
                                bom_lv:val['bom_lv'],
                                bom_no:val['bom_no'],
                                unit_quan:val['unit_quan'],
                                parent_id:val['parent_id'],
                                top_bom_id:top_bom_id,
                                pj_uid:pj_uid
                            },
                            success: function(val, action) {
                                gm.me().store.load();
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

    editPartHandler: function() {
        var part = gm.me().grid.getSelectionModel().getSelection()[0];
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('edit_part_form'),
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
                    id:gu.id('editPartForm_item_code'),
                    name:'item_code',
                    xtype:'textfield',
                    fieldLabel:'품번',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:part.get('item_code')
                }, {
                    id:gu.id('editPartForm_item_name'),
                    name:'item_name',
                    xtype:'textfield',
                    fieldLabel:'품명',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:part.get('item_name')
                }, {
                    id:gu.id('editPartForm_specification'),
                    name:'specification',
                    xtype:'textfield',
                    fieldLabel:'규격',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:part.get('specification')
                }, {
                    id:gu.id('editPartForm_bom_no'),
                    name:'bom_no',
                    xtype:'textfield',
                    fieldLabel:'순번',
                    allowBlank: false,
                    value:part.get('bom_no')
                }, {
                    id:gu.id('editPartForm_unit_quan'),
                    name:'unit_quan',
                    xtype:'numberfield',
                    minValue:0,
                    value:1,
                    fieldLabel:'소요량',
                    decimalPrecision: 2,
                    allowBlank: false,
                    value:part.get('unit_quan')
                }, {
                    id:gu.id('editPartForm_req_quan'),
                    name:'req_quan',
                    xtype:'numberfield',
                    minValue:0,
                    value:1,
                    fieldLabel:'필요량',
                    decimalPrecision: 2,
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:part.get('req_quan')
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '수정',
            width: 500,
            height: 300,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('edit_part_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        var unique_id = part.get('unique_id');
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design.do?method=editAssyData',
                            params:{
                                unique_id:unique_id,
                                bom_no:val['bom_no'],
                                unit_quan:val['unit_quan'],
                            },
                            success: function(val, action) {
                                gm.me().store.load();
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
    
    searchAddAssyStore:Ext.create('Msys.store.ItemMstStore', {}),
    searchAddPartStore:Ext.create('Msys.store.ItemMstStore', {}),
    searchAssyStore:Ext.create('Msys.store.ItemMstStore', {}),
    assyTreeStore:Ext.create('Msys.store.AssyTreeStore', {}),
    srchProjectStore:Ext.create('Msys.store.ProjectStore', {}),
})