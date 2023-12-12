Ext.define('Wsys.views.WearingView', {
    extend:'Wsys.base.BaseView',
    initComponent: function() {

        var a = Ext.create('Ext.Action', {
            id: 'button1',
            key:'button1',
            iconCls:'af-search',
            text:'Button',
            handler: function() {
                
            }
        })

        var arr = [];
        arr.push(a);

        var toolbar = Ext.create('widget.toolbar', {
            style:{backgroundColor: '#ededed'},
            items: arr
        });

        this.itemSearchGrid = Ext.create('Ext.grid.Panel', {
            id:'itemSearchGrid',
            // header:{
            //     title : {
            //         style:'text-align:center;',
            //         text : '품목검색'
            //     }
            // },
            store: null,
            multiSelect: false,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoHeight: true,
            filterable: true,
            layout :'fit',
            cls : 'rfx-panel',
            columns: [
                { text:'품명', dataIndex:'item_name', width:'33%', align:'center' },
                { text:'위치정보', dataIndex:'location', width:'33%', align:'center' },
                { text:'수량', dataIndex:'quan', width:'33%', align:'center' },
            ],
            // plugins:[cellEditing],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style:'text-align:center; padding:10px; bakcground-color:red;',
                    bodyStyle:'text-align:center; padding:10px; bakcground-color:green;',
                    items: [
                        {
                            xtype:'triggerfield',
                            width:'25%',
                            emptyText:'품목 검색',
                            id:gu.id('search_buttn'),
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        }, {
                            xtype:'button',
                            text:'검색'
                        }
                    ]
                }
            ]
        });

        this.searchItemAction = {
            xtype:'textfield'
        }

        this.locationSearchGrid = Ext.create('Ext.grid.Panel', {
            id:'locationSearchGrid',
            // header:{
            //     style:'background-color:green;',
            //     title : {
            //         style:'text-align:center; font-size:35px;',
            //         text : '위치검색'
            //     }
            // },
            store: null,
            multiSelect: false,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoHeight: true,
            filterable: true,
            height: 500,  // (getCenterPanelHeight()/5) * 4
            region: 'center',
            columns: [
                { text:'위치정보', dataIndex:'location', width:'33%' },
                { text:'품명', dataIndex:'item_name', width:'33%' },
                { text:'수량', dataIndex:'quan', width:'33%' },
            ],
            // plugins:[cellEditing],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    style:'text-align:center; padding:10px; bakcground-color:red;',
                    bodyStyle:'text-align:center; padding:10px; bakcground-color:green;',
                    items: [
                        {
                            xtype:'triggerfield',
                            width:'25%',
                            emptyText:'위치 검색',
                            id:gu.id('location_buttn'),
                            trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        }, {
                            xtype:'button',
                            text:'검색'
                        }
                    ]
                }
            ]
        });

        this.panel = Ext.create('Ext.panel.Panel', {
            id:gu.id('wearingView'),
            autoScroll:true,
            scroll:true,
            region: 'center',
            width: '100%',
            height: '100%',
            bodyStyle:'width:100%; height:100%;',
            style:'width:100%; height:100%;',
            frame:true,
            layout: 'fit',
            items: [
                {
                    region:'north',
                    width:'100%',
                    height:'50%',
                    layout:'fit',
                    items: this.itemSearchGrid
                },{
                    region:'center',
                    width:'100%',
                    height:'50%',
                    layout:'fit',
                    items:this.locationSearchGrid
                }
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            header:{
                cls : 'header-cls',
                // style:'background-color:#8fbcea; overflow:visible;',
                title : {
                    cls : 'header-title-cls',
                    text : '입고'
                },
                // style: {
                //     backgroundColor:'#8fbcea',
                // }
            },
            items: [
                {
                    region:'north',
                    width:'100%',
                    height:'50%',
                    layout:'fit',
                    items: this.itemSearchGrid
                },{
                    region:'center',
                    width:'100%',
                    height:'50%',
                    layout:'fit',
                    items:this.locationSearchGrid
                }
            ]
        });

        this.callParent(arguments);

        // this.store.load();
    }
})