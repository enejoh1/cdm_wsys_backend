Ext.define('Msys.views.purchase.OrderPurchaseView', {
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

        this.orderReqAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-refresh',
            text: '주문 작성',
            disabled: true,
            tooltip: '선택하신 항목을 주문 작성 합니다.',
            handler: function() {
                gm.me().orderReqHandler();
            }
        });

        this.attachFileAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '첨부파일',
            disabled: true,
            handler: function() {
                gm.me().getAttachFileEvent(gm.me().grid, gu.id('fileGrid'));
            }
        });

        this.denyReqAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '반려',
            disabled: true,
            tooltip: '해당 항목의 요청을 반려합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title:'요청반려',
                    msg: '선택하신 항목들을 요청반려 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().denyReqHandler,
                    // animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });
        
        buttonToolbar.insert(1, this.orderReqAction);
        buttonToolbar.insert(2, this.denyReqAction);
        buttonToolbar.insert(3, this.attachFileAction);

		//스토어 생성
        this.createStore('Msys.model.OrderPurchaseModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);
        
        var cols = this.grid.columns;
        var contractStore = this.contractSupplierStore;
        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;
            var me = this;

            switch(dataIndex) {
                case 'req_quan':
                    col['editor'] = {xtype:'numberfield'};
                    col['renderer'] = function(value, meta) {
                        meta.css = 'custom-column';
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return value;
                    }
                    break;
                case 'req_date':
                    col['editor'] = {
                        xtype:'datefield',
                        format:'Y-m-d',
                        dateFormat:'Y-m-d',
                        submitFormat:'Y-m-d'
                    };
                    col['renderer'] = function(value, meta, record) {
                        meta.css = 'custom-column';
                        if(value==null) {
                            record.set('req_date', new Date(value));
                            record.commit();
                        }
                        value = Ext.Date.format(new Date(value), 'Y-m-d');
                        return value;
                    }
                    break;
                case 'sup_name':
                    col['editor'] = {
                        xtype:'combo',
                        id: gu.id('sup_name'),
                        name:'sup_name',
                        displayField : 'supmst_name',
                        valueField : 'unique_id',
                        store: contractStore,
                        // store:this.contractSupplierStore,
                        minChars: 1,
                        enableKeyEvents: true,
                        editable: true, 
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            // Custom rendering template for each item
                            getInnerTpl: function() {
                                return '<div data-qtip="{unique_id}">{supmst_name}</div>';
                            }			                	
                        },
                        listeners: {
                            select : function(combo, record) {
                                var pctman_uid = record.get('unique_id');
                                gm.me().vPCTMAN_UID = pctman_uid;
                            }
                        }
                    };
                    col['style'] = 'background-color:#0271BC; text-align:center';
                    col["css"] = 'edit-cell';
                    col["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
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
                    var item_id = select.get('item_id');
                    var pctman_uid = select.get('comp1');

                    gm.me().vPCTMAN_UID = pctman_uid;

                    gm.me().contractSupplierStore.getProxy().setExtraParam('item_id', item_id);
                    gm.me().contractSupplierStore.load();
                    
                    gm.me().orderReqAction.enable();
                    gm.me().attachFileAction.enable();
                    gm.me().denyReqAction.enable();
                } else {
                    gm.me().vPCTMAN_UID = -1;

                    gm.me().orderReqAction.disable();
                    gm.me().attachFileAction.disable();
                    gm.me().denyReqAction.disable();
                }
            }
        });

        this.grid.on('edit', function(editor, e) {
            var rec = e.record;
            var unique_id = rec.get('unique_id');
            var req_quan = rec.get('req_quan');
            var pctman_uid = rec.get('sup_name');
            var req_date = rec.get('req_date');
            if(req_date==null||req_date.length<1) {
                gm.me().store.load();
                return;
            };
            req_date = Ext.Date.format(new Date(req_date), 'Y-m-d');

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/prch.do?method=updateOrderComponent',
                params: {
                    unique_id:unique_id,
                    req_quan:req_quan,
                    pctman_uid:gm.me().vPCTMAN_UID,
                    req_date:req_date
                },
                success: function(result, request) {
                    gm.me().store.load();
                },
                // failure: extjsUtil.failureMessage
            });
        });

        this.callParent(arguments);

        this.store.getProxy().setExtraParam('comp_type', 'PR');
        this.store.getProxy().setExtraParam('status', 'PY');
        this.store.load();

        this.deliveryPlaceStore.load();
        this.payConditionStore.load();
        this.contractSupplierStore.getProxy().setExtraParam('limit', 100);
	},
    vPCTMAN_UID:-1,
    denyReqHandler: function(btn) {
        if(btn=='yes') {
            var selections = gm.me().grid.getSelectionModel().getSelection();
            var uids = [];

            for(var i=0; i<selections.length; i++) {
                var select = selections[i];
                var uid = select.get('unique_id');
                uids.push(uid);
            };

            if(uids!=null && uids.length>0) {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/prch.do?method=denyRequst',
                    params: {
                        unique_id_list:uids,
                        status:'DE'
                    },
                    success: function(result, request) {
                       gm.me().store.load();
                    },
                    // failure: extjsUtil.failureMessage
                });
            }
        }
    },

    orderReqHandler: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var rec = selections[0];
        var uids = [];
        var sup_id = null;
        var total_amount = 0;
		var height_win = 450;
		var abroad_yn = rec.get('abroad_yn');
		if(abroad_yn=='Y'){height_win = 600;}
		
        for(var i=0; i<selections.length; i++) {
            var select = selections[i];
            var supmst_uid = select.get('supmst_uid');
            if(supmst_uid==null || supmst_uid<1) {
                Ext.MessageBox.alert('알림', '계약공급사를 확인해주세요.');
                return;
            };
            
            if(sup_id==null) sup_id = supmst_uid;

            if(sup_id!=supmst_uid) {
                Ext.MessageBox.alert('알림', '계약공급사를 확인해주세요.');
                return;
            };
            var pur_amount = select.get('pur_price') * select.get('req_quan');
            total_amount += pur_amount * 1;


            var id = select.get('unique_id');
            uids.push(id);
        };
        var item_code = rec.get('item_code');
        var header = '[' + rec.get('sup_name') + '] 발주요청';
        var content = item_code + ' 외 ' + (selections.length - 1) + ' 건';
        var req_date = rec.get('req_date');

        total_amount = Ext.util.Format.number(total_amount, "000,000,000,000,000.##/i");
		
		var formItems = [{
                    id:gu.id('header'),
                    name:'header',
                    xtype:'textfield',
                    fieldLabel:'제목',
                    // readOnly:true,
                    // fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:header
                },{
                    id:gu.id('supplier_name'),
                    name:'supplier_name',
                    xtype:'textfield',
                    fieldLabel:'주문처',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:rec.get('sup_name')
                },{
                    id:gu.id('content'),
                    name:'content',
                    xtype:'textfield',
                    fieldLabel:'주문내용',
                    // readOnly:true,
                    // fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:content
                },{
                    id:gu.id('currency'),
                    name:'currency',
                    xtype:'textfield',
                    fieldLabel:'통화',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:rec.get('currency')
                },{
                    id:gu.id('amount_price'),
                    name:'amount_price',
                    xtype:'textfield',
                    fieldLabel:'합계금액',
                    readOnly:true,
                    fieldStyle:'background-color: #D6E8F6; background-image: none;',
                    value:total_amount
                },{
	            	id:gu.id('delivery_place'),
	                name:'delivery_place',
	                xtype:'combo',
	                fieldLabel:'납품장소',
	                store:gm.me().deliveryPlaceStore,
	                displayField:'code_value',
	                valueField:'code_value',
	                value:'본사',
	                minChars: 1,
	                listConfig:{
	                    loadingText: 'Searching...',
	                    emptyText: 'No matching posts found.',
	                    getInnerTpl: function() {
	                        return '<div data-qtip="{code_value}">{code_value}</div>';
	                    }			                	
	                }
            	}
		];
		if(abroad_yn=='Y'){
			formItems.push({
            	fieldLabel: 'P/O No.',
                name:'po_no',
                xtype: 'textfield'
            });
			formItems.push({
				fieldLabel: 'SHIPPING MODE',
                name:'shipping_mode',
                xtype: 'combo',
                queryMode: 'local',
                forceSelection: true,
                displayField : 'name',
                valueField : 'value',
                fieldStyle: 'background-color: #FBF8E6',
                store : Ext.create('Ext.data.Store',{
                	queryMode : 'local',
                    storeId : 'columnStore',
                    fields : ['name','value'],
                    data : [
						{name : 'Air', value : 'Air'},
						{name : 'Ocean', value : 'Ocean'},
						{name : 'DHL',value : 'DHL'}
					]
				})
			});
			formItems.push({
				fieldLabel: 'PAYMENT TERMS',
                name:'pay_condition',
                xtype: 'combo',
                queryMode: 'local',
                forceSelection: true,
                displayField : 'name',
                valueField : 'value',
                fieldStyle: 'background-color: #FBF8E6',
                store : Ext.create('Ext.data.Store',{
                	queryMode : 'local',
                    storeId : 'columnStore',
                    fields : ['name','value'],
                    data : [
                    	{name : 'L/C',value : 'L/C'},
						{name : 'T/T in advance', value : 'T/T in advance'},
                        {name : 'T/T after B/L date', value : 'T/T after B/L date'}
                    ]
                })
			});
			formItems.push({
				fieldLabel: 'DELIVERY TERMS',
                name:'delivery_terms',
                xtype: 'combo',
                queryMode: 'local',
                forceSelection: true,
                displayField : 'name',
                valueField : 'value',
                fieldStyle: 'background-color: #FBF8E6',
                store : Ext.create('Ext.data.Store', {
                	queryMode : 'local',
                    storeId : 'columnStore',
                    fields : ['name','value'],
                    data : [
                    	{name : '[FOB]본선인도조건',		  value : 'FOB'},
                    	{name : '[FCA]운송인인도조건',		  value : 'FCA'},
                    	{name : '[FAS]선측인도조건',		  value : 'FAS'},
                    	{name : '[CFR]운임포함조건',		  value : 'CFR'},
                    	{name : '[CIF]운임보험료포함조건',	  value : 'CIF'},
                    	{name : '[EXW]공장인도조건',		  value : 'EXW'},
                    	{name : '[DDP(U)]관세미지급인도조건', value : 'DDP(U)'}
                	]
				}),
        	});
		}else{
			formItems.push({
	                id:gu.id('pay_condition'),
	                name:'pay_condition',
	                xtype:'combo',
	                fieldLabel:'결제조건',
	                store:gm.me().payConditionStore,
	                displayField:'code_value',
	                valueField:'code_value',
	                value:'정기결제',
	                minChars: 1,
	                listConfig:{
	                	loadingText: 'Searching...',
	                    emptyText: 'No matching posts found.',
	                    getInnerTpl: function() {
	                		return '<div data-qtip="{code_value}">{code_value}</div>';
	                	}			                	
	            	}
				});
		}
		formItems.push({
            id:gu.id('remark'),
            name:'remark',
            xtype:'textarea',
            fieldLabel:'비고'
        });
		formItems.push({
            id:gu.id('send_comment'),
            name:'send_comment',
            xtype:'textarea',
            fieldLabel:'상신의견'
        });

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('order_pur_form'),
            xtype: 'form',
            frame: false,
            width: 500,
            height: 500,
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
            items: formItems
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '주문작성',
            width: 600,
            height: height_win,
            plain: true,
            autoScroll : true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('order_pur_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
						var po_no = ''; if(val['po_no']!=undefined){po_no=val['po_no'];}
						var shipping_mode = ''; if(val['shipping_mode']!=undefined){shipping_mode=val['shipping_mode'];}
						var delivery_terms = ''; if(val['delivery_terms']!=undefined){delivery_terms=val['delivery_terms'];}
						
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/prch.do?method=requestOrderPurchase',
                            params:{
                                supmst_uid:rec.get('supmst_uid'),
                                header:val['header'],
                                content:val['content'],
                                amount_price:val['amount_price'],
                                pay_condition:val['pay_condition'],
                                send_comment:val['send_comment'],
                                delivery_place:val['delivery_place'],
                                remark:val['remark'],
								po_no:po_no,
								shipping_mode:shipping_mode,
								delivery_terms:delivery_terms,
                                unique_id_list:uids
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

    deliveryPlaceStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'DELIVERY_PLACE'}),
    payConditionStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'PAY_CONDITION'}),
    contractSupplierStore:Ext.create('Msys.store.PctManStore'),
})