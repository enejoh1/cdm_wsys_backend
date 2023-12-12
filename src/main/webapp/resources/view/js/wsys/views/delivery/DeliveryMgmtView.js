Ext.define('Msys.views.delivery.DeliveryMgmtView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Delivery DeliveryMgmtView');

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

        this.shipConfirmAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-arrow-right',
            text: '배송완료',
            disabled:true,
            handler: function() {
                Ext.MessageBox.show({
                    title: '배송완료',
                    msg: '선택한 항목을 배송완료 처리 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().shipConfirmHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.deliveryCancelAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '반려',
            disabled:true,
            handler: function() {
                
            }
        });

        this.pdfAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-pdf',
            text: '거래명세서',
            disabled:true,
            handler: function() {
                
            }
        });

        buttonToolbar.insert(1, this.shipConfirmAction);
        buttonToolbar.insert(2, this.deliveryCancelAction);
        buttonToolbar.insert(3, this.pdfAction);

        this.createStore('Msys.model.DeliveryMgmtModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                
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
                    id:gu.id('deliveryItems'),
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
                    var unique_id = select.get('unique_id');

                    gm.me().shipConfirmAction.enable();
                    gm.me().deliveryCancelAction.enable();
                    gm.me().pdfAction.enable();

                    gm.me().deliveryItemStore.getProxy().setExtraParam('limit', 100);
                    gm.me().deliveryItemStore.getProxy().setExtraParam('dl_group_uid', unique_id);
                    gm.me().deliveryItemStore.load();
                } else {
                    gm.me().shipConfirmAction.disable();
                    gm.me().deliveryCancelAction.disable();
                    gm.me().pdfAction.disable();

                    gm.me().deliveryItemStore.removeAll();
                }
            }
        });

        var status_list = [];
        status_list.push('A');
        status_list.push('Y');
        this.store.getProxy().setExtraParam('status_list', status_list);

        this.callParent(arguments);
    },
    

    createCenter: function() {

        this.itemGrids = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: true,
            columns:gMain.subcolumns,
            columnLines:true,
            store: this.deliveryItemStore,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.deliveryItemStore,
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
        });
        
        return this.itemGrids;
    },

    shipConfirmHandler: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                var status = select.get('status');
                if(status==null || status != 'A') {
                    Ext.Msg.alert('안내', '출하완료 상태가 아닙니다.', function() {});
                    return;
                }
                uids.push(uid);
            };

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales.do?method=deliveryStatusChange',
                params:{
                    unique_id_list:uids,
                    status:'Y'
                },
                success: function(){
                    gm.me().store.load();
                },
                failure: function(){
                    gm.me().eventNotice('결과', '실패' );
                }
             });
        }
    },

    defaultColumnStore: Ext.create('Msys.store.DefaultColumnStore', {}),
    deliveryItemStore:Ext.create('Msys.store.DlvManStore', {}),
})