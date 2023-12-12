Ext.define('Msys.views.purchase.GoodInTransitView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
		
        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

		this.crudOrdSubAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '미착정보입력',
            tooltip: 'L/C No. 데이터를 입력합니다.',
            disabled: false,
            handler: function() {
            	//ordsub 컬럼에 update
            	gm.me().crudOrdSubUpdate();
            	
            }
    	});

        this.blCreateAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: 'B/L No.등록',
            tooltip: 'B/L No. 데이터를 등록합니다.',
            disabled: true,
            handler: function() {
            	//ordsub 테이블에 데이터 create
            	var selections = gm.me().grid.getSelectionModel().getSelection();
            	var sales_price_arr = [];
            	for(var i=0; i< selections.length; i++) {
					 var rec = selections[i];
					 sales_price_arr.push(rec.get('pur_price'));
					 if(rec.get('pur_price')==0){
						 Ext.Msg.alert('알림', '계약단가가 0 입니다. 수정 후 진행하세요.', function() {});
						 return;
					 }
					 if(rec.get('remain_quan')==0){
						 Ext.Msg.alert('알림', 'B/L수량이 0 입니다. 수정 후 진행하세요.', function() {});
						 return;
					 }
					 if(rec.get('remain_quan')<0){
						 Ext.Msg.alert('알림', '선적수량의 값이 잘못 입력되었습니다. 확인 후 진행하세요.', function() {});
						 return;
					 }
					 if(rec.get('po_quan')==rec.get('sh_quan')){
						 Ext.Msg.alert('알림', '주문수량이 전부 선적 되었습니다.', function() {});
						 return;
					 }
				 }
            	
            	gm.me().blNoCreate();
            }
        });

        buttonToolbar.insert(1, this.crudOrdSubAction);
        buttonToolbar.insert(2, this.blCreateAction);

		//스토어 생성
        this.createStore('Msys.model.GoodInTransitModel', gu.pageSize);
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
                                var sh_quan = select.get('sh_quan');
								var po_quan = select.get('po_quan');
								var r_quan = po_quan-sh_quan;
								console.log('r_quan',r_quan);
                                if(value > r_quan) {
                                    Ext.MessageBox.alert('알림', '수량을 확인해주세요.');
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
            items: [
                {
                    collapsible: false,
					frame: true,
					region: 'center',
                    height: '50%',
                    layout:'fit',
					items: this.grid
                }, {
                    id:'ordsub',
					collapsible: false,
					frame: true,
					region: 'south',
					layout: 'fit',
					height: '50%',
					items: this.createSouth()
                }
            ]
        });
		
		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    console.log('=======select', select);
					gm.me().blCreateAction.enable();
                } else {
					gm.me().blCreateAction.disable();
                }
            }
        });
        this.callParent(arguments);

        this.store.getProxy().setExtraParam('status', 'PO');
        this.store.load();
        this.whumstStore.load();
	},
	subGridStore:null,
    createSouth: function() {
    	var menu_code = 'GIT_MANAGE_SUB';
		var options = [];
		
		//스토어 생성
        var store_sub = this.createSubStore('Msys.model.GoodInTransitSubModel', gu.pageSize, menu_code);
        //버튼 생성
		var subBToolbar = this.createButtonToolbar(menu_code, store_sub);
        var subSToolbar = this.createSearchToolbar(menu_code, store_sub, true);

		subBToolbar.insert(1,this.execWearingAction);
		subBToolbar.insert(2,this.blCancleAction);
		subBToolbar.insert(3,this.editCostAction);

        //그리드 생성
        this.ordSubGrid = this.createSubGrid(subBToolbar, subSToolbar, options, store_sub, menu_code);

        this.ordSubGrid.addListener('cellkeydown', this.cellClipCopy);
        this.ordSubGrid.getSelectionModel().on({
        	selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
					if(select.get('status')=='SH'){
						gm.me().execWearingAction.enable();
						gm.me().blCancleAction.enable();
						//gm.me().editCostAction.disable();
					}else{
						gm.me().execWearingAction.disable();
						gm.me().blCancleAction.disable();
						//gm.me().editCostAction.enable();
					}
                } else {
                    gm.me().execWearingAction.disable();
                }
            }
        });
        
        this.ordSubGrid.on('edit', function(editor, e) {

        });
		
		this.subGridStore=store_sub;
		this.subGridStore.load();
        
        return this.ordSubGrid;
    	
    },
	execWearingAction : Ext.create('Ext.Action', {
		xtype : 'button',
        iconCls: 'af-refresh',
        text: '입고실행',
        disabled: true,
        tooltip: '선택하신 항목을 입고실행 합니다.',
        handler: function() {
        	gm.me().execWearingHandler();
        }
    }),
	execWearingHandler: function() {
        var selections = gm.me().ordSubGrid.getSelectionModel().getSelection();
        var uids = [];
		var ordman_uids = [];
        var gr_quans = [];
		var status_arr = [];
        for(var i=0; i<selections.length; i++) {
            var select = selections[i];
            var id = select.get('unique_id');
            var ordman_uid = select.get('ordman_uid');
            var remain_quan = select.get('sh_quan');
            uids.push(id);
            gr_quans.push(remain_quan);
			ordman_uids.push(ordman_uid);
			status_arr.push(select.get('status'));
        }

		if(status_arr.indexOf('Y')>-1){
			Ext.Msg.alert('알림', '입고완료된 품목이 포함되어있습니다. 확인 후 진행하세요.', function() {});
			return;
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
                                gr_date:gr_date,
								ordman_uid_list:ordman_uids
                            },
                            success: function(val, action) {
                                gm.me().store.load();
								gm.me().subGridStore.load();
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
	crudOrdSubUpdate : function() {
    	var selections = gm.me().grid.getSelectionModel().getSelection();
		var ponoStore =	Ext.create('Msys.store.UnitPonoStore',{params:{abroad_yn:'Y',limit:300}})
		// paging Toolbar
        var ponoPaging = Ext.create('Ext.PagingToolbar', {
            store:ponoStore,
            displayInfo: true,
            displayMsg: '{0} - {1} / Total: {2}',
            // displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
            emptyMsg: "표시할 항목이 없습니다.",
            listeners: {
                beforechange: function(page, curPage) { },
                change: function() { }
            }
        });
		ponoStore.load();
        var formItems = [
            {
                xtype: 'fieldset',
                title: '미착정보',
                collapsible: false,
                width: '95%',
                defaults: {
                    width: '100%',
                    layout: {
						region: 'middle',
                        type: 'hbox'
                    }
                },
                items : [
					{
						xtype:'combo',
	                    id:'unitman_uid',
	                    name:'unitman_uid',
	                    padding: '0 0 5px 0px',
	                    allowBlank:false,
	                    fieldLabel:'PO_No. 선택',
						queryMode:'remote',
						minChars: 1,
						displayField: 'unit4',
						valueField: 'unique_id',
						store : ponoStore,
		                listConfig: {
		                 	loadingText: '검색중...',
		                 	emptyText: '일치하는 항목 없음.',
		                 	getInnerTpl: function() {
		                    	return '<div data-qtip="{unique_id}">{unit4}</div>';
		                    }
		                },
						listeners: {
                        	select: function (combo, record) {
								Ext.getCmp('lc_no').setValue(record.get('ord2'));
								Ext.getCmp('exchange_rate').setValue(record.get('exchange_rate'));
                            }
                        }
					},
                    {
                        fieldLabel: 'L/C No',
                        xtype: 'textfield',
                        id: 'lc_no',
                        name: 'lc_no',
                        value: ''
                        
                    },
                    {
                        fieldLabel: '환율',
                        xtype: 'textfield',
                        id: 'exchange_rate',
                        name: 'exchange_rate',
                        value: ''
                        
                    }
                ]
            }
		];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'center',
                msgTarget: 'side'
            },
            items: formItems
        });

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '미착정보 입력',
            width: 450,
            height: 300,
            autoScroll : true,
            plain: true,
			region: 'center',
            items: form,
            buttons: [{
                text: '확인',
                handler: function(btn) {
                	var val = form.getValues(false);
                    Ext.Ajax.request({
                        url : CONTEXT_PATH + '/prch.do?method=crudOrdMan',
                        params: {
							crud_code:'UPDATE_UNIT',
							unique_id:val['unitman_uid'],
                        	lc_no:val['lc_no'],
                        	exchange_rate:val['exchange_rate']
                        	},
                        success: function(val, action){
                            prWin.close();
                            gm.me().store.load();
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });
                }
            }, {
                text: '취소',
                handler: function(btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    }
    ,blNoCreate : function() {
    	var selections = gm.me().grid.getSelectionModel().getSelection();
    	
        var formItems = [
            {
                xtype: 'fieldset',
                title: 'B/L No. 등록',
                collapsible: false,
                width: '95%',
                defaults: {
                    width: '100%',
                    layout: {
                        type: 'hbox'
                    }
                },
                items : [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'B/L No.',
                        id: 'bl_no',
                        name: 'bl_no',
						labelWidth:130,
                        value: '',
                        
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'ETD(출발예정시간)',
						labelWidth:130,
                        id: 'etd',
                        name: 'etd',
                        format: 'Y-m-d'
                    },
                    {	xtype: 'datefield',
                        fieldLabel: 'ETA(도착예정시간)',
                        name: 'eta',
                        id: 'eta',
						labelWidth:130,
//                        value: Ext.Date.format(new Date(),'Y-m-d'),
                        format: 'Y-m-d'
                    }
                ]
            }
            ];

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
            bodyPadding: 10,
            region: 'center',
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: formItems
        });

        var myHeight = 920;
        var myWidth = 600;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: 'B/L No. 입력',
            width: 400,
            height: 300,
            autoScroll : true,
            plain: true,
            items: form,
            buttons: [{
				
                text: '확인',
                handler: function(btn) {
                	var idArray = [];
                	var sh_qtys = []
                	for(var i=0; i< selections.length; i++) {
						var uniqueId = selections[i].get('unique_id');
						var left_qty = selections[i].get('remain_quan');
						idArray.push(uniqueId);
						sh_qtys.push(left_qty);
					}
                	var val = form.getValues(false);
                    Ext.Ajax.request({
                        url : CONTEXT_PATH + '/stock.do?method=crudOrdSub',
                        params: {
                        	crud_code : 'ADD',
                        	bl_no:val['bl_no'],
                        	etd:val['etd'],
                        	eta:val['eta'],
                        	unique_ids : idArray,
                        	sh_qtys : sh_qtys
                        	},
                        success: function(val, action){
                            prWin.close();
                            gm.me().subGridStore.load();
                            gm.me().store.load();
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });
                }
            }, {
                text: '취소',
                handler: function(btn) {
                    prWin.close();
                }
            }]
        });

        prWin.show();
    },
	blCancleAction : Ext.create('Ext.Action', {
		xtype : 'button',
        iconCls: 'af-remove',
        text: 'B/L품목취소',
        disabled: true,
        tooltip: '선택하신 항목을 취소합니다.',
        handler: function() {
			var selections = gm.me().ordSubGrid.getSelectionModel().getSelection();
			var idArray = [];
            for(var i=0; i< selections.length; i++) {
				var uniqueId = selections[i].get('unique_id');
				idArray.push(uniqueId);
			}
			
			Ext.MessageBox.show({
				title:'삭제',
				msg: '선택하신 항목을 삭제하시겠습니까?',
				buttons: Ext.MessageBox.YESNO,
				fn: function(btn) {
					if(btn=='yes') {
						Ext.Ajax.request({
					    	url : CONTEXT_PATH + '/stock.do?method=crudOrdSub',
					        params: {
					        	crud_code : 'REMOVE',
					        	unique_ids : idArray,
					        },
					        success: function(val, action){
					            gm.me().subGridStore.load();
					            gm.me().store.load();
					        }
						});
					}
				},
				icon: Ext.MessageBox.QUESTION
			});
		}
    }),
	editCostAction : Ext.create('Ext.Action', {
		xtype : 'button',
        iconCls: 'af-edit',
        text: '수입비용 입력',
        disabled: false,
        tooltip: 'B/L No.를 선택하여 수입비용을 입력합니다.',
        handler: function() {
        	var selections = gm.me().ordSubGrid.getSelectionModel().getSelection();
	    	var blnoStore =	Ext.create('Msys.store.OrdSubBlnoStore',{params:{limit:300}})
	        var formItems = [
	            {
	                xtype: 'fieldset',
	                title: '수입비용 입력',
	                collapsible: false,
	                width: '95%',
	                defaults: {
	                    width: '100%',
	                    layout: {
	                        type: 'hbox'
	                    }
	                },
	                items : [
	                    {
							xtype:'combo',
		                    id:'bl_no',
		                    name:'bl_no',
		                    padding: '0 0 5px 0px',
		                    allowBlank:false,
		                    fieldLabel:'B/L No.선택',
							queryMode:'remote',
							minChars: 1,
							displayField: 'bl_no',
							valueField: 'bl_no',
							store : blnoStore,
			                listConfig: {
			                 	loadingText: '검색중...',
			                 	emptyText: '일치하는 항목 없음.',
			                 	getInnerTpl: function() {
			                    	return '<div data-qtip="{bl_no}">{bl_no}</div>';
			                    }
			                },
							listeners: {
	                        	select: function (combo, record) {
									Ext.getCmp('lc_no').setValue(record.get('ord2'));
									Ext.getCmp('exchange_rate').setValue(record.get('exchange_rate'));
	                            }
	                        }
						},
	                    {
	                        xtype: 'textfield',
	                        fieldLabel: '관세',
	                        id: 'tariff',
	                        name: 'tariff',
	                    },
	                    {	xtype: 'textfield',
	                        fieldLabel: '수입비용',
	                        name: 'add_fee',
	                        id: 'add_fee',
	                    }
	                ]
	            }
	            ];
	
	        var form = Ext.create('Ext.form.Panel', {
	            id: gu.id('formPanel'),
	            xtype: 'form',
	            frame: false,
	            border: false,
	            width: '100%',
	            bodyPadding: 10,
	            region: 'center',
	            layout: 'column',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            items: formItems
	        });
	
	        var prWin = Ext.create('Ext.Window', {
	            modal: true,
	            title: 'B/L No. 입력',
	            width: 400,
	            height: 300,
	            autoScroll : true,
	            plain: true,
	            items: form,
	            buttons: [{
	                text: '확인',
	                handler: function(btn) {
	                	var val = form.getValues(false);
	                    Ext.Ajax.request({
	                        url : CONTEXT_PATH + '/stock.do?method=crudOrdSub',
	                        params: {
	                        	crud_code : 'EDIT_COST',
	                        	tariff : val['tariff'],
	                        	add_fee : val['add_fee'],
	                        	},
	                        success: function(val, action){
	                            prWin.close();
	                            gm.me().subGridStore.load();
	                            gm.me().store.load();
	                        },
	                        failure: function(val, action){
	                            prWin.close();
	                        }
	                    });
	                }
	            }, {
	                text: '취소',
	                handler: function(btn) {
	                    prWin.close();
	                }
	            }]
	        });
	
	        prWin.show();
	        }
    }),
    whumstStore:Ext.create('Msys.store.WhuMstStore'),
})