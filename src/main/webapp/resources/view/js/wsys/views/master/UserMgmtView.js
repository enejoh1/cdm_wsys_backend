Ext.define('Msys.views.master.UserMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master UserMgmtModel', this.columns);

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
            tooltip: '사용자를 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '사용자정보를 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().vSelectUsrMst);
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
        this.createStore('Msys.model.UserMgmtModel', gu.pageSize);

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
					gm.me().vSelectUsrMst = select;
					
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
		this.authmstStore.load();
		this.depmstStore.load();
		this.divmstStore.load();
		
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
                                    id:'user_id',
                                    name:'user_id',
                                    padding: '0 0 5px 0px',
									fieldStyle: fieldColor,
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    fieldLabel:'사용자ID',
									readOnly:(type=='ADD')?false:true,
									value: (type=='ADD')? '' : record.get('user_id')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var user_id = Ext.getCmp('user_id').getValue();
                                            //아이디 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'usrmst',
													column_name : 'user_id',
													code : user_id
												},
                                                success: function (result, request) {
                                                    var result = Ext.decode(result.responseText);
                                                    var data = result.datas;
													if(data=='false') {
		                                    			Ext.MessageBox.alert('알림', '이미 등록된 아이디입니다.');
					                                    uniqueCheck = false;
					                                } else {
					                                    gm.me().eventNotice('알림', '사용가능한 아이디입니다.');
					                                    uniqueCheck = true;
					                                }
                                                },
                                                // failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'password',
                                    name:'password',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'패스워드',
									inputType: 'password',
									value: (type=='ADD')? '' : record.get('password')
                                },{
                                    id :'divmst_uid',
                                    name : 'divmst_uid',
                                    fieldLabel: '사업부',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().divmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'div_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'div_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('divmst_uid'),
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{div_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
											gm.me().depmstStore.getProxy().setExtraParam('divmst_uid', record.get('unique_id'));
                    						gm.me().depmstStore.load();
                                        }// endofselect
                                    }
                                },{
                                    id :'depmst_uid',
                                    name : 'depmst_uid',
                                    fieldLabel: '부서',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().depmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'dept_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'div_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('depmst_uid'),
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{dept_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
	
                                        }// endofselect
                                    }
                                },{
                                    id :'user_type',
                                    name : 'user_type',
                                    fieldLabel: '권한설정',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().authmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'auth_name',
                                    valueField:   'auth_code',
                                    sortInfo: { field: 'div_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('user_type'),
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{auth_code}">{auth_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
	
                                        }// endofselect
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'emp_no',
                                    name:'emp_no',
                                    padding: '0 0 5px 30px',
                                    fieldStyle: fieldColor,
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    fieldLabel:'사원번호',
									value: (type=='ADD')? '' : record.get('emp_no')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var emp_no = Ext.getCmp('emp_no').getValue();
                                            //아이디 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'usrmst',
													column_name : 'emp_no',
													code : emp_no
												},
                                                success: function (result, request) {
                                                    var result = Ext.decode(result.responseText);
                                                    var data = result.datas;
													if(data=='false') {
		                                    			Ext.MessageBox.alert('알림', '이미 등록된 사원번호입니다.');
					                                    uniqueCheck = false;
					                                } else {
					                                    gm.me().eventNotice('알림', '사용가능한 사원번호입니다.');
					                                    uniqueCheck = true;
					                                }
                                                },
                                                // failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'position',
                                    name:'position',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'직책',
									value: (type=='ADD')? '' : record.get('position')
                                },{
                                    xtype:'textfield',
                                    id:'user_name',
                                    name:'user_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'이름',
									value: (type=='ADD')? '' : record.get('user_name')
                                },{
                                    xtype:'textfield',
                                    id:'user_name_en',
                                    name:'user_name_en',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'이름(영문)',
									value: (type=='ADD')? '' : record.get('user_name_en')
                                },{
                                    xtype:'textfield',
                                    id:'reg_no',
                                    name:'reg_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'주민등록번호',
									value: (type=='ADD')? '' : record.get('reg_no')
                                },{
                                    xtype:'textfield',
                                    id:'zip_code',
                                    name:'zip_code',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'우편번호',
									value: (type=='ADD')? '' : record.get('zip_code')
                                },{
                                    xtype:'textfield',
                                    id:'address1',
                                    name:'address1',
                                    padding: '0 0 5px 0px',
                                    width:'94%',
                                    allowBlank:false,
                                    fieldLabel:'주소1',
									value: (type=='ADD')? '' : record.get('address1')
                                },{
                                    xtype:'textfield',
                                    id:'address2',
                                    name:'address2',
                                    padding: '0 0 5px 0px',
                                    width:'94%',
                                    allowBlank:false,
                                    fieldLabel:'주소2',
									value: (type=='ADD')? '' : record.get('address2')
                                },{
                                    xtype:'textfield',
                                    id:'hp_no',
                                    name:'hp_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'자택번호',
									value: (type=='ADD')? '' : record.get('hp_no')
                                },{
                                    xtype:'textfield',
                                    id:'mobile_no',
                                    name:'mobile_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'휴대폰번호',
									value: (type=='ADD')? '' : record.get('mobile_no')
                                },{
                                    xtype:'textfield',
                                    id:'extention_no',
                                    name:'extention_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'내선번호',
									value: (type=='ADD')? '' : record.get('extention_no')
                                },{
                                    xtype:'textfield',
                                    id:'tel_no',
                                    name:'tel_no',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'외선번호',
									value: (type=='ADD')? '' : record.get('tel_no')
                                },{
                                    xtype:'textfield',
                                    id:'fax_no',
                                    name:'fax_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'팩스번호',
									value: (type=='ADD')? '' : record.get('fax_no')
                                },{
                                    xtype:'textfield',
                                    id:'email',
                                    name:'email',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'이메일',
									value: (type=='ADD')? '' : record.get('email')
                                },


								new Ext.form.Hidden({
                                	  id:'unique_id',
                                      name: 'unique_id',
                                      value: (type=='ADD')? -1 : record.get('unique_id')
                                }),
								new Ext.form.Hidden({
                                	  id:'crud_code',
                                      name: 'crud_code',
                                      value: type
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
                                url: CONTEXT_PATH + '/master.do?method=crudUsrMst',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									user_id : val['user_id'],
									password : val['password'],
									divmst_uid : val['divmst_uid'],
									depmst_uid : val['depmst_uid'],
									user_type : val['user_type'],
									emp_no : val['emp_no'],
									position : val['position'],
									user_name : val['user_name'],
									user_name_en : val['user_name_en'],
									reg_no : val['reg_no'],
									zip_code : val['zip_code'],
									address1 : val['address1'],
									address2 : val['address2'],
									hp_no : val['hp_no'],
									mobile_no : val['mobile_no'],
									extention_no : val['extention_no'],
									tel_no : val['tel_no'],
									fax_no : val['fax_no'],
									email : val['email']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().vSelectUsrMst =  gm.me().store.findRecord('unique_id', unique_id);
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
						url: CONTEXT_PATH + '/master.do?method=crudUsrMst',
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
    divmstStore  : Ext.create('Msys.store.DivMstStore', 	{hasNull:true}),
    depmstStore  : Ext.create('Msys.store.DepMstStore', 	{hasNull:true}),
    authmstStore  : Ext.create('Msys.store.AuthMstStore', 	{hasNull:false})
})