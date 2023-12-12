Ext.define('Msys.model.TreeModelClassCode', {
    extend: 'Msys.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/itemmst.do?method=readClassTreeData',
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