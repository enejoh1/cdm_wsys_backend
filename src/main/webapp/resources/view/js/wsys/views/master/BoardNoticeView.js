Ext.define('Msys.views.master.BoardNoticeView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
        console.log('MSYS Views master BoardNoticeModel', this.columns);

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
            tooltip: '게시물을 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '수정',
            tooltip: '게시물을 수정합니다.',
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

        this.attachFileAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '첨부파일',
            disabled: true,
            handler: function() {
                gm.me().getAttachFileEvent(gm.me().grid, gu.id('fileGrid'));
            }
        });
		
		buttonToolbar.insert(1, this.addAction);
        buttonToolbar.insert(2, this.editAction);
		buttonToolbar.insert(3, this.removeAction);
		buttonToolbar.insert(4, this.attachFileAction);
		//스토어 생성
        this.createStore('Msys.model.BoardNoticeModel', gu.pageSize);

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
					gm.me().attachFileAction.enable();
					
                } else {
                    gm.me().editAction.disable();
                    gm.me().removeAction.disable();
					gm.me().attachFileAction.disable();
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
									xtype:'combo',
									id:'type',
									name:'type',
									width:'45%',
									padding: '0 0 5px 0',
									fieldLabel:'게시유형',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? '0' : record.get('type'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'typeStore',
										fields :['name','value'],
										data : [{name : '공지사항',value : '0'},{name : '정보공유',value : '1'}]
									}),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
									xtype:'combo',
									id:'status',
									name:'status',
									width:'45%',
									padding: '0 0 5px 30',
									fieldLabel:'상태',
									displayField : 'name',
									valueField : 'value',
									value: (type=='ADD')? 'N' : record.get('status'),
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'statusStore',
										fields :['name','value'],
										data : [{name : '일반',value : 'N'},{name : '긴급',value : 'E'}]
								    }),
									listeners: { 
										select: function(combo, record) {}
									}
								},
								{
                                    xtype:'textfield',
                                    id:'title1',
                                    name:'title1',
                                    padding: '0 0 10px 0',
                                    width:'95%',
                                    fieldLabel:'제목',
									value: (type=='ADD')? '' : record.get('title')
                                },
								{
                                    xtype:'textarea',
                                    id:'content1',
                                    name:'content1',
                                    padding: '0 0 10px 0',
                                    width:'95%',
                                    fieldLabel:'내용',
									value: (type=='ADD')? '' : record.get('content')
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
                                url: CONTEXT_PATH + '/master.do?method=crudBoard',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									parent : val['parent'],
									type : val['type'],
									status : val['status'],
									title : val['title1'],
									content : val['content1'],
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
						url: CONTEXT_PATH + '/master.do?method=crudBoard',
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