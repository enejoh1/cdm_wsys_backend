Ext.define('Wsys.views.MainView', {
    extend:'Wsys.base.BaseView',
    initComponent: function() {
        var menu_list = [];
        Ext.each(gMain.menuDatas, function(data, index) {
            console.log('===data', data);
            var menuCode = data.menu_code;
            var menuName = data.menu_name;
            var icon = data.icon;
            var link = data.link;
            var type = data.type;
            var parent_code = data.parent_code;
            var child = data.children;

            // var obj = {
            //     html:menuName,
            //     code:menuCode,
            //     link:link,
            //     type:type,
            //     icon:icon,
            //     margin: '10 10 10 10'
            // };

            var image = {};
            var text = {};
            var container = {};

            if(menuCode!=null && menuCode!='HOME') {
                if(child!=null && child.length>0) {
                    Ext.each(child, function(c, i) {
                        var c_icon = c.icon;
                        if(c_icon==null) {
                            c_icon = icon;
                        }

                        image = {
                            xtype: 'image',
                            src: c_icon,
                            width:50, 
                            height:50,
                            info: {
                                link:c.link,
                                type:c.type,
                                icon:c.icon,
                                name:c.menu_name,
                                code:c.menu_code,
                                parentCode:c.parent_code,
                            },
                            listeners: {
                                el: {
                                    click: function() {
                                        var menu = this.component.info;
                                        gMain.moveToMenu(menu.link, menu.name, menu.code, menu.parentCode);
                                    }
                                }
                            },
                            
                        };

                        text = {
                            html:c.menu_name,
                            code:c.menu_code,
                            header :false,
                            info: {
                                link:c.link,
                                type:c.type,
                                icon:c.icon,
                                name:c.menu_name,
                                code:c.menu_code,
                                parentCode:c.parent_code,
                            },
                            style:'text-align:center;',
                            listeners: {
                                el: {
                                    click: function() {
                                        var menu = this.component.info;
                                        gMain.moveToMenu(menu.link, menu.name, menu.code, menu.parentCode);
                                    }
                                }
                            },
                        };
    
                        container = {
                            xtype:'container',
                            width:'100%',
                            height:'100%',
                            // layout: 'fit',
                            frame:true,
                            style:'text-align:center;',
                            // margin: '10 10 10 10',
                            items: [image, text],
                            
                        };
            
                        menu_list.push(container);
                    });
                } else {
                    image = {
                        xtype: 'image',
                        src: icon,
                        width:50, 
                        height:50,
                        info: {
                            link:link,
                            type:type,
                            icon:icon,
                            name:menuName,
                            code:menuCode,
                            parentCode:parent_code,
                        },
                        listeners: {
                            el: {
                                click: function() {
                                    var menu = this.component.info;
                                    gMain.moveToMenu(menu.link, menu.name, menu.code, menu.parentCode);
                                }
                            }
                        },
                        // style:'width:30px; height:50px;'
                    };
    
                    text = {
                        html:menuName,
                        code:menuCode,
                        header :false,
                        info: {
                            link:link,
                            type:type,
                            icon:icon,
                            name:menuName,
                            code:menuCode,
                            type:type,
                            parentCode:parent_code,
                        },
                        style:'text-align:center;',
                        listeners: {
                            el: {
                                click: function(a,b,c,d,e) {
                                    var menu = this.component.info;
                                    gMain.moveToMenu(menu.link, menu.name, menu.code, menu.parentCode);
                                }
                            }
                        },
                        // margin: '10 10 10 10'
                    };
    
                    container = {
                        xtype:'container',
                        width:'100%',
                        height:'100%',
                        // layout: 'fit',
                        frame:true,
                        style:'text-align:center;',
                        // margin: '10 10 10 10',
                        items: [image, text]
                    };
        
                    menu_list.push(container);
                }
            }
        });
        
        this.panel = Ext.create('Ext.panel.Panel', {
            id:gu.id('mainview'),
            autoScroll:true,
            scroll:true,
            region: 'center',
            width: '100%',
            height: '100%',
            bodyStyle:'width:100%; height:100%; padding:100px; border:1px solid;',
            style:'width:100%; height:100%;',
            frame:true,
            // bodyStyle:'margin:30; padding:30;',
            layout: {
                type: 'table',
                columns:3,
                tableAttrs: {
                    // bodyStyle: {padding: 150, margin:150,},
                    style: {
                       width: '100%',
                       height: '100%',
                    //    padding: '100%'
                    //    margin: '10 10 10 10',
                    //    backgroundColor:'blue'
                    },
                    // cellpadding: 0,
                    // cellspacing: 0
                },
            },
            defaults: {
                style:'border-radius:10px;width:100%; height:100%;',
                bodyStyle:'backgroundColor:#ece6b7; border-radius:10px;width:100%; height:100%;',
                frame : true,
                width:'100%',
                height:'100%',
            },
            items: menu_list,
        });

        Ext.apply(this, {
            // layout: 'border',
            items: this.panel
        });

        console.log('======? this', this);

        this.callParent(arguments);

        // this.store.load();
    }
})