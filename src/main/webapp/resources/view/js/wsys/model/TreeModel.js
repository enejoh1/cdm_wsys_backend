Ext.define('Msys.model.TreeModel', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/design.do?method=readAssemblyList',
           },
           reader: {
                type: 'json',
                root: 'datas'
           },
           writer: {
                type: 'json'
           } 
   }
   });