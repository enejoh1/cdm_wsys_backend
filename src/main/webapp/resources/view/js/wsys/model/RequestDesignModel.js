Ext.define('Msys.model.RequestDesignModel', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
				read: CONTEXT_PATH + '/design.do?method=readDrhMan',
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