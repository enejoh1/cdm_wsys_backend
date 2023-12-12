Ext.define('Msys.model.OrganTreeModel', {
    extend: 'Msys.model.Base',//추후 조직도 트리구조 만들때 개발
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/master.do?method=readOrgan',
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