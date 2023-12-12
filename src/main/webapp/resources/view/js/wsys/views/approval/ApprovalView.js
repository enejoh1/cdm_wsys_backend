Ext.define('Msys.views.approval.ApprovalView', {
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
            disabled: false,
            text:'첨부',
            handler: function(widget, event) {
                gm.me().attachFile();
            }
        });

      //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',

            tooltip:'주문서 출력',
            disabled: false,

            handler: function(widget, event) {
                var aprvman_uid =  gm.me().vSELECTED_UNIQUE_ID;
                var aprv_no =  gm.me().vSELECTED_APRV_NO;
                var aprv_type = gm.me().vSELECTED_APRVTYPE ;
				var doc_uid = gm.me().vSELECTED_DOC_UID;

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/apprdoc.do?method=printDoc',
                    params:{
                        unique_id : aprvman_uid,
						doc_uid : doc_uid,
                        aprv_type : aprv_type,
                        aprv_no : aprv_no,
                        pdfPrint : 'pdfPrint'
						//,is_rotate: 'N'
                        //,supplier_name: supplier_code
                    },
                    reader: {
                        pdfPath: 'pdfPath'
                    },
                    success : function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console.log(pdfPath);
                        if(pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                            top.location.href=url;
                        }
                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';

            }
        });
        // 버튼 추가.
        buttonToolbar.insert(1, this.apprDocViewAction);
        
		//스토어 생성
        this.createStore('Msys.model.ApprovalModel', gu.pageSize);

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
                	gm.me().vSELECTED_APRVTYPE = rec.get('rtg_type');
                	gm.me().vSELECTED_APRV_NO = rec.get('aprv_no');

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

		var menu_code = 'GET_APPROVAL_SUB';
        var options = [];      
        //스토어 생성
        this.subGridStore = this.createSubStore('Msys.model.ApprovalSubModel', gu.pageSize, menu_code);
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
    docView : function(rtg_type, unique_id) {
    	var form = Ext.create('PdfViewer.view.panel.PDF', {
//          title    : 'PDF Panel',
      		xtype: 'PdfViewerPdfPanel',
        	showPerPage: true,
        	width    : '100%',
        	height   : '100%',
        	pageScale: 1.25, 
        	showLoadMaskOnInit: true,
        	disableTextLayer: true,
        	src : `data:application/pdf;base64,`+gm.me().vSELECTED_PDF,
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
                cls: 'my-x-toolbar-default1',
                items: [/*apprbtn, rejectbtn, opinionbtn*/]
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
                text: '확인',
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
