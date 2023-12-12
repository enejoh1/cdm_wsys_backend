Ext.define('Msys.views.master.MenuAuthMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master MenuAuthMgmtView', this.columns);

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
            tooltip: '권한을 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '권한정보를 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().vSelectAuthMst);
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
        buttonToolbar.insert(1, this.editAction);
		//buttonToolbar.insert(3, this.removeAction);
		
		//스토어 생성
        this.createStore('Msys.model.MenuAuthMgmtModel', gu.pageSize);

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
					gm.me().vSelectAuthMst = select;
					
					gm.me().editAction.enable();
					gm.me().removeAction.enable();
                } else {
                    gm.me().editAction.disable();
                    gm.me().removeAction.disable();
                }
            }
        });

        this.callParent(arguments);


		this.store.getProxy().setExtraParam('orderBy', "menu.unique_id ASC, menu.sort_no ASC");
        this.store.load();
		this.authmstStore.load();
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
                                    id:'menu_name',
                                    name:'menu_name',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'메뉴명',
									value: (type=='ADD')? '' : record.get('menu_name')
                                },{
                                    xtype:'textfield',
                                    id:'menu_name_en',
                                    name:'menu_name_en',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'메뉴명(영문)',
									value: (type=='ADD')? '' : record.get('menu_name_en')
                                },{
			                		xtype: 'combo',
			                		field_id:  'auth_code',
			                        id: 'auth_code',
			                        name: 'auth_code',
                                    fieldLabel:'권한선택',
									padding: '0 0 5px 0px',
									width:'100%',
			                        queryMode: 'local',
			                        emptyText: '선택',
			                  		forceSelection: true,
			                  		multiSelect:true,
			                        selectOnFocus:true,
			                  		displayField : 'auth_name',
			                  		valueField : 'auth_code',
			                  		fieldStyle: 'background-color: #FBF8E6; background-image: none; width:50',
			                        store : gm.me().authmstStore,
			                  		listeners: { 
			                  			select: function(combo, record) {
											var auth_code = Ext.getCmp('auth_code');
											var menu_auth = Ext.getCmp('menu_auth');
			                  				menu_auth.setValue(auth_code.getValue());
			                  			}
			                  		}
			                    },{
                                    xtype:'textfield',
                                    id:'menu_auth',
                                    name:'menu_auth',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
									hidden:false,
									fieldStyle:'background-color:#DCDCDC',
                                    fieldLabel:'권한',
									value: (type=='ADD')? '' : record.get('menu_auth')
                                },{
                                    xtype:'numberfield',
                                    id:'sort_no',
                                    name:'sort_no',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'메뉴순번',
									value: (type=='ADD')? '' : record.get('sort_no')
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
            width: 400,
            height: 300,
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
                                url: CONTEXT_PATH + '/master.do?method=crudMenu',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									menu_name : val['menu_name'],
									menu_name_en : val['menu_name_en'],
									menu_auth : val['menu_auth'],
									sort_no : val['sort_no']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().vSelectAuthMst =  gm.me().store.findRecord('unique_id', unique_id);
												}
											}
										}
									);	
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            Ext.MessageBox.alert('알림', '필수값을 확인해주세요.');
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
						url: CONTEXT_PATH + '/master.do?method=crudMenu',
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
    authmstStore  : Ext.create('Msys.store.AuthMstStore', 	{hasNull:false})
})