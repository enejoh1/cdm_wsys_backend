Ext.define('Msys.views.master.ClassCodeMgmtView', {
    extend:'Msys.base.BaseView',
    initComponent: function() {
	
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

        this.addClassAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '추가',
            tooltip: '분류를 등록합니다.',
            handler: function() {
                gm.me().manageClassHandler('ADD');
            }
        });

        this.editClassAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: '수정',
            disabled: true,
            tooltip: '분류를 수정합니다.',
            handler: function() {
                gm.me().manageClassHandler('EDIT');
            }
        });

        this.copyClassAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-copy',
            text: '복사등록',
            disabled: true,
            tooltip: '분류를 복사등록합니다.',
            handler: function() {
                gm.me().manageClassHandler('COPY');
            }
        });

        this.removeClassAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '삭제',
            disabled: true,
            tooltip: '분류를 삭제합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().removeClassHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        buttonToolbar.insert(1, this.addClassAction);
        buttonToolbar.insert(2, this.editClassAction);
        buttonToolbar.insert(3, this.copyClassAction);
        buttonToolbar.insert(4, this.removeClassAction);

		//스토어 생성
        this.createStore('Msys.model.ClassCodeModel', gu.pageSize);
		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    id:gu.id('classLayout'),
					region: 'west',
					layout: 'fit',
					width: '40%',
                    resizable: true,
					items: this.createClassTree()
                },{
                    region: 'center',
                    width: '60%',
                    layout:'fit',
                    resizable: true,
					items: this.grid
                }
            ]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];
                    
                    gm.me().editClassAction.enable();
                    gm.me().copyClassAction.enable();
                    gm.me().removeClassAction.enable();
                } else {
                    gm.me().editClassAction.disable();
                    gm.me().copyClassAction.disable();
                    gm.me().removeClassAction.disable();
                }
            }
        });

        this.callParent(arguments);

        this.accountTypeStore.getProxy().setExtraParam('class_lv', 0);
        this.accountTypeStore.getProxy().setExtraParam('orderBy', 'sort_no asc');
        this.accountTypeStore.load();
        // this.store.load();

	},

    classSrchAction: Ext.create('Ext.Action', {
        xtype : 'button',
        iconCls: 'af-search',
        text: '검색',
        tooltip: '분류코드를 검색합니다.',
        handler: function() {
            gm.me().classTreeStore.load();
        }
    }),

    createClassTree: function() {
        this.classTreeStore = Ext.create('Msys.store.ClassTreeStore', {});
        this.classTreeStore.getProxy().setExtraParam('orderBy', 'sort_no asc');

        this.classGrid = Ext.create('Ext.tree.Panel', {
            id:gu.id('classGrid'),
            store:this.classTreeStore,
            useArrows: true,
            rootVisible: false,
            forceFit: true,
            rowLines: true,
            // selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            // multiSelect: true,
            viewConfig: {
                getRowClass : function(record, index) {
                    
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
            dockedItems: [
                {
                    dock : 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        this.classSrchAction, 
                        {
                            id: gu.id('search_account_type'),
                            name: 'account_type',
                            xtype: 'combo',
                            // fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                            store: this.accountTypeStore,
                            emptyText:'계정',
                            displayField: 'class_name',
                            valueField: 'unique_id',
                            typeAhead: false,
                            hideLabel: true,
                            minChars: 2,
                            width: 150,
                            listConfig: {
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목이 없습니다',
                                getInnerTpl: function () {
                                    return '<div data-qtip="{unique_id}">{class_name}</div>';
                                }
                            },
                            listeners: {
                                select: function (combo, record) {
                                    var unique_id = record.get('unique_id');
                                    gm.me().classTreeStore.getProxy().setExtraParam('unique_id', unique_id);
                                    gm.me().classTreeStore.load();
                                }
                            }
                        }
                    ],
                }
            ],
            columns:[
                {
                    xtype: 'treecolumn',
                    id:gu.id('assy_bom'),
                    text: 'Node',
                    width: 300,
                    autoSizeColumn: true,
                    sortable: true,
                    dataIndex: 'text'
                },{
                    text: '속성1',
                    dataIndex: 'status_kr1',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                },{
                    text: '속성2',
                    dataIndex: 'status_kr2',
                    width: 80,
                    style: 'text-align:center',
                    align: 'center',
                    stopSelection: false,
                }
            ]
        });

        this.classGrid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    var select = selections[0];
                    var unique_id = select.get('unique_id');

                    gm.me().store.getProxy().setExtraParam('parent_id', unique_id);
                    gm.me().store.load();
                } else {
                    
                }
            }
        });

        return this.classGrid;
    },

    manageClassHandler: function(type) {
        var type_kr = '';
        var select = null;
        var check = false;
        var overlap = false;
        switch(type) {
            case 'ADD':
                type_kr = '등록';
                overlap = false;
                break;
            case 'EDIT':
                type_kr = '수정';
                overlap = true;
                check = true;
                select = this.grid.getSelectionModel().getSelection()[0];
                break;
            case 'COPY':
                type_kr = '복사';
                overlap = false;
                check = true;
                select = this.grid.getSelectionModel().getSelection()[0];
                break;
        };

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('manage_class_form'),
            xtype: 'form',
            frame: false,
            width: 500,
            height: 300,
            border:true,
            width: '100%',
            layout:'column',
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    id:gu.id('manage_class_code'),
                    name:'class_code',
                    xtype:'textfield',
                    width:'80%',
                    allowBlank:false,
                    fieldLabel:'분류코드',
                    readOnly: type == 'EDIT' ? true : false,
                    fieldStyle: type == 'EDIT' ? 'background-color: #D6E8F6; background-image: none;' : null,
                    value: check == true ? select.get('class_code') : null
                },{
                    xtype:'button',
                    text:'중복확인',
                    disabled: type == 'EDIT' ? true : false,
                    width:'20%',
                    handler: function() {
                        var class_code = Ext.getCmp(gu.id('manage_class_code')).getValue();
                        if(class_code==null||class_code.length<1) {
                            Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                            overlap = false;
                            return;
                        };

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/itemmst.do?method=checkUniqueClassCode',
                            params:{
                                class_code:class_code
                            },
                            success: function (result, request) {
                                var result = Ext.decode(result.responseText);
                                var data = result.datas;

                                if(data>0) {
                                    Ext.MessageBox.alert('알림', '이미 등록된 분류코드입니다.');
                                    overlap = false;
                                } else {
                                    gm.me().eventNotice('알림', '사용가능한 분류코드입니다.');
                                    overlap = true;
                                }
                            },
                            // failure: extjsUtil.failureMessage
                        });
                    }
                },{
                    id:gu.id('manage_class_name'),
                    name:'class_name',
                    xtype:'textfield',
                    fieldLabel:'분류명',
                    allowBlank:false,
                    width:'100%',
                    value: check == true ? select.get('class_name') : null
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: type_kr,
            width: 500,
            height: 300,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    if(!overlap) {
                        Ext.MessageBox.alert('알림', '중복확인을 해주세요.');
                        return;
                    }
                    var form = Ext.getCmp(gu.id('manage_class_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);
                        var classRec = gm.me().classGrid.getSelectionModel().getSelection()[0];
                        var unique_id = null;
                        var parent_id = null;
                        var class_lv = classRec.get('class_lv') + 1;
                        var class_group = classRec.get('class_group');
                        var sort_no = gm.me().store.data.items.length + 1;
                        sort_no = sort_no * 10;

                        switch(type) {
                            case 'ADD':
                                parent_id = classRec.get('unique_id');
                                break;
                            case 'EDIT':
                                unique_id = select.get('unique_id');
                                break;
                            case 'COPY':
                                parent_id = classRec.get('unique_id');
                                break;
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/itemmst.do?method=manageClassData',
                            params:{
                                unique_id:unique_id,
                                parent_id:parent_id,
                                class_code:val['class_code'],
                                class_name:val['class_name'],
                                class_lv:class_lv,
                                class_group:class_group,
                                sort_no:sort_no
                            },
                            success: function(val, action) {
                                // gm.me().classTreeStore.load();
                                gm.me().store.load();
                                win.close();
                            },
                            // failure: extjsUtil.failureMessage
                        });
                    } else {
                        Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
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

    removeClassHandler: function() {
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var uids = [];
        for(var i=0; i<selections.length; i++) {
            var select = selections[i];
            var unique_id = select.get('unique_id');
            uids.push(unique_id);
        };

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/itemmst.do?method=removeClassData',
            params:{
                unique_id:unique_id
            },
            success: function(val, action) {
                gm.me().store.load();
            },
            // failure: extjsUtil.failureMessage
        });
    },

    accountTypeStore:Ext.create('Msys.store.ClassStore'),
})