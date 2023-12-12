Ext.define('Msys.views.produce.PlanningConfirmView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Produce PlanningConfirmView');

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridMenuList(this).showAt(e.getXY());
                    return false;
                },
                itemdblclick: this.tabchangeFn
            }
        };

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.assyPlanAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: 'ASSY계산',
            disabled: true,
            tooltip: 'ASSY의 소요량 계산을 진행합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'ASSY계산',
                    msg: 'ASSY의 소요량 계산을 진행하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().assyPlanHandler,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.setDefaultAssyAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: '초기화',
            disabled: true,
            tooltip: 'ASSY의 소요량 계산을 초기화합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'ASSY계산',
                    msg: 'ASSY의 소요량 계산을 진행하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().setDefaultAssyHandler,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.confirmPlanAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: '계획수립',
            // disabled: true,
            tooltip: '해당 제품의 계획수립을 진행합니다.',
            handler: function() {
                gm.me().confirmPlanWindow();
                
            }
        });

        this.returnAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-reject',
            text: '반려',
            disabled: true,
            tooltip: '해당 제품을 BOM확정 전으로 진행합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'반려',
                    msg: '해당 제품을 반려하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().returnForMake,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.divisionProductAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
            text: '제품분할',
            disabled: true,
            tooltip: '해당 제품을 분할 진행합니다.',
            handler: function() {
                gm.me().divisionProductHandler();
            }
        });

        this.useStockAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-rotate-left',
            text: '재고사용',
            disabled: true,
            tooltip: '해당 제품의 가용재고를 사용합니다.',
            handler: function() {
                gm.me().useStockHandler();
            }
        });
        
        // buttonToolbar.insert(1, this.confirmPlanAction);
        buttonToolbar.insert(1, this.returnAction);
        buttonToolbar.insert(2, this.divisionProductAction);
        buttonToolbar.insert(3, this.useStockAction);

        this.createStore('Msys.model.PlanningConfirmModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'status_kr':
                    col['align']  = 'center';
                    col['style']  = 'text-align:center;';
                    break;
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                this.tabPanel()
            ]
        });

        // this.createWest(), this.createEast()

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];
                    var pj_uid = select.get('pj_uid');
                    var item_id = select.get('item_id');
                    var unique_id = select.get('unique_id');

                    gm.me().planAssyTreeStore.getProxy().setExtraParam('pj_uid', pj_uid);
                    gm.me().planAssyTreeStore.getProxy().setExtraParam('item_id', item_id);
                    gm.me().planAssyTreeStore.getProxy().setExtraParam('top_bom_id', unique_id);
                    gm.me().planAssyTreeStore.load({
                        callback: function(records) {
                            gm.me().assyGrid.getSelectionModel().select(0);
                            gm.me().assyGrid.expandAll();
                        }
                    });

                    // gm.me().confirmPlanAction.enable();
                    gm.me().returnAction.enable();
                    gm.me().divisionProductAction.enable();
                    gm.me().useStockAction.enable();
                } else {
                    // gm.me().confirmPlanAction.disable();
                    gm.me().returnAction.disable();
                    gm.me().divisionProductAction.disable();
                    gm.me().useStockAction.disable();
                }
            }
        });

        this.callParent(arguments);
        
        this.store.getProxy().setExtraParam('status', 'BR');
        this.store.load();
    },

    tabchangeFn: function() {
        var tab = Ext.getCmp(gu.id('tabPanel'));
        tab.setActiveTab(Ext.getCmp(gu.id('bomPanel')));
    },

    tabPanel: function() {
        this.grid.setTitle('생산요청');

        this.bomPanel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            items: [
                {
                    region:'west',
                    frame:true,
                    width:'50%',
                    layout:'fit',
                    resizable: true,
                    items: this.createAssyPanel()
                },{
					region: 'center',
                    frame: true,
                    width:'50%',
                    layout:'fit',
                    items: this.createMtrlPanel()
                }
            ]
        });

        this.tabPanel = Ext.widget('tabpanel', {
            id:gu.id('tabPanel'),
            layout: 'border',
            border: true,
            region: 'center',
            width: '100%',
            items: [this.grid, 
                {
                    id:gu.id('bomPanel'),
                    layout:'fit',
                    width:'100%',
                    frame:true,
                    title:'BOM',
                    region:'center',
                    items: this.bomPanel
                }
            ]
        });

        return this.tabPanel;
    },

    createAssyPanel: function() {
        var assy_account_type_list = ['P','O'];
        this.planAssyTreeStore.getProxy().setExtraParam('account_type_list', assy_account_type_list);
        this.assyGrid = Ext.create('Ext.tree.Panel', {
            id:gu.id('assyGrid'),
            title: 'Assembly',
            // collapsible: true,
            cls : 'rfx-panel',
            width: '100%',
            useArrows: true,
            rootVisible: false,
            autoScroll : true,
            autoHeight: true,
            layout :'fit',
            border: false,
            forceFit: true,
            rowLines: true,
            columnLines: true,
            // layout :'border',
            // width:'50%',
            // region:'center',
            // forceFit: true,
            store: this.planAssyTreeStore,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'single'}),
            // multiSelect: true,
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.prdItemStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다."
                ,listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }
            }),
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            // plugins:[this.cellEditing_prd],
            viewConfig: {
                getRowClass : function(record, index) {
                    var bom_lv = record.get('bom_lv');
                    if(bom_lv!=null && bom_lv==1) {
                        record.set('icon', "x-grid-tree-node-expanded x-tree-icon-parent-top");
                        record.set('iconCls', "x-grid-tree-node-expanded x-tree-icon-parent-top");
                        return 'blue-row';
                    };
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
                },
                'afterrender': function (grid) {
                    var elments = Ext.select(".x-column-header", true);
                    elments.each(function (el) {

                    }, this);

                },
                activate: function (tab) {
                    setTimeout(function () {
                        // gu.getCmp('main-panel-center').setActiveTab(0);
                        // alert(tab.title + ' was activated.');
                    }, 1);
                },
                itemcontextmenu: function (view, rec, node, index, e) {
                    e.stopEvent();
                    // gm.me().assyContextMenu.showAt(e.getXY());
                    return false;
                }
            },
            dockedItems: [{
                cls: 'my-x-toolbar-default2',
                dock : 'top',
                xtype: 'toolbar',
                items: [
                    this.searchAssyAction, '-', this.addAssyAction, '-', this.editAssyAction, '-', this.removeAssyAction, '-',
                    this.assyPlanAction, this.setDefaultAssyAction, '->', this.confirmPlanAction
                //    this.removePrdAction, '->',addAttachAction, this.sendMailAction
                ],
            }],
            columns: [
                {
                    xtype: 'treecolumn', // this is so we know which column
                    // will show the tree
                    text: 'BOM',
                    width: 360,
                    autoSizeColumn: true,
                    sortable: true,
                    dataIndex: 'text',
                    locked: true
                }, {
                    text:'공정',
                    dataIndex:'pcs_name',
                    width:80,
                    style: 'text-align:center',
                    align: 'center',
                }, {
                    text:'상태',
                    dataIndex:'status_kr',
                    width:80,
                    style: 'text-align:center',
                    align: 'center',
                }, {
                    text: '생산',
                    dataIndex: 'mk_quan',
                    width: 60,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                    editor:{xtype:'numberfield'},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                }, {
                    text: '재고',
                    dataIndex: 'st_quan',
                    width: 60,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                    editor:{xtype:'numberfield'},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                }, {
                    text: '소요',
                    dataIndex: 'unit_quan',
                    width: 60,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                    renderer: function(value, meta) {
                        return value;
                    }
                }, {
                    text: '필요',
                    dataIndex: 'req_quan',
                    width: 60,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                    renderer: function(value, meta) {
                        return value;
                    }
                }, {
                    text: '가용',
                    dataIndex: 'useful_quan',
                    width: 70,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false
                }
            ]
        });

        this.assyGrid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Call back assy grid select', selections);
                    var select = selections[0];
                    var unique_id = select.get('unique_id');
                    var pj_uid = select.get('pj_uid');
                    var bom_lv = select.get('bom_lv');

                    gm.me().mtrlPartStore.getProxy().setExtraParam('parent_id', unique_id);
                    gm.me().mtrlPartStore.getProxy().setExtraParam('pj_uid', pj_uid);
                    gm.me().mtrlPartStore.load();

                    if(bom_lv!=null && bom_lv>1) {
                        gm.me().editAssyAction.enable();
                        gm.me().removeAssyAction.enable();
                        
                        gm.me().setDefaultAssyAction.disable();
                    } else {
                        gm.me().editAssyAction.disable();
                        gm.me().removeAssyAction.disable();

                        gm.me().setDefaultAssyAction.enable();
                    }
                    gm.me().assyPlanAction.enable();
                } else {
                    gm.me().editAssyAction.disable();
                    gm.me().removeAssyAction.disable();
                    gm.me().assyPlanAction.disable();
                    gm.me().setDefaultAssyAction.disable();
                }
            }
        });

        this.assyGrid.on('edit', function(editor, e) {
            var rec = e.record;
            var unique_id = rec.get('unique_id');
            var bom_lv = rec.get('bom_lv');
            var mk_quan = rec.get('mk_quan');
            var st_quan = rec.get('st_quan');

            if(bom_lv == 1) {
                Ext.Msg.alert('알림', '제품 단위 레벨은 생산만 가능합니다. 재고는 재고사용 버튼을 눌러주세요.');
                gm.me().planAssyTreeStore.load();
                return;
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=updateAssyPlanEdit',
                params: {
                    unique_id:unique_id,
                    mk_quan:mk_quan,
                    st_quan:st_quan
                },
                success: function(result, request) {
                    // gm.me().planAssyTreeStore.load();
                    rec.set('mk_quan', mk_quan);
                    rec.set('st_quan', st_quan);
                    gm.me().mtrlPartStore.load();
                },
                // failure: extjsUtil.failureMessage
            });
        });

        return this.assyGrid;
    },

    mtrlPlanHandler: function(btn) {
        if(btn=='yes') {
            var selections = gm.me().mtrlGrid.getSelectionModel().getSelection();
            var uids = [];

            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var account_type = select.get('account_type');
                var uid = select.get('unique_id');
                switch(account_type) {
                    case 'R':
                    case 'G':
                    case 'E':
                        uids.push(uid);
                        break;
                };
            };

            if(uids.length == 0) {
                Ext.Msg.alert('알림', '조회된 자재가 없습니다.');
                return;
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=mtrlPlanForProduce',
                params:{
                    unique_id_list:uids
                },
                success : function(result, request) {
                    gm.me().mtrlPartStore.load();
                }
            });
        }
    },
    mtrlPlanAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-arrow-right',
        text: '자재계산',
        disabled: true,
        tooltip: 'Part의 소요량 계산을 진행합니다.',
        handler: function() {
            Ext.MessageBox.show({
                title:'자재계산',
                msg: 'Part의 소요량 계산을 진행하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().mtrlPlanHandler,
                // animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),
    addPartAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-plus-circle',
        text: '추가',
        tooltip: 'Part를 등록합니다.',
        handler: function() {
            gm.me().addPartHandler();
        }
    }),
    editPartAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-edit',
        text: '수정',
        disabled: true,
        tooltip: 'Part를 등록합니다.',
        handler: function() {
            gm.me().editPartHandler();
        }
    }),
    removePartAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-remove',
        text: '삭제',
        disabled: true,
        tooltip: 'Part를 등록합니다.',
        handler: function() {
            Ext.MessageBox.show({
                title: '삭제',
                msg: '선택한 항목을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().removePartHandler,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    searchAssyAction: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: '검색',
        tooltip: '어셈블리 조회',
        handler: function(widget, event) {
            gm.me().planAssyTreeStore.load();
        }
    }),
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

    createMtrlPanel: function() {

        this.mtrlPanelModel = Ext.create('Msys.model.ManageCustomBomModel', {});
        var o = {
            pageSize:300, model:this.mtrlPanelModel, sortOnLoad:true, remoteSort:true
        };
        this.mtrlPartStore = new Ext.data.Store(o);

        this.mtrlGrid = Ext.create('Ext.grid.Panel', {
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            store: this.mtrlPartStore,
            title: 'BOM 목록',
            width:'50%',
            cls : 'rfx-panel',
            region:'east',
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.addPartAction, '-', this.editPartAction, '-', this.removePartAction,
                    '->', this.mtrlPlanAction
                ]
            }],
            viewConfig: {
                markDirty: false,
                stripeRows: false,
                getRowClass: function(record) {
                    var account_type = record.get('account_type');
                    switch(account_type) {
                        case 'P':
                        case 'O':
                            return 'blue-row';
                        default:
                            break;
                    }
                }
            },
            columns: [
                // {
                //     text: '레벨',
                //     dataIndex: 'bom_lv',
                //     width: 50,
                //     style: 'text-align:center',
                //     align: 'center'
                // },
                {
                    text: '순번',
                    dataIndex: 'bom_no',
                    width: 40,
                    style: 'text-align:center',
                    align: 'center'
                },{
                    text: '상태',
                    dataIndex: 'status_kr',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    // renderer: function(value, meta, record) {
                    //     return gm.me().getAssyStatus(value, meta, null, record);
                    // }
                },{
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '구매',
                    dataIndex: 'pr_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right',
                    editor:{xtype:'numberfield'},
                    renderer : function(value, meta) {
                        meta.css = 'custom-column';
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
                },{
                    text: '재고',
                    dataIndex: 'st_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right',
                    editor:{xtype:'numberfield'},
                    renderer : function(value, meta) {
                        meta.css = 'custom-column';
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
                },{
                    text: '소요',
                    dataIndex: 'unit_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right',
                    renderer : function(value) {
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
                },{
                    text: '필요',
                    dataIndex: 'req_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right',
                    // editor: {},
                    renderer : function(value, meta) {
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
                },{
                    text: '가용',
                    dataIndex: 'useful_quan',
                    width: 60,
                    style: 'text-align:right',
                    align: 'right',
                    renderer : function(value) {
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
                }
            ]
        });

        this.mtrlGrid.addListener('cellkeydown', this.cellClipCopy);

        this.mtrlGrid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    gm.me().editPartAction.enable();
                    gm.me().removePartAction.enable();
                    gm.me().mtrlPlanAction.enable();
                } else {
                    gm.me().editPartAction.disable();
                    gm.me().removePartAction.disable();
                    gm.me().mtrlPlanAction.disable();
                }
            }
        });

        this.mtrlGrid.on('edit', function(editor, e) {
            var rec = e.record;
            var unique_id = rec.get('unique_id');
            var pr_quan = rec.get('pr_quan');
            var st_quan = rec.get('st_quan');
            var account_type = rec.get('account_type');

            switch(account_type) {
                case 'R':
                case 'E':
                case 'G':
                    break;
                default:
                    Ext.Msg.alert('알림', '자재 목록만 수정 가능합니다.');
                    gm.me().mtrlPartStore.load();
                    return;
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=updateAssyPlanEdit',
                params: {
                    unique_id:unique_id,
                    pr_quan:pr_quan,
                    st_quan:st_quan
                },
                success: function(result, request) {
                    // gm.me().planAssyTreeStore.load();
                },
                // failure: extjsUtil.failureMessage
            });
        });

        return this.mtrlGrid;
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

        var assyStore = gm.me().planAssyTreeStore;
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
                                gm.me().planAssyTreeStore.load();
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
                                gm.me().planAssyTreeStore.load();
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
                    gm.me().planAssyTreeStore.load();
                },
                // failure: extjsUtil.failureMessage
            });
        }
    },

    useAssyStockHandler: function(btn) {
        if(btn=='yes') {
            var select = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design.do?method=useAssyStock',
                params:{
                    unique_id:unique_id
                },
                success: function(val, action) {
                    gm.me().planAssyTreeStore.load();
                },
            });
        }
    },

    removePartHandler: function(btn) {
        if(btn=='yes') {
            var select = gm.me().mtrlGrid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design.do?method=removeAssyData',
                params:{
                    unique_id:unique_id
                },
                success: function(val, action) {
                    gm.me().mtrlPartStore.load();
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

        var assyStore = gm.me().planAssyTreeStore;
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
                                gm.me().mtrlPartStore.load();
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
        var part = gm.me().mtrlGrid.getSelectionModel().getSelection()[0];
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
                                gm.me().mtrlPartStore.load();
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

    returnForMake: function(result) {
        if(result == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');
            var parent_id = select.get('parent_id');
            var bomAssys = gm.me().planAssyTreeStore.data.items;

            for(var i=0; i<bomAssys.length; i++) {
                var assy = bomAssys[i];
                var status = assy.get('status');
                if(status!='BR') {
                    Ext.MessageBox.alert('알림', 'BOM 확정이 아닌 Assembly가 있습니다.');
                    return;
                };
            };
            
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=returnSalesBOM',
                params: {
                    unique_id:unique_id,
                    parent_id:parent_id
                },
                success: function(result, request) {
                	gm.me().store.load(function(records) {});
                },
                // failure: extjsUtil.failureMessage
            });
        }
    },

    divisionProductHandler: function() {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        var req_quan = select.get('req_quan');
        var unique_id = select.get('unique_id');
        var pj_uid = select.get('pj_uid');
        var status = select.get('status');
        if(req_quan!=null && req_quan == 1) {
            Ext.MessageBox.alert('알림', '생산요청량이 2 이상만 가능합니다.');
            return;
        }
        if(status!=null && status == 'BM') {
            Ext.MessageBox.alert('알림', 'BOM 확정 상태만 가능합니다.');
            return;
        }
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('divisionQaun'),
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            width: 400,
            height: 300,
            region: 'center',
            defaults: {
                anchor: '100%',
                editable: true,
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
            items: [
                {
                    xtype:'numberfield',
                    name:'req_quan',
                    fieldLabel:'현재수량',
                    readOnly:true,
                    value:req_quan,
                    fieldStyle : 'background-color: #ddd; background-image: none;'
                },{
                    xtype:'numberfield',
                    name:'division_quan',
                    fieldLabel:'분할수량',
                    allowBlank:false,
                    value:1,
                    minValue:1,
                    maxValue:req_quan-1
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            title: '제품분할',
            width: 400,
            height: 300,
            minWidth: 250,
            minHeight: 180,
            items: form,
            buttons: [{
                text: '확인',
                handler: function() {
                    var form = Ext.getCmp(gu.id('divisionQaun')).getForm();
                    if (form.isValid()) {
                        var val = form.getValues(false);

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/produce.do?method=divisionProductQuan',
                            params: {
                                unique_id:unique_id,
                                curQuan:val['req_quan'],
                                divisionQuan:val['division_quan'],
                                pjUid:pj_uid
                            },
                            success: function(result, request) {
                                if (win) {
                                    win.close();
                                };
                                gm.me().store.load();
                            },
                            // failure: extjsUtil.failureMessage
                        });

                        if (win) {
                            win.close();
                        }
                    } else {
                        Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                    }

                }
            }, {
                text: '취소',
                handler: function() {
                    if (win) {
                        win.close();
                    }
                }
            }]
        });
        win.show();
    },

    usefuleStockHandler: function() {
        Ext.MessageBox.show({
            title:'가용재고 사용',
            msg: "선택한 제품을 가용재고를 통해 진행하시겠습니까?",
            buttons: Ext.MessageBox.YESNO,
            fn:  function(result) {
                if(result=='yes') {
                    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                    var status = rec.get('status');
                    var quan = rec.get('quan');
                    var useful_stock_qty = rec.get('useful_stock_qty');
                    
                    if(status != 'BR') {
                        Ext.MessageBox.alert('알림', 'BOM 확정 상태에서만 가능합니다.');
                        return;
                    };
                    if(quan > useful_stock_qty) {
                        Ext.MessageBox.alert('알림', '가용재고 보다 생산요청량이 많습니다.');
                        return;
                    };

                    var assymap_uid = rec.get('unique_uid');
                    var srcahd_uid = rec.get('unique_id_long');
                    var pj_uid = rec.get('pj_uid');
                    var standard_flag = rec.get('standard_flag');
                    
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/production/schdule.do?method=usefuleStockProduct',
                        params:{
                            assymap_uid:assymap_uid,
                            srcahd_uid:srcahd_uid,
                            pj_uid:pj_uid,
                            standard_flag:standard_flag
                        },
                        success : function(result, request) {
                            gm.me().store.load();
                        }
                    });
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    setDefaultAssyHandler: function(btn) {
        if(btn=='yes') {
            var select = gm.me().assyGrid.getSelectionModel().getSelection()[0];
            var top_uid = select.get('unique_id');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=setDefaultAssy',
                params:{
                    unique_id:top_uid
                },
                success : function(result, request) {
                    gm.me().planAssyTreeStore.load();
                }
            });
        }
    },

    assyPlanHandler: function(btn) {
        if(btn=='yes') {
            var selections = gm.me().assyGrid.getSelectionModel().getSelection();
            var idxs = [];
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var idx = gm.me().planAssyTreeStore.indexOf(select);
                idxs.push(idx);
            };
            idxs = idxs.sort(function (a,b){ return a-b; });

            for(var i=0; i<idxs.length; i++) {
                var key = idxs[i];
                var record = gm.me().planAssyTreeStore.getAt(key);
                var uid = record.get('unique_id');
                uids.push(uid);
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=assyPlanForProduce',
                params:{
                    unique_id_list:uids
                },
                success : function(result, request) {
                    gm.me().planAssyTreeStore.load();
                }
            });
        }
    },

    confirmPlanWindow: function(btn) {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('confirm_plan_form'),
            xtype: 'form',
            frame: false,
            width: 300,
            height: 200,
            border:true,
            width: '100%',
            layout:'column',
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    id:gu.id('plan_req_date'),
                    name:'req_date',
                    xtype:'datefield',
                    width:'80%',
                    allowBlank:false,
                    fieldLabel:'작업요청일',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',
                    dateFormat: 'Y-m-d',
                    value: Ext.Date.format(new Date(), 'Y-m-d')
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            id:gu.id('plan_win'),
            title: '계획수립',
            width: 300,
            height: 150,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    Ext.MessageBox.show({
                        title:'계획수립',
                        msg: '해당 항목을 계획수립 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: gm.me().confirmPlanHandler,
                        // animateTarget: 'mb4',
                        icon: Ext.MessageBox.QUESTION
                    });
                }
            }, {
                text: '취소',
                handler: function(btn) {
                    win.close();
                }
            }]
        });win.show();
    },

    confirmPlanHandler: function(btn) {
        if(btn=='yes') {
            var form = Ext.getCmp(gu.id('confirm_plan_form')).getForm();
            if(form.isValid()) {
                var val = form.getValues(false);

                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                var unique_id = select.get('unique_id');
        
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/produce.do?method=confirmPlanForProduce',
                    params:{
                        unique_id:unique_id,
                        req_date:val['req_date']
                    },
                    success : function(result, request) {
                        gm.me().store.load();
                        gm.me().planAssyTreeStore.load();
                        var win = Ext.getCmp(gu.id('plan_win'));
                        if(win!=null) {
                            win.close();
                        }
                    }
                });
            } else {
                Ext.MessageBox.alert('알림', '계획수립을 실패했습니다.');
            }
        }
    },

    planAssyTreeStore:Ext.create('Msys.store.PlanAssyTreeStore', {}),
    searchAddAssyStore:Ext.create('Msys.store.ItemMstStore', {}),
    searchAddPartStore:Ext.create('Msys.store.ItemMstStore', {}),
    searchAssyStore:Ext.create('Msys.store.ItemMstStore', {}),
})