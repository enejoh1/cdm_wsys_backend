Ext.define('Msys.model.WearingStateModel', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
                read: CONTEXT_PATH + '/stock.do?method=readWearingState',
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