/**
 * @class Ext.calendar.form.field.ReminderCombo
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing a reminder setting for an event.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    width: 200,
    fieldLabel: 'Reminder',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value'
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.field.ReminderCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.reminderfield',

    fieldLabel: '제품명', //'Reminder',
    mode: 'local',
    queryMode: 'remote',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'user_name',
    valueField:   'unique_id',
    listConfig:{ 	
        getInnerTpl: function(){
    		return '<div data-qtip="{unique_id}">[{dept_name}] {user_name}</div>';
    	}	                	
    },
    // private
    initComponent: function() {
        this.store = this.store || Ext.create('Mplm.store.UserStore', {hasNull: true} );

        this.callParent();
    },

    // inherited docs
    initValue: function() {
        if (this.value !== undefined) {
            this.setValue(this.value);
        }
        else {
            this.setValue('');
        }
        this.originalValue = this.getValue();
    }
});
