Ext.define('Msys.views.sales.RegistProjectView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Sales RegistProjectView');

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

        this.addAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '수주등록',
            tooltip: '해당 수주를 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().recvAddHandler();
            }
        });

        this.editPoAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수주수정',
            tooltip: '수주수정',
            disabled: true,
            handler: function () {
                gm.me().recvEditHandler();
            }
        });

        this.addItemAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '품목추가',
            tooltip: '품목추가',
            disabled: true,
            handler: function () {
                gm.me().addItemHandler();
            }
        });

        this.confirmRecvAction = Ext.create('Ext.Action', {
            iconCls: 'af-arrow-right',
            text: '수주확정',
            tooltip: '수주확정',
            disabled: true,
            handler: function () {
                Ext.MessageBox.show({
                    title: '수주확정',
                    msg: '선택한 항목을 확정하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().confirmRecvHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        buttonToolbar.insert(1, this.addAction);
        buttonToolbar.insert(2, this.editPoAction);
        buttonToolbar.insert(3, this.addItemAction);
        buttonToolbar.insert(4, this.confirmRecvAction);

        this.createStore('Msys.model.RegistProjectModel', gu.pageSize);
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
            items: [
                {
                    collapsible: false,
					frame: true,
					region: 'center',
                    height: '60%',
                    layout:'fit',
					items: this.grid
                }, {
                    id:'pjPrdList',
					collapsible: false,
					frame: true,
					region: 'south',
					layout: 'fit',
					height: '40%',
					items: this.createCenter()
                }
            ]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];
                    var pj_uid = select.get('unique_id');
                    var top_bom_id = select.get('top_bom_id');

                    gm.me().prdItemStore.getProxy().setExtraParam('pj_uid', pj_uid);
                    gm.me().prdItemStore.getProxy().setExtraParam('top_bom_id', top_bom_id);
                    gm.me().prdItemStore.load(function(records){
						gm.me().reccount = records.length;
						console.log(gm.me().reccount);
						if(gm.me().reccount>0){
							gm.me().confirmRecvAction.enable();
						}else{
							gm.me().confirmRecvAction.disable();
						}
					});

                    gm.me().editPoAction.enable();
                    gm.me().addItemAction.enable();
					
					
                    
                } else {
                    gm.me().editPoAction.disable();
                    gm.me().addItemAction.disable();
                    gm.me().confirmRecvAction.disable();
                }
            }
        });

        this.callParent(arguments);
        
        this.store.getProxy().setExtraParam('status', 'BM');
        this.store.load();

        this.ProjectTypeStore.load();
        this.searchDetailStore.getProxy().setExtraParam('orderBy', 'itemmst.account_type, itemmst.item_code, itemmst.item_name ASC');
        this.searchDetailStore.load();
        this.userStore.load();
        this.cstmstStore.load();
    },

    removePrdAction: Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '삭제',
        tooltip: '삭제',
        disabled: true,
        handler: function () {
            Ext.MessageBox.show({
                title:'삭제',
                msg: '선택하신 항목들을 삭제하시겠습니까?',
                buttons: Ext.MessageBox.YESNO,
                fn: function(btn) {
                    if(btn=='yes') {
                        var selects = gm.me().prdGrid.getSelectionModel().getSelection();
                        var uids = [];
                        var pj_uid = gm.me().prdGrid.getSelectionModel().getSelection()[0].get('pj_uid');
                        for(var i=0; i<selects.length; i++) {
                            var select = selects[i];
                            var id = select.get('unique_id');
                            uids.push(id);
                        };
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales.do?method=cancelRecvProduct',
                            params:{
                                unique_ids:uids,
                                pj_uid:pj_uid
                            },
                            success: function(){
                                gm.me().eventNotice('결과', uids.length + ' 건 삭제완료.' );
                                gm.me().store.load();
                                gm.me().prdItemStore.load();
                            },
                            failure: function(){
                                gm.me().eventNotice('결과', '삭제실패' );
                            }
                         });
                    }
                },
                //animateTarget: 'mb4',
                icon: Ext.MessageBox.QUESTION
            });
        }
    }),

    createCenter: function() {
        this.prdGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: true,
            columnLines:true,
            store: this.prdItemStore,
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
                    var child_cnt = record.get('child_cnt');
                    var standard_flag = record.get('standard_flag');
                    switch(standard_flag) {
                        case 'A':
                            if(child_cnt < 1) {
                                return 'red-row';
                            }
                            break;
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
            dockedItems: [{
                
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                    //    this.removePrdAction, '->',addAttachAction, this.sendMailAction
                    ],
                
            }],
            columns: [
                {
                    text: '진행상태',
                    dataIndex: 'status_kr',
                    width: 50,
                    align:'center',
                    sortable: true,
                    // renderer: function(value, meta) {
                    //     return gm.me().getAssyStatus(value, meta);
                    // }
                },{
                    text: '계정',
                    dataIndex: 'account_type_kr',
                    width: 50,
                    // field:'textfield',
                    align:'center', style:'text-align:center;',
                    sortable: true,
                },{   
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 100,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    // style:'text-align:left'
                },{   
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 100,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    // style:'text-align:left'
                },{   
                    text: '규격',
                    dataIndex: 'specification',
                    width: 120,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    // style:'text-align:left'
                },{
                    text: '납품단가',  // 판가
                    dataIndex: 'sales_price',
                    width: 100,
                    sortable: true,
                    align:'right', style:'text-align:center;',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value!=null) {
//                            value = Ext.util.Format.number(value, '0,00/i');
                        	var formattedValue = Ext.util.Format.number(value, "000,000,000,000,000.00/i");
                        	value = (formattedValue.split('.')[1] === '00') ? Ext.util.Format.number(value, "000,000,000,000,000") : formattedValue;
                        } else {
                            value = 0;
                        }
                        return  value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '수주수량',
                    dataIndex: 'req_quan',
                    width: 60,
                    sortable: true,
                    align:'right', style:'text-align:center;',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value!=null) {
                            value = Ext.util.Format.number(value, '0,00/i');
                        } else {
                            value = 1;
                        }
                        return  value;
                    }
                    // style:'text-align:left'
                },{
                    text: '납품금액',
                    dataIndex: 'sales_amount',
                    width: 80,
                    sortable: true,
                    align:'right', style:'text-align:center;',
                    renderer: function(value, meta, record) {
                        var sales_price = record.get('sales_price');
                        var quan = record.get('req_quan');
                        value = sales_price * quan;
                        
//                        value = Ext.util.Format.number(value, '0,00/i');
                        var formattedValue = Ext.util.Format.number(value, "000,000,000,000,000.00/i");
                    	value = (formattedValue.split('.')[1] === '00') ? Ext.util.Format.number(value, "000,000,000,000,000") : formattedValue;
                        return  value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '가용재고',
                    dataIndex: 'useful_stock_qty',
                    width: 60,
                    sortable: true,
                    align:'right', style:'text-align:center;',
                    renderer: function(value, meta) {
//                        if(value!=null&&value.length>0) {
//                            value = Ext.util.Format.number(value, '0,00/i');
//                        } else {
//                            value = 0;
//                        }
                        return  value;
                    }
                    // style:'text-align:left'
                },
                {   
                    text: '사용자지정1',
                    dataIndex: 'bom1',
                    width: 60,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '사용자지정2',
                    dataIndex: 'bom2',
                    width: 60,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                }
                ,{   
                    text: '사용자지정3',
                    dataIndex: 'bom3',
                    width: 60,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '사용자지정4',
                    dataIndex: 'bom4',
                    width: 60,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    editor:{
                        xtype:'combo',
                        id:'reserved3',
                        name:'reserved3',
                        store: this.startControllerStore,
                        displayField:'system_code',
                        valueField:'system_code',
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            // Custom rendering template for each item
                            getInnerTpl: function() {
                                return '<div data-qtip="{system_code}">{system_code}</div>';
                            }			                	
                        },
                    },
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                },{   
                    text: '특이사항',
                    dataIndex: 'remark',
                    // dataIndex: 'comment',
                    width: 100,
                    sortable: true,
                    align:'left', style:'text-align:center;',
                    editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                    // style:'text-align:left'
                }
            ]     
        });
        
        // this.prdGrid.addListener('itemdblClick', this.setPrdBom);
        // this.prdGrid.addListener('cellkeydown', this.cellClipCopy);

        // this.prdGrid.getSelectionModel().on({
        //     selectionchange: function(sm, selections) {
        //     	gMain.selPanel.rec = selections[0];
        //         if(selections.length) {
        //             gUtil.enable(gMain.selPanel.removePrdAction);
        //             gUtil.enable(Ext.getCmp('addAttachAction'));
        //             gUtil.enable(gMain.selPanel.sendMailAction);
        //         } else {
        //             gUtil.disable(gMain.selPanel.removePrdAction);
        //             gUtil.disable(Ext.getCmp('addAttachAction'));
        //             gUtil.disable(gMain.selPanel.sendMailAction);
        //         }
        //     }
        // });

        // this.prdGrid.on('edit', function(editor, e) {
        //     var rec = e.record;
        //     var quan = rec.get('quan');
        //     if(quan < 1) {
        //         Ext.Msg.alert('안내', '수주수량이 1 이상이어야 합니다.', function() {});
        //         rec.set('quan', 1);
        //         gm.me().prdStore.sync();
        //         return;
        //     }

        //     Ext.Ajax.request({
        //         url: CONTEXT_PATH + '/production/schdule.do?method=updateAssyMapMakeInfo',
        //         params: {
        //             quan:rec.get('quan'),
        //             reserved1:rec.get('reserved1'),
        //             reserved2:rec.get('reserved2'),
        //             reserved3:rec.get('reserved3'),
        //             reserved4:rec.get('reserved4'),
        //             reserved5:rec.get('reserved5'),
        //             reserved6:rec.get('reserved6'),
        //             unique_id:rec.get('unique_uid'),
        //             sales_price:rec.get('static_sales_price'),
        //             pj_uid:rec.get('ac_uid')
        //         },
        //         success: function(result, request) {
        //             var result = result.responseText;
        //             gm.me().prdStore.load();
        //             gm.me().store.load();
        //         },
        //         failure: extjsUtil.failureMessage
        //     });
        // });
        
        return this.prdGrid;
    },

    recvAddHandler: function() {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('addForm'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '60%',
            layout:'column',
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '공통정보',
                    width: '100%',
                    // autoScroll : true,
                    // cls: 'my-x-toolbar-default1',
                    style: 'padding:10px;',
                    defaults: {
                        labelStyle: 'padding:10px',
                        anchor: '100%',
                        layout: {
                            type: 'column',
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            // margin: '0 10 10 1',
                            border:true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    id:'pj_code',
                                    name:'pj_code',
                                    width:'35%',
                                    allowBlank:false,
                                    padding: '0 0 5px 0',
                                    fieldLabel:'수주번호',
                                },{
                                    xtype:'button',
                                    text:'자동생성',
                                    width:'10%',
                                    listeners: {
                                        click: function(btn) {
                                            var pj_code = Ext.getCmp('pj_code');

                                            // 다음 수주번호 가져오기
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/sales.do?method=getNextPjCode',
                                                // params:{
                                                //     pj_first: pj_first,
                                                //     codeLength: 3
                                                // },
                                                success: function (result, request) {
                                                    var result = Ext.decode(result.responseText);
                                                    var data = result.datas;
                                                    pj_code.setValue(data);
                                                },
                                                // failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'pj_name',
                                    name:'pj_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'프로젝트명'
                                },{
                                    id :'cstmst_uid',
                                    name : 'cstmst_uid',
                                    fieldLabel: '고객사',
                                    allowBlank:false,
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().cstmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'cst_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'cst_name', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{cst_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var address_kr = record.get('address_kr');
                                            Ext.getCmp('cstmst_address').setValue(address_kr);
                                        }// endofselect
                                    }
                                },{
                                    id :'sales_manager_uid',
                                    name : 'sales_manager_uid',
                                    fieldLabel: '영업 담당자',                                            
                                    xtype: 'combo',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().userStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'user_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'user_name', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{user_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            
                                        }// endofselect
                                    }
                                },{
                                    id :'pj_type',
                                    name : 'pj_type',
                                    fieldLabel: '등록원인',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    allowBlank:false,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().ProjectTypeStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'code_name',
                                    valueField:   'code_value',
                                    value:'P',
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var value = combo.value;
                                            var target = Ext.getCmp('order_cst_unique');
                                            switch(value) {
                                                case 'R':
                                                    gm.me().cstmstStore.getProxy().setExtraParam('unique_id', vCompanyReserved4);
                                                    gm.me().cstmstStore.load(function(records) {
                                                        var data = records[0];
                                                        var target_uid = data.get('unique_id_long');
                                                        target.setValue(target_uid);
                                                    });
                                                    break;
                                                default:
                                                    gm.me().cstmstStore.getProxy().setExtraParam('cst_code', null);
                                                    gm.me().cstmstStore.load();
                                                    target.setValue(null);
                                                    break;
                                            };
                                        }// endofselect
                                    }
                                }
                                , {
                                    fieldLabel: '납품요청일',
                                    xtype: 'datefield',
                                    width:'45%',
                                    name: 'req_delivery_date',
                                    id: 'req_delivery_date',
                                    format: 'Y-m-d',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    fieldStyle: 'background-image: none;',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    value:Ext.Date.format(new Date(), 'Y-m-d')
//                                            value:Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 14), 'Y-m-d')
                                },{
                                    xtype:'textfield',
                                    id:'cstmst_address',
                                    name:'cstmst_address',
                                    padding: '0 0 5px 0',
                                    // padding: '0 0 0 30px',
                                    width:'45%',
                                    readOnly:true,
                                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                                    fieldLabel:'납품장소'
                                }
                                ,{
                                    xtype:'textfield',
                                    id:'delivery_info',
                                    name:'delivery_info',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'납품처정보'
                                },{
                                    xtype:'textfield',
                                    id:'address',
                                    name:'address',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'수요처'
                                },{
                                    xtype:'textarea',
                                    id:'project1',
                                    name:'project1',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'전달사항(1)'
                                },{
                                    xtype:'textarea',
                                    id:'project2',
                                    name:'project2',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'전달사항(2)'
                                }
                            ]
                        },
                        
                    ]
                }
            ]
        });

        var searchPjNameForm = Ext.create('Ext.form.Panel', {
            id: 'searchPjNameForm',
            xtype: 'form',
            frame: false,
            border: false,
            width: '40%',
            bodyPadding: 10,
            items: gm.me().searchPjNameFn()
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: '수주등록',
            width: 1300,
            height: 500,
            plain: true,
            layout:'hbox',
            items: [
                form, searchPjNameForm
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                     if (btn == "no") {
                        win.close();
                    } else {
                        var form = Ext.getCmp(gu.id('addForm')).getForm();
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales.do?method=addRecv',
                                params:{
                                    pj_code:val['pj_code'],
                                    pj_name:val['pj_name'],
                                    cstmst_uid:val['cstmst_uid'],
                                    pj_type:val['pj_type'],
                                    sales_manager_uid:val['sales_manager_uid'],
                                    req_delivery_date:val['req_delivery_date'],
                                    // cstmst_address:val['cstmst_address'],
                                    delivery_info:val['delivery_info'],
                                    address:val['address'],
                                    project1:val['project1'],
                                    project2:val['project2']
                                },
                                success: function(val, action) {
                                    gm.me().store.load();
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                        }
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

    searchPjNameFn: function() {
        this.searchPjNameStore = Ext.create('Msys.store.ProjectStore', {});
        this.searchPjName = Ext.create('Ext.form.TriggerField', {
            iconCls: 'af-search',
            emptyText: '프로젝트 검색',
            width: 190,
            field_id:'searchPjName',
            name:'searchPjName',
            store:this.searchPjNameStore,
            fieldStyle: 'background-color: #D6E8F6; background-image: none;',
            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            onTrigger1Click : function() {
                this.setValue('');
            },
            listeners : {
                change : function(fieldObj, e) {
                    if(e.length > 0) {
                        gm.me().searchPjNameStore.getProxy().setExtraParam('pj_name', '%'+e+'%');
                        gm.me().searchPjNameStore.getProxy().setExtraParam('check_complished', false);
                        gm.me().searchPjNameStore.load();
                    } else {
                        gm.me().searchPjNameStore.removeAll();
                    }
                }
            }
        });

        this.searchPjNameGrid = Ext.create('Ext.grid.Panel', {
            store: this.searchPjNameStore,
            multiSelect: true,
            stateId: 'searchPjNameGrid',
            dockedItems: [{
                dock : 'top',
                xtype : 'toolbar',
                items : [
                    this.searchPjName
                ]
            }],
            columns: [
                {
                    text     : '프로젝트명',
                    width     : '50%',
                    sortable : true,
                    dataIndex: 'pj_name',
                    align:'left',
                    style:'text-align:center'
                },{
                    text     : '등록일자',
                    width     : '25%',
                    sortable : true,
                    dataIndex: 'regist_date',
                    align:'left',
                    style:'text-align:center',
                    renderer: Ext.util.Format.dateRenderer('Y-m-d')
                },{
                    text     : '등록자',
                    width     : '25%',
                    sortable : true,
                    dataIndex: 'creator',
                    align:'left',
                    style:'text-align:center'
                }
            ]
        });
        this.searchPjNameGrid.addListener('cellkeydown', this.cellClipCopy);

        this.searchPjNameGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if (selections.length) {

                } else {

                }
            }
        });

        return this.searchPjNameGrid;
    },

    addItemHandler: function() {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        if(select == null || select == undefined || select.length<1) {
            Ext.Msg.alert('안내',  '프로젝트를 선택해주세요.');
            return;
        }
        var pj_uid = select.get('unique_id');
        var top_bom_id = select.get('top_bom_id');

        var itemGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().searchDetailStore,
            layout: 'fit',
            id:'itemGrid',
            title:'품목검색',
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            multiSelect: true,
            pageSize: 100,
            width:800,
            height:520,
            border:true,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: gm.me().searchDetailStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다."
                ,listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
            viewConfig: {
                listeners: {
                    'itemdblClick': function(view , record) {
                        record.commit();
                        saveStore.add(record);
                    }
                },
                emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
            },
            columns: [
                { text:'계정', width:'10%', dataIndex:'account_type_kr', sortable:true, align:'center', style:'text-align:center;' },
                { text:'기존품번', width:'20%', dataIndex:'old_item_code', sortable:true, align:'center', style:'text-align:center;' },
                { text:'품번', width:'20%', dataIndex:'item_code', sortable:true, align:'center', style:'text-align:center;' },
                { text:'품명', width:'20%', dataIndex:'item_name', sortable:true, align:'center', style:'text-align:center;' },
                { text:'규격', width:'20%', dataIndex:'specification', sortable:true, align:'center', style:'text-align:center;' },
                { text:'수량', width:'10%', dataIndex:'req_quan', sortable:true, align:'right', style:'text-align:center;',
                    editor:{
                        xtype:'numberfield',
                        minValue:1,
                    }, 
                    renderer: function(value, meta) {
                        meta.css = 'edit-column';
                        if(value==null) value = 1;
                        return value;
                    }
                },
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            xtype:'triggerfield',
                            id:gu.id('search_item_code'),
                            name:gu.id('search_item_code'),
                            width:'20%',
                            emptyText:'품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },{
                            xtype:'triggerfield',
                            id:gu.id('search_item_name'),
                            name:gu.id('search_item_name'),
                            width:'20%',
                            emptyText:'품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },{
                            xtype:'triggerfield',
                            id:gu.id('search_specification'),
                            name:gu.id('search_specification'),
                            width:'20%',
                            emptyText:'규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },{
                            xtype:'triggerfield',
                            id:gu.id('search_old_item_code'),
                            name:gu.id('search_old_item_code'),
                            width:'20%',
                            emptyText:'기존품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        }, gm.me().multiItemCodeSearch()
                    ]
                }
            ]
        });

        itemGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console.log('selections', selections);
            }
        });

        var saveStore =  new Ext.data.Store({
            model : gm.me().searchDetailStore
        });

        var saveDeleteAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '항목삭제',
            tooltip: '선택한 항목이 삭제합니다.',
            disabled: true,
            handler: function(widget, event) {
                var saveSelect = saveForm.getSelectionModel().getSelection();
                saveStore.remove(saveSelect);
            }
        });

        var saveForm = Ext.create('Ext.grid.Panel', {
            store: saveStore,
            id:'saveFormGrid',
            layout: 'fit',
            title:'저장목록',
            region:'east',
            border:true,
            // style:'padding-left:10px;',
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            columns: [
                {text: "품번", width:'30%', dataIndex: 'item_code', sortable: true},
                {text: "품명", width:'25%', dataIndex: 'item_name', sortable: true},
                {text: "규격", width:'30%', dataIndex: 'specification', sortable: true},
                {text: "수량", width:'15%', dataIndex: 'req_quan', sortable: true, editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value == null || value.length < 1) {
                            value = 1;
                        }
                        return value;
                    }
                }
            ],
            multiSelect: true,
            pageSize: 100,
            width:350,
            height:600,
            dockedItems: [
                {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default1',
                items: [
                    saveDeleteAction
                ]
            }]
        });

        saveForm.on('edit', function(editor, e) {
            var rec = e.record;
            var field = e['field'];
            var value = rec.get(field);
            
            if(field != null && field == 'bm_quan' && (value == null || value < 1)) {
                Ext.Msg.alert('안내', '수량이 1 이상이어야 합니다.', function() {});
                rec.set(field, 1);
                e.store.sync();
                return;
            }
            rec.set(field, rec.get(field));
            e.store.sync();
        });

        saveForm.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections != null && selections.length > 0) {
                    saveDeleteAction.enable();
                } else {
                    saveDeleteAction.disable();
                }
            }
        })

        var win = Ext.create('Ext.Window', {
            title: '품목추가',
            width: 1200,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            layout:'column',
            items: [
                itemGrid ,saveForm
            ],
            buttons: [
                {
                    text:'추가',
                    handler:function(btn) {
                        var selects = itemGrid.getSelectionModel().getSelection();
                        for(var i=0; i<selects.length; i++) {
                            var record = selects[i];
                            saveStore.add(record);
                        }
                    }
                }, {
                    text:'확인',
                    handler: function(btn) {
                        var items = saveStore.data.items;
                        var json = '';
                        for(var i=0; i<items.length; i++) {
                            var item = items[i];
                            var id = item.get('unique_id'); // srcahd uid
                            var req_quan = item.get('req_quan');
                            if(req_quan == null || req_quan == undefined || req_quan.length<1) req_quan = 1;

                            if(json.length) {
                                json += ",{\"id\":" + id + ",\"req_quan\":" + req_quan + "}";
                            } else {
                                json += "{\"id\":" + id + ",\"req_quan\":" + req_quan + "}";
                            }
                        }
                        json = '[' + json + ']';

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/sales.do?method=addItemsToRecv',
                            params:{
                                jsonDatas:json,
                                pj_uid:pj_uid,
                                top_bom_id:top_bom_id
                            },
                            success : function(result, request) {
                                // gm.me().store.load();
                                // var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                gm.me().prdItemStore.load();
                                gm.me().store.load();
                                if(win) win.close();
                                
                            },
                            // failure: extjsUtil.failureMessage
                        });
                    }
                }, {
                    text:'취소',
                    handler: function(btn) {
                        win.close();
                    }
                }
            ]

        }); win.show();

    },

    redrawSearchStore: function() {
        // 초기화
        gm.me().searchDetailStore.getProxy().setExtraParams({});

        var item_code = Ext.getCmp(gu.id('search_item_code')).getValue();
        var item_name = Ext.getCmp(gu.id('search_item_name')).getValue();
        var specification = Ext.getCmp(gu.id('search_specification')).getValue();
        var old_item_code = Ext.getCmp(gu.id('search_old_item_code')).getValue();

        if(item_code!=null && item_code.length>0) gm.me().searchDetailStore.getProxy().setExtraParam('item_code', '%'+item_code+'%');
        if(item_name!=null && item_name.length>0) gm.me().searchDetailStore.getProxy().setExtraParam('item_name', '%'+item_name+'%');
        if(specification!=null && specification.length>0) gm.me().searchDetailStore.getProxy().setExtraParam('specification', '%'+specification+'%');
        if(old_item_code!=null && old_item_code.length>0) gm.me().searchDetailStore.getProxy().setExtraParam('old_item_code', '%'+old_item_code+'%');
        
        if(this.curMboxValues!=null && this.curMboxValues.length>0) {
            var arrs = this.curMboxValues.split('\n');
            var item_code_list = [];
            for(var i=0; i<arrs.length; i++) {
                var a = arrs[i];
                if(a!=null && a.length>0) {
                    item_code_list.push(a);
                }
            }
            gm.me().searchDetailStore.getProxy().setExtraParam('item_code_list', item_code_list);
        };
        
        gm.me().searchDetailStore.getProxy().setExtraParam('orderBy', 'itemmst.account_type, itemmst.item_code, itemmst.item_name ASC');
        gm.me().searchDetailStore.load();
    },
    curMboxValues:null,
    multiItemCodeSearch: function() {
        var multiSearchAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-search',
            text: '다중품번검색',
            tooltip: '엔터를 기준으로 여러 품번을 검색합니다.',
            disabled: false,
            handler: function () {
                var mBox = Ext.create('Ext.window.MessageBox', {
                    resizable: true
                });

                mBox.show({
                    title: '다중 품번 검색(엔터 구분)',
                    modal: true,
                    msg: '다중 품번 검색',
                    width:300,
                    resizable: true,
                    height:500,
                    buttons: Ext.MessageBox.OK,
                    multiline: true,
                    defaultTextHeight: 390,
    //	             maxHeight: 2048,
                    maxWidth: 1000,
                    scope: this,
                    value:gm.me().curMboxValues,
                    initComponent: function() {
                        //console_logs('initComponent', this.value);
                    },
                    fn: function(btn, text, c) {
                        if(btn != null && btn == 'ok' && text != null && text.length > 0) {
                            gm.me().curMboxValues = text;
                            gm.me().redrawSearchStore();
                        } else if(btn != null && btn == 'ok' && (text == null || text.length == 0) ) {
                            console_logs('text.length', text.length);
                            gm.me().curMboxValues = null;
                            gm.me().redrawSearchStore();
                        }
                    }
                });
            }
        });

        return multiSearchAction;
    },

    confirmRecvHandler: function(btn) {
        if(btn == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');
            var top_bom_id = select.get('top_bom_id');
    
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales.do?method=confirmRecv',
                params:{
                    unique_id:unique_id,
                    top_bom_id:top_bom_id
                },
                success: function (result, request) {
                    gm.me().eventNotice('알림', '수주확정 완료');
                    gm.me().store.load();
                },
                failure: function(result) {
                    gm.me().eventNotice('알림', '수주확정 실패');
                    gm.me().store.load();
                }
            });
        };
    },

    recvEditHandler: function() {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        var unique_id = select.get('unique_id');

        var req_delivery_date = new Date(select.get('req_delivery_date'));
            req_delivery_date = Ext.Date.format(req_delivery_date, 'Y-m-d');

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('editForm'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            layout:'fit',
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '공통정보',
                    width: '100%',
                    style: 'padding:10px;',
                    defaults: {
                        labelStyle: 'padding:10px',
                        anchor: '100%',
                        layout: {
                            type: 'column',
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            width: '100%',
                            border:true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    id:gu.id('edit_pj_code'),
                                    name:'pj_code',
                                    width:'45%',
                                    allowBlank:false,
                                    padding: '0 0 5px 0',
                                    fieldLabel:'수주번호',
                                    readOnly:true,
                                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                                    value:select.get('pj_code')
                                },{
                                    xtype:'textfield',
                                    id:gu.id('edit_pj_name'),
                                    name:'pj_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'프로젝트명',
                                    value:select.get('pj_name')
                                },{
                                    id:gu.id('edit_cstmst_uid'),
                                    name : 'cstmst_uid',
                                    fieldLabel: '고객사',
                                    allowBlank:false,
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().cstmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'cst_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'cst_name', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{cst_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var address_kr = record.get('address_kr');
                                            Ext.getCmp(gu.id('edit_cstmst_address')).setValue(address_kr);
                                        }// endofselect
                                    },
                                    value:select.get('cstmst_uid')
                                },{
                                    id:gu.id('edit_sales_manager_uid'),
                                    name : 'sales_manager_uid',
                                    fieldLabel: '영업 담당자',                                            
                                    xtype: 'combo',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().userStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'user_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'user_name', direction: 'ASC' },
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{user_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            
                                        }// endofselect
                                    },
                                    value:select.get('sales_manager_uid')
                                },{
                                    id:gu.id('edit_pj_type'),
                                    name : 'pj_type',
                                    fieldLabel: '등록원인',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    allowBlank:false,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().ProjectTypeStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'code_name',
                                    valueField:   'code_value',
                                    value:'P',
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var value = combo.value;
                                            var target = Ext.getCmp('order_cst_unique');
                                            switch(value) {
                                                case 'R':
                                                    gm.me().cstmstStore.getProxy().setExtraParam('unique_id', vCompanyReserved4);
                                                    gm.me().cstmstStore.load(function(records) {
                                                        var data = records[0];
                                                        var target_uid = data.get('unique_id_long');
                                                        target.setValue(target_uid);
                                                    });
                                                    break;
                                                default:
                                                    gm.me().cstmstStore.getProxy().setExtraParam('cst_code', null);
                                                    gm.me().cstmstStore.load();
                                                    target.setValue(null);
                                                    break;
                                            };
                                        }// endofselect
                                    },
                                    value:select.get('pj_type')
                                }
                                , {
                                    fieldLabel: '납품요청일',
                                    xtype: 'datefield',
                                    width:'45%',
                                    name: 'req_delivery_date',
                                    id:gu.id('edit_req_delivery_date'),
                                    format: 'Y-m-d',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    fieldStyle: 'background-image: none;',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    value: req_delivery_date
                                },{
                                    xtype:'textfield',
                                    id:gu.id('edit_cstmst_address'),
                                    name:'cstmst_address',
                                    padding: '0 0 5px 0',
                                    // padding: '0 0 0 30px',
                                    width:'45%',
                                    readOnly:true,
                                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                                    fieldLabel:'납품장소',
                                    value:select.get('cstmst_address')
                                }
                                ,{
                                    xtype:'textfield',
                                    id:gu.id('edit_delivery_info'),
                                    name:'delivery_info',
                                    // padding: '0 0 0 30px',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'납품처정보',
                                    value:select.get('delivery_info')
                                },{
                                    xtype:'textfield',
                                    id:gu.id('edit_address'),
                                    name:'address',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'수요처',
                                    value:select.get('prjman_address')
                                },{
                                    xtype:'textarea',
                                    id:gu.id('edit_project1'),
                                    name:'project1',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'전달사항(1)',
                                    value:select.get('project1')
                                },{
                                    xtype:'textarea',
                                    id:gu.id('edit_project2'),
                                    name:'project2',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'전달사항(2)',
                                    value:select.get('project2')
                                }
                            ]
                        },
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: '수주수정',
            width: 800,
            height: 500,
            plain: true,
            layout:'hbox',
            items: form,
            buttons: [{
                text: '확인',
                handler: function(btn) {
                     if (btn == "no") {
                        win.close();
                    } else {
                        var form = Ext.getCmp(gu.id('editForm')).getForm();
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/sales.do?method=editRecv',
                                params:{
                                    unique_id:unique_id,
                                    pj_name:val['pj_name'],
                                    cstmst_uid:val['cstmst_uid'],
                                    pj_type:val['pj_type'],
                                    sales_manager_uid:val['sales_manager_uid'],
                                    req_delivery_date:val['req_delivery_date'],
                                    delivery_info:val['delivery_info'],
                                    address:val['address'],
                                    project1:val['project1'],
                                    project2:val['project2']
                                },
                                success: function(val, action) {
                                    gm.me().store.load();
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            Ext.MessageBox.alert('알림', '수주번호/프로젝트명/고객사/등록원인 을 확인해주세요.');
                        }
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

    cstmstStore:Ext.create('Msys.store.CstMstStore', {}),
    userStore:Ext.create('Msys.store.UserStore', {}),
    ProjectTypeStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'PJ_TYPE'}),
    searchDetailStore:Ext.create('Msys.store.ItemMstStore', {account_type_list: ['P','G','O']}),
    prdItemStore:Ext.create('Msys.store.RecvPrdItemStore', {}),
    
})