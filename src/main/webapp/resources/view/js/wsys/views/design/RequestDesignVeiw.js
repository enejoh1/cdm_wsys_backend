Ext.define('Msys.views.design.RequestDesignVeiw', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master RequestDesignVeiw', this.columns);

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

       (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '품목등록',
            tooltip: '품목을 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().addItemHandler();
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '고객사정보를 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().vSelectCstmst);
            }
        });

        this.removeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '삭제',
            tooltip: '삭제',
            disabled: true,
            handler: function () {
				gm.me().removeHandler('REMOVE');
            }
        });

		buttonToolbar.insert(1, this.addItemAction);
        //buttonToolbar.insert(2, this.editAction);
		//buttonToolbar.insert(3, this.removeAction);

		//스토어 생성
        this.createStore('Msys.model.RequestDesignModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });
		
		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
					
					gm.me().addItemAction.enable();
					//gm.me().editAction.enable();
					//gm.me().removeAction.enable();
						
                    
                } else {
					gm.me().addItemAction.disable();
                    //gm.me().editAction.disable();
					//gm.me().removeAction.disable();
                }
            }
        });
        this.callParent(arguments);

        this.store.load();
		this.usrmstStore.load();
	},
	addItemHandler: function() {       
		var select = gm.me().grid.getSelectionModel().getSelection()[0];
		var account = select.get('account_type');
		var type = 'P';
		switch(account){
			case 'P' :
			case 'O' :
				type = 'P';
				gm.me().accountTypeStore.getProxy().setExtraParam('code_group', 'PROUDCT_ACCOUNT');
			break;
			case 'R' :
			case 'G' :
				type = 'M';
				gm.me().accountTypeStore.getProxy().setExtraParam('code_group', 'MATERIAL_ACCOUNT');
			break;
			default:
				type = 'E';
				gm.me().accountTypeStore.getProxy().setExtraParam('code_group', 'ETC_ACCOUNT');
		}
		gm.me().accountTypeStore.load();
        
		var form = Ext.create('Ext.form.Panel', {
            id: gu.id('rd_item_form'),
            xtype: 'form',
            frame: false,
            border:true,
            width: '100%',
            layout:'column',
            bodyPadding: 10,
            items: [
                new Ext.form.Hidden({
                    name: 'type',
                    value: type
                }),
                new Ext.form.Hidden({
                    name: 'unique_id',
                    value: select.get('unique_id')
                }),
				new Ext.form.Hidden({
                    name: 'estsub_uid',
                    value: select.get('estsub_uid')
                }),
                {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '설계요청내용',
                    width: '100%',
                    style: 'padding:10px',
                    defaults: {
                        labelStyle: 'padding:10px',
                        anchor: '100%',
                        layout: {
                            type: 'column',
                        }
                    },
                    items: [{
						xtype:'textarea',
	                    id:gu.id('rd_remark'),
	                    name:'remark',
	                    padding: '0 0 5px 30px',
	                    width:'95%',
						readOnly:true,
	                    value:select.get('remark')
					}]
                },
{
                    xtype:'textfield',
                    id:gu.id('rd_item_code'),
                    name:'item_code',
                    padding: '0 0 5px 0',
                    width:'85%',
                    allowBlank:false,
                    fieldLabel:'<font color=red>*</font>품번',
                    value:''
                },{
                    xtype:'button',
                    text:'중복확인',
                    handler: function() {
                        var item_code = Ext.getCmp(gu.id('rd_item_code')).getValue();
                        if(item_code==null || item_code.length<1) {
                            Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                            uniqueCheck = false;
                            return;
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design.do?method=checkUniqueItemCode',
                            params:{
                                item_code:item_code
                            },
                            success: function (result, request) {
                                var result = Ext.decode(result.responseText);
                                var data = result.datas;

                                if(data>0) {
                                    Ext.MessageBox.alert('알림', '이미 등록된 품번입니다.');
                                    uniqueCheck = false;
                                } else {
                                    gm.me().eventNotice('알림', '사용가능한 품번입니다.');
                                    uniqueCheck = true;
                                }
                            },
                            // failure: extjsUtil.failureMessage
                        });
                    }
                },{
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '제품정보',
                    width: '100%',
                    style: 'padding:10px',
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
                            items: [
                                {
                                    xtype:'combo',
                                    id:gu.id('rd_account_type'),
                                    name:'account_type',
                                    mode: 'local',
                                    padding: '0 0 5px 0',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '계정',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'code_name',
                                    valueField: 'code_value',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().accountTypeStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value: select.get('account_type')
                                },{
                                    xtype:'combo',
                                    id:gu.id('rd_class_1'),
                                    name:'class_1',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '대분류',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'class_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().classStore1,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
									value : ''
                                }, {
                                    xtype:'combo',
                                    id:gu.id('rd_class_2'),
                                    name:'class_2',
                                    mode: 'local',
                                    padding: '0 0 5px 0',
                                    fieldLabel: '중분류',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'class_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().classStore2,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                }, {
                                    xtype:'combo',
                                    id:gu.id('rd_class_3'),
                                    name:'class_3',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '소분류',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'class_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().classStore3,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
									value : ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_item_name'),
                                    name:'item_name',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'<font color=red>*</font>품명',
                                    value:select.get('item_name')
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_specification'),
                                    name:'specification',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'<font color=red>*</font>규격',
                                    value:select.get('specification')
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_model_no'),
                                    name:'model_no',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'모델번호',
                                    value:''
                                }, {
                                    xtype:'combo',
                                    id:gu.id('rd_maker_uid'),
                                    name:'maker_uid',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '제조사',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    emptyText: '선택',
                                    displayField: 'code_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().makerListStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{code_name}</div>';
                                        }
                                    }, 
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value:''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_unit_code'),
                                    name:'unit_code',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'단위',
                                    value:select.get('unit_code')
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_currency'),
                                    name:'currency',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'통화',
                                    value:'KRW'
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('rd_std_sell_price'),
                                    name:'std_sell_price',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'표준판매단가',
                                    value:select.get('std_sell_price')
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('rd_std_pur_price'),
                                    name:'std_pur_price',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'표준구매단가',
                                    value:0
                                }, {
                                    xtype:'combo',
                                    id:gu.id('rd_tax_free'),
                                    name:'tax_free',
                                    mode: 'local',
                                    padding: '0 0 5px 0',
                                    fieldLabel: '비과세 여부',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    emptyText: '선택',
                                    displayField: 'code_name',
                                    valueField: 'code_value',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().ynTypeStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value:'N'
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_description'),
                                    name:'description',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'설명',
                                    value:''
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '추가정보',
                    width: '100%',
                    style: 'padding:10px',
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
                                    id:gu.id('rd_itemmst1'),
                                    name:'itemmst1',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'추가정보1',
                                    value: ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('rd_itemmst2'),
                                    name:'itemmst2',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'추가정보2',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value: ''
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('rd_itemmst3'),
                                    name:'itemmst3',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'추가정보3',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value: ''
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('rd_itemmst4'),
                                    name:'itemmst4',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'추가정보4',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value: ''
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: '품목등록',
            width: 800,
            height: 700,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '등록',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('rd_item_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);

                        form.submit({
                            url: CONTEXT_PATH + '/design.do?method=designRequestAddItem',
                            params: val,
                            success: function(val, action) {
                                gm.me().store.load();
                                if(win) win.close();
                            },
                            failure: function(val, action) {
                                Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                                return;
                            }
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
	removeHandler:function(type) {
		Ext.MessageBox.show({
			title:'삭제',
			msg: '선택하신 항목을 삭제하시겠습니까?',
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn) {
				if(btn=='yes') {
					var selections = gm.me().grid.getSelectionModel().getSelection();
					var unique_ids = []; 
					for(var i=0; i<selections.length; i++) {
							var rec = selections[i];
                            var unique_id = rec.get('unique_id');
                            unique_ids.push(unique_id);
                    }

	        		Ext.Ajax.request({
						url: CONTEXT_PATH + '/sales.do?method=crudCstMst',
						params:{
							unique_ids : unique_ids,
							crud_code : type
						},
						success: function(){
							gm.me().store.load();
						},
						failure: function(){
							//gm.me().showToast('결과', '삭제실패' );
						}
					});
	            }
			},
			icon: Ext.MessageBox.QUESTION
		});

	},
    usrmstStore  : Ext.create('Msys.store.UserStore', {hasNull:true}),
	accountTypeStore:Ext.create('Msys.store.CommonCodeStore', {}),
	classStore1:Ext.create('Msys.store.ClassStore'),
    classStore2:Ext.create('Msys.store.ClassStore'),
    classStore3:Ext.create('Msys.store.ClassStore'),
    classStore4:Ext.create('Msys.store.ClassStore'),
    classStore5:Ext.create('Msys.store.ClassStore'),
    ynTypeStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'YN_TYPE'}),
    makerListStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'MAKER_LIST'}),
})