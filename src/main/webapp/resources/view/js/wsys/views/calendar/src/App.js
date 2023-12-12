/*
 * This calendar application was forked from Ext Calendar Pro
 * and contributed to Ext JS as an advanced example of what can 
 * be built using and customizing Ext components and templates.
 * 
 * If you find this example to be useful you should take a look at
 * the original project, which has more features, more examples and
 * is maintained on a regular basis:
 * 
 *  http://ext.ensible.com/products/calendar
 */
Ext.define('Ext.calendar.App', {
    
    requires: [
        'Ext.Viewport',
        'Ext.layout.container.Border',
        'Ext.picker.Date',
        'Ext.calendar.util.Date',
        'Ext.calendar.CalendarPanel',
        'Ext.calendar.data.MemoryCalendarStore',
        'Ext.calendar.data.MemoryEventStore',
        'Ext.calendar.data.Events',
        'Ext.calendar.data.Calendars',
        'Ext.calendar.form.EventWindow'
    ],

    contents: '',
    
    constructor : function() {

        // Minor workaround for OSX Lion scrollbars
        this.checkScrollOffset();
        
//        var carTypeStore = Ext.create('Mplm.store.CarTypeStore', {} );
//        carTypeStore.load( function(records) {
//				console_logs('carTypeStore', records); 
//         });
        // This is an example calendar store that enables event color-coding
//        this.calendarStore = Ext.create('Ext.calendar.data.MemoryCalendarStore', {
//            data: gMain.carTypeStore.getCalData()
//        });
        
        this.calendarStore = gMain.carTypeStore;
        // switch(vCompanyReserved4) {
        //     case 'HJSV01KR':
        //         this.calendarStore = Ext.create('Mplm.store.MakePlanStore', {});
        //         break;
        // }
        
        var carTypeHtml = '<div style="background-color:#FFFFFF;"><br>';
 
        var myItems = this.calendarStore.data.items;
        
        console_logs('myItems', myItems);
        
        
    	for(var i=0; i< myItems.length; i++) {
    		var rec = myItems[i];
    		var id = Number(rec.getId());
    		var col = (id%9)+1;
        	carTypeHtml = carTypeHtml + '<div class="ext-color-'  + col + '-ad" style="margin-top:3px;font-weight:bold;width:100px;text-align:center;padding:2px;color:white;">[' + rec.get('systemCode') + '] ' + rec.get('codeName') +'</div>';
    	}
    	carTypeHtml = carTypeHtml +'</div>';
        
        // console_logs('carTypeHtml', carTypeHtml);
        
        // A sample event store that loads static JSON from a local file. Obviously a real
        // implementation would likely be loading remote data via an HttpProxy, but the
        // underlying store functionality is the same.
        this.eventStore = Ext.create('Ext.calendar.data.EventStore', {
            data: Ext.calendar.data.Events.getData()
        });
        
        this.contents = {
            items: [{
                id: 'calendarTitle',
                //title: '...', // will be updated to the current view's date range
                region: 'center',
                layout: 'border',
                listeners: {
                    'afterrender': function(){
                        //Ext.getCmp('app-center').header.addCls('app-center-header');
                    }
                },
                items: [{
                    xtype: 'container',
                    id:'app-west',
                    region: 'west',
                    border: false,
                    items: [                           
	                            {
			                        xtype: 'datepicker',
			                        id: 'app-nav-picker',
                                    cls: 'ext-cal-nav-picker',
                                    hidden:vCompanyReserved4 == 'HJSV01KR' || vCompanyReserved4 == 'DSMF01KR'
                                             ? true : false,
			                        listeners: {
			                            'select': {
			                                fn: function(dp, dt){
			                                    Ext.getCmp('app-calendar').setStartDate(dt);
			                                },
			                                scope: this
			                            }
			                        }
			                    }

			                    // , {
			                    // 	cls: 'carInfo',
			                    // 	html: carTypeHtml
			                    // }
                            
                            
                            ]
                },{
                    xtype: 'calendarpanel',
                    eventStore: this.eventStore,
                    calendarStore: this.calendarStore,
                    border: false,
                    frame:true,
                    id:'app-calendar',
                    region: 'center',
                    activeItem: 0,//dayView 3, // month view
                    monthViewCfg: {
                        showHeader: true,
                        showWeekLinks: true,
                        showWeekNumbers: true
                    },
                    listeners: {
                        'eventclick': {
                            fn: function(vw, rec, el){
                                this.showEditWindow(rec, el);
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventover': function(vw, rec, el){
                            //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventout': function(vw, rec, el){
                            //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventadd': {
                            fn: function(cp, rec){
                                this.showMsg('Event '+ rec.data.Title +' was added');
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function(cp, rec){
                            	console_logs('eventupdate', 'showMsg');
                                this.showMsg('Event '+ rec.data.Title +' was updated');
                            },
                            scope: this
                        },
                        'eventcancel': {
                            fn: function(cp, rec){
                                // edit canceled
                            },
                            scope: this
                        },
                        'viewchange': {
                            fn: function(p, vw, dateInfo){
                                if(this.editWin){
                                    this.editWin.hide();
                                }
                                if(dateInfo){
                                    // will be null when switching to the event edit form so ignore
                                    Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                    this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                }
                            },
                            scope: this
                        },
                        'dayclick': {
                            fn: function(vw, dt, ad, el){
                                this.showEditWindow({
                                    StartDate: dt,
                                    IsAllDay: ad
                                }, el);
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'rangeselect': {
                            fn: function(win, dates, onComplete){
                                this.showEditWindow(dates);
                                this.editWin.on('hide', onComplete, this, {single:true});
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventmove': {
                            fn: function(vw, rec){
                                var mappings = Ext.calendar.data.EventMappings,
                                    time = rec.data[mappings.IsAllDay.name] ? '' : ' \\a\\t g:i a';
                                
                                rec.commit();
                                
                                this.showMsg('Event '+ rec.data[mappings.Title.name] +' was moved to '+
                                    Ext.Date.format(rec.data[mappings.StartDate.name], ('F jS'+time)));
                            },
                            scope: this
                        },
                        'eventresize': {
                            fn: function(vw, rec){
                                rec.commit();
                                this.showMsg('Event '+ rec.data.Title +' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function(win, rec){
                                this.eventStore.remove(rec);
                                this.showMsg('Event '+ rec.data.Title +' was deleted');
                            },
                            scope: this
                        },
                        'initdrag': {
                            fn: function(vw){
                                if(this.editWin && this.editWin.isVisible()){
                                    this.editWin.hide();
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }]
        };
    },
       
        
    // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
    // This makes it very easy to swap it out with a different type of window or custom view, or omit
    // it altogether. Because of this, it's up to the application code to tie the pieces together.
    // Note that this function is called from various event handlers in the CalendarPanel above.
    showEditWindow : function(rec, animateTarget){
        if(!this.editWin){
            this.editWin = Ext.create('Ext.calendar.form.EventWindow', {
                calendarStore: this.calendarStore,
                listeners: {
                    'eventadd': {
                        fn: function(win, rec){
                        	console_logs('eventadd', 'showEditWindow');
                        	
                            win.hide();
                            rec.data.IsNew = false;
                            this.eventStore.add(rec);
                            this.eventStore.sync();
                            this.showMsg('Event '+ rec.data.Title +' was added');
                            location.reload();
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function(win, rec){
                        	
                        	console_logs('eventupdate', 'showEditWindow');
                            win.hide();
                            //rec.commit();
                            
                            //k1park add ajax 호출이 난되서 추가.
                            this.eventStore.add(rec);
                            this.eventStore.sync();
                            this.showMsg('Event '+ rec.data.Title +' was updated');
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function(win, rec){
                            this.eventStore.remove(rec);
                            this.eventStore.sync();
                            win.hide();
                            this.showMsg('Event '+ rec.data.Title +' was deleted');
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function(win, rec){
                            win.hide();
                            Ext.getCmp('app-calendar').showEditForm(rec);
                        }
                    }
                }
            });
        }
        this.editWin.show(rec, animateTarget);
    },
        
    // The CalendarPanel itself supports the standard Panel title config, but that title
    // only spans the calendar views.  For a title that spans the entire width of the app
    // we added a title to the layout's outer center region that is app-specific. This code
    // updates that outer title based on the currently-selected view range anytime the view changes.
    updateTitle: function(startDt, endDt){
        var fmt = Ext.Date.format;
        
    	var p = Ext.getCmp('calendarTitle');
        var cal = Ext.getCmp('sales-delivery-calendar');
        var cal_id = this.contents.items[0].id;
        if(cal == null || cal == undefined) {
            cal = Ext.getCmp(cal_id);
        }
    	var gridTitle = '';

        switch(vCompanyReserved4) {
            case 'KWLM01KR':
                gridTitle = '공휴일관리';
                break;
            case 'HJSV01KR':
            case 'DSMF01KR':
                gridTitle = '제작관리';
                break;
            default:
                gridTitle = '출하 캘린더';
                break;
        }
    	
    	if(gMain.checkPcHeight() && gMain.checkPcWidth()) {
	        if(p==null) {
	        	cal.setTitle(makeGridTitle(gridTitle + ' <span style="font-size:11px;font-weight:normal;">' + fmt(startDt, 'Y.m.d') + ' - ' + fmt(endDt, 'Y.m.d')) + '</span>');
	        } else {
	        	p.setTitle(fmt(startDt, 'Y.m.d') + ' - ' + fmt(endDt, 'Y.m.d'));
	        }
        
    	} else {
	        if(p==null && cal!=null) {
	        	cal.setTitle('<span style="font-size:11px;font-weight:normal;">' + fmt(startDt, 'Y.m.d') + ' - ' + fmt(endDt, 'Y.m.d') + '</span>');
	        } else {
	        	p.setTitle(fmt(startDt, 'Y.m.d') + ' - ' + fmt(endDt, 'Y.m.d'));
	        }
    	}
    	
    	
    	if(gMain.checkPcHeight() && gMain.checkPcWidth()) {
    		Ext.getCmp('app-west').show();
    	} else {
    		Ext.getCmp('app-west').hide();
    	}
    	
        
//        if(Ext.Date.clearTime(startDt).getTime() === Ext.Date.clearTime(endDt).getTime()){
//            p.setTitle(fmt(startDt, 'Y F d'));
//        }
//        else if(startDt.getFullYear() === endDt.getFullYear()){
//            if(startDt.getMonth() === endDt.getMonth()){
//                p.setTitle(fmt(startDt, 'F d') + ' - ' + fmt(endDt, 'Y d'));
//            }
//            else{
//                p.setTitle(fmt(startDt, 'F d') + ' - ' + fmt(endDt, 'Y F d'));
//            }
//        }
//        else{
//            p.setTitle(fmt(startDt, 'Y F d') + ' - ' + fmt(endDt, 'Y F d'));
//        }
    },
    
    // This is an application-specific way to communicate CalendarPanel event messages back to the user.
    // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
    // vary based on application requirements, which is why it's not baked into the CalendarPanel.
    showMsg: function(msg){
        Ext.fly('app-msg').update(msg).removeCls('x-hidden');
    },
    clearMsg: function(){
        Ext.fly('app-msg').update('').addCls('x-hidden');
    },
    
    // OSX Lion introduced dynamic scrollbars that do not take up space in the
    // body. Since certain aspects of the layout are calculated and rely on
    // scrollbar width, we add a special class if needed so that we can apply
    // static style rules rather than recalculate sizes on each resize.
    checkScrollOffset: function() {
        var scrollbarWidth = Ext.getScrollbarSize ? Ext.getScrollbarSize().width : Ext.getScrollBarWidth();
        
        // We check for less than 3 because the Ext scrollbar measurement gets
        // slightly padded (not sure the reason), so it's never returned as 0.
        if (scrollbarWidth < 3) {
            Ext.getBody().addCls('x-no-scrollbar');
        }
        if (Ext.isWindows) {
            Ext.getBody().addCls('x-win');
        }
    }
},
function() {
    /*
     * A few Ext overrides needed to work around issues in the calendar
     */
    
    Ext.form.Basic.override({
        reset: function() {
            var me = this;
            // This causes field events to be ignored. This is a problem for the
            // DateTimeField since it relies on handling the all-day checkbox state
            // changes to refresh its layout. In general, this batching is really not
            // needed -- it was an artifact of pre-4.0 performance issues and can be removed.
            //me.batchLayouts(function() {
                me.getFields().each(function(f) {
                    f.reset();
                });
            //});
            return me;
        }
    });
    
    // Currently MemoryProxy really only functions for read-only data. Since we want
    // to simulate CRUD transactions we have to at the very least allow them to be
    // marked as completed and successful, otherwise they will never filter back to the
    // UI components correctly.
    Ext.data.MemoryProxy.override({
        updateOperation: function(operation, callback, scope) {
            operation.setCompleted();
            operation.setSuccessful();
            Ext.callback(callback, scope || this, [operation]);
        },
        create: function() {
            this.updateOperation.apply(this, arguments);
        },
        update: function() {
            this.updateOperation.apply(this, arguments);
        },
        destroy: function() {
            this.updateOperation.apply(this, arguments);
        }
    });
});
