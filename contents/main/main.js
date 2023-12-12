Ext.onReady(function () {
	alert('main js');
    gUtil = Ext.create('Wsys.app.Util', {});
    gu = gUtil;

    var treeMenus = Ext.JSON.decode(treeMenuList);

    gu.treeMenus = treeMenus;

    gMain = Ext.create('Wsys.app.Main');
    gm = gMain;
    gMain.launch();

    // window.onbeforeunload = function () {
    //     return '메세지 내용';
    // };
});

function refreshMain() {
    window.location.reload();
}

function logout() {
	Ext.create("Ext.Window", {
        title: "확인",
        bodyStyle: "padding:20px;",
        width: 220,
        height: 150,
        html: '로그아웃 하시겠습니까?',
        buttons: [
            {
                text: "예", handler: function () {
	                Ext.getBody().mask('종료중입니다.');
	                this.up('window').close();
	                
	                var action_para = vCONTEXT_PATH + '/index/login.do?method=logout';
	                document.GeneralBaseForm1.action = action_para;
	                document.GeneralBaseForm1.submit();
            	}
            },
            {
                text: "아니오", handler: function () {
                this.up('window').close();
            	}
            }
        ]
    }).show();
}
