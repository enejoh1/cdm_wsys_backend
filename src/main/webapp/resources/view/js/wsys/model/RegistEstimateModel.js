Ext.define('Msys.model.RegistEstimateModel', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
				read: CONTEXT_PATH + '/sales.do?method=readEstMan',
				insert: CONTEXT_PATH + '/util/cud.do?method=insert',
	            update: CONTEXT_PATH + '/util/cud.do?method=update',
	            delete: CONTEXT_PATH + '/util/cud.do?method=delete'
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