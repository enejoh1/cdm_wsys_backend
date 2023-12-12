Ext.define('Msys.views.finance.AccountListView', {
    extend:'Msys.base.BaseView',
    // xtype:'PJ_REGIST',
    initComponent: function() {
        console.log('MSYS Views Finance AccountListView');

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

        // (buttonToolbar.items).each(function(item,index,length){
        //     if(index==1||index==2||index==3||index==4) {
        //         buttonToolbar.items.remove(item);
        //     }
        // });

        // buttonToolbar.insert(1, this.deliveryConfirmAction);

        // this.createStore('Msys.model.DeliveryWaitModel', gu.pageSize);
        // this.createBaseGrid(buttonToolbar, searchToolbar, options);

        // var cols = this.grid.columns;

        // Ext.each(cols, function(col, index) {
        //     var dataIndex = col.dataIndex;

        //     // switch(dataIndex) {
                
        //     // }
        // });

        var accountStore = Ext.create("Ext.data.Store",{
            fields : ['bank_code', 'bank_name', 'back_img', 'account_number', 'account_comment', 'remain_amount', 'last_date'],
            data: [
                {bank_code:'NH', bank_name:'농협', back_img:gCONTENT_PATH + '/xdview/resources/images/bank_logo/nh_bank_logo.png', 
                 account_number:'111-222-3141254', account_comment:'기타 코멘트1', remain_amount:24320, last_date:'2021-10-12 17:02:03'
                },
                {bank_code:'KB', bank_name:'KB국민은행', back_img:gCONTENT_PATH + '/xdview/resources/images/bank_logo/kb_bank_logo.png', 
                 account_number:'333-756-123142', account_comment:'기타 코멘트2', remain_amount:412340, last_date:'2021-10-12 16:05:13'
                },
                {bank_code:'IBK', bank_name:'IBK기업은행', back_img:gCONTENT_PATH + '/xdview/resources/images/bank_logo/ibk_bank_logo.png', 
                 account_number:'444-134-412434', account_comment:'기타 코멘트3', remain_amount:35167450, last_date:'2021-10-12 15:22:13'
                },
                {bank_code:'NH', bank_name:'농협', back_img:gCONTENT_PATH + '/xdview/resources/images/bank_logo/nh_bank_logo.png', 
                 account_number:'111-346-745643', account_comment:'기타 코멘트4', remain_amount:441231220, last_date:'2021-10-12 09:56:21'
                },
                {bank_code:'IBK', bank_name:'IBK기업은행', back_img:gCONTENT_PATH + '/xdview/resources/images/bank_logo/ibk_bank_logo.png', 
                 account_number:'444-675-52341', account_comment:'기타 코멘트5', remain_amount:33112100, last_date:'2021-10-12 14:22:30'
                },
            ]
        });

        var items = [];
        var accountRecords = accountStore.data.items;
        for(var i=0; i<accountRecords.length; i++) {
            var account = accountRecords[i];

            var bank_code = account.get('bank_code');
            var bank_name = account.get('bank_name');
            var back_img = account.get('back_img');
            var account_number = account.get('account_number');
            var account_comment = account.get('account_comment');
            var remain_amount = account.get('remain_amount');
            var last_date = account.get('last_date');

            remain_amount = Ext.util.Format.number(parseFloat(remain_amount),'0,000.##');

            var obj = {};

            var html = '<div class="account">' + 
            ' <div class="account_title">' +
            '  <div class="account_logo"><img src=' + back_img + ' alt="' + bank_name + '" style="width: 100%; height: 100%"></div>' +
            '  <div class="account_info">' +
            '   <div style="font-weight:bold; font-size:20px;">' + bank_name + '</div>' +
            '   <div style="font-size:14px; margin-top: 3px;">' + account_number + '</div>' +
            '   <div style="font-size:14px; margin-top: 3px;">' + account_comment + '</div>' +
            '  </div>' +
            ' </div>' +
            ' <div class="account_content">' +
               remain_amount + '원' +
            '  <div class="account_lastdate">' +
            '   최종수집일시' +  last_date +
            '  </div>' +
            ' </div>' +
            '</div>'
            ;

            obj['width'] = 400;
            obj['height'] = 150;
            obj['margin'] = '10 10 10 10';
            obj['html'] = html;

            items.push(obj);
        }

        var imgUrl = gCONTENT_PATH + '/xdview/resources/images/bank_logo/nh_bank_logo.png';

        var panel = Ext.create("Ext.Panel",{
            title:'전계좌조회',
            autoScroll:true,
            scroll:true,
            region: 'center',
            width: '100%',
            height: '100%',
            frame:true,
            layout: {
                type: 'table',
                columns:3
            },
            defaults: {
                style:'border-radius:10px;',
                bodyStyle:'backgroundColor:#ece6b7; border-radius:10px;',
                frame : true,
            },
            items: items
            // [
            //     {
            //         html:'<div class="account">' + 
            //         ' <div class="account_title">' +
            //         '  <div class="account_logo"><img src=' + imgUrl + ' alt="농협" style="width: 100%; height: 100%"></div>' +
            //         '  <div class="account_info">' +
            //         '   <div style="font-weight:bold; font-size:20px;">농협</div>' +
            //         '   <div style="font-size:14px; margin-top: 3px;">1322-222-111</div>' +
            //         '   <div style="font-size:14px; margin-top: 3px;">기타 코멘트</div>' +
            //         '  </div>' +
            //         ' </div>' +
            //         ' <div class="account_content">' +
            //         '  24,326 원' +
            //         '  <div class="account_lastdate">' +
            //         '   최종수집일시 2021-10-12 15:39:24' +
            //         '  </div>' +
            //         ' </div>' +
            //         '</div>',
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     }, {
            //         html:2,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     }, {
            //         html:3,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     }, {
            //         html:4,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     }, {
            //         html:5,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     }, {
            //         html:6,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     },  {
            //         html:7,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     },  {
            //         html:8,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     },  {
            //         html:9,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     },  {
            //         html:10,
            //         width:400,
            //         height:150,
            //         margin: '10 10 10 10'
            //     }, 
            // ]
     
        });
    
        Ext.apply(this, {
            layout: 'border',
            items: panel
        });

        // this.grid.getSelectionModel().on({
        //     selectionchange: function(s, selections) {
        //         if(selections.length) {
        //             console.log('Grid Callback Selections', selections);
        //             var select = selections[0];
        //             var unique_id = select.get('unique_id');
                    
        //         } else {
                    
        //         }
        //     }
        // });

        this.callParent(arguments);
    },

    // unitManStore:Ext.create('Msys.store.UnitManStore', {}),
})