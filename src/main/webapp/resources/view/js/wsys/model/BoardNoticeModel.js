Ext.define('Msys.model.BoardNoticeModel', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/master.do?method=readBoard&&not_in_type=V',
           },
           reader: {
               type: 'json',
               root: 'datas',
               totalProperty: 'count',
               successProperty: 'success',
               excelPath: 'excelPath'
           },
           writer: {
               type: 'singlepost',
               writeAllFields: false,
               root: 'datas'
           } 
   }
   });