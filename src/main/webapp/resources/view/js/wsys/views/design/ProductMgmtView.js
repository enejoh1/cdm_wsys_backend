Ext.define('Msys.views.design.ProductMgmtView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
	
        console.log('MSYS Views design ProductMgmtView', this.columns);

        var buttonToolbar = this.createButtonToolbar();
        var searchToolbar = this.createSearchToolbar();
        var options = [];

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4) {
                buttonToolbar.items.remove(item);
            }
        });

        this.addItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-plus-circle',
            text: '추가',
            tooltip: '제품을 등록합니다.',
            handler: function() {
                gm.me().manageItemHandler('ADD');
            }
        });

        this.editItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-edit',
            text: '수정',
            disabled: true,
            tooltip: '제품을 수정합니다.',
            handler: function() {
                gm.me().manageItemHandler('EDIT');
            }
        });

        this.copyItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-copy',
            text: '복사등록',
            disabled: true,
            tooltip: '제품을 복사등록합니다.',
            handler: function() {
                gm.me().manageItemHandler('COPY');
            }
        });

        this.removeItemAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-remove',
            text: '삭제',
            disabled: true,
            tooltip: '제품을 삭제합니다.',
            handler: function() {
                Ext.MessageBox.show({
                    title: '삭제',
                    msg: '선택한 항목을 삭제하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().removeItemHandler,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        buttonToolbar.insert(1, this.addItemAction);
        buttonToolbar.insert(2, this.editItemAction);
        buttonToolbar.insert(3, this.copyItemAction);
        buttonToolbar.insert(4, this.removeItemAction);

		//스토어 생성
        this.createStore('Msys.model.ProductMgmtModel', gu.pageSize);

		//그리드 생성
        this.createBaseGrid(buttonToolbar, searchToolbar, options);

        /*
        Ext.each(cols, function(col, index) {
            var dataIndex = col.dataIndex;

            switch(dataIndex) {
                case 'col1':
                    col['align']  = 'center';
                    col['style']  = 'text-align:center;';
                    break;
            }
        });*/

        Ext.apply(this, {
            layout: 'border',
            items: this.grid
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(s, selections) {
                if(selections.length) {
                    console.log('Grid Callback Selections', selections);
                    var select = selections[0];

                    gm.me().editItemAction.enable();
                    gm.me().copyItemAction.enable();
                    gm.me().removeItemAction.enable();
                } else {
                    gm.me().editItemAction.disable();
                    gm.me().copyItemAction.disable();
                    gm.me().removeItemAction.disable();
                }
            }
        });

        this.callParent(arguments);

        var account_type_list = [];
        account_type_list.push('P'); account_type_list.push('O');
        this.store.getProxy().setExtraParam('account_type_list', account_type_list);
        this.store.load();

        this.accountTypeStore.getProxy().setExtraParam('class_lv', 1);
        this.classStore1.getProxy().setExtraParam('class_lv', 1);
        this.classStore2.getProxy().setExtraParam('class_lv', 2);
        this.classStore3.getProxy().setExtraParam('class_lv', 3);
        this.classStore4.getProxy().setExtraParam('class_lv', 4);
        this.classStore5.getProxy().setExtraParam('class_lv', 5);
        
        this.classStore1.getProxy().setExtraParam('class_group', 'PRODUCT');
        this.classStore2.getProxy().setExtraParam('class_group', 'PRODUCT');
        this.classStore3.getProxy().setExtraParam('class_group', 'PRODUCT');
        this.classStore4.getProxy().setExtraParam('class_group', 'PRODUCT');
        this.classStore5.getProxy().setExtraParam('class_group', 'PRODUCT');

        this.ynTypeStore.load();
        this.makerListStore.load();

        this.accountTypeStore.load();
        this.classStore1.load();
        this.classStore2.load();
        this.classStore3.load();
        this.classStore4.load();
        this.classStore5.load();

        this.pcsMstStore.getProxy().setExtraParam('pcs_lv', 0);
        this.pcsMstStore.load();
	},

    manageItemHandler: function(type) {
        var select = gm.me().grid.getSelectionModel().getSelection()[0];
        var type_kr = '';
        var type_check = false;
        var uniqueCheck = false;
        switch(type) {
            case 'ADD':
                type_kr = '등록';
                type_check = false;
                uniqueCheck = false;
                break;
            case 'EDIT':
                type_kr = '수정';
                type_check = true;
                uniqueCheck = true;
                break;
            case 'COPY':
                type_kr = '복사등록';
                type_check = false;
                uniqueCheck = false;
                break;
        }

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('manage_item_form'),
            xtype: 'form',
            frame: false,
            border:true,
            width: '100%',
            layout:'column',
            bodyPadding: 10,
            items: [
                new Ext.form.Hidden({
                    name: 'type',
                    value: type
                }),
                new Ext.form.Hidden({
                    name: 'unique_id',
                    value: type == 'EDIT' ? select.get('unique_id') : -1
                }),
                {
                    xtype:'textfield',
                    id:gu.id('manage_item_code'),
                    name:'item_code',
                    padding: '0 0 5px 0',
                    width:'85%',
                    allowBlank:false,
                    readOnly:type_check == true ? true : false,
                    fieldLabel:'<font color=red>*</font>품번',
                    fieldStyle: type_check == true ? 'background-color: #ddd; background-image: none;' : '',
                    value:type=='EDIT'||type=='COPY' ? select.get('item_code') : ''
                },{
                    xtype:'button',
                    text:'중복확인',
                    handler: function() {
                        var item_code = Ext.getCmp(gu.id('manage_item_code')).getValue();
                        if(item_code==null || item_code.length<1) {
                            Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                            uniqueCheck = false;
                            return;
                        }

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/design.do?method=checkUniqueItemCode',
                            params:{
                                item_code:item_code
                            },
                            success: function (result, request) {
                                var result = Ext.decode(result.responseText);
                                var data = result.datas;

                                if(data>0) {
                                    Ext.MessageBox.alert('알림', '이미 등록된 품번입니다.');
                                    uniqueCheck = false;
                                } else {
                                    gm.me().eventNotice('알림', '사용가능한 품번입니다.');
                                    uniqueCheck = true;
                                }
                            },
                            // failure: extjsUtil.failureMessage
                        });
                    }
                },{
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '제품정보',
                    width: '100%',
                    style: 'padding:10px',
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
                            // margin: '0 10 10 1',
                            border:true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items: [
                                {
                                    xtype:'combo',
                                    id:gu.id('manage_account_type'),
                                    name:'account_type',
                                    mode: 'local',
                                    padding: '0 0 5px 0',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '계정',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'code_name',
                                    valueField: 'code_value',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().accountTypeStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('account_type') : 'P'
                                },{
                                    xtype:'combo',
                                    id:gu.id('manage_class_1'),
                                    name:'class_1',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '대분류',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'class_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().classStore1,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var id = record.get('unique_id');
                                            gm.me().classStore2.getProxy().setExtraParam('parent_id', id);
                                            gm.me().classStore2.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('class_1') > -1 ? select.get('class_1') : '' : ''
                                }, {
                                    xtype:'combo',
                                    id:gu.id('manage_class_2'),
                                    name:'class_2',
                                    mode: 'local',
                                    padding: '0 0 5px 0',
                                    fieldLabel: '중분류',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'class_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().classStore2,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var id = record.get('unique_id');
                                            gm.me().classStore3.getProxy().setExtraParam('parent_id', id);
                                            gm.me().classStore3.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('class_2') > -1 ? select.get('class_2') : '' : ''
                                }, {
                                    xtype:'combo',
                                    id:gu.id('manage_class_3'),
                                    name:'class_3',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '소분류',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'class_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().classStore3,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">[{class_code}] <small><font color=blue>{class_name}</font></small></div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            var id = record.get('unique_id');
                                            gm.me().classStore4.getProxy().setExtraParam('parent_id', id);
                                            gm.me().classStore4.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('class_3') > -1 ? select.get('class_3') : '' : ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_item_name'),
                                    name:'item_name',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'<font color=red>*</font>품명',
                                    value:type=='EDIT'||type=='COPY' ? select.get('item_name') : ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_specification'),
                                    name:'specification',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    allowBlank:false,
                                    fieldLabel:'<font color=red>*</font>규격',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('specification') : ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_model_no'),
                                    name:'model_no',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'모델번호',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('model_no') : ''
                                }, {
                                    xtype:'combo',
                                    id:gu.id('manage_maker_uid'),
                                    name:'maker_uid',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '제조사',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    // emptyText: '선택',
                                    displayField: 'code_name',
                                    valueField: 'unique_id',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().makerListStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{unique_id}">{code_name}</div>';
                                        }
                                    }, 
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('maker_uid') > -1 ? select.get('maker_uid') : '' : ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_unit_code'),
                                    name:'unit_code',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'단위',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('unit_code') : 'EA'
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_currency'),
                                    name:'currency',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'통화',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('currency') : 'KRW'
                                }, {
                                    xtype:'combo',
                                    id:gu.id('manage_pcs_code'),
                                    name:'pcs_code',
                                    mode: 'local',
                                    padding: '0 0 5px 0',
                                    // fieldLabel: '<font color=red>*</font>계정',
                                    fieldLabel: '공정',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    displayField: 'pcs_name',
                                    valueField: 'pcs_code',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().pcsMstStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{pcs_code}">{pcs_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('pcs_code') : null
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('manage_std_sell_price'),
                                    name:'std_sell_price',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'표준판매단가',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('std_sell_price') : ''
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('manage_std_pur_price'),
                                    name:'std_pur_price',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'표준구매단가',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('std_pur_price') : ''
                                }, {
                                    xtype:'combo',
                                    id:gu.id('manage_tax_free'),
                                    name:'tax_free',
                                    mode: 'local',
                                    padding: '0 0 5px 30px',
                                    fieldLabel: '비과세 여부',
                                    fieldStyle: 'background-image: none;',
                                    width:'45%',
                                    queryMode: 'remote',
                                    emptyText: '선택',
                                    displayField: 'code_name',
                                    valueField: 'code_value',
                                    typeAhead: false,
                                    minChars: 1,
                                    store: gm.me().ynTypeStore,
                                    listConfig: {
                                        getInnerTpl: function () {
                                            return '<div data-qtip="{code_value}">{code_name}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function (combo, record) {
                                            // Ext.getCmp('sg_code').setValue(null);
                                            // Ext.getCmp('class_code').setValue(null);
                                            // var value = combo.value;
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('level1', 2);
                                            // gm.me().claastStoreDetail.getProxy().setExtraParam('parent_class_code', value);
                                            // gm.me().claastStoreDetail.load();
                                        }
                                    },
                                    value:type=='EDIT'||type=='COPY' ? select.get('tax_free') : 'N'
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_description'),
                                    name:'description',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'설명',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('description') : ''
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '추가정보',
                    width: '100%',
                    style: 'padding:10px',
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
                            // margin: '0 10 10 1',
                            border:true,
                            defaultMargins: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 10
                            },
                            items:[
                                {
                                    xtype:'textfield',
                                    id:gu.id('manage_itemmst1'),
                                    name:'itemmst1',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'추가정보1',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('itemmst1') : ''
                                }, {
                                    xtype:'textfield',
                                    id:gu.id('manage_itemmst2'),
                                    name:'itemmst2',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'추가정보2',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('itemmst2') : ''
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('manage_itemmst3'),
                                    name:'itemmst3',
                                    padding: '0 0 5px 0',
                                    width:'45%',
                                    fieldLabel:'추가정보3',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('itemmst3') : ''
                                }, {
                                    xtype:'numberfield',
                                    id:gu.id('manage_itemmst4'),
                                    name:'itemmst4',
                                    padding: '0 0 5px 30px',
                                    width:'45%',
                                    fieldLabel:'추가정보4',
                                    // fieldStyle: type=='edit' ? 'background-color: #ddd; background-image: none;' : '',
                                    // readOnly:type=='edit' ? true : false,
                                    value:type=='EDIT'||type=='COPY' ? select.get('itemmst4') : ''
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        var win = Ext.create('Ext.Window', {
            modal: false,
            title: type_kr,
            width: 800,
            height: 500,
            plain: true,
            layout:'fit',
            items: [
                form
            ],
            buttons: [{
                text: '확인',
                handler: function(btn) {
                    var form = Ext.getCmp(gu.id('manage_item_form')).getForm();
                    if(form.isValid()) {
                        var val = form.getValues(false);

                        form.submit({
                            url: CONTEXT_PATH + '/design.do?method=manageItemData',
                            params: val,
                            success: function(val, action) {
                                gm.me().store.load();
                                if(win) win.close();
                            },
                            failure: function(val, action) {
                                Ext.MessageBox.alert('알림', '입력값을 확인해주세요.');
                                return;
                            }
                        });

                        // Ext.Ajax.request({
                        //     url: CONTEXT_PATH + '/design.do?method=manageItemData',
                        //     params:{
                        //         item_id:val['item_id'],
                        //         bom_lv:val['bom_lv'],
                        //         bom_no:val['bom_no'],
                        //         unit_quan:val['unit_quan'],
                        //         parent_id:val['parent_id'],
                        //         top_bom_id:top_bom_id,
                        //         pj_uid:-1
                        //     },
                        //     success: function(val, action) {
                        //         gm.me().store.load();
                        //         win.close();
                        //     },
                        //     // failure: extjsUtil.failureMessage
                        // });
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

    removeItemHandler: function(btn) {
        if(btn == 'yes') {
            var select = gm.me().grid.getSelectionModel().getSelection()[0];
            var unique_id = select.get('unique_id');
    
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/design.do?method=removeItemData',
                params:{
                    unique_id:unique_id
                },
                success: function(val, action) {
                    gm.me().store.load();
                },
                // failure: extjsUtil.failureMessage
            });
        }
    },

    accountTypeStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'PROUDCT_ACCOUNT'}),
    pcsMstStore:Ext.create('Msys.store.PcsMstStore'),
    classStore1:Ext.create('Msys.store.ClassStore'),
    classStore2:Ext.create('Msys.store.ClassStore'),
    classStore3:Ext.create('Msys.store.ClassStore'),
    classStore4:Ext.create('Msys.store.ClassStore'),
    classStore5:Ext.create('Msys.store.ClassStore'),
    ynTypeStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'YN_TYPE'}),
    makerListStore:Ext.create('Msys.store.CommonCodeStore', {code_group:'MAKER_LIST'}),
})