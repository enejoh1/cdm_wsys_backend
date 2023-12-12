Ext.define('Msys.views.master.CompanyMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master CompanyMgmtView', this.columns);

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = {};
        var options = [];

		//스토어 생성
        this.createStore('Msys.model.CompanyMgmtModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

		(buttonToolbar.items).each(function(item,index,length){
            if(index==0||index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '등록',
            tooltip: '회사 및 자회사를 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '회사 및 자회사 정보를 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().vSelectComMst);
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

		//buttonToolbar.insert(1, this.addAction);
        buttonToolbar.insert(0, this.editAction);
		//buttonToolbar.insert(3, this.removeAction);
        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });

		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
					gm.me().vSelectComMst = select;
					gm.me().editAction.enable();
						
                    
                } else {
                    gm.me().editAction.disable();
                }
            }
        });

        this.callParent(arguments);

        this.store.load();
	},
	crudHandler: function(type, record) {
		var fieldColor = 'background-color:none';
		var uniqueCheck = false;
		switch(type){
			case 'ADD':
				gm.me().crudText='등록';
			break;
			case 'EDIT':
				gm.me().crudText='수정';
				fieldColor='background-color:#DCDCDC';
				uniqueCheck = true;
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
                                    xtype:'textfield',
                                    id:'com_code',
                                    name:'com_code',
                                    padding: '0 0 5px 0px',
									fieldStyle: fieldColor,
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    fieldLabel:'회사코드',
									readOnly:(type=='ADD')?false:true,
									value: (type=='ADD')? '' : record.get('com_code')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var com_code = Ext.getCmp('com_code');
                                            //코드 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'commst',
													column_name : 'com_code',
													code : com_code.getValue()
												},
                                                success: function (result, request) {
                                                    var result = Ext.decode(result.responseText);
                                                    var data = result.datas;
													if(data=='false') {
		                                    			Ext.MessageBox.alert('알림', '이미 등록된 코드입니다.');
					                                    uniqueCheck = false;
					                                } else {
					                                    gm.me().eventNotice('알림', '사용가능한 코드입니다.');
					                                    uniqueCheck = true;
					                                }
                                                },
                                                // failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'com_name',
                                    name:'com_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'회사명',
									value: (type=='ADD')? '' : record.get('com_name')
                                },{
                                    xtype:'textfield',
                                    id:'biz_no',
                                    name:'biz_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'사업자번호',
									value: (type=='ADD')? '' : record.get('biz_no')
                                },{
                                    xtype:'textfield',
                                    id:'ceo_name',
                                    name:'ceo_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'대표자명',
									value: (type=='ADD')? '' : record.get('ceo_name')
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
                                    id:'zip_code',
                                    name:'zip_code',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'우편번호',
									value: (type=='ADD')? '' : record.get('zip_code')
                                },{
                                    xtype:'textfield',
                                    id:'address_kr',
                                    name:'address_kr',
                                    padding: '0 0 5px 0px',
                                    width:'94%',
                                    fieldLabel:'한글주소',
									value: (type=='ADD')? '' : record.get('address_kr')
                                },{
                                    xtype:'textfield',
                                    id:'address_en',
                                    name:'address_en',
                                    padding: '0 0 5px 0px',
                                    width:'94%',
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
                                },
								new Ext.form.Hidden({
                                	  id:'unique_id',
                                      name: 'unique_id',
                                      value: (type=='ADD')? -1 : record.get('unique_id')
                                }),
                            ]
                        }
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: true,
            title: gm.me().crudText,
            width: 750,
            height: 550,
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
                                url: CONTEXT_PATH + '/master.do?method=crudComMst',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									com_code : val['com_code'],
									com_name : val['com_name'],
									biz_no : val['biz_no'],
									biz_condition : val['biz_condition'],
									biz_category : val['biz_category'],
									ceo_name : val['ceo_name'],
									zip_code : val['zip_code'],
									address_kr : val['address_kr'],
									address_en : val['address_en'],
									tel_no : val['tel_no'],
									fax_no : val['fax_no'],
									email : val['email']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().vSelectComMst =  gm.me().store.findRecord('unique_id', unique_id);
												}
											}
										}
									);	
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            Ext.MessageBox.alert('알림', '견적번호/견적명/고객사/등록원인 을 확인해주세요.');
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
						url: CONTEXT_PATH + '/master.do?method=crudComMst',
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

	}
})