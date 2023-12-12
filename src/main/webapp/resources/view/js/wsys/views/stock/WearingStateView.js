Ext.define('Msys.views.stock.WearingStateView', {
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

        this.cancelWearingAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '입고취소',
            disabled: true,
            tooltip: '선택하신 항목을 입고취소 합니다.',
            handler: function() {
                gm.me().cancelWearingHandler();
            }
        });

        buttonToolbar.insert(1, this.cancelWearingAction);

		//스토어 생성
        this.createStore('Msys.model.WearingStateModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);
        
        var cols = this.grid.columns;
        var contractStore = this.contractSupplierStore;
        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;
            var me = this;
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

                    gm.me().cancelWearingAction.enable();
                } else {
                    gm.me().cancelWearingAction.disable();
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
        this.store.getProxy().setExtraParam('status', 'GR');
        this.store.load();
	},

    cancelWearingHandler: function() {
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('cancel_wear_form'),
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
                    id:gu.id('gc_comment'),
                    name:'gc_comment',
                    xtype:'textarea',
                    fieldLabel:'취소의견'
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            id:gu.id('cancel_wearing_win'),
            title: '입고취소',
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
                    Ext.MessageBox.show({
                        title:'입고취소',
                        msg: '선택하신 항목들을 입고취소 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn: gm.me().cancelWearingEvent,
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

    cancelWearingEvent: function(btn) {
        if(btn == 'yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];
            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                var is_calculate = select.get('is_calculate');
                if(is_calculate!=null && is_calculate=='Y') {
                    Ext.MessageBox.alert('알림', '이미 정산된 항목이 있습니다.');
                    return;
                };
                uids.push(uid);
            };
            var form = Ext.getCmp(gu.id('cancel_wear_form')).getForm();
            if(form.isValid()) {
                var val = form.getValues(false);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/stock.do?method=cancelWearingEvent',
                    params:{
                        unique_id_list:uids,
                        gc_comment:val['gc_comment']
                    },
                    success: function(val, action) {
                        gm.me().store.load();
                        var win = Ext.getCmp(gu.id('cancel_wearing_win'));
                        if(win) win.close();
                    },
                    // failure: extjsUtil.failureMessage
                });
            } else {
                Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
            }
        }
    },
})