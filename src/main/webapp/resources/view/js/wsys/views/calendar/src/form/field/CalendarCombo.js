/**
 * @class Ext.calendar.form.field.CalendarCombo
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing from the list of available calendars to assign an event to.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    fieldLabel: 'Calendar',
    triggerAction: 'all',
    queryMode: 'local',
    forceSelection: true,
    selectOnFocus: true,
    width: 200
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.field.CalendarCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.calendarpicker',
    requires: [
        'Ext.calendar.data.CalendarMappings'
    ],

    fieldLabel: '차량 지정', //'Calendar',
    triggerAction: 'all',
    queryMode: 'local',
    forceSelection: true,
    selectOnFocus: true,
    
    // private
    defaultCls: 'ext-color-default',

    // private
    initComponent: function(){
        this.valueField = Ext.calendar.data.CalendarMappings.CalendarId.name;
        this.displayField = Ext.calendar.data.CalendarMappings.Title.name;
    
        this.listConfig = Ext.apply(this.listConfig || {}, {
            getInnerTpl: this.getListItemTpl
        });
        
        this.callParent(arguments);
    },
    
    // private
    getListItemTpl: function(displayField) {
    	console_logs('displayField', displayField);
    	console_logs('Ext.calendar.data.CalendarMappings.CalendarId', Ext.calendar.data.CalendarMappings.CalendarId);
        return '<div class="x-combo-list-item ext-color-{' + Ext.calendar.data.CalendarMappings.CalendarId.name +
                '}"><div class="ext-cal-picker-icon">&#160;</div>{' + displayField + '}</div>';
    },
    
    // private
    afterRender: function(){
        this.callParent(arguments);
        
        this.wrap = this.el.down('.x-form-text-wrap');
        this.wrap.addCls('ext-calendar-picker');
        
        this.icon = Ext.core.DomHelper.append(this.wrap, {
            tag: 'div', cls: 'ext-cal-picker-icon ext-cal-picker-mainicon'
        });
    },
    
    /* @private
     * Value can be a data value or record, or an array of values or records.
     */
    getStyleClass: function(value){
    	console_logs('getStyleClass value', value);
    	
        var val = value;
        
        if (!Ext.isEmpty(val)) {
            if (Ext.isArray(val)) {
                val = val[0];
            }
            return 'ext-color-' + (val.data ? val.data[Ext.calendar.data.CalendarMappings.CalendarId.name] : val); 
        }
        return '';
    },
    
    // inherited docs
    setValue: function(value) {
    	///console_logs('setValue value', value);
    	//console_logs('this.store.getCount()', this.store.getCount());
    	//console_logs('this.store', this.store);
    	
//    	var rec = this.store.getAt(value).data;
//    	console_logs('rec', rec);
//    	console_logs('Ext.calendar.data.CalendarMappings.CalendarId', Ext.calendar.data.CalendarMappings.CalendarId);
    	
        if (!value && this.store.getCount() > 0) {
            // ensure that a valid value is always set if possible
        	//console_logs('this.store.getAt(0)', this.store.getAt(0));
        	//console_logs('Ext.calendar.data.CalendarMappings.CalendarId.name', Ext.calendar.data.CalendarMappings.CalendarId.name);
        	
            value = this.store.getAt(0).data[Ext.calendar.data.CalendarMappings.CalendarId.name];
            //console_logs('setValue value  2', value);
        }
        
        if (this.wrap && value) {
            var currentClass = this.getStyleClass(this.getValue()),
                newClass = this.getStyleClass(value);
            
            //console_logs('currentClass', currentClass);
            //console_logs('newClass', newClass);
            
            this.wrap.replaceCls(currentClass, newClass);
        }


//        console_logs('this.wrap', this.wrap);
//        
//        
//        var c = this.wrap['dom'].childNodes;
//        console_logs('c', c);
//        c[0].style.backgroundColor = "yellow";
//        c[0].style.fontColor = "black";
//        c[0].value = "New text!";
        
        
        this.callParent(arguments);
    }
});