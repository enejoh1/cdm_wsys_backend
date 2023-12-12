Ext.define('Msys.views.master.ProcessCodeMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

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
                gm.me().crudHandler('EDIT', gm.me().vSelectPcsMst);
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
        this.createStore('Msys.model.ProcessCodeMgmtModel', gu.pageSize);

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
					gm.me().vSelectPcsMst = select;
					
					gm.me().editAction.enable();
					gm.me().removeAction.enable();
                } else {
                    gm.me().editAction.disable();
                    gm.me().removeAction.disable();
                }
            }
        });

        this.callParent(arguments);
		this.store.getProxy().setExtraParam('orderBy', "pcsmst.parent_id ASC, pcsmst.sort_no ASC");
        this.store.load();
		this.pcscodeStore.load();
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
		                         	id :'parent_id',
		                         	name : 'parent_id',
		                         	fieldLabel: '상위공정',                                            
		                         	xtype: 'combo',
									hidden:(type=='ADD')?false:true,
		                            width:'100%',
		                            padding: '0 0 5px 0',
		                            allowBlank:false,
		                            fieldStyle: 'background-image: none;',
		                            store: gm.me().pcscodeStore,
		                            emptyText: '선택해주세요.',
		                            displayField:   'pcs_name',
		                            valueField:   'unique_id',
		                            value:(type=='ADD')? -1 : record.get('parent_id'),
		                            typeAhead: false,
		                            minChars: 1,
		                            listConfig:{
		                            	loadingText: 'Searching...',
		                                emptyText: 'No matching posts found.',
		                                getInnerTpl: function() {
		                                	return '<div data-qtip="{parent_id}">[lv{pcs_lv} {pcs_code}] {pcs_name}</div>';
		                                }			                	
		                            },
		                            listeners: {
		                                select: function (combo, record) {
											
											if(record.get('unique_id')==-1){
												Ext.getCmp('pcs_lv').setValue(record.get('pcs_lv'));
											}else{
												Ext.getCmp('pcs_lv').setValue(record.get('pcs_lv')+1);
											}
			                            }// endofselect
		                            }
		                        },
                                {
                                    xtype:'numberfield',
                                    id:'pcs_lv',
                                    name:'pcs_lv',
                                    padding: '0 0 5px 0px',
									fieldStyle: fieldColor,
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'공정레벨',
									fieldStyle:'background-color:#DCDCDC',
									readOnly:true,
									value: (type=='ADD')? 0 : record.get('pcs_lv')
                                },
                                {
                                    xtype:'textfield',
                                    id:'pcs_code',
                                    name:'pcs_code',
                                    padding: '0 0 5px 0px',
									fieldStyle: fieldColor,
                                    width:(type=='ADD')?'80%':'100%',
                                    allowBlank:false,
                                    fieldLabel:'공정코드',
									readOnly:(type=='ADD')?false:true,
									value: (type=='ADD')? '' : record.get('pcs_code')
                                },{
                                    xtype:'button',
                                    text:'중복확인',
                                    width:'20%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var pcs_code = Ext.getCmp('pcs_code');
                                            //코드 중복체크
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=duplicateCodeCheck',
												params:{
													table_name : 'pcsmst',
													column_name : 'pcs_code',
													code : pcs_code.getValue()
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
                                    id:'pcs_name',
                                    name:'pcs_name',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'공정명',
									value: (type=='ADD')? '' : record.get('pcs_name')
                                },
                                {
                                    xtype:'numberfield',
                                    id:'sort_no',
                                    name:'sort_no',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'공정순번',
									value: (type=='ADD')? 0 : record.get('sort_no')
                                },
								{
                                    xtype:'numberfield',
                                    id:'pcs_price',
                                    name:'pcs_price',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'공정단가',
									value: (type=='ADD')? 0 : record.get('pcs_price')
                                },
								{
                                    xtype:'numberfield',
                                    id:'pcs_lead_time',
                                    name:'pcs_lead_time',
                                    padding: '0 0 5px 0px',
                                    width:'100%',
                                    allowBlank:false,
                                    fieldLabel:'공정리드타임',
									value: (type=='ADD')? 0 : record.get('pcs_lead_time')
                                },
								{
                                    xtype:'textarea',
                                    id:'description',
                                    name:'description',
                                    padding: '0 0 10px 0',
                                    width:'100%',
                                    fieldLabel:'설명',
									value: (type=='ADD')? '' : record.get('description')
                                },
								{
                                    xtype:'textarea',
                                    id:'remark',
                                    name:'remark',
                                    padding: '0 0 10px 0',
                                    width:'100%',
                                    fieldLabel:'비고',
									value: (type=='ADD')? '' : record.get('remark')
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
            height: 500,
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
                                url: CONTEXT_PATH + '/master.do?method=crudPcsMst',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									parent_id : val['parent_id'],
									pcs_lv : val['pcs_lv'],
									pcs_code : val['pcs_code'],
									pcs_name : val['pcs_name'],
									sort_no : val['sort_no'],
									pcs_price : val['pcs_price'],
									pcs_lead_time : val['pcs_lead_time'],
									description : val['description'],
									remark : val['remark']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().vSelectPcsMst =  gm.me().store.findRecord('unique_id', unique_id);
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
						url: CONTEXT_PATH + '/master.do?method=crudPcsMst',
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
	pcscodeStore : Ext.create('Msys.store.PcsMstStore', {hasNull:true} ),
})