Ext.define('Ext.calendar.data.Events', {

    statics: {
        getData: function() {
            var today = Ext.Date.clearTime(new Date()), 
                makeDate = function(d, h, m, s) {
                    d = d * 86400;
                    h = (h || 0) * 3600;
                    m = (m || 0) * 60;
                    s = (s || 0);
                    return Ext.Date.add(today, Ext.Date.SECOND, d + h + m + s);
                };
                
            return {
                "evts": [{
                    "id": 1001,
                    "cid": 1,
                    "title": "현대쇼핑",
                    "start": makeDate(0, 10),
                    "end": makeDate(0, 15),
                    "notes": "현대쇼핑 #DEF4563"
                }, {
                    "id": 1002,
                    "cid": 2,
                    "title": "신세계",
                    "start": makeDate(0, 11, 30),
                    "end": makeDate(0, 13),
                    "loc": "Chuy's!",
                    "url": "http://chuys.com",
                    "notes": "Order the queso",
                    "rem": "15"
                }, {
                    "id": 1003,
                    "cid": 3,
                    "title": "농협",
                    "start": makeDate(0, 15),
                    "end": makeDate(0, 15)
                }, {
                    "id": 1004,
                    "cid": 1,
                    "title": "성주사과",
                    "start": today,
                    "end": today,
                    "notes": "Need to get a gift",
                    "ad": true
                }, {
                    "id": 1005,
                    "cid": 2,
                    "title": "교보문고",
                    "start": makeDate(0),
                    "end": makeDate(0, 0, 0, -1),
                    "ad": true
                }, {
                    "id": 1006,
                    "cid": 3,
                    "title": "충주감귤",
                    "start": makeDate(0),
                    "end": makeDate(0, 0, 0, -1),
                    "ad": true,
                    "rem": "2880"
                }, {
                    "id": 1007,
                    "cid": 1,
                    "title": "서울상회",
                    "start": makeDate(0, 9),
                    "end": makeDate(0, 9, 30),
                    "notes": "Get cash on the way"
                }, {
                    "id": 1008,
                    "cid": 3,
                    "title": "오 쇼핑",
                    "start": makeDate(-1),
                    "end": makeDate(-1),
                    "ad": true
                }, {
                    "id": 1009,
                    "cid": 2,
                    "title": "한국전자",
                    "start": makeDate(-2, 13),
                    "end": makeDate(-2, 18),
                    "loc": "ABC Inc.",
                    "rem": "60"
                }, {
                    "id": 1010,
                    "cid": 3,
                    "title": "가희물산",
                    "start": makeDate(3),
                    "end": makeDate(3, 0, 0, -1),
                    "ad": true
                }, {
                    "id": 1011,
                    "cid": 1,
                    "title": "중국수출",
                    "start": makeDate(2, 19),
                    "end": makeDate(2, 23),
                    "notes": "Don't forget the tickets!",
                    "rem": "60"
                }]
            }
        }
    }
});
