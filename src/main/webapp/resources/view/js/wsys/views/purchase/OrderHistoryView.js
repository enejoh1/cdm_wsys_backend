Ext.define('Msys.views.purchase.OrderHistoryView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {

        Ext.apply(this, {
            layout: 'border',
            items: [
                this.createTabPanel()
            ]
        });

        this.callParent(arguments);

        this.orderDetailStore.getProxy().setExtraParam('limit', 300);
	},

    createTabPanel: function() {
        this.tabPanel = Ext.widget('tabpanel', {
            id:gu.id('tabPanel'),
            layout: 'border',
            border: true,
            region: 'center',
            width: '100%',
            items: [
                {
                    id:gu.id('orderCompPanel'),
                    layout:'fit',
                    width:'100%',
                    frame:false,
                    region:'center',
                    title:'발주상세내역',
                    items:this.createOrderCompPanel()
                },{
                    id:gu.id('orderUnitPanel'),
                    layout:'fit',
                    width:'100%',
                    frame:false,
                    region:'center',
                    title:'발주서내역',
                    items:this.createOrderUnitPanel()
                }
            ]
        });

        return this.tabPanel;
    },

    createOrderCompPanel: function() {
        this.compColums = this.createMenuColumns('PUR_HISTORY_COMP');
        this.orderCompStore = Ext.create('Msys.store.OrderCompStore', {});

        this.orderCompPanel = Ext.create('Ext.grid.Panel', {
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            store: this.orderCompStore,
            title: '발주상세내역',
            width:'50%',
            cls : 'rfx-panel',
            region:'east',
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.compSearchAction
                ]
            }],
            viewConfig: {
                stripeRows: true,
                markDirty:false,
                enableTextSelection: true,
                preserveScrollOnReload: true,
                getRowClass: function(record) {
                    
                }
            },
            bbar:Ext.create('Ext.PagingToolbar', {
                store:this.orderCompStore,
                displayInfo: true,
                displayMsg: '{0} - {1} / Total: {2}',
                // displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function(page, curPage) {

                    },
                    change: function() {
    
                    }
                }
            }),
            columns: this.compColums
        });

        return this.orderCompPanel;
    },

    createOrderUnitPanel: function() {
        
        this.unitPanel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            items: [
                {
                    region:'west',
                    frame:true,
                    width:'30%',
                    layout:'fit',
                    resizable: true,
                    items: this.createOrderUnit()
                },{
					region: 'center',
                    frame: true,
                    width:'70%',
                    layout:'fit',
                    items: this.createOrderUnitDetail()
                }
            ]
        });

        return this.unitPanel;
    },

    createOrderUnit: function() {
        this.unitColums = this.createMenuColumns('PUR_HISTORY_UNIT');
        this.orderUnitStore = Ext.create('Msys.store.OrderUnitStore', {});
        this.orderUnitStore.getProxy().setExtraParam('unit_type', 'P');
        this.orderUnitStore.getProxy().setExtraParam('limit', 300);

        this.orderUnitPanel = Ext.create('Ext.grid.Panel', {
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            store: this.orderUnitStore,
            title: '발주서내역',
            width:'50%',
            cls : 'rfx-panel',
            region:'east',
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })],
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    this.unitSearchAction,
                    this.orderReqPdfAction,
                    this.sendOrderMailAction,
                    this.preShowPdfAction
                ]
            }],
            viewConfig: {
                stripeRows: true,
                markDirty:false,
                enableTextSelection: true,
                preserveScrollOnReload: true,
                getRowClass: function(record) {
                    
                }
            },
            bbar:Ext.create('Ext.PagingToolbar', {
                store:this.orderUnitStore,
                displayInfo: true,
                displayMsg: '{0} - {1} / Total: {2}',
                // displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function(page, curPage) {

                    },
                    change: function() {
    
                    }
                }
            }),
            columns: this.unitColums
        });

        this.orderUnitPanel.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    var unique_id = select.get('unique_id');

                    gm.me().orderDetailStore.getProxy().setExtraParam('po_unit_uid', unique_id);
                    gm.me().orderDetailStore.load(function(records) {
                        var rawData = this.getProxy().getReader().rawData;
                        var sum_po_amount = rawData['sum_po_amount'];
                        var sum_gr_amount = rawData['sum_gr_amount'];

                        sum_po_amount = Ext.util.Format.number(sum_po_amount, "000,000,000,000,000.##/i");

                        Ext.getCmp(gu.id('sum_po_amount')).update('발주금액: ' + sum_po_amount);
                    });

                    gm.me().orderReqPdfAction.enable();
                    gm.me().sendOrderMailAction.enable();
                    gm.me().preShowPdfAction.enable();
                } else {
                    gm.me().orderDetailStore.removeAll();
                    Ext.getCmp(gu.id('sum_po_amount')).update('발주금액: 0');

                    gm.me().orderReqPdfAction.disable();
                    gm.me().sendOrderMailAction.disable();
                    gm.me().preShowPdfAction.disable();
                }
            }
        });

        return this.orderUnitPanel;
    },

    createOrderUnitDetail: function() {
        this.detailColums = this.createMenuColumns('PUR_HISTORY_DETAIL');
        this.orderDetailStore = Ext.create('Msys.store.OrderDetailStore', {});

        this.orderDetailPanel = Ext.create('Ext.grid.Panel', {
            selModel: Ext.create("Ext.selection.CheckboxModel", {}),
            store: this.orderDetailStore,
            title: '세부사항',
            width:'50%',
            cls : 'rfx-panel',
            region:'east',
            plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })],
            dockedItems: [
                Ext.create('widget.toolbar', {
                    cls: 'my-x-toolbar-default2',
                    items: [{
                        xtype: 'tbfill'
                    }, {
                        xtype: 'label',
                        id:gu.id('sum_po_amount'),
                        style: 'color: black; font-weight: bold; font-size: 15px; margin: 5px;',
                        text: '발주금액: 0'
                    }]
                })
                // {
                //     dock: 'top',
                //     xtype: 'toolbar',
                //     cls: 'my-x-toolbar-default2',
                //     items: [
                //         {
                //             xtype: 'label',
                //             id:gu.id('sum_po_amount'),
                //             style: 'color: black; font-weight: bold; font-size: 15px; margin: 5px;',
                //             text: '발주금액: 0'
                //         }
                //     ]
                // }
            ],
            viewConfig: {
                stripeRows: true,
                markDirty:false,
                enableTextSelection: true,
                preserveScrollOnReload: true,
                getRowClass: function(record) {
                    
                }
            },
            bbar:Ext.create('Ext.PagingToolbar', {
                store:this.orderDetailStore,
                displayInfo: true,
                displayMsg: '{0} - {1} / Total: {2}',
                // displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                emptyMsg: "표시할 항목이 없습니다.",
                listeners: {
                    beforechange: function(page, curPage) {

                    },
                    change: function() {
    
                    }
                }
            }),
            columns: this.detailColums
        });

        return this.orderDetailPanel;
    },

    createMenuColumns: function(menuCode) {
        var cols = [];
        var me = this;
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/fields.do?method=read',
            async:false,
            params: {
                menuCode:menuCode
            },
            success: function(result, request) {
                var result = Ext.decode(result.responseText);
                var data = result.datas;
                cols = me.addColumnRecords(data);
            },
        });
        return cols;
    },

    addColumnRecords: function(records) {
        var arry = [];
        for(var i=0; i<records.length; i++) {
            var rec = records[i];
            var unique_id = rec['unique_id'];
            var data_index =rec['data_index'];
            var menu_code =rec['menu_code'];
            var menu_name =rec['name'];
            var sort_no =rec['sort_no'];
            var sortable =rec['sortable'];
            var width =rec['width'];
            var code_type =rec['code_type'];
            var style = 'text-align:center;'
            var align = '';
            var type = 'string';
            var xtype = 'string';
            var renderer = null;

            switch(code_type) {
                case 'number':
                    align += 'right';
                    type = 'numberfield';
                    xtype = 'searchnumber';
                    renderer = function(value, meta) {
                        return Ext.util.Format.number(value, "000,000,000,000,000.##/i");
                    };
                    break;
                case 'int':
                    align += 'right';
                    type = 'numberfield';
                    xtype = 'searchnumber';
                    renderer = function(value, meta) {
                        return Ext.util.Format.number(value, "000,000,000,000,000/i");
                    };
                    break;
                case 'date':
                    align += 'center';
                    type = 'datefield';
                    xtype = 'searchdate';
                    renderer = function(value, meta) {
                        value = Ext.util.Format.date(value, 'Y-m-d');
                        return value;
                    };
                    break;
                case 'string':
                    type = 'textfield';
                    xtype = 'searchtrigger';
                    break;
                default:
                    type = 'textfield';
                    align += 'left';
                    xtype = 'searchtrigger';
                    break;
            }

            var obj = {
                unique_id:unique_id,
                dataIndex:data_index,
                menu_code:menu_code,
                menu_name:menu_name,
                header:menu_name,
                sort_no:sort_no,
                sortable:sortable,
                align:align,
                style:style,
                width:width,
                type:type,
                sortable:true,
            };

            if(renderer!=null) {
                obj['renderer'] = renderer;
            }

            arry.push(obj);
        };

        return arry;
    },

    compSearchAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-search',
        text: '검색',
        handler: function() {
            gm.me().orderCompStore.load();
        }
    }),

    unitSearchAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-search',
        text: '검색',
        handler: function() {
            gm.me().orderUnitStore.load();
        }
    }),

    preShowPdfHandler: function() {
        var pdf = Ext.create('Msys.util.CreatePdf');
        var content = [
            {
                text:'테스트입니다.',
                bold:true,
                widths: [100, '*', 200, '*'],
            }
        ];

        var setStyles = {
            style_test: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 0],
                alignment: 'center'
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            }
        };

        this.document = {
            content:content,
            // footer:footer,
            styles:setStyles,
            pageSize:'A4',
            pageOrientation:'portrait'
        }
        const pdfDocGenerator = pdfMake.createPdf(this.document);
        var dataUid = "";
        pdfDocGenerator.getBase64((data) => {
            dataUid = data;
            var form = Ext.create('PdfViewer.view.panel.PDF', {
                title    : 'PDF문서보기',
                xtype: 'PdfViewerPdfPanel',
                showPerPage: true,
                width    : '100%',
                height   : '100%',
                pageScale: 1.25, 
                showLoadMaskOnInit: true,
                disableTextLayer: true,
                src : `data:application/pdf;base64,`+ dataUid,//gm.me().vSELECTED_DOC_CONTENT,
                renderTo : Ext.getBody()
                
            });
        
        var myHeight = '90%';
        var myWidth = 800;

        var prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '내용보기',
            width: myWidth,
            height: myHeight,
            plain: true,
            items: form,
            autoScroll : true,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default1',
                items: []
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
        });
    },

    orderReqPdfAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-pdf',
        text: '발주서출력',
        disabled:true,
        handler: function() {
            var pdf = Ext.create('Msys.util.CreatePdf');
            console.log('===pdf', pdf);

            var content = [
                {
                    text:'테스트입니다.',
                    bold:true,
                    widths: [100, '*', 200, '*'],
                }
            ];

            var setStyles = {
                style_test: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 0],
                    alignment: 'center'
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                }
            };

            pdf.setContent(content);
            pdf.setStyles(setStyles);
            pdf.setPdfName("테스트PDF");
            pdf.createPdf();

            // var select = gm.me().orderUnitPanel.getSelectionModel().getSelection()[0];
            // var unique_id = select.get('unique_id');

            // var documentDefinition = {
            //     //content : pdf의 내용을 정의
            //     content: [
            //     {
            //         text: 'First paragraph'
            //     }, // 스타일 적용 없이 그냥 출력
            //     {
            //         text: 'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
            //         bold: true
            //     }, // 텍스트에 bold 주기
            //     {
            //         text: '가나다라마바사아자타카타파하',
            //         style: 'style_test'
            //     }, // style 부분에 정의된 style_test 적용해보기 및 한글 꺠짐 테스트
            //     {
            //         style: 'tableExample',
            //         table: {
            //         widths: [100, '*', 200, '*'],
            //         body: [
            //             ['width=100', 'star-sized', 'width=200', 'star-sized'],
            //             ['fixed-width cells have exactly the specified width', {
            //             text: 'nothing interesting here',
            //             italics: true,
            //             color: 'gray'
            //         }, {
            //             text: 'nothing interesting here',
            //             italics: true,
            //             color: 'gray'
            //         }, {
            //             text: 'nothing interesting here',
            //             italics: true,
            //             color: 'gray'
            //         }]
            //     ]
            //     }
            //     }//테이블 그리기
            //     ],
            //     //하단의 현재페이지 / 페이지 수 넣기
            //     footer: function (currentPage, pageCount) {
            //     return {
            //     margin: 10,
            //     columns: [{
            //     fontSize: 9,
            //     text: [{
            //     text: '--------------------------------------------------------------------------' +
            //     '\n',
            //     margin: [0, 20]
            //     },
            //     {
            //     text: '' + currentPage.toString() + ' of ' +
            //     pageCount,
            //     }
            //     ],
            //     alignment: 'center'
            //     }]
            //     };
                
            //     },
            //     //필요한 스타일 정의하기
            //     styles: {
            //         style_test: {
            //             fontSize: 18,
            //             bold: true,
            //             margin: [0, 0, 0, 0],
            //             alignment: 'center'
            //         },
            //         tableExample: {
            //             margin: [0, 5, 0, 15]
            //         }
            //     },
                
            //     // 페이지 크기 용지의 크기 사이즈 넣기 또는 특정 사이즈 넣기 { width: number, height: number }
            //     pageSize: 'A4',
                
            //     /* 페이지 방향 portrait : 가로 , landscape : 세로 */
            //     pageOrientation: 'portrait',
            //     };
                
            //     var pdf_name = 'pdf파일 만들기.pdf'; // pdf 만들 파일의 이름
            //     pdfMake.createPdf(documentDefinition).download(pdf_name);
        }
    }),
    
    preShowPdfAction:Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-refresh',
        text: 'PDF 미리보기',
        disabled:true,
        handler: function() {
            gm.me().preShowPdfHandler();
        }
    }),

    sendOrderMailAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-external-link',
        text: '메일전송',
        disabled:true,
        handler: function() {
            gm.me().sendOrderMailHandler();
        }
    }),

    sendOrderMailHandler: function() {

    },

    compColumnStore: Ext.create('Msys.store.DefaultColumnStore', {}),
    unitColumnStore: Ext.create('Msys.store.DefaultColumnStore', {}),
})