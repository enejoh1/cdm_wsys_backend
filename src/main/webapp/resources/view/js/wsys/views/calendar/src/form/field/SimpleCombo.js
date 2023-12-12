/**
 * @class Ext.calendar.form.field.SimpleCombo
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
Ext.define('Ext.calendar.form.field.SimpleCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.calendarpicker',

    fieldLabel: '차량 지정', //'Calendar',
//    triggerAction: 'all',
  //  queryMode: 'local',
//    forceSelection: true,
   // selectOnFocus: true,
    
    // private
    valueField:     'systemCode',
    displayField:   'codeName',
    initComponent: function(){
        this.callParent(arguments);
    },
    listConfig:{
      	getInnerTpl: function(){
      		return '<div data-qtip="{unique_id}">[{systemCode}] {codeName}</div>';
      	}			                	
      }
    
});