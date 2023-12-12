Ext.define('Msys.views.master.RackMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master RackMgmtModel', this.columns);

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
        this.createStore('Msys.model.RackMgmtModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        /*Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });*/arguments
		        Ext.apply(this, {
            layout: 'border',
            items: [
                {
					region: 'center',
					layout: 'fit',
                    width: '60%',
					resizable: true,
					items: this.grid
                }, {
                    id:'racsub',
					region: 'east',
					layout: 'fit',
					width: '40%',
					resizable: true,
					items: this.createEast()
                }
            ]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
					
					
					
                    var select = selections[0];
					gm.me().select_record = select;
                    
					gm.me().racSubStore.getProxy().setExtraParam('racmst_uid', select.get('unique_id'));
					gm.me().racSubStore.load();

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
		this.whumstStore.load();
	},
	createEast: function() {
		this.racSubGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: false,
            store: this.racSubStore,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: this.estSubStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
			selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            plugins:[Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],
            viewConfig: {
                getRowClass : function(record, index) {
                   
                },
                enableTextSelection: true
            },
            listeners: {
                
            },
            dockedItems: [{
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                    	this.addBrackAction //, this.removeItemAction,'->',this.fileAttachAction
                    ],
                
            }],
			columns: [
                {text: '선반코드', dataIndex: 'brack_code', width: 150, sortable: true, style: 'text-align:center', align:'center'},
				{text: '선반명',   dataIndex: 'brack_name', width: 150, sortable: true, style: 'text-align:center', align: 'left'},
				{text: '선반위치', dataIndex: 'brack_pos', width: 100, sortable: true, style: 'text-align:center', align: 'center'},
				//{text: '정렬순서', dataIndex: 'sort_no', 	width: 100, sortable: true, style: 'text-align:center', align: 'right'},
				{text: '층번호',   dataIndex: 'row_no', 	width: 100, sortable: true, style: 'text-align:center', align: 'right'},
				{text: '호번호',   dataIndex: 'col_no', 	width: 100, sortable: true, style: 'text-align:center', align: 'right'},
				{text: '설명', 	   dataIndex: 'description', width: 250, sortable: true, style: 'text-align:center', align: 'left'},
				{text: '비고', 	   dataIndex: 'remark', 	width: 250, sortable: true, style: 'text-align:center', align: 'left'},
				{text: '등록자',   dataIndex: 'creator', 	width: 100, sortable: true, style: 'text-align:center', align: 'center'},
				{text: '등록일자', dataIndex: 'create_date', width: 100, sortable: true, style: 'text-align:center', align: 'center', xtype: 'datecolumn', format: 'Y-m-d'},
				{text: '수정자',   dataIndex: 'changer', 	width: 100, sortable: true, style: 'text-align:center', align: 'center'},
				{text: '수정일자', dataIndex: 'change_date', width: 100, sortable: true, style: 'text-align:center', align: 'center', xtype: 'datecolumn', format: 'Y-m-d'}
			]
		});
		
		this.racSubGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console.log('selections', selections);
				if(selections.length) {
					gm.me().removeItemAction.enable();
					gm.me().fileAttachAction.enable();
					
            	}else{
					gm.me().removeItemAction.disable();
					gm.me().fileAttachAction.disable();
				}
			}
        });

		this.racSubGrid.on('edit', function(editor, e) {
            var rec = e.record;
            var quan = rec.get('quan');
            if(quan < 1) {
                Ext.Msg.alert('안내', '견적수량이 1 이상이어야 합니다.', function() {});
                rec.set('quan', 1);
                gm.me().prdStore.sync();
                return;
            }

			Ext.Ajax.request({
                url: CONTEXT_PATH + '/sales.do?method=crudEstSub',
                params: {
					crud_code:'EDIT',
					estsub_uid:rec.get('unique_id'),
                    quan:rec.get('quan'),
					est_price:rec.get('est_price'),
                    remark:rec.get('remark')
                },
                success: function(result, request) {
                    var result = result.responseText;
                    gm.me().estSubStore.load();
                    gm.me().store.load();
                },
                //failure: extjsUtil.failureMessage
            });
        });

        return this.racSubGrid;
	},
	addBrackAction : Ext.create('Ext.Action', {
		xtype : 'button',
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '선반정보를 수정합니다.',
            disabled: true,
            handler: function() {

			}
	}),
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
                                    id :'whumst_uid',
                                    name : 'whumst_uid',
                                    fieldLabel: '창고',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().whumstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'wh_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'wh_name', direction: 'ASC' },
									value: (type=='ADD')? '' : record.get('whumst_uid'),
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{wh_code}">{wh_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
											var rack_pos = Ext.getCmp('rack_pos');
											rack_pos.setValue(record.get('wh_name'));
                                        }// endofselect
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'rack_code',
                                    name:'rack_code',
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    padding: '0 0 5px 30',
                                    fieldLabel:'RACK코드',
									readOnly:(type=='ADD')?false:true,
									fieldStyle: fieldColor,
									value: (type=='ADD')? '' : record.get('rack_code')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var rack_code = Ext.getCmp('rack_code');
                                            //코드 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'racmst',
													column_name : 'rack_code',
													code : rack_code.getValue()
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
                                    id:'rack_name',
                                    name:'rack_name',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'RACK명',
									value: (type=='ADD')? '' : record.get('rack_name')
                                },{
                                    xtype:'textfield',
                                    id:'rack_pos',
                                    name:'rack_pos',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'RACK위치',
									value: (type=='ADD')? '' : record.get('rack_pos')
                                },{
                                    xtype:'numberfield',
                                    id:'sort_no',
                                    name:'sort_no',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'정렬순번',
									value: (type=='ADD')? '1' : record.get('sort_no')
                                },{
                                    xtype:'numberfield',
                                    id:'row_quan',
                                    name:'row_quan',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'층개수',
									value: (type=='ADD')? '1' : record.get('row_quan')
                                },{
                                    xtype:'numberfield',
                                    id:'col_quan',
                                    name:'col_quan',
                                    padding: '0 0 5px 0px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'호개수',
									value: (type=='ADD')? '1' : record.get('col_quan')
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
						Ext.MessageBox.alert('알림', 'RACK코드를 확인해주세요.');
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
                                url: CONTEXT_PATH + '/stock.do?method=crudRacMst',
                                params:{
									crud_code : type,
									whumst_uid : val['whumst_uid'],
									unique_id : val['unique_id'],
									rack_code : val['rack_code'],
									rack_name : val['rack_name'],
									rack_pos : val['rack_pos'],
									sort_no : val['sort_no'],
									row_quan : val['row_quan'],
									col_quan : val['col_quan'],
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
						url: CONTEXT_PATH + '/stock.do?method=crudRacMst',
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
	whumstStore  : Ext.create('Msys.store.WhuMstStore', {}),
	racSubStore  : Ext.create('Msys.store.RacSubStore', {})
	
})