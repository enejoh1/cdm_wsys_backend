/**
 * @class Ext.calendar.form.EventWindow
 * @extends Ext.Window
 * <p>A custom window containing a basic edit form used for quick editing of events.</p>
 * <p>This window also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.EventWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.eventeditwindow',
    
    requires: [
        'Ext.form.Panel',
        'Ext.calendar.util.Date',
        'Ext.calendar.data.EventModel',
        'Ext.calendar.data.EventMappings'
    ],
    
    selected_date: null,

    constructor: function(config) {
        var formPanelCfg = null;
        switch(vCompanyReserved4) {
            case 'HJSV01KR':
                    formPanelCfg = {
                        xtype: 'form',
                        fieldDefaults: {
                            msgTarget: 'side',
                            labelWidth: 65
                        },
                        frame: false,
                        bodyStyle: 'background:transparent;padding:5px 10px 10px;',
                        bodyBorder: false,
                        border: false,
                        items: [{
                                itemId: 'title',
                                name: Ext.calendar.data.EventMappings.Title.name,
                                fieldLabel: '고객사', //'Title',
                                xtype: 'textfield',
                                allowBlank: false,
                                emptyText: '고객사', //'Event Title',
                                anchor: '100%'
                            },{
                                itemId: 'reminder',
                                name: Ext.calendar.data.EventMappings.Reminder.name,
                                fieldLabel: '제품명', //'Title',
                                xtype: 'textfield',
                                allowBlank: true,
                                emptyText: '제품명', //'Event Title',
                                anchor: '100%'
                            },
                            new Ext.form.TextArea({
                                fieldLabel: '상세설명', //'Notes',
                                name: Ext.calendar.data.EventMappings.Notes.name,
                                grow: true,
                                growMax: 150,
                                anchor: '100%',
                                fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                                readOnly: true
                            }),
                            new Ext.form.Text({
                                fieldLabel: '배송지', //'Location',
                                name: Ext.calendar.data.EventMappings.Location.name,
                                anchor: '100%'
                            }),
                            new Ext.form.Text({
                                fieldLabel: '납품수량', //'Web Link',
                                name: Ext.calendar.data.EventMappings.Url.name,
                                anchor: '100%'
                            }),
                            {
                                xtype: 'daterangefield',
                                itemId: 'date-range',
                                name: 'dates',
                                anchor: '100%',
                                parentForm: this,
                                fieldLabel: '배송일시', //'When'
                            }
                        ]
                    };
    
                    if (config.calendarStore) {
                        this.calendarStore = config.calendarStore;
                        delete config.calendarStore;
    
                        formPanelCfg.items.push({
                            xtype: 'calendarpicker',
                            itemId: 'calendar',
                            name: Ext.calendar.data.EventMappings.CalendarId.name,
                            anchor: '100%',
                            store: this.calendarStore
                        });
                    }
                break;
                case 'DSMF01KR':
                    
                    formPanelCfg = {
                        xtype: 'form',
                        fieldDefaults: {
                            msgTarget: 'side',
                            labelWidth: 80
                        },
                        frame: false,
                        bodyStyle: 'background:transparent;padding:5px 10px 10px;',
                        bodyBorder: false,
                        border: false,
                        items: [
                            // Ext.calendar.data.EventMappings.CalendarId.name
                            this.getCalendarList(),
                            // {
                            //     itemId: 'title',
                            //     name: Ext.calendar.data.EventMappings.Title.name,
                            //     fieldLabel: '고객사', //'Title',
                            //     xtype: 'textfield',
                            //     allowBlank: false,
                            //     emptyText: '고객사', //'Event Title',
                            //     anchor: '100%'
                            // },{
                            //     itemId: 'calendar_pj_name',
                            //     name: 'calendar_pj_name',
                            //     fieldLabel: '프로젝트명', //'Title',
                            //     xtype: 'textfield',
                            //     allowBlank: true,
                            //     emptyText: '프로젝트명', //'Event Title',
                            //     anchor: '100%'
                            // },{
                            //     itemId: 'calendar_regist_date',
                            //     name: 'calendar_regist_date',
                            //     fieldLabel: '등록일', //'Title',
                            //     xtype: 'datefield',
                            //     allowBlank: true,
                            //     emptyText: '등록일', //'Event Title',
                            //     anchor: '100%'
                            // },{
                            //     itemId: 'calendar_req_dlivery_plan',
                            //     name: 'calendar_req_dlivery_plan',
                            //     fieldLabel: '납품예정일', //'Title',
                            //     xtype: 'datefield',
                            //     allowBlank: true,
                            //     emptyText: '납품예정일', //'Event Title',
                            //     anchor: '100%'
                            // },{
                            //     itemId: 'calendar_aprv_date',
                            //     name: 'calendar_aprv_date',
                            //     fieldLabel: '작업지시일', //'Title',
                            //     xtype: 'datefield',
                            //     allowBlank: true,
                            //     emptyText: '작업지시일', //'Event Title',
                            //     anchor: '100%'
                            // },new Ext.form.Text({
                            //     fieldLabel: '수주수량', //'Web Link',
                            //     itemId: 'calendar_quan',
                            //     name: 'calendar_quan',
                            //     anchor: '100%'
                            // }),
                            // new Ext.form.TextArea({
                            //     fieldLabel: '상세설명', //'Notes',
                            //     itemId: 'calendar_comment',
                            //     name: 'calendar_comment',
                            //     // name: Ext.calendar.data.EventMappings.Notes.name,
                            //     grow: true,
                            //     growMax: 150,
                            //     anchor: '100%',
                            //     fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                            //     readOnly: true
                            // }),
                            // new Ext.form.Hidden({
                            //     itemId: 'calendar',
                            //     name: Ext.calendar.data.EventMappings.CalendarId.name,
                            // }),
                        ]
                    };
    
                    if (config.calendarStore) {
                        this.calendarStore = config.calendarStore;
                        delete config.calendarStore;
    
                        // formPanelCfg.items.push({
                        //     xtype: 'calendarpicker',
                        //     itemId: 'calendar',
                        //     name: Ext.calendar.data.EventMappings.CalendarId.name,
                        //     anchor: '100%',
                        //     store: this.calendarStore
                        // });
                    }
                break;
            case 'KWLM01KR':
                formPanelCfg = {
                    xtype: 'form',
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelWidth: 65
                    },
                    frame: false,
                    bodyStyle: 'background:transparent;padding:5px 10px 10px;',
                    bodyBorder: false,
                    border: false,
                    items: [{
                        itemId: 'title',
                        name: Ext.calendar.data.EventMappings.Title.name,
                        fieldLabel: '휴일명', //'Title',
                        xtype: 'textfield',
                        allowBlank: false,
                        emptyText: '휴일명', //'Event Title',
                        anchor: '100%'
                    },
                    {
                        xtype: 'daterangefield',
                        itemId: 'date-range',
                        name: 'dates',
                        anchor: '100%',
                        parentForm: this,
                        fieldLabel: '휴일날짜', //'When'
                    }]
                };

                if (config.calendarStore) {
                    this.calendarStore = config.calendarStore;
                    delete config.calendarStore;

                    formPanelCfg.items.push({
                        xtype: 'calendarpicker',
                        itemId: 'calendar',
                        hidden: true,
                        name: Ext.calendar.data.EventMappings.CalendarId.name,
                        anchor: '100%',
                        store: this.calendarStore
                    });
                }

                break;
            default:
                formPanelCfg = {
                    xtype: 'form',
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelWidth: 65
                    },
                    frame: false,
                    bodyStyle: 'background:transparent;padding:5px 10px 10px;',
                    bodyBorder: false,
                    border: false,
                    items: [{
                        itemId: 'title',
                        name: Ext.calendar.data.EventMappings.Title.name,
                        fieldLabel: '고객사', //'Title',
                        xtype: 'textfield',
                        allowBlank: false,
                        emptyText: '고객사', //'Event Title',
                        anchor: '100%'
                    },/*new Ext.calendar.form.field.ReminderCombo({
                     name: '담당자', //'Reminder',
                     anchor: '100%'
                     })*/
                        {
                            itemId: 'reminder',
                            name: Ext.calendar.data.EventMappings.Reminder.name,
                            fieldLabel: '제품명', //'Title',
                            xtype: 'textfield',
                            allowBlank: true,
                            emptyText: '제품명', //'Event Title',
                            anchor: '100%'
                        },
                        new Ext.form.TextArea({
                            fieldLabel: '상세설명', //'Notes',
                            name: Ext.calendar.data.EventMappings.Notes.name,
                            grow: true,
                            growMax: 150,
                            anchor: '100%',
                            fieldStyle: 'background-color: #F0F0F0; background-image: none; color:#5F6DA3;',
                            readOnly: true
                        }),
                        new Ext.form.Text({
                            fieldLabel: '배송지', //'Location',
                            name: Ext.calendar.data.EventMappings.Location.name,
                            anchor: '100%'
                        }),
                        new Ext.form.Text({
                            fieldLabel: '납품수량', //'Web Link',
                            name: Ext.calendar.data.EventMappings.Url.name,
                            anchor: '100%'
                        }),
                        {
                            xtype: 'daterangefield',
                            itemId: 'date-range',
                            name: 'dates',
                            anchor: '100%',
                            parentForm: this,
                            fieldLabel: '배송일시', //'When'
                        }

                    ]
                };

                if (config.calendarStore) {
                    this.calendarStore = config.calendarStore;
                    delete config.calendarStore;

                    formPanelCfg.items.push({
                        xtype: 'calendarpicker',
                        itemId: 'calendar',
                        name: Ext.calendar.data.EventMappings.CalendarId.name,
                        anchor: '100%',
                        store: this.calendarStore
                    });
                }
                break;
        }

        var titleAdd = '일정 추가';
        var titleEdit = '일정 수정';
        switch(vCompanyReserved4) {
            case 'DSMF01KR':
                titleAdd = '일정 확인';
                titleEdit = '일정 확인';
                break;
        }
    
        this.callParent([Ext.apply({
            titleTextAdd: titleAdd, //'Add Event',
            titleTextEdit: titleEdit, //'Edit Event',
            width: 600,
            autocreate: true,
            border: true,
            closeAction: 'hide',
            modal: false,
            resizable: false,
            buttonAlign: 'left',
            savingMessage: '저장 중입니다...', //'Saving changes...',
            deletingMessage: '삭제 중입니다...', //'Deleting event...',
            layout: 'fit',
    
            defaultFocus: 'title',
            onEsc: function(key, event) {
                        event.target.blur(); // Remove the focus to avoid doing the validity checks when the window is shown again.
                        this.onCancel();
                    },

            fbar: [{
                xtype: 'tbtext',
                hidden: true,
                text: '<a href="#" id="tblink">상세내용...</a>', //'<a href="#" id="tblink">Edit Details...</a>'
            },
            '->',
            {
                itemId: 'delete-btn',
                text: '삭제', //'Delete Event',
                disabled: false,
                handler: this.onDelete,
                scope: this,
                //minWidth: 150,
                hideMode: 'offsets'
            },
            {
                text: '저장', //'Save',
                disabled: false,
                handler: this.onSave,
                scope: this
            },
            {
                text: '취소', //'Cancel',
                disabled: false,
                handler: this.onCancel,
                scope: this
            }],
            items: formPanelCfg
        },
        config)]);
    },

    // private
    newId: 10000,

    /**
     * @event eventadd
     * Fires after a new event is added
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was added
     */

    /**
     * @event eventupdate
     * Fires after an existing event is updated
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was updated
     */

    /**
     * @event eventdelete
     * Fires after an event is deleted
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was deleted
     */

    /**
     * @event eventcancel
     * Fires after an event add/edit operation is canceled by the user and no store update took place
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was canceled
     */

    /**
     * @event editdetails
     * Fires when the user selects the option in this window to continue editing in the detailed edit form
     * (by default, an instance of {@link Ext.calendar.EventEditForm}. Handling code should hide this window
     * and transfer the current event record to the appropriate instance of the detailed form by showing it
     * and calling {@link Ext.calendar.EventEditForm#loadRecord loadRecord}.
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} that is currently being edited
     */

    // private
    initComponent: function() {
        this.callParent();

        this.formPanel = this.items.items[0];
    },

    // private
    afterRender: function() {
        this.callParent();

        this.el.addCls('ext-cal-event-win');

        Ext.get('tblink').on('click', this.onEditDetailsClick, this);
        
        this.titleField = this.down('#title');
        this.dateRangeField = this.down('#date-range');
        this.calendarField = this.down('#calendar');
        this.deleteButton = this.down('#delete-btn');
    },
    
    // private
    onEditDetailsClick: function(e){
        e.stopEvent();
        this.updateRecord(this.activeRecord, true);
        this.fireEvent('editdetails', this, this.activeRecord, this.animateTarget);
    },

    /**
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
	 * @param {Ext.data.Record/Object} o Either a {@link Ext.data.Record} if showing the form
	 * for an existing event in edit mode, or a plain object containing a StartDate property (and 
	 * optionally an EndDate property) for showing the form in add mode. 
     * @param {String/Element} animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @return {Ext.Window} this
     */
    show: function(o, animateTarget) {
        // Work around the CSS day cell height hack needed for initial render in IE8/strict:
        this.setGridStore(o, animateTarget);
        var me = this,
            anim = (Ext.isIE8 && Ext.isStrict) ? null: animateTarget,
            M = Ext.calendar.data.EventMappings,
            data = {};

        this.callParent([anim, function(){
            me.titleField.focus(true);
        }]);
        
        this.deleteButton[o.data && o.data[M.EventId.name] ? 'show': 'hide']();

        var rec,
        f = this.formPanel.form;

        console_logs('EventWindow show o', o);

        if (o.data) {
            rec = o;
            this.setTitle(rec.phantom ? this.titleTextAdd : this.titleTextEdit);
            console_logs('EventWindow f.loadRecord', 'start');
            this.loadRecord(rec);
            console_logs('EventWindow f.loadRecord', 'end');
        }
        else {
            this.setTitle(this.titleTextAdd);

            var start = o[M.StartDate.name],
                end = o[M.EndDate.name] || Ext.calendar.util.Date.add(start, {hours: 1});
            
            data[M.StartDate.name] = start;
            data[M.EndDate.name] = end;
            data[M.IsAllDay.name] = !!o[M.IsAllDay.name] || start.getDate() != Ext.calendar.util.Date.add(end, {millis: 1}).getDate();
            rec = new Ext.calendar.data.EventModel(data);

            //f.reset();
            this.loadRecord(rec);
        }

        // if (this.calendarStore) {
        //     this.calendarField.setValue(rec.data[M.CalendarId.name]);
        // }
        // this.dateRangeField.setValue(rec.data);
        this.activeRecord = rec;

        return this;
    },

    setCalenndarDisable : function(disabled) {
        var f = this.formPanel.form;
    	var calForm = f.findField(Ext.calendar.data.EventMappings.CalendarId.name);   
        calForm.setDisabled(disabled);
    },
    // inherited docs
    loadRecord: function(rec){
        // this.gridStore = rec.store;
    	// this.setCalenndarDisable(rec.get('IsAllDay'));
    	this.formPanel.form.reset().loadRecord(rec);
    },
    // private
    roundTime: function(dt, incr) {
        incr = incr || 15;
        var m = parseInt(dt.getMinutes(), 10);
        return dt.add('mi', incr - (m % incr));
    },

    // private
    onCancel: function() {
        this.cleanup(true);
        this.fireEvent('eventcancel', this);
    },

    // private
    cleanup: function(hide) {
        if (this.activeRecord && this.activeRecord.dirty) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;

        if (hide === true) {
            // Work around the CSS day cell height hack needed for initial render in IE8/strict:
            //var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            this.hide();
        }
    },

    // private
    updateRecord: function(record, keepEditing) {
    	console_logs('updateRecord', record);
    	
        var fields = record.getFields(),
            values = this.formPanel.getForm().getValues(),
            name,
            M = Ext.calendar.data.EventMappings,
            obj = {};

        Ext.Array.each(fields, function(f) {
            name = f.name;
            if (name in values) {
                obj[name] = values[name];
            }
        });
        
        var dates = this.dateRangeField.getValue();
        obj[M.StartDate.name] = dates[0];
        obj[M.EndDate.name] = dates[1];
        obj[M.IsAllDay.name] = dates[2];

        record.beginEdit();
        record.set(obj);
        
        if (!keepEditing) {
            record.endEdit();
        }

        console_logs('update ok', this);
        return this;
    },
    
    // private
    onSave: function(){
    	console_logs('onSave', this);
        if(!this.formPanel.form.isValid()){
            return;
        }
        if(!this.updateRecord(this.activeRecord)){
            this.onCancel();
            return;
        }
        console_logs('fire', this.activeRecord);
        this.fireEvent(this.activeRecord.phantom ? 'eventadd' : 'eventupdate', this, this.activeRecord, this.animateTarget);

        // Clear phantom and modified states.
        this.activeRecord.commit();

        console_logs('commit', 'ok');
    },
    
    // private
    onDelete: function(){
        this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
    },

    gridStore:null,
    setGridStore: function(rec, animateTarget) {
        console_logs('>>>>>>>>>>>>> setGridStore', rec);
        this.gridStore = rec.store;
    },

    getCalendarList: function() {
        // console_logs('>>>>>>>>>>>>>?', this.gridStore);
        var CAL_COLUMN = [
            { header:'프로젝트명', dataIndex:'title', width:'15%', sortable:true },
            { header:'Assy명', dataIndex:'title', width:'20%', sortable:true },
            { header:'수주등록일', dataIndex:'title', width:'20%', sortable:true },
            { header:'납기요청일', dataIndex:'title', width:'20%', sortable:true },
            { header:'계획수립일', dataIndex:'title', width:'20%', sortable:true },
            { header:'생산수량', dataIndex:'title', width:'15%', sortable:true },
        ];

        this.calendarGrid = Ext.create('Ext.grid.Panel', {
            id: 'calendarGrid',
            store: this.gridStore,
            multiSelect: true,
            stateId: 'stateGridsub',
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            autoScroll : true,
            autoHeight: true,
            filterable: true,
            height: 650,  // (getCenterPanelHeight()/5) * 4
    //        bbar: getPageToolbar(store),
            region: 'center',
            columns: /*(G)*/CAL_COLUMN,
            // plugins:[cellEditing,{
            //         ptype: 'gridfilters'
            // }],
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
            },
            // dockedItems: [
            //     {
            //         dock : 'top',
            //         xtype : 'toolbar',
            //         items : [
            //             this.addPRDAction, this.removePRDAction
            //         ]
            //     }
            // ]
        });

        return this.calendarGrid;
    },
});