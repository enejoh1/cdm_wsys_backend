//@define Ext.calendar.data.EventMappings
/**
 * @class Ext.calendar.data.EventMappings
 * A simple object that provides the field definitions for Event records so that they can
 * be easily overridden.
 *
 * To ensure the proper definition of Ext.calendar.data.EventModel the override should be
 * written like this:
 *
 *      Ext.define('MyApp.data.EventMappings', {
 *          override: 'Ext.calendar.data.EventMappings'
 *      },
 *      function () {
 *          // Update "this" (this === Ext.calendar.data.EventMappings)
 *      });
 */
Ext.ns('Ext.calendar.data');

Ext.calendar.data.EventMappings = {
    EventId: {
        name: 'EventId',
        mapping: 'id',
        type: 'int'
    },
    CalendarId: {
        name: 'CalendarId',//지정차량
        mapping: 'cid',
        type: 'int'
    },
    Title: {
        name: 'Title',//고객사
        mapping: 'title',
        type: 'string'
    },
    StartDate: {
        name: 'StartDate',
        mapping: 'start',
        type: 'date',
        dateFormat: 'c'
    },
    EndDate: {
        name: 'EndDate',
        mapping: 'end',
        type: 'date',
        dateFormat: 'c'
    },
    Location: {
        name: 'Location',//배송지
        mapping: 'loc',
        type: 'string'
    },
    Notes: {
        name: 'Notes',
        mapping: 'notes',//상세설명
        type: 'string'
    },
    Url: {
        name: 'Url',
        mapping: 'url',//납품수량
        type: 'string'
    },
    IsAllDay: {
        name: 'IsAllDay',//배차여부
        mapping: 'ad',
        type: 'boolean'
    },
    Reminder: {
        name: 'Reminder',//제품명
        mapping: 'rem',
        type: 'string'
    },
    IsNew: {
        name: 'IsNew',
        mapping: 'n',
        type: 'boolean'
    }
};
