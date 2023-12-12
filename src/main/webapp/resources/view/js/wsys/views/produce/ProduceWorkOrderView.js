Ext.define('Msys.views.produce.ProduceWorkOrderView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Produce ProduceWorkOrderView');

        // var buttonToolbar = this.createButtonToolbar();
        // var searchToolbar = this.createSearchToolbar();
        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = [];
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
            buttonToolbar.items.remove(item);
            // if(index==0||index==1||index==2||index==3||index==4) {
            //     buttonToolbar.items.remove(item);
            // }
        });

        this.execWorkOrderAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: '작업지시',
            disabled: true,
            tooltip: '선택하신 항목을 작업지시 합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'작업지시',
                    msg: '선택하신 항목을 작업지시하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().execWorkOrderHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.workOrderPdfAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-pdf',
            text: '작업지시서',
            disabled: true,
            tooltip: '선택하신 항목의 작업지시서를 출력합니다.',
            handler: function() {
                gm.me().workOrderPdfHandler();
            }
        });

        buttonToolbar.insert(1, this.execWorkOrderAction);
        buttonToolbar.insert(2, this.workOrderPdfAction);

        this.createStore('Msys.model.ProduceWorkOrderModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'status_kr':
                    col['align']  = 'center';
                    col['style']  = 'text-align:center;';
                    col['renderer']  = function(value, meta, record) {
                        gm.me().setStatusStyle(value, meta, record)
                        return value;
                    }
                    break;
                case 'bom_no':
                    col['renderer'] = function(value) {
                        console.log('==value', value);
                        if(value==null||value=='') value = 0;
                        return value;
                    };
                    break;
            }
        });

        Ext.apply(this, {
            layout: 'border',
			items: [
                {
                    region: 'west',
                    frame: false,
                    width:'40%',
                    layout:'fit',
                    flex : 1,
                    items: this.createWest()
                },{
					region: 'center',
                    frame: false,
                    width:'60%',
                    height:'100%',
                    layout:'border',
                    items: [
                        {
                            region: 'center',
                            width:'100%',
                            height:'50%',
                            layout:'fit',
                            items: this.grid
                        },
                        {
                            region: 'south',
                            width:'100%',
                            height:'50%',
                            layout:'fit',
                            items: this.createCenter()
                        }
                    ]
                }
			]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];
                    var unique_id = select.get('unique_id');
                    var bom_id = select.get('bom_id');

                    gm.me().partBomStore.getProxy().setExtraParam('parent_id', bom_id);
                    gm.me().partBomStore.load();

                    gm.me().execWorkOrderAction.enable();
                    gm.me().workOrderPdfAction.enable();

                } else {
                    gm.me().execWorkOrderAction.disable();
                    gm.me().workOrderPdfAction.disable();

                    gm.me().partBomStore.removeAll();
                }
            }
        });

        this.callParent(arguments);
        
        this.workOderProductStore.getProxy().setExtraParam('limit', 300);
        this.partBomStore.getProxy().setExtraParam('limit', 300);

        this.store.getProxy().setExtraParam('orderBy', 'bomman.bom_lv, bomman.bom_no ASC');
        this.workOderProductStore.getProxy().setExtraParam('orderBy', 'prjman.pj_code ASC');
        this.partBomStore.getProxy().setExtraParam('orderBy', 'bomman.bom_no ASC');
    },

    searchPjAssyAction: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: '검색',
        tooltip: '작업 제품 검색',
        handler: function () {
            gm.me().workOderProductStore.load();
        }
    }),
    rejectPjAssyAction: Ext.create('Ext.Action', {
        iconCls: 'af-reject',
        text: '반려',
        tooltip: '작업 제품 반려',
        disabled:true,
        handler: function () {
            Ext.MessageBox.show({
                title:'반려',
                msg: '선택하신 항목을 반려하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: gm.me().rejectPjAssyHandler,
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),
    rejectPjAssyHandler: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().projectAssyGrid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=rejectPjAssy',
                params:{
                    unique_id_list : uids
                },
                success: function(){
                    gm.me().workOderProductStore.load();
                },
                failure: function(){
                    // gm.me().showToast('결과', '삭제실패' );
                }
            });
        }
    },
    createWest: function() {
        this.workOderProductStore = Ext.create('Msys.store.WorkOderProductStore', {});
        this.workOderProductStore.getProxy().setExtraParam('bom_lv', 1);
        this.workOderProductStore.load();

        this.projectAssyGrid = Ext.create('Ext.grid.Panel', {
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: false,
            layout :'fit',
            forceFit: true,
            columnLines: true,
            store: this.workOderProductStore,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.workOderProductStore,
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
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            viewConfig: {
                
            },
            dockedItems: [
                {
                    cls: 'my-x-toolbar-default2',
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.searchPjAssyAction,
                        this.rejectPjAssyAction
                    ],
                },
                // {
                //     dock: 'top',
                //     xtype: 'toolbar',
                //     cls: 'my-x-toolbar-default1',
                //     items: [
                //     ]
                // }
            ],
            columns: [
                {
                    text: '진행상태',
                    dataIndex: 'status_kr',
                    width: 70,
                    align:'center',
                    sortable: true,
                    renderer: function(value, meta, record) {
                        gm.me().setStatusStyle(value, meta, record);
                        return value;
                    }
                },{   
                    text: '수주번호',
                    dataIndex: 'pj_code',
                    width: 80,
                    sortable: true,
                    align:'left',
                    style:'text-align:center'
                },{   
                    text: '프로젝트명',
                    dataIndex: 'pj_name',
                    width: 140,
                    sortable: true,
                    align:'left',
                    style:'text-align:center'
                },{   
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 120,
                    sortable: true,
                    align:'left',
                    style:'text-align:center'
                }, {
                    text: '납품요청일',
                    dataIndex: 'req_delivery_date',
                    width: 80,
                    sortable: true,
                    align:'left',
                    style:'text-align:center',
                    renderer: function(value, meta) {
                        if(value!=null&&value.length>0) {
                            value = value.substring(0,10);
                        } else {
                            value = '';
                        }
                        return  value;
                    }
                }, {   
                    text: '납품수량',
                    dataIndex: 'recv_quan',
                    width: 70,
                    sortable: true,
                    align:'center',
                    renderer: function(value, meta) {
                        if(value!=null) {
                            value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        } else {
                            value = 0;
                        }
                        return  value;
                    }
                },
            ],
        });

        this.projectAssyGrid.addListener('cellkeydown', this.cellClipCopy);

        this.projectAssyGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length>0) {
                    var select = selections[0];
                    var unique_id = select.get('bom_id');
                    var pj_uid = select.get('pj_uid');
                    var account_type_list = ['P','O'];

                    gm.me().store.getProxy().setExtraParam('pj_uid', pj_uid);
                    gm.me().store.getProxy().setExtraParam('total_id', unique_id);
                    gm.me().store.getProxy().setExtraParam('account_type_list', account_type_list);
                    gm.me().store.load();

                    gm.me().rejectPjAssyAction.enable();
                } else {
                    gm.me().rejectPjAssyAction.disable();

                    gm.me().store.removeAll();
                    gm.me().partBomStore.removeAll();
                }
            }
        });

        return this.projectAssyGrid;
    },

    createCenter: function() {
        this.partBomStore = Ext.create('Msys.store.PartBomStore', {});

        this.partListGrid = Ext.create('Ext.grid.Panel', {
            collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            columnLines:true,
            // layout :'fit',
            height:'50%',
            // forceFit: true,
            store: this.partBomStore,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.partBomStore,
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
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            viewConfig: {
                // getRowClass : function(record, index) {
                //     var child_cnt = record.get('child_cnt');
                //     if(child_cnt < 1) {
                //         return 'red-row';
                //     }
                // }
            },
            dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                items: [
                    this.partExcelAction
                ],
            }],
            columns: [
                {
                    text: '진행상태',
                    dataIndex: 'status_kr',
                    width: 80,
                    align:'center',
                    sortable: true,
                    renderer: function(value, meta, record) {
                        gm.me().setStatusStyle(value, meta, record);
                        return value;
                    }
                },{
                    text: '계정',
                    dataIndex: 'account_type_kr',
                    width: 50,
                    align:'center',
                    sortable: true
                },{
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 110,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 170,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '규격',
                    dataIndex: 'specification',
                    width: 170,
                    style: 'text-align:center',
                    align: 'left'
                },{
                    text: '단위',
                    dataIndex: 'unit_code',
                    width: 55,
                    style: 'text-align:center',
                }
                ,{
                    text: '소요량',
                    dataIndex: 'unit_quan',
                    width: 70,
                    xtype: 'numbercolumn', 
                    format:'0,000.00',
                    align: 'right',
                    style: 'text-align:center'
                }
                ,{
                    text: '필요량',
                    dataIndex: 'req_quan',
                    width: 70,
                    xtype: 'numbercolumn', 
                    format:'0,000.00',
                    align: 'right',
                    style: 'text-align:center'
                },{
                    text: '구매',
                    dataIndex: 'pr_quan',
                    width: 60,
                    xtype: 'numbercolumn', 
                    format:'0,000.00',
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '생산',
                    dataIndex: 'mk_quan',
                    width: 60,
                    xtype: 'numbercolumn', 
                    format:'0,000.00',
                    style: 'text-align:center',
                    align: 'right'
                },{
                    text: '할당',
                    dataIndex: 'st_quan',
                    width: 60,
                    xtype: 'numbercolumn', 
                    format:'0,000.00',
                    style: 'text-align:center',     
                    align:'right'
                },
                // {
                //     text: '입고예정일',
                //     dataIndex: 'req_delivery_date',
                //     width: 90,
                //     style: 'text-align:center',
                //     align: 'center',
                //     renderer: Ext.util.Format.dateRenderer('Y-m-d')
                // },
                // {
                //     text: '입고수량',
                //     dataIndex: 'cartmap_grQuan',
                //     width: 75,
                //     xtype: 'numbercolumn', 
                //     format:'0,000.00',
                //     align: 'right',
                //     style: 'text-align:center'
                // }
            ],
            listeners: {
                celldblClick: function(view, th, col_idx, record, tr, row_idx) {
                    gm.me().viewMtrlDetailStatus(col_idx, row_idx);
                }
            }
        });

        this.partListGrid.addListener('cellkeydown', this.cellClipCopy);

        this.partListGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length>0) {
                    console.log('PartList Grid Callback', selections);
                } else {

                }
            }
        });
        
        return this.partListGrid;
    },

    execWorkOrderHandler: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/produce.do?method=execWorkOrderHandler',
                params:{
                    unique_id_list : uids
                },
                success: function(){
                    gm.me().store.load();
                },
                failure: function(){
                    // gm.me().showToast('결과', '삭제실패' );
                }
            });
        }
    },

})