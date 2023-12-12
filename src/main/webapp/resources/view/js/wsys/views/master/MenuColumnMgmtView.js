Ext.define('Msys.views.master.MenuColumnMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {

        console.log('MSYS Views master MenuColumnMgmtView', this.columns);
		this.selMode='SINGLE';
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
            tooltip: '컬럼을 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '컬럼정보를 수정합니다.',
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
        this.createStore('Msys.model.MenuColumnMgmtModel', gu.pageSize);

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

		this.store.getProxy().setExtraParam('orderBy', "tb_column.unique_id ASC, tb_column.sort_no ASC");
		this.menuStore.load();
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
			                		xtype: 'combo',
			                		field_id:  'menu_code',
			                        id: 'menu_code',
			                        name: 'menu_code',
                                    fieldLabel:'메뉴',
									padding: '0 0 5px 0px',
									width:'100%',
			                        queryMode: 'local',
			                        emptyText: '선택',
									allowBlank:true,
			                  		forceSelection: true,
			                  		multiSelect:true,
			                        selectOnFocus:true,
			                  		displayField : 'menu_name',
			                  		valueField : 'menu_code',
									value: (type=='ADD')? '' : record.get('menu_code'),
									hidden: (type=='ADD')? false : true,
			                  		fieldStyle: 'background-color: #FBF8E6; background-image: none; width:50',
			                        store : gm.me().menuStore,
			                  		listeners: { 
			                  			select: function(combo, record) {
			                  			}
			                  		}
			                    },{
                                    xtype:'textfield',
                                    id:'data_index',
                                    name:'data_index',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'데이터명',
									value: (type=='ADD')? '' : record.get('data_index'),
									hidden: (type=='ADD')? false : true,
                                },{
                                    xtype:'textfield',
                                    id:'name',
                                    name:'name',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'컬럼명',
									value: (type=='ADD')? '' : record.get('name')
                                },{
                                    xtype:'textfield',
                                    id:'name_en',
                                    name:'name_en',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    fieldLabel:'컬럼명(영문)',
									value: (type=='ADD')? '' : record.get('name_en')
                                },{
                                    xtype:'numberfield',
                                    id:'sort_no',
                                    name:'sort_no',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    fieldLabel:'컬럼순번',
									value: (type=='ADD')? '' : record.get('sort_no')
                                },{
                                    xtype:'numberfield',
                                    id:'width',
                                    name:'width',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    fieldLabel:'컬럼길이',
									value: (type=='ADD')? '' : record.get('width')
                                },{
									xtype:'combo',
									id:'excel_yn',
									name:'excel_yn',
									width:'100%',
									padding: '0 0 5px 0',
									fieldLabel:'Excel사용유무',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? 'Y' : record.get('excel_yn'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'columnStore',
										fields :['name','value'],
										data : [{name : '사용',value : 'Y'},{name : '사용안함',value : 'N'}]
			                        }),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
                                    xtype:'numberfield',
                                    id:'excel_width',
                                    name:'excel_width',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    fieldLabel:'Excel컬럼길이',
									value: (type=='ADD')? '' : record.get('excel_width')
                                },{
                                    xtype:'textfield',
                                    id:'code_type',
                                    name:'code_type',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
									hidden:false,
									fieldStyle:'background-color:#DCDCDC',
                                    fieldLabel:'데이터속성',
									value: (type=='ADD')? '' : record.get('code_type')
                                },{
									xtype:'combo',
									id:'code_type',
									name:'code_type',
									width:'100%',
									padding: '0 0 5px 0',
									fieldLabel:'데이터속성',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? 'Y' : record.get('code_type'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'columnStore',
										fields :['name','value'],
										data : [{name : '문자열',value : 'string'}
												,{name : '정수형',value : 'int'}
												,{name : '실수형',value : 'number'}
												,{name : '날짜형식',value : 'date'}
												]
			                        }),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
									xtype:'combo',
									id:'search_yn',
									name:'search_yn',
									width:'100%',
									padding: '0 0 5px 0',
									fieldLabel:'검색사용',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? 'Y' : record.get('search_yn'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'columnStore',
										fields :['name','value'],
										data : [{name : '사용',value : 'Y'},{name : '사용안함',value : 'N'}]
			                        }),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
									xtype:'combo',
									id:'view_yn',
									name:'view_yn',
									width:'100%',
									padding: '0 0 5px 0',
									fieldLabel:'컬럼표시',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? 'Y' : record.get('view_yn'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'columnStore',
										fields :['name','value'],
										data : [{name : '사용',value : 'Y'},{name : '사용안함',value : 'N'}]
			                        }),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
			                		xtype: 'combo',
			                		field_id:  'usrmst_uid',
			                        id: 'usrmst_uid',
			                        name: 'usrmst_uid',
                                    fieldLabel:'메뉴',
									padding: '0 0 5px 0px',
									width:'100%',
			                        queryMode: 'local',
			                        emptyText: '선택',
			                  		forceSelection: true,
			                  		multiSelect:true,
			                        selectOnFocus:true,
			                  		displayField : 'user_name',
			                  		valueField : 'usrmst_uid',
									value: (type=='ADD')? '' : record.get('usrmst_uid'),
									hidden: (type=='ADD')? false : true,
			                  		fieldStyle: 'background-color: #FBF8E6; background-image: none; width:50',
			                        store : gm.me().usrmstStore,
			                  		listeners: { 
			                  			select: function(combo, record) {
			                  			}
			                  		}
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
            height: 400,
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
                                url: CONTEXT_PATH + '/master.do?method=crudColumn',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									menu_code : val['menu_code'],
									data_index : val['data_index'],
									name : val['name'],
									name_en : val['name_en'],
									sort_no : val['sort_no'],
									width : val['width'],
									code_type : val['code_type'],
									excel_yn : val['excel_yn'],
									excel_width : val['excel_width'],
									usrmst_uid : val['usrmst_uid'],
									view_yn : val['view_yn'],
									search_yn: val['search_yn']
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
						url: CONTEXT_PATH + '/master.do?method=crudColumn',
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
    authmstStore  : Ext.create('Msys.store.AuthMstStore', 	{hasNull:false}),
	menuStore : Ext.create('Msys.store.MenuStore', 	{hasNull:false}),
    usrmstStore  : Ext.create('Msys.store.UserStore', 	{hasNull:true})

})