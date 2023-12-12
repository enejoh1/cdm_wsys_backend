Ext.define('Msys.views.stock.WearingWaitView', {
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

        this.execWearingAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-refresh',
            text: '입고실행',
            disabled: true,
            tooltip: '선택하신 항목을 입고실행 합니다.',
            handler: function() {
                gm.me().execWearingHandler();
            }
        });

        buttonToolbar.insert(1, this.execWearingAction);

		//스토어 생성
        this.createStore('Msys.model.WearingWaitModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);
        
        var cols = this.grid.columns;
        var contractStore = this.contractSupplierStore;
        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;
            var me = this;

            switch(dataIndex) {
                case 'remain_quan':
                    col['editor'] = {
                        xtype:'numberfield',
                        minValue:0,
                        listeners: {
                            change: function(field, value, oldValue) {
                                var select = gm.me().grid.getSelectionModel().getSelection()[0];
                                var not_gr_quan = select.get('not_gr_quan');
                                if(value > not_gr_quan) {
                                    Ext.MessageBox.alert('알림', '미입고량을 확인해주세요.');
                                    select.set('remain_quan', oldValue);
                                    return;
                                };
                            }
                        }
                    };
                    col['renderer'] = function(value, meta) {
                        meta.css = 'custom-column';
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
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
                    var select = selections[0];
                    console.log('=======select', select);

                    gm.me().execWearingAction.enable();
                } else {
                    gm.me().execWearingAction.disable();
                }
            }
        });

        // this.grid.on('edit', function(editor, e) {
        //     var rec = e.record;
        //     var unique_id = rec.get('unique_id');
        //     var req_quan = rec.get('req_quan');
        //     var pctman_uid = rec.get('sup_name');
        //     var req_date = rec.get('req_date');
        //     if(req_date==null||req_date.length<1) {
        //         gm.me().store.load();
        //         return;
        //     };
        //     req_date = Ext.Date.format(new Date(req_date), 'Y-m-d');

        //     Ext.Ajax.request({
        //         url: CONTEXT_PATH + '/prch.do?method=updateOrderComponent',
        //         params: {
        //             unique_id:unique_id,
        //             req_quan:req_quan,
        //             pctman_uid:gm.me().vPCTMAN_UID,
        //             req_date:req_date
        //         },
        //         success: function(result, request) {
        //             gm.me().store.load();
        //         },
        //         // failure: extjsUtil.failureMessage
        //     });
        // });

        this.callParent(arguments);

        // this.store.getProxy().setExtraParam('comp_type', 'PR');
        this.store.getProxy().setExtraParam('status', 'PO');
        this.store.load();

        this.whumstStore.load();
	},

    execWearingHandler: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uids = [];
        var gr_quans = [];
        for(var i=0; i<selections.length; i++) {
            var select = selections[i];
            var id = select.get('unique_id');
            var remain_quan = select.get('remain_quan');
            uids.push(id);
            gr_quans.push(remain_quan);
        }
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('exec_wear_form'),
            xtype: 'form',
            frame: false,
            width: 500,
            height: 450,
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
                    id:gu.id('gr_comment'),
                    name:'gr_comment',
                    xtype:'textarea',
                    fieldLabel:'입고의견'
                }, {
                    id:gu.id('gr_date'),
                    name:'gr_date',
                    xtype:'datefield',
                    fieldLabel:'입고일자',
                    format:'Y-m-d',
                    dateFormat:'Y-m-d',
                    submitFormat:'Y-m-d',
                    value:Ext.Date.format(new Date(), 'Y-m-d'),
                }, {
                    id:gu.id('whumst_uid'),
                    name:'whumst_uid',
                    xtype:'combo',
                    fieldLabel:'창고지정',
                    store:gm.me().whumstStore,
                    displayField:'wh_name',
                    valueField:'unique_id',
                    // value:'자재창고',
                    minChars: 1,
                    listConfig:{
                        loadingText: 'Searching...',
                        emptyText: 'No matching posts found.',
                        getInnerTpl: function() {
                            return '<div data-qtip="{unique_id}">{wh_name}</div>';
                        }			                	
                    },
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '입고실행',
            width: 500,
            height: 250,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('exec_wear_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        var gr_date = val['gr_date'];
                        gr_date = Ext.Date.format(new Date(gr_date), 'Y-m-d');
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/stock.do?method=execWearingEvent',
                            params:{
                                unique_id_list:uids,
                                gr_quans:gr_quans,
                                gr_comment:val['gr_comment'],
                                whumst_uid:val['whumst_uid'],
                                gr_date:gr_date
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

    whumstStore:Ext.create('Msys.store.WhuMstStore'),
})