Ext.define('Wsys.app.Main', {
    name:'WsysMes',
    mains:null,
    viewport:null,
    mainTabs:null,
    treeMenu:null,
    treeMenuStore:null,
    selMainPanel:null,
    selMainPanelName:null,
    selMainTabs:null,
    selMainPanelCenter:null,
    selParentCode:null,
    menuTree:null,
    columns:null,
	subcolumns:[],
    me: function() {
        return this.selMainPanel;
    },
    callSelectedPanel: function() {
        return this.selMainTabs;
    },
    createViewPort: function() {
        // this.mainTabs.getTabBar().hide();
        var deviceSize = Ext.getBody().getViewSize();
        var deviceWidth = deviceSize['width'];
        var deviceHeight = deviceSize['height'];
        this.viewport = new Ext.Viewport({
            layout : 'border',
            bodyBorder : false,
            border : false,
            defaults : {
                collapsible : false,
                split : false,
                bodyPadding : 0
            },
            getItem : function(region) {
                var items = this.items['items'];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (region == item['region']) {
                        return item;
                    }
                }
                return null;
            },
    
            resizeRegion : function(region, size) {
                var r = this.getItem(region);
                r.setHeight(size);
            },
    
            hideRegion : function(region) {
                var r = this.getItem(region);
                r.hide();
            },
            showRegion : function(region) {
                var r = this.getItem(region);
                r.show();
            },
            items : [{
                padding : 0,
                height : 50,
                region : 'north',
                bodyStyle : 'background: RGB(245,245,246); ',
                contentEl : 'header'
            }, 
            // {
            //     padding : 0,
            //     height : '100%',
            //     region : 'center',
            //     // bodyStyle : 'background: red; ',
            //     contentEl : 'content',
            //     items:this.main
            // }
            this.mains,
            {
                width: '25%',
                padding : 0,
                region : 'west',
                // floating:true,
                id:'sideMenuPanel',
                // titleCollapse:true,
                // split: true,
                collapsible: false,
                collapsed: true,
                preventHeader: true ,
                hideCollapseTool: true,
                // style:'absolute'
                // hideMode: 'visibility',
                items:[
                    this.menuList
                ]
            }, 
            {
                padding : 0,
                height : 20,
                bodyStyle : 'background: #96634D; ',
                region : 'south',
                contentEl : 'footer'
            } 
        ],
            listeners : {
                afterrender : function() {
                    
                }
            }
        });
    },
    setParentTabActive: function(parentCode) {
        var list = gu.menuList;
        for(var i=0; i<list.length; i++) {
            var l = list[i];
            var code = l['code'];
            if(parentCode == code) {
                var code = l['code'];
                var id = 'active-' + l['id'];
                var title = l['title'];
                var children = l['children'];

                gMain.mainTabs.addTab(code, id, title, children);
                break;
            };
        };
    },
    createMainTabs: function() {
        this.mainTabs = new Ext.TabPanel({
            region:'center',
            id:'mainTabs',
            border:false,
            flex:1,
            activeTab:0,
            deferredRender : false,
            defaults : {
				autoHeight : true,
				bodyPadding: 5
			},
            items: [],
            // addTab: function(class_name, id, title, children) {
            //     var o = Ext.getCmp(id);
                
            //     if(o==null || o==undefined) {
            //         var path = 'Wsys.views.' + class_name; // .toLowerCase()
            //         var active = Ext.create(path, {
            //             title:title,
            //             id:id,
            //             menu_key:id,
			// 			itemId : id,
			// 			link: id,
            //             closable : false,
            //             listMenu : children,
            //         });
            //         this.add(active);
			// 		gMain.selMainPanel = active;
			// 		gMain.selMainPanelName = title;
            //     }
            //     this.setActiveTab(id);
            // }
        });

        this.selMainTabs = this.mainTabs;
    },

    createLeftMenu: function() {

    },

    changeMenu: function(tree, menu) {
        var node = menu.node
        var data = node.data;
        var type = data['type'];
        console.log('changeMenu setSubColumn', node.get('code'));
        // gm.setSubColumn(node.get('code'));
        if(type!=null) {
            switch(type) {
                case 'P':
                    var child = data.children;
                    if(child==null || child.length<1) {
                        var parentCode = node.get('parent');
                        var menuCode = node.get('code');
                        var link = node.get('link');
                        var text = node.get('text');
                        
                        console.log('==parentCode', parentCode);
                        console.log('==menuCode', menuCode);
                        console.log('==link', link);
                        console.log('==text', text);

                        if(this.selParentCode==null || this.selParentCode==undefined) {
                            this.selParentCode = parentCode;
                        } else {
                            if(this.selParentCode != parentCode) {
                                this.selParentCode = parentCode;
                                gm.selMainTabs.removeAll();
                            }
                        };
                        gm.moveToMenu(link, text, menuCode);

                        if(link!=null) {
                            var linkArr = link.split('.');
                            var len = linkArr.length;
                            gm.curLink = linkArr[len-1];
                            gu.link = menuCode;
                        }

                        // url 변경
                        var hashTo = '';
                        if(parentCode==null || parentCode.length<1) {
                            hashTo = '#' + menuCode;
                        } else {
                            hashTo = '#' + parentCode + ':' + menuCode;
                        }
                        window.location.hash = hashTo;
                    }
                    break;
                case 'C':
                    var parentCode = node.get('parent');
                    var menuCode = node.get('code');
                    var link = node.get('link');
                    var text = node.get('text');

                    if(this.selParentCode==null || this.selParentCode==undefined) {
                        this.selParentCode = parentCode;
                    } else {
                        if(this.selParentCode != parentCode) {
                            this.selParentCode = parentCode;
                            gm.selMainTabs.removeAll();
                        }
                    };
                    gm.moveToMenu(link, text, menuCode);

                    if(link!=null) {
                        var linkArr = link.split('.');
                        var len = linkArr.length;
                        gm.curLink = linkArr[len-1];
                        gu.link = menuCode;
                    }

                    // url 변경
                    var hashTo = '';
                    if(parentCode==null || parentCode.length<1) {
                        hashTo = '#' + menuCode;
                    } else {
                        hashTo = '#' + parentCode + ':' + menuCode;
                    }
                    window.location.hash = hashTo;
                break;
            };
        };
    },

    // createMainView: function() {
    //     this.mainView = Ext.create('Ext.panel.Panel', {
    //         layout:'border',
    //         defaults: {
    //             split: true,
    //             bodyPadding: 0,
    //         },
    //         region : 'center', 
    //         items: []
    //     });

    //     return this.mainView;
    // },

    getMenuText: function(record) {
        if(record != null) {
            var icon = record.get('icon');
            var name = record.get('menu_name');
            var text =  '<div style="width:100%; display:flex;">' +
                        ' <div style="width:15%;">' +
                        '  <img src="' + icon + '" style="width:100%;"/>' +
                        ' </div>' +
                        ' <div style="width:75%;padding-left:15%;font-size:14px;">' +
                            name +
                        ' </div>' +
                        '</div>'
            ;
            return text;
        }
    },

    getMenuTextChild: function(record) {
        if(record != null) {
            var icon = record.icon;
            var name = record.menu_name;
            var text =  '<div style="width:100%; display:flex;">' +
                        ' <div style="width:15%;">' +
                        '  <img src="' + icon + '" style="width:100%;"/>' +
                        ' </div>' +
                        ' <div style="width:75%;padding-left:15%;font-size:14px;">' +
                            name +
                        ' </div>' +
                        '</div>'
            ;
            return text;
        }
    },

    tempListMenu: function() {
        this.menuList = Ext.JSON.decode(treeMenuList).datas;
        console.log('===treeMenuList', this.menuList);

        this.menuDatas = [];

        for(var i=0; i<this.menuList.length; i++) {
            var m = this.menuList[i];
            var o = {
                menu_code:m.menu_code, menu_name:m.menu_name, link:m.menu_link, expanded:false,
                type:m.type, icon:m.icon_url, children:[] 
            };

            var child = m.child;
            if(child!=null && child.length>0) {
                for(var j=0; j<child.length; j++) {
                    var c = child[j];
                    var oc = {
                        menu_code:c.menu_code, menu_name:c.menu_name, link:c.menu_link, expanded:false,
                        type:c.type, icon:c.icon_url, children:[] 
                    };

                    o['children'].push(oc);
                };
            };

            this.menuDatas.push(o);
        }

        console.log('==this.menuDatas', this.menuDatas);

        this.menuStore = Ext.create("Ext.data.Store",{
            fields : ['menu_code','menu_name', 'link', 'type', 'expanded', 'icon', 'children'],
            data:this.menuDatas
        });

        var menuRecords = this.menuStore.data.items;
        this.listMenus = [];

        for(var i=0; i<menuRecords.length; i++) {
            var record = menuRecords[i];
            var menu_code = record.get('menu_code');
            var menu_name = record.get('menu_name');
            var link = record.get('link');
            var type = record.get('type');
            var expanded = record.get('expanded');
            var icon = record.get('icon');
            var children = record.get('children');
            var text = this.getMenuText(record);

            var o = {
                id:menu_code, code:menu_code, type:type, link:link, expanded:expanded, children:[],
                text:text
            };

            if(children!=null && children.length>0) {
                for(var j=0; j<children.length; j++) {
                    var c = children[j];
                    var t = c.menu_name;
                    // var t = this.getMenuTextChild(c);
                    var oc = {
                        id:c.menu_code, code:c.menu_code, type:c.type, link:c.link, expanded:c.expanded,
                        text:t, children:[]
                    };
                    o['children'].push(oc);
                };
            };

            this.listMenus.push(o);
        };
    },
    createSideMenu: function() {
        this.tempListMenu();
        this.menuList = Ext.create('Ext.list.Tree', {
            id:'menuList',
            height:'100%',
            useArrows: false,
			rootVisible: false,
			multiSelect: false,
			singleExpand: false,
			frame: false,
			border: true,
            expanderOnly: false,
            collapsed:false,
            collapsible:false,
            // cls:'my-menu-panel',
            store: {
                root: {
                    name:'메뉴',
                    link:'menu',
                    children:this.listMenus
                    // expaneded:true,
                    // children: listMenus
                },
            },
            listeners: {
                ItemClick: function(tree, menu) {
                    console.log('== item click', menu);
                    gm.changeMenu(tree, menu);
                }
            }
        });

        this.sideMenu = Ext.create('Ext.panel.Panel', {
            id:gu.id('sideMenu'),
            region:'west',
            width:'40%',
            hidden:true,
            frame: false,
			border: true,
            autoScroll:true,
            scroll:true,
            collapsed:false,
            collapsible: false,
            items: [
                this.menuList
            ],
            cls:'my-menu-panel',
            dockedItems: [
                Ext.create('widget.toolbar', {
                    // style: 'margin-right: 0',
                    items: [
                        {
                            id: 'main-toolbarPath',
                            xtype: 'component',
                            html: '-',
                            listeners: {
                                render: function(c) {
                                    c.getEl().on({
                                        click: function() {
                                            console.log('cur menu link ====> ', gm.curLink);
                                        }
                                    })
                                }
                            }
                        },
                        '->',
                        {
                            iconCls: 'arrow_left',
                            scale: 'small',
                            //text: '<',
                            cls: 'my-menu-item',
                            handler: function(btn) {
                                gm.menuPanel.collapse();
                            }
                        },
                    ],
                    height: 30,
                    cls: 'my-x-toolbar-default1-4'
                },
            )
            ]
        });
    },

    // createMainView: function() {
    //     this.mainView = Ext.create('Ext.panel.Panel', {
    //         id:'mainView',
    //         title:'Main View',
    //         region:'center',
    //         width:'100%',
    //         height:'100%',
    //         frame: false,
	// 		border: true,
    //         autoScroll:true,
    //         scroll:true,
    //         collapsed:false,
    //         collapsible: false,
    //         layout:'border',
    //         // style:'background: #29598B; ',
    //         bodyStyle:'background: #29598B; z-index:1',
    //         // backgroundColor:'#29598B',
    //         defaults: {
    //             split: true,
    //             bodyPadding: 0,
    //         },
    //         region : 'center', 
    //         items: []
    //     });
    // },

    createMainPanel: function() {
        this.mains = Ext.create('Ext.panel.Panel', {
            id:'mainPanel',
            layout:'border',
            region:'center',
            width:'100%',
            height:'100%',
            frame: false,
			border: false,
            autoScroll:true,
            scroll:true,
            layout:'fit',
            style : 'background: #29598B; width:100%; height:100%;',
            bodyStyle : 'background: #29598B; width:100%; height:100%;',
            // defaults: {
            //     split: true,
            //     bodyPadding: 0,
            // },
            items: [
                // this.sideMenu,
                // this.mainView
                // this.createTreeMenu(),
                // this.mainTabs
                // this.createLeftMenu(),
                // this.createMainView()
            ],
            listeners: {
                afterrender: this.onAfterRender
            }
        });

    },
    defaultColumnStore: null,
    // defaultColumnStore: Ext.create('Wsys.store.DefaultColumnStore', {}),
    moveToMenu: function(link, text, menuCode, parentCode) {
        Ext.getCmp('mainPanel').removeAll();
        var newPanel = Ext.create(link, {
            // title: text,
            id: gu.id(menuCode + '-panel'),
            linkPath:link,
            menuCode:menuCode,
            bodyStyle:'width:100%; height:100%;',
            style:'width:100%; height:100%;',
            width:'100%',
            height:'100%'
            // closable:true,
            // columns:arry
        });
        Ext.getCmp('mainPanel').add(newPanel); 
        Ext.getCmp('mainPanel').fireEvent('afterrender', Ext.getCmp('mainPanel'));

        if(link!=null) {
            var linkArr = link.split('.');
            var len = linkArr.length;
            gm.curLink = linkArr[len-1];
            gu.link = menuCode;
        }

        // url 변경
        var hashTo = '';
        if(parentCode==null || parentCode.length<1) {
            hashTo = '#' + menuCode;
        } else {
            hashTo = '#' + parentCode + ':' + menuCode;
        }
        window.location.hash = hashTo;
    },

    resizeColumnSize: function(column, width) {
        var unique_id = column['unique_id'];
        var width = Math.round(width);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/fields.do?method=resizeColumnWidth',
            params:{
                unique_id:unique_id,
                width:width
            },
            success: function(){
                
            },
            failure: function(){
                gm.me().showToast('결과', '실패' );
            }
        });
    },
    menuToggleFn: function(childs, _type) {
        var toggle = Ext.getCmp('menu_up_down_toggle');
        var type = toggle.type;
        if(_type!=null && _type!=undefined && _type.length>0) type = _type;
        switch(type) {
            case 'up':
                for(var i=0; i<childs.length; i++) {
                    var child = childs[i];
                    child.collapse(true);
                }
                toggle.setType('down');
                toggle.setTooltip('전체열기');
                break;
            case 'down':
                for(var i=0; i<childs.length; i++) {
                    var child = childs[i];
                    child.expand(true);
                }
                toggle.setType('up');
                toggle.setTooltip('전체닫기');
                break;
        }
    },
    menuTriggerFn(field) {
        var me = Ext.getCmp('menuTree');
        var store = me.getStore();
        var value = field.getValue();

        store.clearFilter(true);

        var childs = Ext.getCmp('menuTree').getStore().root.childNodes;
        if(value==null || value.length<1) {
            store.filter(function(r) {
                return true;
            });
            gm.menuToggleFn(childs, 'up');
        } else {
            var items = store.root.data.children;
            var names = [];
            for(var i=0; i<items.length; i++) {
                var item = items[i];
                var name = item.text;
                
                var children = item.children;
                if(children!=null && children.length>0) {
                    for(var j=0; j<children.length; j++) {
                        var child = children[j];
                        var cName = child.text;
                        if(cName.indexOf(value) == 0) {
                            if(!names.includes(name)) {
                                names.push(name);
                            }
                            names.push(cName);
                        }
                    };
                };
            };

            store.filter(function(r) {
                var text = r.get('text');
                for(var i=0; i<names.length; i++) {
                    var name = names[i];
                    if(name == text) {
                        return true;
                    }
                }
            });

            gm.menuToggleFn(childs, 'down');
        }
    },
    saveLastMenu: function(link, text, menuCode, parentCode) {
        var arr = [];
        var o = {
            link:link,
            menuCode:menuCode,
            parentCode:parentCode,
            text:text,
        };
        arr.push(o);

        var jsonDatas = JSON.stringify(arr);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin.do?method=saveLastMenu',
            params:{
                jsonDatas:jsonDatas
            },
            success: function(val, action) {
                console.log('============= save last menu', 'success');
            },
            failure: function(val, action) {
                console.log('============= save last menu', 'failure');
            },
        });
    },
    checkLastMenu: function() {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin.do?method=getLastMenu',
            // params:{
                
            // },
            success: function(result, request) {
                var jsonData = Ext.JSON.decode(result.responseText);
                var result = Ext.JSON.decode(jsonData.result)[0];
                var childs = Ext.getCmp('menuTree').getStore().root.childNodes;

                var hidden = gm.mainTabs.getTabBar().hidden;
                if(hidden) {
                    gm.mainTabs.getTabBar().show();
                }

                var link = result['link'];
                var menuCode = result['menuCode'];
                var parentCode = result['parentCode'];
                var text = result['text'];

				gm.setSubColumn(menuCode);
				
                if(link==null||link.length<1 || 
                    menuCode==null||menuCode.length<1 ||
                        parentCode==null||parentCode.length<1 ||
                            text==null||text.length<1) {
                        return;
                    }

                for(var i=0; i<childs.length; i++) {
                    var child = childs[i];
                    var code = child.get('code');
                    if(code == parentCode) {
                        child.expand(true);
                        var children = child.get('children');
                        for(var j=0; j<children.length; j++) {
                            var c = children[j];
                            var _code = c.code;
                            if(_code == menuCode) {
                                Ext.getCmp('menuTree').setSelection(c);
                                break;
                            }
                        }
                        break;
                    }
                }

                if(this.selParentCode==null || this.selParentCode==undefined) {
                    this.selParentCode = parentCode;
                } else {
                    if(this.selParentCode != parentCode) {
                        this.selParentCode = parentCode;
                        gm.selMainTabs.removeAll();
                    }
                };
                gm.moveToMenu(link, text, menuCode);
                if(link!=null) {
                    var linkArr = link.split('.');
                    var len = linkArr.length;
                    gm.curLink = linkArr[len-1];
                    gu.link = menuCode;
                }

                // url 변경
                var hashTo = '#' + parentCode + ':' + menuCode;
                window.location.hash = hashTo;

                // Set Cur Menu
                // gm.setMenuCode(menuCode, text);
            },
            failure: function(result, request) {
                console.log('============= save last menu', 'failure');
            },
        });
    },
    setMenuCode: function(menu_code, text) {
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin.do?method=setMenuCode',
            params:{
                menu_code:menu_code,
                menu_name:text
            },
            success: function (result, request) {
                
            },
            // failure: extjsUtil.failureMessage
        });
    },
	setSubColumn: function(menu_code){
		Ext.Ajax.request({
			async: false,
			url: CONTEXT_PATH + '/master.do?method=readColumn',
            params:{
                sub_code:menu_code,
				orderBy:'tb_column.sort_no ASC'
            },
			success: function (result, request) {
				var rs = JSON.parse(result.responseText); rs = rs['datas'];
				var arry = [];
				for(var j=0; j<rs.length; j++) {
					var rec = rs[j];
					var unique_id = rec.unique_id;
					var data_index = rec.data_index;
					var menu_code = rec.menu_code;
					var menu_name = rec.name;
					var sort_no = rec.sort_no;
					var sortable = rec.sortable;
					var width = rec.width;
					var code_type = rec.code_type;
					var style = 'text-align:center;'
					var align = '';
					var type = 'string';
					var renderer = null;
									
					var set_object = null;
					if(rec.set_object!=null&&rec.set_object!=''){ set_object=JSON.parse(rec.set_object);}
									
					var search_yn = rec.search_yn;
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
						set_object:set_object,
						search_yn:search_yn
					};
				
					if(renderer!=null) {
					    obj['renderer'] = renderer;
					}
					arry.push(obj);
				}
				gMain.subcolumns=arry;
				
			}
		});	
	},
    launch: function() {
        // main panel 생성
        // this.createMainTabs();
        this.createSideMenu();
        // this.createMainView();
        this.createMainPanel();
        // viewport 생성
        this.createViewPort();

        Ext.History.init();

        // Main View Setting
        Ext.each(this.menuDatas, function(menu, index) {
            var menuCode = menu.menu_code;
            if(menuCode!=null && menuCode == 'HOME') {
                var link = menu.link;
                var newPanel = Ext.create(link, {
                    // title: text,
                    id: gu.id(menuCode + '-panel'),
                    linkPath:link,
                    menuCode:menuCode,
                    bodyStyle:'width:100%; height:100%;',
                    style:'width:100%; height:100%;',
                    width:'100%',
                    height:'100%'
                    // closable:true,
                    // columns:arry
                });
                Ext.getCmp('mainPanel').add(newPanel);
            }
        });
        
        // Last Menu Check
        // this.checkLastMenu();
    },

    onAfterRender: function(panel) {
        Ext.History.on('change', function(token) {	// history 가 변경되었을 경우 감시할 리스너
            console.log('==== token?', token);
        });
        var items = panel.items.items;
        if(items!=null && items.length>0) {
            var item = items[0];
            var id = item.id;
            Ext.History.add(id);	
        }
    }
});