Ext.define('Msys.model.ApprovalModel', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
				read: CONTEXT_PATH + '/aprv.do?method=readAprvMan',
				insert: CONTEXT_PATH + '/util/cud.do?method=insert',
	            update: CONTEXT_PATH + '/util/cud.do?method=update',
	            delete: CONTEXT_PATH + '/util/cud.do?method=delete'
				//destroy: CONTEXT_PATH + '/admin/board.do?method=destroy'
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