Ext.define('Msys.views.sales.UnDeliveryMgmtView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Sales UnDeliveryMgmtView');

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridMenuList(this).showAt(e.getXY());
                    return false;
                }
            }, 
            features: [{
                ftype: 'groupingsummary',
                groupHeaderTpl: '<div style="background-color:#CEECF5; font-size:16px;">{name}</div>',
                // groupHeaderTpl: '<div style="background-color:#CEECF5; font-size:16px;">{columnName}:{name}</div>',
                // hideGroupedHeader: true,
                enableGroupingMenu: false,
                dock: 'top'
            }]
        };

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.dlAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '출하요청',
            disabled:true,
            handler: function() {
                gm.me().dlHandler();
            }
        });

        this.purItemAction = Ext.create('Ext.Action', {
            itemId: 'purItemAction',
            iconCls: 'font-awesome_4-7-0_dollar_14_0_5395c4_none',
            text: '구매요청',
            tooltip:'구매요청',
            disabled:true,
            handler: function() {
                gm.me().purHandler();
            }
        });

        buttonToolbar.insert(1, this.dlAction);
        buttonToolbar.insert(2, this.purItemAction);

        this.createStore('Msys.model.UnDeliveryModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'remain_req_date':
                    col['renderer']  = function(value, meta, record) {
                        if(value!=null && value<1) {
                            meta.css = 'custom-column-working-stop';
                        }
                        return value;
                    }
                    break;
                case 'pur_quan':
                    col['editor'] = {
                        xtype:'numberfield',
                        minValue:0
                    }
                    col['renderer']  = function(value, meta, record) {
                        meta.css = 'edit-column';
                        return value;
                    }
                    break;
                case 'delivery_quan':
                    col['editor'] = {
                        xtype:'numberfield',
                        minValue:0
                    }
                    col['renderer']  = function(value, meta, record) {
                        meta.css = 'edit-column';
                        return value;
                    }
                    break;
                case 'status_kr':
                    col['align'] = 'center';
                    col['renderer'] = function(value, meta, record) {
                        gm.me().setStatusStyle(value, meta, record);
                        return value;
                    }
                    break;
                case 'account_type_kr':
                    col['align'] = 'center';
                    break;
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];

                    gm.me().dlAction.enable();
                    gm.me().purItemAction.enable();
                } else {
                    gm.me().dlAction.disable();
                    gm.me().purItemAction.disable();
                }
            }
        });

        this.callParent(arguments);
        
        var not_status_list = [];
        not_status_list.push('BM');
        var status_list = Ext.getCmp(this.menuCode+'-status_kr-srch').getValue();
        this.store.getProxy().setExtraParam('bom_lv', 1);
        this.store.getProxy().setExtraParam('not_status_list', not_status_list);
        this.store.getProxy().setExtraParam('status_list', status_list);
        this.store.getProxy().setExtraParam('orderBy', 'prjman.pj_code ASC');
        this.store.load();

        // this.store.group('pj_name');
        this.store.group('pj_code');
    },

    dlHandler: function() {

        this.unitManStore.getProxy().setExtraParam('unit_type', 'D');
        this.unitManStore.load({async:false});

        var selects = gm.me().grid.getSelectionModel().getSelection();
        var json = '';
        var delivery_date = selects[0].get('req_delivery_date');
	        delivery_date = new Date(delivery_date);
        for(var i=0; i<selects.length; i++) {
            var select = selects[i];
            var unique_id = select.get('unique_id');
            var delivery_quan = select.get('delivery_quan');

            if(json.length) {
                json += ",{\"unique_id\":" + unique_id + ",\"delivery_quan\":" + delivery_quan + "}";
            } else {
                json += "{\"unique_id\":" + unique_id + ",\"delivery_quan\":" + delivery_quan + "}";
            }
        };

        json = '[' + json + ']';
        
        var form = Ext.create('Ext.form.Panel', {
            id:'dlform',
            xtype:'form',
            frame:true,
            border:true,
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'vbox', 
            defaults: {
                anchor: '100%',
                labelWidth: 80,
                labelAlign:'center',
                align:'center',
                style:'text-align:center; align:center'
            },
            items:[
                {
                    xtype:'combo',
                    fieldLabel:'납품서',
                    emptyText:'신규',
                    width:'100%',
                    id:'stateDelivery',
                    name:'stateDelivery',
                    store:this.unitManStore,
                    displayField:'req_no',
                    valueField:'req_no',
                    minChars:1,
                    listConfig: {
                        loadingText: 'Searching...',
                        emptyText: 'No matching posts found.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{req_no}</div>';
                        }
                    },
                    listeners: {
                        select: function(combo, record) {
                            var value = combo.value;
                            if(value != null && value.length > 0) {
                                Ext.getCmp('req_date').setDisabled(true);
                                Ext.getCmp('reserved_varchar2').setDisabled(true);
                            } else {
                                Ext.getCmp('req_date').setDisabled(false);
                                Ext.getCmp('reserved_varchar2').setDisabled(false);
                            }
                        }
                    }
                }, {
                    xtype:'datefield',
                    id:'req_date',
                    name:'req_date',
                    fieldLabel:'출고요청일',
                    width:'100%',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',
                    // height:'10%',
                    layout: 'fit',
                    value:Ext.Date.format(delivery_date, 'Y-m-d') //Ext.Date.format(new Date(), 'Y-m-d')
                }, {
                    xtype:'textarea',
                    id:'remark',
                    name:'remark',
                    fieldLabel:'비고',
                    width:'100%'
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal:true,
            title:'출하요청',
            width:'25%',
            height:'40%',
            plain:true,
            items: form,
            buttons: [{
                text:'확인',
                handler: function(btn) {
                    win.setLoading(true);
                    var delivery_no = Ext.getCmp('stateDelivery').getValue();
                    var req_date = Ext.getCmp('req_date').getValue();
                    var remark = Ext.getCmp('remark').getValue();
                    if(delivery_no == null || delivery_no == undefined) {
                        delivery_no = null;
                    };
                    if(req_date != null && req_date.length>0) {
                        req_date = new Date(req_date);
                        // req_date = Ext.Date.format(new Date(req_date), 'Y-m-d');
                    };

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales.do?method=deliveryRequest',   // addStateDelivery : 출고
                        params:{
                            jsonDatas:json,
                            delivery_no:delivery_no,
                            req_date:req_date,
                            remark:remark
                        },
                        success : function(result, request) {
                            win.setLoading(false);
                            gm.me().store.load();
                            if(win) win.close();
                        },
                        // failure: extjsUtil.failureMessage
                    });
                }
            }, {
                text:'취소',
                handler: function() {
                    win.setLoading(false);
                    if(win) {
                        win.close();
                    };
                }
            }]
        }); win.show();
        win.setLoading(false);
    },

    purHandler: function() {
        let selects = gm.me().grid.getSelectionModel().getSelection();
        let json = '';

        for(let i=0; i<selects.length; i++) {
            let select = selects[i];
            let unique_id = select.get('unique_id');
            let account_type = select.get('account_type');
            let pur_quan = select.get('pur_quan');
            switch(account_type) {
                case 'P':
                case 'O':
                    Ext.Msg.alert('안내', '상품/자재 만 구매 가능합니다.', function() {});
                    return;
            };
            if(pur_quan == null || pur_quan < 0.00001) {
                Ext.Msg.alert('안내', '구매요청 수량이 0인 항목이 있습니다.', function() {});
                return;
            };

            if(json.length) {
                json += ",{\"id\":" + unique_id + ",\"pur_quan\":" + pur_quan + "}";
            } else {
                json += "{\"id\":" + unique_id + ",\"pur_quan\":" + pur_quan + "}";
            };
        }

        json = '[' + json + ']';

        var req_delivery_date = new Date(selects[0].get('req_delivery_date'));
        var pur_req_date = Ext.Date.add(req_delivery_date, Ext.Date.DAY, -1);

        var form = Ext.create('Ext.form.Panel', {
            id:'purForm',
            xtype:'form',
            frame:true,
            border:true,
            bodyPadding: '3 3 0',
            region: 'center',
            layout: 'vbox', 
            defaults: {
                anchor: '100%',
                labelWidth: 80,
                labelAlign:'center',
                align:'center',
                style:'text-align:center; align:center'
            },
            items:[
                {
                    xtype:'datefield',
                    fieldLabel:'납기요청일',
                    width:'100%',
                    id:'pur_req_date',
                    labelStyle:'text-align:left',
                    name:'pur_req_date',
                    format: 'Y-m-d',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',
                    // height:'10%',
                    layout: 'fit',
                    value:Ext.Date.format(pur_req_date, 'Y-m-d') //Ext.Date.format(new Date(), 'Y-m-d')
                }
                // , {
                //     xtype:'textarea',
                //     fieldLabel:'특이사항',
                //     labelStyle:'text-align:left',
                //     rows:5,
                //     width:'100%',
                //     height:150,
                //     name:'remark',
                //     id:'remark'
                // }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal:true,
            title:'구매요청',
            width:'20%',
            height:'20%',
            plain:true,
            items: form,
            buttons: [{
                text:'확인',
                handler: function(btn) {
                    var pur_req_date = Ext.getCmp('pur_req_date').getValue();
                    if(pur_req_date != null && pur_req_date.length>0) {
                        // pur_req_date = Ext.Date.format(pur_req_date, 'Y-m-d');
                        pur_req_date = new Date(pur_req_date);
                    };

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/sales.do?method=dlPurchaseRequest',
                        params:{
                            jsonDatas:json,
                            pur_req_date:pur_req_date
                        },
                        success : function(result, request) {
                            gm.me().store.load();
                            if(win) win.close();
                        },
                        // failure: extjsUtil.failureMessage
                    });
                }
            }, {
                text:'취소',
                handler: function() {
                    if(win) {
                        win.close();
                    }
                }
            }]
        }); win.show();
    },
    
    unitManStore:Ext.create('Msys.store.UnitManStore', {}),
})