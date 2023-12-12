Ext.define('Msys.base.BaseGrid', {
    extend: 'Ext.grid.Panel',
    requires: ['Msys.util.SearchTrigger'],
    region: 'center',
    border: true,
    resizable: true,
    scroll: true,
    columnLines:true,
    multiSelect: true,
    collapsible: false,
    listeners: {
        columnresize: function(header, column, width) {
            gMain.resizeColumnSize(column, width);
        },
        cellkeydown: function(table, td, columnIndex, record, tr, rowIndex, e)  {
            if (e.ctrlKey && e.getKey() == 67) {
                var value = td.innerText;
                var tempElem = document.createElement('textarea');
                tempElem.value = value;  
                document.body.appendChild(tempElem);
    
                tempElem.select();
                document.execCommand("copy");
                document.body.removeChild(tempElem);
            }
        }
    },
});
