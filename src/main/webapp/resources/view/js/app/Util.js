Ext.define('Wsys.app.Util', {
    treeMenus:null,
    selectedMenuId:null,
    menuList:null,
    link:null,
    pageSize:300,
    id: function(id) {
        var link = '';
        if(this.link != null) link = this.link;
    	return link + '-' + id;
    },
});