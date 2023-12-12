Ext.define('Msys.views.purchase.SupplierMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master CustomerMgmtView', this.columns);

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

       (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '등록',
            tooltip: '고객사를 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '고객사정보를 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().vSelectSupmst);
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

		buttonToolbar.insert(1, this.addAction);
        buttonToolbar.insert(2, this.editAction);
		buttonToolbar.insert(3, this.removeAction);

		//스토어 생성
        this.createStore('Msys.model.SupplierMgmtModel', gu.pageSize);

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
					gm.me().vSelectSupmst = select;
					gm.me().editAction.enable();
					gm.me().removeAction.enable();
						
                    
                } else {
                    gm.me().editAction.disable();
					gm.me().removeAction.disable();
                }
            }
        });
        this.callParent(arguments);

        this.store.load();
		this.usrmstStore.load();
	},
	crudHandler: function(type, record) {
		var fieldColor = 'background-color:none';
		switch(type){
			case 'ADD':
				gm.me().crudText='공급사 등록';
			break;
			case 'EDIT':
				gm.me().crudText='공급사 수정';
				fieldColor='background-color:#DCDCDC';
			break;
		};
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('addForm'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
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
                                    xtype:'combo',
                                    id:'abroad_yn',
                                    name:'abroad_yn',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'외자구분',
									queryMode:'local',
									minChars: 1,
									displayField: 'name',
									valueField: 'value',
	                                listConfig: {
	                                    loadingText: '검색중...',
	                                    emptyText: '일치하는 항목 없음.',
	                                    getInnerTpl: function() {
	                                        return '<div data-qtip="{value}">{name}</div>';
	                                    }
	                                },
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
            			  				storeId : 'columnStore',
            			  				fields : [
            			  					'name',
            			  					'value'
            			  				],
            			  				data : [
            			  					{
            			  						name : '내자',
            			  						value : 'N'
            			  					},{
            			  						name : '외자',
            			  						value : 'Y'
            			  					}
            			  				]
									}),
									value:(type=='ADD')? 'N' : record.get('abroad_yn'),
                                },{
                                    xtype:'textfield',
                                    id:'sup_code',
                                    name:'sup_code',
                                    padding: '0 0 5px 30px',
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    fieldLabel:'공급사코드',
									readOnly:(type=='ADD')?false:true,
									value: (type=='ADD')? '' : record.get('sup_code')
                                },{
                                    xtype:'button',
                                    text:'자동생성',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var sup_code = Ext.getCmp('sup_code');
                                            // 다음 고객사코드 가져오기
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=getAutoCode',
												params:{
													table_name : 'supmst',
													column_name : 'sup_code',
													first_code : 'SUP',
													length : 4
												},
                                                success: function (result, request) {
                                                    var result = Ext.decode(result.responseText);
                                                    var data = result.datas;
                                                    sup_code.setValue(data);
                                                },
                                                // failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'sup_name',
                                    name:'sup_name',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'공급사명',
									value: (type=='ADD')? '' : record.get('sup_name')
                                },{
                                    id :'po_user_uid',
                                    name : 'po_user_uid',
                                    fieldLabel: '구매담당자',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().usrmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'user_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'user_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('po_user_uid'),
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
                                    xtype:'textfield',
                                    id:'nation_code',
                                    name:'nation_code',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'국가코드',
									value: (type=='ADD')? 'KR' : record.get('nation_code')
                                },{
                                    xtype:'textfield',
                                    id:'biz_no',
                                    name:'biz_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'사업자번호',
									value: (type=='ADD')? '' : record.get('biz_no')
                                },{
                                    xtype:'textfield',
                                    id:'biz_condition',
                                    name:'biz_condition',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'업태',
									value: (type=='ADD')? '' : record.get('biz_condition')
                                },{
                                    xtype:'textfield',
                                    id:'biz_category',
                                    name:'biz_category',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'업종',
									value: (type=='ADD')? '' : record.get('biz_category')
                                },{
                                    xtype:'textfield',
                                    id:'ceo_name',
                                    name:'ceo_name',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'대표자명',
									value: (type=='ADD')? '' : record.get('ceo_name')
                                },{
                                    xtype:'textfield',
                                    id:'zip_code',
                                    name:'zip_code',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'우편번호',
									value: (type=='ADD')? '' : record.get('zip_code')
                                },{
                                    xtype:'textfield',
                                    id:'address_kr',
                                    name:'address_kr',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'한글주소',
									value: (type=='ADD')? '' : record.get('address_kr')
                                },{
                                    xtype:'textfield',
                                    id:'address_en',
                                    name:'address_en',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'영문주소',
									value: (type=='ADD')? '' : record.get('address_en')
                                },{
                                    xtype:'textfield',
                                    id:'tel_no',
                                    name:'tel_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'Tel',
									value: (type=='ADD')? '' : record.get('tel_no')
                                },{
                                    xtype:'textfield',
                                    id:'fax_no',
                                    name:'fax_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'Fax',
									value: (type=='ADD')? '' : record.get('fax_no')
                                },{
                                    xtype:'textfield',
                                    id:'email',
                                    name:'email',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'Email',
									value: (type=='ADD')? '' : record.get('email')
                                },{
                                    xtype:'textfield',
                                    id:'manager_name',
                                    name:'manager_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'담당자명',
									value: (type=='ADD')? '' : record.get('manager_name')
                                },{
                                    xtype:'textfield',
                                    id:'manager_tel_no',
                                    name:'manager_tel_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'담당자Tel',
									value: (type=='ADD')? '' : record.get('manager_tel_no')
                                },{
                                    xtype:'textfield',
                                    id:'manager_mobile_no',
                                    name:'manager_mobile_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'담당자Mobile',
									value: (type=='ADD')? '' : record.get('manager_mobile_no')
                                },{
                                    xtype:'textfield',
                                    id:'manager_email',
                                    name:'manager_email',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'담당자Email',
									value: (type=='ADD')? '' : record.get('manager_email')
                                },{
                                    xtype:'datefield',
                                    id:'biz_start_date',
                                    name:'biz_start_date',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'거래시작일',
									format:'Y-m-d',
									value: (type=='ADD')? new Date() : gm.me().Date2String(record.get('biz_start_date'))
                                },{
                                    xtype:'combo',
                                    id:'use_yn',
                                    name:'use_yn',
									hidden: (type=='ADD')?false:true,
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'거래여부',
									queryMode:'local',
									minChars: 1,
									displayField: 'name',
									valueField: 'value',
									value:(type=='ADD')? 'Y' : record.get('use_yn'),
	                                listConfig: {
	                                    loadingText: '검색중...',
	                                    emptyText: '일치하는 항목 없음.',
	                                    getInnerTpl: function() {
	                                        return '<div data-qtip="{value}">{name}</div>';
	                                    }
	                                },
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
            			  				storeId : 'columnStore',
            			  				fields : [
            			  					'name',
            			  					'value'
            			  				],
            			  				data : [
            			  					{
            			  						name : '거래종료',
            			  						value : 'N'
            			  					},{
            			  						name : '거래중',
            			  						value : 'Y'
            			  					}
            			  				]
									})
                                },
								new Ext.form.Hidden({
                                	  id:'unique_id',
                                      name: 'unique_id',
                                      value: (type=='ADD')? -1 : record.get('unique_id')
                                }),
                            ]
                        }
                    ]
                },{
					xtype: 'fieldset',
                    collapsible: false,
                    title: '계좌 정보',
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
							items: [
								{
                                    xtype:'textfield',
                                    id:'bank_name',
                                    name:'bank_name',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    fieldLabel:'은행명',
									value: (type=='ADD')? '' : record.get('bank_name')
                                },{
                                    xtype:'textfield',
                                    id:'bank_account',
                                    name:'bank_account',
                                    width:'45%',
                                    padding: '0 0 5px 30',
                                    fieldLabel:'은행계좌번호',
									value: (type=='ADD')? '' : record.get('bank_account')
                                },{
                                    xtype:'textfield',
                                    id:'bank_holder',
                                    name:'bank_holder',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    fieldLabel:'예금주',
									value: (type=='ADD')? '' : record.get('bank_holder')
                                }
							]
						}	
					]//end of fieldset items
				}
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: gm.me().crudText,
            width: 750,
            height: 600,
            plain: true,
            layout:'hbox',
            items: [
                form
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
                            var unique_id = val['unique_id'];
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/prch.do?method=crudSupMst',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									abroad_yn : val['abroad_yn'],
									sup_code : val['sup_code'],
									sup_name : val['sup_name'],
									po_user_uid : val['po_user_uid'],
									nation_code : val['nation_code'],
									biz_no : val['biz_no'],
									biz_condition : val['biz_condition'],
									biz_category : val['biz_category'],
									ceo_name : val['ceo_name'],
									zip_code : val['zip_code'],
									address_kr : val['address_kr'],
									address_en : val['address_en'],
									tel_no : val['tel_no'],
									fax_no : val['fax_no'],
									email : val['email'],
									manager_name : val['manager_name'],
									manager_tel_no : val['manager_tel_no'],
									manager_mobile_no : val['manager_mobile_no'],
									manager_email : val['manager_email'],
									bank_name : val['bank_name'],
									bank_account : val['bank_account'],
									bank_holder : val['bank_holder'],
									biz_start_date : val['biz_start_date'],
									use_yn : val['use_yn']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().vSelectSupmst =  gm.me().store.findRecord('unique_id', unique_id);
												}
											}
										}
									);
									
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            Ext.MessageBox.alert('알림', '공급사코드/공급사명/사업자번호/공급사담당자를 확인해주세요.');
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
						url: CONTEXT_PATH + '/sales.do?method=crudSupMst',
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
	Date2String : function(date){
    	if(date==null){
    		return '';
    	}else{
    		var sbstr = date.substring(0,10);
        	return sbstr;
    	}
    	
    },
    usrmstStore  : Ext.create('Msys.store.UserStore', 	{hasNull:true})
})