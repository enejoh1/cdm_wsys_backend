Ext.define('Msys.views.sales.RegistEstimateView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
        console.log('MSYS Views Sales RegistEstimateView');
		this.selMode='SINGLE';
        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = {
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    gm.me().gridMenuList(this).showAt(e.getXY());
                    return false;
                }
            }
        };

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '견적등록',
            tooltip: '해당 견적을 등록합니다.',
            disabled: false,
            handler: function() {
                gm.me().crudHandler('ADD');
            }
        });

        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '견적수정',
            tooltip: '견적수정',
            disabled: true,
            handler: function () {
                gm.me().crudHandler('EDIT', gm.me().estman_record);
            }
        });

        this.addItemAction = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '품목추가',
            tooltip: '품목추가',
            disabled: true,
            handler: function () {
                gm.me().addItemHandler();
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
		
		this.reqAddPrdAction = Ext.create('Ext.Action', {
            iconCls: 'af-arrow-right',
            text: '설계요청',
            tooltip: '설계요청',
            disabled: true,
            handler: function () {
				gm.me().reqPrdHandler();
            }
        });

        this.reqAprvAction = Ext.create('Ext.Action', {
            iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
            text: '결재상신',
            tooltip: '결재상신',
            disabled: true,
            handler: function () {
				gm.me().reqAprvHandler();
	
            }
        });
			
        this.createRecvAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '수주전환',
            tooltip: '수주전환',
            disabled: true,
            handler: function () {
                gm.me().createRecvHandler();
            }
        });

        this.docViewAction = Ext.create('Ext.Action', {
            iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
            text: '견적서',
            tooltip: '견적서 보기',
            disabled: true,
            handler: function () {
				
            	gm.me().docView(gm.me().vSELECTED_DOC_UID);
            }
        });

        buttonToolbar.insert(1, this.addAction);
        buttonToolbar.insert(2, this.editAction);
		buttonToolbar.insert(3, this.addItemAction);
		buttonToolbar.insert(4, this.removeAction);
		buttonToolbar.insert(5, this.reqAddPrdAction);
		buttonToolbar.insert(6, this.reqAprvAction);
        buttonToolbar.insert(7, this.createRecvAction);
		buttonToolbar.insert(8, '->');
		buttonToolbar.insert(9, this.docViewAction);
		buttonToolbar.insert(10, this.fileAttachActionMain);
		
		
		
        this.createStore('Msys.model.RegistEstimateModel', gu.pageSize);
        this.createBaseGrid(buttonToolbar, searchToolbar, options);
		
        var cols = this.grid.columns;

        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'col1':
                    col['align']  = 'center';
                    col['style']  = 'text-align:center;';
                    break;
            }
        });

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    collapsible: false,
					frame: true,
					region: 'center',
                    height: '60%',
                    layout:'fit',
					items: this.grid
                }, {
                    id:'estPrdList',
					collapsible: false,
					frame: true,
					region: 'south',
					layout: 'fit',
					height: '40%',
					items: this.createSouth()
                }
            ]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
					
                    var select = selections[0];
                    var status = select.get('status');

					gm.me().vSELECTED_DOC_UID=select.get('unique_id');
					gm.me().vSELECTED_EST_CODE=select.get('est_code');
					gm.me().vSELECTED_DOC_CONTENT=select.get('doc_content');
					gm.me().checkPDF(select.get('unique_id'));
					gm.me().estman_record=select;	
					gm.me().estSubStore.getProxy().setExtraParam('estman_uid', select.get('unique_id'));
                    gm.me().estSubStore.load(function(records){
						var item_uids = []; 
						for(var i=0; i<records.length; i++) {
								var rec = records[i];
	                            var unique_id = rec.data.itemmst_uid;
								item_uids.push(unique_id);
	                    }						
						gm.me().itemmst_uids = item_uids;

						var uk_cnt = 0;
						for(i=0;i<records.length;i++){
							var rec = records[i];
							if(rec.data.status=='UK'){
								uk_cnt++;
							}
						}
						if(0<uk_cnt){
							gm.me().reqAddPrdAction.enable();
							gm.me().createRecvAction.disable();
						}else{
							gm.me().reqAddPrdAction.disable();
							gm.me().createRecvAction.enable();
							gm.me().reqAprvAction.enable();
						}
						
					});
					
					gm.me().docViewAction.enable();
					gm.me().fileAttachActionMain.enable();
					if(status=='R'){
						gm.me().editAction.enable();
						gm.me().addItemAction.enable();
						gm.me().removeAction.enable();
						gm.me().addUkItemAction.enable();
						gm.me().docViewAction.enable();
					}else if(status=='A'){
						gm.me().createRecvAction.enable();
						gm.me().reqAprvAction.enable();
					}
                    
                } else {
					gm.me().fileAttachActionMain.disable();
                    gm.me().editAction.disable();
                    gm.me().addItemAction.disable();
                    gm.me().createRecvAction.disable();
					gm.me().removeAction.disable();
					gm.me().addUkItemAction.disable();
					gm.me().docViewAction.disable();
					gm.me().printPDFAction.disable();
					gm.me().docViewAction.disable();
					gm.me().reqAprvAction.disable();
                }
            }
        });

        this.callParent(arguments);
        
		this.store.getProxy().setExtraParam('orderBy', "estman.est_code DESC");
        this.store.load();
		
		this.cstmstStore.load();
		this.usrmstStore.load();
		this.estimateTypeStore.load();
    },

    createSouth: function() {
	
		this.estSubGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout :'fit',
            forceFit: false,
            store: this.estSubStore,
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
                    var itemmst_uid = record.get('itemmst_uid');
					var status = record.get('status');
                   /*switch(itemmst_uid) {
                        case -1 :
								return 'red-row';
						break;
                    }*/
					switch(status) {
                        case 'UK' :
								return 'red-row';
						break;
						case 'RI' :
								return 'yellow-row';
						break;
						default :
								return '';
						break;
                    }
                },
                enableTextSelection: true
            },
            listeners: {
                cellkeydown:  function(table, td, columnIndex, record, tr, rowIndex, e)  {
                    if (e.getKey() == 67) {
                        var value = td.innerText;

                        var tempElem = document.createElement('textarea');
                        tempElem.value = value;  
                        document.body.appendChild(tempElem);

                        tempElem.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempElem);
                    }
                }
            },
            dockedItems: [{
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                    	this.addUkItemAction, this.removeItemAction,'->',this.fileAttachActionSub
                    ],
                
            }],
            columns: [
                {
                    text: '등록상태',
                    dataIndex: 'status_kr',
                    width: 100,
                    align:'center',
                    sortable: true,
                },{
                    text: '계정',
                    dataIndex: 'account_type_kr',
                    width: 100,
                    align:'center',
                    sortable: true,
                },{   
                    text: '품번',
                    dataIndex: 'item_code',
                    width: 120,
                    sortable: true,
                    align:'left',
					style:'text-align:center',
                },{   
                    text: '품명',
                    dataIndex: 'item_name',
                    width: 250,
                    sortable: true,
                    align:'left',
					style:'text-align:center',
                },{   
                    text: '규격',
                    dataIndex: 'specification',
                    width: 400,
                    sortable: true,
                    align:'left',
					style:'text-align:center',
                },{
                    text: '견적단가',
                    dataIndex: 'est_price',
                    width: 120,
                    sortable: true,
                    align:'right',
					style:'text-align:center',
                    editor:{
						
					},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value!=null) {
							value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        } else {
                            value = 0;
                        }
                        return  value;
                    }
                },{   
                    text: '견적수량',
                    dataIndex: 'quan',
                    width: 120,
                    sortable: true,
                    align:'right',
					style:'text-align:center',
                    editor:{},
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value!=null) {
                            value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        } else {
                            value = 1;
                        }
                        return  value;
                    }
                },{
                    text: '견적금액',
                    dataIndex: 'est_amount',
                    width: 120,
                    sortable: true,
                    align:'right',
					style:'text-align:center',
                    renderer: function(value, meta, record) {
                        var sales_price = record.get('est_price');
                        var quan = record.get('quan');
                        value = sales_price * quan;
                        value = Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                        return  value;
                    }
                    
                },{   
                    text: '특이사항',
                    dataIndex: 'remark',
                    width: 360,
                    sortable: true,
                    align:'left',
                    style:'text-align:center',
                    editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    }
                }
            ]     
        });
		
		this.estSubGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console.log('selections', selections);
				if(selections.length) {
					gm.me().removeItemAction.enable();
					gm.me().fileAttachActionSub.enable();
					
            	}else{
					gm.me().removeItemAction.disable();
					gm.me().fileAttachActionSub.disable();
				}
			}
        });

		this.estSubGrid.on('edit', function(editor, e) {
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

        return this.estSubGrid;
    },
    crudHandler: function(type, record) {
		var fieldColor = 'background-color:none';
		switch(type){
			case 'ADD':
				gm.me().crudText='견적등록';
			break;
			case 'EDIT':
				gm.me().crudText='견적수정';
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
                                    id :'est_type',
                                    name : 'est_type',
                                    fieldLabel: '견적종류',                                            
                                    xtype: 'combo',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    allowBlank:false,
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().estimateTypeStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'code_name',
                                    valueField:   'code_value',
                                    value:(type=='ADD')? 'P' : record.get('est_type'),
                                    typeAhead: false,
                                    minChars: 1,
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function (combo, record) {
	
                                        }// endofselect
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'est_code',
                                    name:'est_code',
                                    width:(type=='ADD')?'35%':'45%',
                                    allowBlank:false,
                                    padding: '0 0 5px 30',
                                    fieldLabel:'견적번호',
									readOnly:(type=='ADD')?false:true,
									fieldStyle: fieldColor,
									value: (type=='ADD')? '' : record.get('est_code')
                                },{
                                    xtype:'button',
                                    text:'자동생성',
                                    width:'10%',
									hidden: (type=='ADD')?false:true,
									listeners: {
                                        click: function(btn) {
                                            var est_code = Ext.getCmp('est_code');
                                            // 다음 견적번호 가져오기
                                            Ext.Ajax.request({
                                                url: CONTEXT_PATH + '/util.do?method=getNextCode',
												params:{
													table_name : 'estman',
													column_name : 'est_code',
													first_code : 'EM',
													length : 3
												},
                                                success: function (result, request) {
                                                    var result = Ext.decode(result.responseText);
                                                    var data = result.datas;
                                                    est_code.setValue(data);
                                                },
                                                // failure: extjsUtil.failureMessage
                                            });
                                        }
                                    }
                                },{
                                    xtype:'textfield',
                                    id:'est_name',
                                    name:'est_name',
                                    padding: '0 0 5px 0px',
                                    width:'94%',
                                    allowBlank:false,
                                    fieldLabel:'견적명',
									value: (type=='ADD')? '' : record.get('est_name')
                                },{
                                    fieldLabel: '견적유효기간',
                                    xtype: 'datefield',
                                    width:'45%',
                                    name: 'validity_date',
                                    id: 'validity_date',
                                    format: 'Y-m-d',
                                    padding: '0 0 5px 0px',
                                    fieldStyle: 'background-image: none;',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                    value: (type=='ADD')? Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 15), 'Y-m-d') : gm.me().parseStringtoDate(record.get('validity_date'))
                                },{
                                    id :'sales_uid',
                                    name : 'sales_uid',
                                    fieldLabel: '영업 담당자',                                            
                                    xtype: 'combo',
                                    padding: '0 0 5px 30',
                                    width:'45%',
                                    fieldStyle: 'background-image: none;',
                                    store: gm.me().usrmstStore,
                                    emptyText: '선택해주세요.',
                                    displayField:   'user_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'user_name', direction: 'ASC' },
									value: (type=='ADD')? -1 : record.get('sales_uid'),
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
                                            Ext.getCmp('sales_name').setValue(record.get('user_name'));
											Ext.getCmp('sales_tel_no').setValue(record.get('tel_no'));
											Ext.getCmp('sales_mobile_no').setValue(record.get('mobile_no'));
											Ext.getCmp('sales_fax_no').setValue(record.get('fax_no'));
											Ext.getCmp('sales_email').setValue(record.get('email'));
                                        }// endofselect
                                    }
                                },
 								new Ext.form.Hidden({
                                	  id:'sales_name',
                                      name: 'sales_name',
                                      value: (type=='ADD')? '' : record.get('sales_name')
                                }),
 								new Ext.form.Hidden({
                                	  id:'sales_tel_no',
                                      name: 'sales_tel_no',
                                      value: (type=='ADD')? '' : record.get('sales_tel_no')
                                }),
 								new Ext.form.Hidden({
                                	  id:'sales_mobile_no',
                                      name: 'sales_mobile_no',
                                      value: (type=='ADD')? '' : record.get('sales_mobile_no')
                                }),
 								new Ext.form.Hidden({
                                	  id:'sales_fax_no',
                                      name: 'sales_fax_no',
                                      value: (type=='ADD')? '' : record.get('sales_fax_no')
                                }),
 								new Ext.form.Hidden({
                                	  id:'sales_email',
                                      name: 'sales_email',
                                      value: (type=='ADD')? '' : record.get('sales_email')
                                }),
								new Ext.form.Hidden({
                                	  id:'unique_id',
                                      name: 'unique_id',
                                      value: (type=='ADD')? -1 : record.get('unique_id')
                                }),
								{
                                    xtype:'textarea',
                                    id:'remark',
                                    name:'remark',
                                    padding: '0 0 10px 0',
                                    width:'94%',
                                    fieldLabel:'비고',
									value: (type=='ADD')? '' : record.get('remark')
                                }
                            ]
                        }
                    ]
                },{
					xtype: 'fieldset',
                    collapsible: false,
                    title: '거래처정보',
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
									id :'cstmst_uid',
									name : 'cstmst_uid',
									fieldLabel: '고객사',
		                            xtype: 'combo',
		                            width:'45%',
		                            padding: '0 0 5px 0px',
		                            fieldStyle: 'background-color: none',//#FBF8E6
		                            store: gm.me().cstmstStore,
		                            emptyText: '선택해주세요.',
		                            displayField:   'cst_name',
		                            valueField:   'unique_id',
		                            sortInfo: { field: 'cst_name', direction: 'ASC' },
		                            typeAhead: false,
		                            minChars: 1,
									value: (type=='ADD')? -1 : record.get('cstmst_uid'),
		                            listConfig:{
		                            	loadingText: 'Searching...',
		                            	emptyText: 'No matching posts found.',
		                           		getInnerTpl: function() {
		                                	return '<div data-qtip="{unique_id}">[{cst_code}] {cst_name}</div>';
		                            	}			                	
									},
		                            listeners: {
		                            	select: function (combo, record) {
			                            	Ext.getCmp('delivery_site').setValue(record.get('address_kr'));
											Ext.getCmp('cst_name').setValue(record.get('cst_name'));
											Ext.getCmp('manager_name').setValue(record.get('manager_name'));
											Ext.getCmp('manager_email').setValue(record.get('manager_email'));
											Ext.getCmp('manager_tel_no').setValue(record.get('manager_tel_no'));
											Ext.getCmp('manager_mobile_no').setValue(record.get('manager_mobile_no'));
											Ext.getCmp('manager_fax_no').setValue(record.get('fax_no'));
										}// endofselect
									}
								},{
                                    xtype:'textfield',
                                    id:'cst_name',
                                    name:'cst_name',
                                    width:'45%',
                                    allowBlank:false,
                                    padding: '0 0 5px 30',
                                    fieldLabel:'고객사명',
									value: (type=='ADD')? '' : record.get('cst_name')
                                },{
                                    xtype:'textfield',
                                    id:'manager_name',
                                    name:'manager_name',
                                    width:'45%',
                                    allowBlank:false,
                                    padding: '0 0 5px 0',
                                    fieldLabel:'담당자명',
									value: (type=='ADD')? '' : record.get('manager_name')
                                },{
                                    xtype:'textfield',
                                    id:'manager_email',
                                    name:'manager_email',
                                    width:'45%',
                                    padding: '0 0 5px 30',
                                    fieldLabel:'이메일',
									value: (type=='ADD')? '' : record.get('manager_email')
                                },{
                                    xtype:'textfield',
                                    id:'manager_tel_no',
                                    name:'manager_tel_no',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    fieldLabel:'전화번호',
									value: (type=='ADD')? '' : record.get('manager_tel_no')
                                },{
                                    xtype:'textfield',
                                    id:'manager_mobile_no',
                                    name:'manager_mobile_no',
                                    width:'45%',
                                    padding: '0 0 5px 30',
                                    fieldLabel:'핸드폰번호',
									value: (type=='ADD')? '' : record.get('manager_mobile_no')
                                },{
                                    xtype:'textfield',
                                    id:'manager_fax_no',
                                    name:'manager_fax_no',
                                    width:'45%',
                                    padding: '0 0 5px 0',
                                    fieldLabel:'팩스번호',
									value: (type=='ADD')? '' : record.get('manager_fax_no')
                                },{
		                        	xtype:'textarea',
		                        	id:'delivery_site',
		                        	name:'delivery_site',
		                        	padding: '0 0 10px 0',
		                        	width:'94%',
		                        	fieldLabel:'납품장소',
									value: (type=='ADD')? '' : record.get('delivery_site')
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
                                url: CONTEXT_PATH + '/sales.do?method=crudEstMan',
                                params:{
									crud_code : type,
									unique_id : val['unique_id'],
									est_type : val['est_type'],
									est_code : val['est_code'],
									est_name : val['est_name'],
									validity_date : val['validity_date'],
									sales_uid : val['sales_uid'],
									sales_name : val['sales_name'],
									sales_tel_no : val['sales_tel_no'],
									sales_mobile_no : val['sales_mobile_no'],
									sales_fax_no : val['sales_fax_no'],
									sales_email : val['sales_email'],
									remark : val['remark'],
									cstmst_uid : val['cstmst_uid'],
									cst_name : val['cst_name'],
									manager_name : val['manager_name'],
									manager_email : val['manager_email'],
									manager_tel_no : val['manager_tel_no'],
									manager_mobile_no : val['manager_mobile_no'],
									manager_fax_no : val['manager_fax_no'],
									delivery_site : val['delivery_site']
                                },
                                success: function(val, action) {
                                    gm.me().store.load(
										{
											callback: function(r,options,success) {
										        if(type=='EDIT'){
													gm.me().estman_record =  gm.me().store.findRecord('unique_id', unique_id);
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
						url: CONTEXT_PATH + '/sales.do?method=crudEstMan',
						params:{
							unique_ids : unique_ids,
							crud_code : type
						},
						success: function(){
							gm.me().store.load();
							gm.me().estSubStore.removeAll();
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
    addItemHandler: function() {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        if(select == null || select == undefined || select.length<1) {
            Ext.Msg.alert('안내',  '견적을 선택해주세요.');
            return;
        }

        var itemMstGrid = Ext.create('Ext.grid.Panel', {
            store: gm.me().itemmstStore,
            layout: 'fit',
            id:'itemMstGrid',
            title:'품목검색',
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            multiSelect: true,
            pageSize: 100,
            width:800,
            height:520,
            border:true,
            bbar: Ext.create('Ext.PagingToolbar', {
                store: gm.me().itemmstStore,
                displayInfo: true,
                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다."
                ,listeners: {
                    beforechange: function (page, currentPage) {

                    }
                }

            }),
            viewConfig: {
                listeners: {
                    'itemdblClick': function(view , record) {
                        record.commit();
                        saveStore.add(record);
                    }
                },
                emptyText: '<div style="text-align:center; padding-top:20% ">No Data..</div>'
            },
            columns: [
                {text:'계정', 		width:'10%', dataIndex:'account_type_kr', sortable:true, align:'center', style:'text-align:center;'},
                //{text:'기존품번', 	width:'20%', dataIndex:'old_item_code',   sortable:true, align:'left', 	 style:'text-align:center;'},
                {text:'품번', 		width:'20%', dataIndex:'item_code', 	  sortable:true, align:'left', style:'text-align:center;'},
                {text:'품명', 		width:'30%', dataIndex:'item_name', 	  sortable:true, align:'left', 	 style:'text-align:center;'},
                {text:'규격', 		width:'30%', dataIndex:'specification',   sortable:true, align:'left', 	 style:'text-align:center;'},
                /*{text:'수량', 		width:'10%', dataIndex:'req_quan', 		  sortable:true, align:'right',  style:'text-align:center;',
					editor:{
						xtype:'numberfield',
                        minValue:1,
                    }, 
                    renderer: function(value, meta) {
                        meta.css = 'edit-column';
                        if(value==null) value = 1;
                        return value;
                    }
                },*/
            ],
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype:'triggerfield',
                            id:gu.id('search_item_code'),
                            name:gu.id('search_item_code'),
                            width:'20%',
                            emptyText:'품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },{
                            xtype:'triggerfield',
                            id:gu.id('search_item_name'),
                            name:gu.id('search_item_name'),
                            width:'20%',
                            emptyText:'품명',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },{
                            xtype:'triggerfield',
                            id:gu.id('search_specification'),
                            name:gu.id('search_specification'),
                            width:'20%',
                            emptyText:'규격',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        },{
                            xtype:'triggerfield',
                            id:gu.id('search_old_item_code'),
                            name:gu.id('search_old_item_code'),
                            width:'20%',
                            emptyText:'기존품번',
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                            onTrigger1Click : function() {
                                this.setValue('');
                                gm.me().redrawSearchStore();
                            },
                            listeners : {
                                change : function(fieldObj, e) {
                                    gm.me().redrawSearchStore();
                                },
                                render: function(c) {
                                    Ext.create('Ext.tip.ToolTip', {
                                        target: c.getEl(),
                                        html: c.emptyText
                                    });
                                }
                            }
                        }, gm.me().multiItemCodeSearch()
                    ]
                }
            ]
        });

        itemMstGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console.log('selections', selections);
			}
        });

        var saveStore =  new Ext.data.Store({
            model : gm.me().itemmstStore
        });

        var saveDeleteAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '항목삭제',
            tooltip: '선택한 항목이 삭제합니다.',
            disabled: true,
            handler: function(widget, event) {
                var saveSelect = saveForm.getSelectionModel().getSelection();
                saveStore.remove(saveSelect);
            }
        });

        var saveForm = Ext.create('Ext.grid.Panel', {
            store: saveStore,
            id:'saveFormGrid',
            layout: 'fit',
            title:'저장목록',
            region:'east',
            border:true,
            // style:'padding-left:10px;',
            plugins:Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            }),
            columns: [
                {text: "품번", width:'30%', dataIndex: 'item_code', 	sortable: true},
                {text: "품명", width:'25%', dataIndex: 'item_name', 	sortable: true},
                {text: "규격", width:'30%', dataIndex: 'specification', sortable: true},
                {text: "수량", width:'15%', dataIndex: 'bm_quan', 		sortable: true, 
					editor:{},
                    css: 'edit-cell',
                    renderer: function(value, meta) {
                        meta.css = 'custom-column';
                        if(value == null || value.length < 1) {
                            value = 1;
                        }
                        return value;
                    }
                }
            ],
            multiSelect: true,
            pageSize: 100,
            width:350,
            height:600,
            dockedItems: [
                {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    saveDeleteAction
                ]
            }]
        });

		saveForm.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console.log('selections', selections);
				if(selections.length) {
					saveDeleteAction.enable();
            	}else{
					saveDeleteAction.disable();
				}
			}
        });
			
        var win = Ext.create('Ext.Window', {
            title: '품목추가',
            width: 1200,
            height: 600,
            minWidth: 600,
            minHeight: 300,
            layout:'column',
            items: [
                itemMstGrid ,saveForm
            ],
            buttons: [
                {
                    text:'추가',
                    handler:function(btn) {
                        var selects = itemMstGrid.getSelectionModel().getSelection();
                        for(var i=0; i<selects.length; i++) {
                            var record = selects[i];
                            saveStore.add(record);
                        }
                    }
                }, {
                    text:'확인',
                    handler: function(btn) {
                        var items = saveStore.data.items;
                        var json = '';
						var rec = gm.me().grid.getSelectionModel().getSelection()[0];
						var estman_uid = rec.get('unique_id');
                        for(var i=0; i<items.length; i++) {
                            var item = items[i];
                            var id = item.get('unique_id'); // srcahd uid
                            var req_quan = item.get('bm_quan');
                            if(req_quan == null || req_quan == undefined || req_quan.length<1) req_quan = 1;

                            if(json.length) {
                                json += ",{\"id\":" + id + ",\"req_quan\":" + req_quan + "}";
                            } else {
                                json += "{\"id\":" + id + ",\"req_quan\":" + req_quan + "}";
                            }
						}
						json = '[' + json + ']';
						console.log('json',json);
						Ext.Ajax.request({
                        	url: CONTEXT_PATH + '/sales.do?method=crudEstSub',
                            params:{
								crud_code : 'ADD',
                            	jsonDatas : json,
                            	estman_uid : estman_uid,
								itemmst_uid : 1
                            },
                            success : function(result, request) {
                            	// gm.me().store.load();
                                var rec = gm.me().grid.getSelectionModel().getSelection()[0];
                                gm.me().estSubStore.getProxy().setExtraParam('estman_uid', rec.get('unique_id'));
                                gm.me().estSubStore.load(function(records){
									var item_uids = []; 
									for(var i=0; i<records.length; i++) {
											var rec = records[i];
				                            var unique_id = rec.data.itemmst_uid;
											item_uids.push(unique_id);
				                    }						
									gm.me().itemmstStore.getProxy().setExtraParam('not_in_unique_ids', item_uids);
									gm.me().itemmstStore.load();
								});
								gm.me().store.load();
								saveStore.remove();
                                if(win) win.close();
                            },
                                // failure: extjsUtil.failureMessage
						});
                        
                    }
                }, {
                    text:'취소',
                    handler: function(btn) {
                        win.close();
                    }
                }
            ]

        }); win.show();

    },

    redrawSearchStore: function() {
        // 초기화
        gm.me().itemmstStore.getProxy().setExtraParams({});
		gm.me().itemmstStore.getProxy().setExtraParam('not_in_unique_ids', gm.me().itemmst_uids);
        var item_code = Ext.getCmp(gu.id('search_item_code')).getValue();
        var item_name = Ext.getCmp(gu.id('search_item_name')).getValue();
        var specification = Ext.getCmp(gu.id('search_specification')).getValue();
        var old_item_code = Ext.getCmp(gu.id('search_old_item_code')).getValue();
		
        if(item_code!=null && item_code.length>0) gm.me().itemmstStore.getProxy().setExtraParam('item_code', '%'+item_code+'%');
        if(item_name!=null && item_name.length>0) gm.me().itemmstStore.getProxy().setExtraParam('item_name', '%'+item_name+'%');
        if(specification!=null && specification.length>0) gm.me().itemmstStore.getProxy().setExtraParam('specification', '%'+specification+'%');
        if(old_item_code!=null && old_item_code.length>0) gm.me().itemmstStore.getProxy().setExtraParam('old_item_code', '%'+old_item_code+'%');
        
        if(this.curMboxValues!=null && this.curMboxValues.length>0) {
            var arrs = this.curMboxValues.split('\n');
            var item_code_list = [];
            for(var i=0; i<arrs.length; i++) {
                var a = arrs[i];
                if(a!=null && a.length>0) {
                    item_code_list.push(a);
                }
            }
            gm.me().itemmstStore.getProxy().setExtraParam('item_code_list', item_code_list);
        };
        
        gm.me().itemmstStore.load();
    },
    curMboxValues:null,
    multiItemCodeSearch: function() {
        var multiSearchAction = Ext.create('Ext.Action', {
            xtype: 'button',
            iconCls: 'af-search',
            text: '다중품번검색',
            tooltip: '엔터를 기준으로 여러 품번을 검색합니다.',
            disabled: false,
            handler: function () {
                var mBox = Ext.create('Ext.window.MessageBox', {
                    resizable: true
                });

                mBox.show({
                    title: '다중 품번 검색(엔터 구분)',
                    modal: true,
                    msg: '다중 품번 검색',
                    width:300,
                    resizable: true,
                    height:500,
                    buttons: Ext.MessageBox.OK,
                    multiline: true,
                    defaultTextHeight: 390,
    //	             maxHeight: 2048,
                    maxWidth: 1000,
                    scope: this,
                    value:gm.me().curMboxValues,
                    initComponent: function() {
                        //console_logs('initComponent', this.value);
                    },
                    fn: function(btn, text, c) {
                        if(btn != null && btn == 'ok' && text != null && text.length > 0) {
                            gm.me().curMboxValues = text;
                            gm.me().redrawSearchStore();
                        } else if(btn != null && btn == 'ok' && (text == null || text.length == 0) ) {
                            console_logs('text.length', text.length);
                            gm.me().curMboxValues = null;
                            gm.me().redrawSearchStore();
                        }
                    }
                });
            }
        });

        return multiSearchAction;
    },
	parseStringtoDate : function(date){
    	if(date==null){
    		return '';
    	}else{
    		var sbstr = date.substring(0,10);
        	return sbstr;
    	}
    	
    },
	addUkItemAction : Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus',
            text: '임의품목등록',
            tooltip: '등록되지 않은 품목을 견적에 추가합니다.',
            disabled: true,
            handler: function() {
				var form = Ext.create('Ext.form.Panel', {
		            id: 'newAddForm',
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
                    	title: '품목정보',
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
								items:[{
									xtype:'combo',
									id:'account_type',
									name:'account_type',
									width:'45%',
									allowBlank:false,
									padding: '0 0 5px 0',
									fieldLabel:'계정',
									displayField : 'name',
									valueField : 'value',
									store : Ext.create('Ext.data.Store',{
										queryMode : 'local',
										storeId : 'columnStore',
										fields :[
											'name',
											'value'
										],
										data : [{
											name : '제품',
											value : 'P'
										},{
											name : '상품',
											value : 'G'
										},{
											name : '반제품',
											value : 'O'
										},{
											name : '재공품',
											value : 'W'
										},{
											name : '자재',
											value : 'R'
										},{
											name : '기타',
											value : 'E'
										}]
			                        }),
									listeners: { 
										select: function(combo, record) {}
									}
								},{
									xtype:'textfield',
									id:'item_code',
									name:'item_code',
									width:'45%',
									allowBlank:false,
									padding: '0 0 5px 30px',
									fieldLabel:'품번',
								},{
									xtype:'textfield',
			                        id:'item_name',
			                        name:'item_name',
			                        fieldLabel:'품명',
			                        padding: '0 0 5px 0px',
			                        width:'45%',
			                        allowBlank:false,
								},{
									xtype:'textfield',
			                        id:'specification',
			                        name:'specification',
			                        fieldLabel: '규격',
			                        padding: '0 0 5px 30px',
			                        width:'45%',
			                    },{
			                    	xtype:'textfield',
			                        id:'unit_code',
			                        name:'unit_code',
			                        fieldLabel: '단위',
			                        padding: '0 0 5px 0px',
			                        width:'45%'
			                    },{
									xtype:'numberfield',
									id:'quan',
			                        name:'quan',
			                        fieldLabel: '수량',
			                        padding: '0 0 5px 30px',
			                        width:'45%'
			                    },{
			                    	xtype:'numberfield',
			                        id:'est_price',
			                        name:'est_price',
			                        fieldLabel: '견적단가',
			                        padding: '0 0 5px 0px',
			                        width:'45%',
			                    },{   
									xtype:'textarea',
			                        id:'remark',
			                        name:'remark',
									fieldLabel: '특이사항',
									width:'94%'
						        }]
							}]
						}]
				});

	        var win = Ext.create('Ext.Window', {
				modal: true,
	            title: '임의품목추가',
	            width: 600,
	            height: 400,
	            plain: true,
				items: form,
				layout:'hbox',
				buttons: [{
					text: '등록',
					handler: function(btn) {
						if (btn == "no") {
	                        win.close();
	                    }else{
	                        var form = Ext.getCmp('newAddForm').getForm();
	                        if(form.isValid()) {
	                            var val = form.getValues(false);
							
								var rec = gm.me().grid.getSelectionModel().getSelection()[0];
								var estman_uid = rec.get('unique_id');
								
								Ext.Ajax.request({
									url: CONTEXT_PATH + '/sales.do?method=crudEstSub',
									params:{
										crud_code : 'ADD',
										estman_uid: estman_uid,
										itemmst_uid : -1,
										account_type : val['account_type'],
										item_code : val['item_code'],
										item_name : val['item_name'],
										specification : val['specification'],
										unit_code : val['unit_code'],
										quan : val['quan'],
										est_price : val['est_price'],
										remark : val['remark']
									},
									success: function(){
										gm.me().store.load();
										gm.me().estSubStore.load();
										win.close();
									},
									failure: function(){
										//gm.me().showToast('결과', '삭제실패' );
									}
								});
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
                
            }
	}),
	removeItemAction : Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '품목삭제',
            tooltip: '해당 품목을 삭제합니다.',
            disabled: true,
            handler: function() {
				var selections = gm.me().estSubGrid.getSelectionModel().getSelection();
				var unique_ids = []; 
				for(var i=0; i<selections.length; i++) {
					var rec = selections[i];
                    var unique_id = rec.get('unique_id');
                    unique_ids.push(unique_id);
                }
				
				Ext.Ajax.request({
					url: CONTEXT_PATH + '/sales.do?method=crudEstSub',
					params:{
						crud_code : 'REMOVE',
                    	estsub_uids : unique_ids
                    },
					success: function(){
						gm.me().store.load();
						gm.me().estSubStore.load();
						
					},
					failure: function(){
						//gm.me().showToast('결과', '삭제실패' );
					}
				});
                
            }
	}),
	docView : function(unique_id) {
		//PDF 파일다운로드
        var printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF Download',

            tooltip:'주문서 출력',
            disabled: false,

            handler: function(widget, event) {
                var doc_uid =  gm.me().vSELECTED_DOC_UID;
                var est_code =  gm.me().vSELECTED_EST_CODE;

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/doc.do?method=printDoc',
                    params:{
                        appr_yn : 'N',
						doc_type : 'EM',
						doc_lang : 'KR',
						doc_no : est_code,
						rotate_yn : 'N',
                        doc_uid : doc_uid,
                        table_name : 'estman'

                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success : function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        if(pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/fileAttach.do?method=download&path="+ pdfPath;
                            top.location.href=url;
                        }
                    },
                    //failure: extjsUtil.failureMessage
                });
                is_rotate = '';

            }
        });
        var form = Ext.create('PdfViewer.view.panel.PDF', {
	        //title    : 'PDF문서보기',
      		xtype: 'PdfViewerPdfPanel',
          	showPerPage: true,
          	width    : '100%',
          	height   : '100%',
          	pageScale: 1.25, 
          	showLoadMaskOnInit: true,
          	disableTextLayer: true,
          	src : `data:application/pdf;base64,`+gm.me().vSELECTED_DOC_CONTENT,
          	renderTo : Ext.getBody()
          	
      });
        
        var myHeight = '90%';
        var myWidth = 800;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '문서 미리보기',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            autoScroll : true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar', 
				style:{backgroundColor: '#ededed'},
                items: ['->', printPDFAction]
                },{
                	xtype: 'fieldset',
                	collapsible: false,
                	width: '95%',
                	defaults: {
                		width: '95%',
                		layout: {
                			type: 'vbox'
                		}
                	}
                }],
            buttons: [{
                text: '닫기',
                handler: function(btn) {
                	prWin.close();
                }
            }
            ]
        });

        prWin.show();
        
    	
    },
	reqPrdHandler : function() {
		
		var reqPrdForm = Ext.create('Ext.form.Panel', {
			id: 'reqPrdForm',
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
					fieldLabel: '등록요청완료일',
					labelWidth: 120,
                 	xtype: 'datefield',
                    width:'90%',
                  	name: 'pr_end_date',
                    id: 'pr_end_date',
                    format: 'Y-m-d',
                    padding: '0 0 5px 0px',
                    fieldStyle: 'background-image: none;',
                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    value: Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.DAY, 15), 'Y-m-d')
				}
			]
		});
        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '설계요청',
            width: 400,
            height: 200,
            plain: true,
            items: reqPrdForm,
            autoScroll : true,
            dockedItems: [
				{
                	xtype: 'fieldset',
                	collapsible: false,
                	width: '95%',
                	defaults: {
                		width: '95%',
                		layout: {
                			type: 'vbox'
                		}
                	}
                }],
            buttons: [{
				text: '등록',
                handler: function(btn) {
					if (btn == "yes") {
                        var selections = gm.me().grid.getSelectionModel().getSelection();
					
						var unique_ids = []; 
						for(var i=0; i<selections.length; i++) {
							var rec = selections[i];
                            var unique_id = rec.get('unique_id');
							unique_ids.push(unique_id);
                    	}
						var form = Ext.getCmp('reqPrdForm').getForm();
                    	if(form.isValid()) {
                        	var val = form.getValues(false);
		        		
							Ext.Ajax.request({
								url: CONTEXT_PATH + '/sales.do?method=reqAddItem',
								params:{
									unique_ids : unique_ids,
									crud_type : 'ADD',
									type : 'ESTMAN',
									pr_end_date : val['pr_end_date']
									
								},
								success: function(){
									gm.me().store.load();
									gm.me().estSubStore.load();
								},
								failure: function(){
									//gm.me().showToast('결과', '삭제실패' );
								}
							});
						}
                		prWin.close();
                    } else {
						win.close();
					
					}
                },
            }, {
					text: '취소',
	                handler: function(btn) {
						prWin.close();
	                }
				}
            ]
        });

        prWin.show();
	},
	fileAttachActionMain : Ext.create('Ext.Action', {
    	xtype : 'button',
        iconCls: 'af-plus-circle',
        text: '첨부',
        tooltip: '파일을 첨부합니다.',
        disabled: true,
        handler: function() {
			gm.me().getAttachFileEvent(gm.me().grid, gu.id('fileGridMain'));
		}
	}),
	fileAttachActionSub : Ext.create('Ext.Action', {
		xtype : 'button',
        iconCls: 'af-plus-circle',
        text: '첨부',
        tooltip: '파일을 첨부합니다.',
        disabled: true,
        handler: function() {
			gm.me().getAttachFileEvent(gm.me().estSubGrid, gu.id('fileGridSub'));
		}
	}),
	createRecvHandler : function(){
		Ext.MessageBox.show({
			title:'수주전환',
			msg: '선택하신 항목을 수주전환 하시겠습니까?',
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn) {
				if(btn == 'yes') {
					var selections = gm.me().grid.getSelectionModel().getSelection();
					var unique_ids = []; 
					for(var i=0; i<selections.length; i++) {
							var rec = selections[i];
                            var unique_id = rec.get('unique_id');
                            unique_ids.push(unique_id);
                    }
		    
		            Ext.Ajax.request({
		                url: CONTEXT_PATH + '/sales.do?method=addEstToRecv',
		                params:{
		                    unique_id:unique_id
							//unique_ids:unique_ids
		                },
		                success: function (result, request) {
		                    gm.me().eventNotice('알림', '수주전환 완료');
		                    gm.me().store.load();
		                },
		                failure: function(result) {
		                    gm.me().eventNotice('알림', '수주전환 실패');
		                    gm.me().store.load();
		                }
		            });
		        }
			},
			icon: Ext.MessageBox.QUESTION
		});
		
	},
	checkPDF : function(unique_id){
		if(gm.me().vSELECTED_DOC_CONTENT==undefined||gm.me().vSELECTED_DOC_CONTENT==''||gm.me().vSELECTED_DOC_CONTENT==null){
			var est_code =  gm.me().vSELECTED_EST_CODE;
			var doc_uid = gm.me().vSELECTED_DOC_UID;
				Ext.Ajax.request({
				async: false,
				url: CONTEXT_PATH + '/doc.do?method=printDoc',
                params:{
                    appr_yn : 'N',
					doc_type : 'EM',
					doc_lang : 'KR',
					doc_no : est_code,
					rotate_yn : 'N',
                    doc_uid : doc_uid,
                    table_name : 'estman'
                },
                reader: {
                    pdfPath: 'pdfPath'
                },
                success : function(result, request) {
                	gm.me().store.load({
						callback: function(r,options,success) {
							gm.me().estman_record =  gm.me().store.findRecord('unique_id', unique_id);
							gm.me().vSELECTED_DOC_CONTENT = gm.me().estman_record.get('doc_content');
							console.log('gm.me().store.load',gm.me().vSELECTED_DOC_CONTENT);
						}
					});	
                },
				failure: function(){
							//gm.me().showToast('결과', '삭제실패' );
				}
			});
		}
	},
	reqAprvHandler : function(){
		var aprvInfoPanel = this.createAprvForm();
		var rec = gm.me().grid.getSelectionModel().getSelection()[0];
		var form = Ext.create('Ext.form.Panel', {
            id: gu.id('aprvForm'),
            xtype: 'form',
            frame: false,
            border: false,
            width: '100%',
			height: '100%',
            layout:'column',
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [aprvInfoPanel]
		});
		
		Ext.getCmp(gu.id('aprv_title')).setValue(rec.get('est_name'));
	
		var aprvWin = Ext.create('Ext.Window', {
            modal: true,
            title: '결재상신',
            width: 870,
            height: 650,
            plain: true,
			autoscroll : true,
            items: [
				form//, aprvPanel	
			],
            autoScroll : true,
            buttons: [{
                text: '결재상신',
                handler: function() {
					/*var unique_ids = []; 
					for(var i=0; i<selections.length; i++) {
							var rec = selections[i];
                            var unique_id = rec.get('unique_id');
							unique_ids.push(unique_id);
                    }*/
					var unique_id = rec.get('unique_id');
					var form = Ext.getCmp(gu.id('aprvForm')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
						Ext.Ajax.request({
							url: CONTEXT_PATH + '/aprv.do?method=createApproval',
							params:{
								doc_uid : unique_id,
								aprv_type : 'EM',
								aprvtmp_name : '기본',
								title : val['title'],
								contents : val['contents'],
								doc_lang : 'KR',
								doc_no : rec.get('est_code'),
								table_name : 'estman'
								
							},
							success: function(){
								//gm.me().store.load();
								//gm.me().estSubStore.load();
							},
							failure: function(){
								//gm.me().showToast('결과', '삭제실패' );
							}
						});
					}
                	aprvWin.close();
                }
			},{
                text: '취소',
                handler: function() {
                	aprvWin.close();
                }
            }
            ]
        });
        aprvWin.show();
	},
    cstmstStore  : Ext.create('Msys.store.CstMstStore', {hasNull:true}),
    usrmstStore  : Ext.create('Msys.store.UserStore', 	{hasNull:true}),
	itemmstStore : Ext.create('Msys.store.ItemMstStore',{not_account_type_list:['T']}),
	estSubStore  : Ext.create('Msys.store.EstSubStore', {}),
    estimateTypeStore : Ext.create('Msys.store.CommonCodeStore', {code_group:'EM_TYPE'}),
 	attachFileStore : Ext.create('Msys.store.AttachFileStore', {} ),
    

})