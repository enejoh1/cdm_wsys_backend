Ext.define('Msys.views.master.WhouseMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master WhouseMgmtModel', this.columns);

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
            tooltip: '창고를 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '해당 창고정보를 수정합니다.',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().select_record);
            }
        });

        this.removeAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '삭제',
            tooltip: '선택한 창고를 삭제합니다.',
            disabled: true,
            handler: function () {
				gm.me().removeHandler('REMOVE');
            }
        });

		buttonToolbar.insert(1, this.addAction);
        buttonToolbar.insert(2, this.editAction);
		buttonToolbar.insert(3, this.removeAction);

		//스토어 생성
        this.createStore('Msys.model.WhouseMgmtModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
					
                    var select = selections[0];
					gm.me().select_record = select;
                    
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
		this.supmstStore.load();
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
			case 'COPY':
				gm.me().crudText='복사등록';
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
									id:'inout_flag',
									name:'inout_flag',
									width:'45%',
									allowBlank:false,
									padding: '0 0 5px 0',
									fieldLabel:'종류',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? 'Y' : record.get('inout_flag'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'columnStore',
										fields :[
											'name',
											'value'
										],
										data : [
											{name : '입고', value : 'Y'},
											{name : '출고', value : 'N'}
										]
			                        }),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
                                    id :'supmst_uid',
                                    name : 'supmst_uid',
                                    fieldLabel: '외주처',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 30',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().supmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'sup_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'sup_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('supmst_uid'),
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{sup_code}">{sup_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                        }// endofselect
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'wh_code',
                                    name:'wh_code',
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    padding: '0 0 5px 0',
                                    fieldLabel:'창고코드',
									readOnly:(type=='ADD')?false:true,
									fieldStyle: fieldColor,
									value: (type=='ADD')? '' : record.get('wh_code')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var wh_code = Ext.getCmp('wh_code');
                                            //코드 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'whumst',
													column_name : 'wh_code',
													code : wh_code.getValue()
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
                                    id:'wh_name',
                                    name:'wh_name',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'창고명',
									value: (type=='ADD')? '' : record.get('wh_name')
                                },{
                                    xtype:'numberfield',
                                    id:'sort_no',
                                    name:'sort_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'정렬순번',
									value: (type=='ADD')? '0' : record.get('sort_no')
                                },{
                                    xtype:'textarea',
                                    id:'description',
                                    name:'description',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'설명',
									value: (type=='ADD')? '' : record.get('description')
                                },
								{
                                    xtype:'textarea',
                                    id:'remark',
                                    name:'remark',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'비고',
									value: (type=='ADD')? '' : record.get('remark')
                                },new Ext.form.Hidden({
                                	  id:'unique_id',
                                      name: 'unique_id',
                                      value: (type=='ADD')? -1 : record.get('unique_id')
                                })
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
					 if(uniqueCheck==false){
						Ext.MessageBox.alert('알림', '창고코드를 확인해주세요.');
						return;
					 }
                     if (btn == "no") {
                        win.close();
                    } else {
                        var form = Ext.getCmp(gu.id('addForm')).getForm();
                        if(form.isValid()) {
                            var val = form.getValues(false);
                            var unique_id = val['unique_id'];
                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/stock.do?method=crudWhuMst',
                                params:{
									crud_code : type,
									supmst_uid : val['supmst_uid'],
									unique_id : val['unique_id'],
									inout_flag : val['inout_flag'],
									wh_code : val['wh_code'],
									wh_name : val['wh_name'],
									sort_no : val['sort_no'],
									description : val['description'],
									remark : val['remark']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().select_record =  gm.me().store.findRecord('unique_id', unique_id);
												}
											}
										}
									);	
                                    win.close();
                                },
                                // failure: extjsUtil.failureMessage
                            });
                            
                        } else {
                            // Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            Ext.MessageBox.alert('알림', '데이터를 확인해주세요.');
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
						url: CONTEXT_PATH + '/stock.do?method=crudWhuMst',
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
	supmstStore  : Ext.create('Msys.store.SupMstStore', 	{hasNull:true})
})