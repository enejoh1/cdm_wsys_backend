Ext.define('Msys.model.TreeModelProduceBom', {
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