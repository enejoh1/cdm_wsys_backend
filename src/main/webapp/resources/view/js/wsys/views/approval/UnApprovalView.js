Ext.define('Msys.views.approval.UnApprovalView', {
    extend:'Msys.base.BaseView',
    initComponent: function () {
        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar(null,null,true);
        var options = [];

        this.apprDocViewAction = Ext.create('Ext.Action', {
            iconCls: 'fa_4-7-0_paste_14_0_5395c4_none',
            text: '결재문서',
            tooltip: '전자결재 문서 보기',
            disabled: false,
            handler: function () {
            	gm.me().docView(gm.me().vSELECTED_APRVTYPE,gm.me().vSELECTED_DOC_UID);
            }
        });

        this.fileattachAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            itemId: 'fileattachAction',
            disabled: true,
            text:'첨부',
            handler: function(widget, event) {
                gm.me().attachFile();
            }
        });

        // 버튼 추가.
        buttonToolbar.insert(1, this.apprDocViewAction);
        
		//스토어 생성
        this.createStore('Msys.model.UnApprovalModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        Ext.apply(this, {
            layout: 'border',
			items: [
				{
					collapsible: false,
					frame: true,
					region: 'center',
                    height: '60%',
                    layout:'fit',
                    items: [this.grid]
				}, 
				{
                    title: '결재선',
                    id:'apprline',
					collapsible: false,
					frame: true,
					region: 'south',
					layout: 'fit',
					height: '40%',
					items: [this.createCenter()]  
				}
            ]
        });

		this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                	var rec = selections[0];
	                gm.me().vSELECTED_RECORD = rec;
    	            gm.me().subGridStore.getProxy().setExtraParam('aprvman_uid', rec.get('unique_id'));
        	        gm.me().subGridStore.load();
            	    gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
               		gm.me().vSELECTED_DOC_UID = rec.get('doc_uid');
                	gm.me().vSELECTED_APRVTYPE = rec.get('aprv_type');
                	gm.me().vSELECTED_APRV_NO = rec.get('aprv_no');
					gm.me().vSELECTED_DOC_PATH=rec.get('doc_path');
					gm.me().vSELECTED_DOC_CONTENT=rec.get('doc_content');
					gm.me().apprDocViewAction.enable();
                } else {
					gm.me().apprDocViewAction.disable();
                }
            }
        });

        this.callParent(arguments);

        // 디폴트 로딩
        this.store.getProxy().setExtraParam('orderby', 'aprvman.unique_id ASC');
        this.store.load(function (records) { });
    },
	subGridStore:null,
    createCenter: function() {
        // console_logs('>>> gm.me().prdStore', gm.me().prdStore);

		var menu_code = 'UN_APPROVAL_SUB';
        var options = [];      
        //스토어 생성
        this.subGridStore = this.createSubStore('Msys.model.UnApprovalSubModel', gu.pageSize, menu_code);
		this.subGridStore.getProxy().setExtraParam('not_in_aprv_type', '참조');
        //그리드 생성
        this.aprvLineGrid = this.createSubGrid(null, null, options, this.subGridStore, menu_code);
        this.aprvLineGrid.addListener('cellkeydown', this.cellClipCopy);
        this.aprvLineGrid.getSelectionModel().on({
                
        });
        
        this.aprvLineGrid.on('edit', function(editor, e) {

        });

        this.aprvLineGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
	
            }
        });

		//this.subGridStore.load();
		
        return this.aprvLineGrid;
    },
    docView : function(aprv_type, unique_id) {
		//PDF 파일 출력기능
        var printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF 다운로드',
            tooltip:'주문서 출력',
            disabled: false,

            handler: function(widget, event) {
                var pdfPath = gm.me().vSELECTED_DOC_PATH;
                console.log(pdfPath);
                if(pdfPath.length > 0) {
                	var url = CONTEXT_PATH + "/fileAttach.do?method=download&path="+ pdfPath;
                    top.location.href=url;
                }
            }
        });
    	var apprbtn = Ext.create('Ext.Action', {
            xtype: 'button',
//            iconCls: 'af-search',
            text: '승인',
            tooltip: '결재를 승인합니다.',
            disabled: false,
            handler: function () {
            	Ext.MessageBox.show({
                    title:'승인',
                    msg: '결재를 승인하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {
                        	var rec = gm.me().vSELECTED_RECORD;
                        	
                        	Ext.Ajax.request({
                                url: CONTEXT_PATH + '/aprv.do?method=updateProcessByAprvType',
                                params: {
                                	unique_id : rec.get('unique_id'),
                                    aprvline_uid : rec.get('aprvline_uid'),
                                    doc_uid : rec.get('doc_uid'),
                                    aprv_type : rec.get('aprv_type'),
                                    total_step : rec.get('total_step'),
                                    cur_step : rec.get('cur_step'),
                                    state : 'Y',
                                    comment1 : Ext.getCmp('comment1').getValue()
                                },
                                success: function(result, request) {
//                                    var result = result.responseText;
                                	Ext.MessageBox.alert('알림', '결재가 승인되었습니다.');
                                    gm.me().store.load();
                                    prWin.close();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        	
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            	
            }
        });

    	var rejectbtn = Ext.create('Ext.Action', {
            xtype: 'button',
//            iconCls: 'af-search',
            text: '반려',
            tooltip: '결재를 반려 합니다.',
            disabled: false,
            handler: function () {
            	Ext.MessageBox.show({
                    title:'반려',
                    msg: '결재를 반려하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(btn) {
                        if(btn=='yes') {
                        	var rec = gm.me().vSELECTED_RECORD;
                        	
                        	Ext.Ajax.request({
                                url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=updateApproval',
                                params: {
                                	unique_id:rec.get('unique_id'),
                                    rtgwrk_uid:rec.get('rtgwrk_uid'),
                                    doc_uid:rec.get('reserved_number1'),
                                    work_quan:rec.get('work_quan'),
                                    step_quan:rec.get('step_quan'),
                                    aprv_type:rec.get('aprv_type'),
                                    state:'N',
                                    comment:Ext.getCmp('comment').getValue()
                                },
                                success: function(result, request) {
//                                    var result = result.responseText;
                                	Ext.MessageBox.alert('알림', '결재가 반려 되었습니다.');
                                    gm.me().store.load();
                                    prWin.close();
                                },
                                failure: extjsUtil.failureMessage
                            });
                        	
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });    	

        var form = Ext.create('PdfViewer.view.panel.PDF', {
//          title    : 'PDF Panel',
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
            title: '결재문서',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            autoScroll : true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                style:{backgroundColor: '#ededed'},
                items: [apprbtn, rejectbtn,'->',printPDFAction/*, opinionbtn*/]
                },{
                	xtype: 'fieldset',
                	collapsible: false,
                	width: '95%',
                	defaults: {
                		width: '95%',
                		layout: {
                			type: 'vbox'
                		}
                	},
                	items : [{
                		fieldLabel: '결재의견',
                		id: 'comment',
                		name: 'comment',
                		xtype: 'textarea',
                	}]
                }],
            buttons: [{
                text: "확인",
                handler: function(btn) {
                	prWin.close();
                }
            }
            ]
        });

        prWin.show();
        
    	
    },
    aprvLineStore: Ext.create('Msys.store.AprvlineStore',{hasNull:false}),

});
