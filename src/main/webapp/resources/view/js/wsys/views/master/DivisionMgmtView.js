Ext.define('Msys.views.master.DivisionMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master DivisionMgmtView', this.columns);

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
                gm.me().crudHandler('EDIT', gm.me().vSelectDivMst);
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
        this.createStore('Msys.model.DivisionMgmtModel', gu.pageSize);

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
					gm.me().vSelectDivMst = select;
					
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
                                    id:'div_code',
                                    name:'div_code',
                                    padding: '0 0 5px 0px',
									fieldStyle: fieldColor,
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    fieldLabel:'사업부코드',
									readOnly:(type=='ADD')?false:true,
									value: (type=='ADD')? '' : record.get('div_code')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var div_code = Ext.getCmp('div_code');
                                            //코드 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'divmst',
													column_name : 'div_code',
													code : div_code.getValue()
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
                                    id:'div_name',
                                    name:'div_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'사업부명',
									value: (type=='ADD')? '' : record.get('div_name')
                                },{
                                    id :'ceo_uid',
                                    name : 'ceo_uid',
                                    fieldLabel: '사업부대표',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().usrmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'user_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'user_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('ceo_uid'),
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
                                    id:'tel_no',
                                    name:'tel_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'사업부 Tel',
									value: (type=='ADD')? '' : record.get('tel_no')
                                },{
                                    xtype:'textfield',
                                    id:'fax_no',
                                    name:'fax_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldLabel:'사업부 Fax',
									value: (type=='ADD')? '' : record.get('fax_no')
                                },{
                                    xtype:'textfield',
                                    id:'email',
                                    name:'email',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'사업부 Email',
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
                                url: CONTEXT_PATH + '/master.do?method=crudDivMst',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									div_code : val['div_code'],
									div_name : val['div_name'],
									ceo_uid : val['ceo_uid'],
									tel_no : val['tel_no'],
									fax_no : val['fax_no'],
									email : val['email']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().vSelectDivMst =  gm.me().store.findRecord('unique_id', unique_id);
												}
											}
										}
									);	
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            Ext.MessageBox.alert('알림', '필수값을을 확인해주세요.');
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
						url: CONTEXT_PATH + '/master.do?method=crudDivMst',
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
    usrmstStore  : Ext.create('Msys.store.UserStore', 	{hasNull:true})
})