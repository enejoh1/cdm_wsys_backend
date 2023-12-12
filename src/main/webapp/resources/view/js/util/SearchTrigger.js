Ext.define('Msys.util.SearchTrigger', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.searchtrigger',
    triggers:{
        search: {
            cls: 'x-form-search-trigger',
            handler: function() {
                this.setFilter(this.up().dataIndex, this.getValue())
            }
        },
        clear: {
            cls: 'x-form-clear-trigger',
            handler: function() {
                this.setValue('')
                if(!this.autoSearch) this.setFilter(this.up().dataIndex, '')
            }
        }
    },
    setFilter: function(filterId, value){
        var store = this.up('grid').getStore();
        // console.log('=== setFilter filterId', filterId)
        // console.log('=== setFilter value', value)
        // console.log('=== setFilter store', store)
        if(value){
            store.removeFilter(filterId, false)
            var filter = {id: filterId, property: filterId, value: value};
            if(this.anyMatch) filter.anyMatch = this.anyMatch
            if(this.caseSensitive) filter.caseSensitive = this.caseSensitive
            if(this.exactMatch) filter.exactMatch = this.exactMatch
            if(this.operator) filter.operator = this.operator
            console.log(this.anyMatch, filter)
            store.addFilter(filter)

            // set param
            store.getProxy().setExtraParam(filterId, value);
            store.load();
        } else {
            console.log('==store.filters', store.filters);
            if(store.filters!=null) store.filters.removeAtKey(filterId)
            store.reload()
        }
    },
    listeners: {
        render: function(){
            var me = this;
            me.ownerCt.on('resize', function(){
                me.setWidth(this.getEl().getWidth())
            })
        },
        change: function() {
            if(this.autoSearch) this.setFilter(this.up().dataIndex, this.getValue())
        }
    }
});

Ext.define('Msys.util.SearchDate', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.searchdate',
    triggers:{
        search: {
            cls: 'x-form-search-date',
            handler: function() {
                this.setFilter(this.up().dataIndex, this.getValue())
            }
        },
        clear: {
            cls: 'x-form-clear-trigger',
            handler: function() {
                this.setValue('')
                if(!this.autoSearch) this.setFilter(this.up().dataIndex, '')
            }
        }
    },
    setFilter: function(filterId, value){
        var store = this.up('grid').getStore();
        if(value){
            store.removeFilter(filterId, false)
            var filter = {id: filterId, property: filterId, value: value};
            if(this.anyMatch) filter.anyMatch = this.anyMatch
            if(this.caseSensitive) filter.caseSensitive = this.caseSensitive
            if(this.exactMatch) filter.exactMatch = this.exactMatch
            if(this.operator) filter.operator = this.operator
            console.log(this.anyMatch, filter)
            store.addFilter(filter)
        } else {
            // store.filters.removeAtKey(filterId)
            store.reload()
        }
    },
    listeners: {
        render: function(){
            var me = this;
            me.ownerCt.on('resize', function(){
                me.setWidth(this.getEl().getWidth())
            })
        },
        change: function() {
            if(this.autoSearch) this.setFilter(this.up().dataIndex, this.getValue())
        }
    }
});

Ext.define('Msys.util.SearchNumber', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.searchnumber',
    triggers:{
        search: {
            cls: 'x-form-search-number',
            handler: function() {
                this.setFilter(this.up().dataIndex, this.getValue())
            }
        },
        clear: {
            cls: 'x-form-clear-trigger',
            handler: function() {
                this.setValue('')
                if(!this.autoSearch) this.setFilter(this.up().dataIndex, '')
            }
        }
    },
    setFilter: function(filterId, value){
        var store = this.up('grid').getStore();
        if(value){
            store.removeFilter(filterId, false)
            var filter = {id: filterId, property: filterId, value: value};
            if(this.anyMatch) filter.anyMatch = this.anyMatch
            if(this.caseSensitive) filter.caseSensitive = this.caseSensitive
            if(this.exactMatch) filter.exactMatch = this.exactMatch
            if(this.operator) filter.operator = this.operator
            console.log(this.anyMatch, filter)
            store.addFilter(filter)
        } else {
            // store.filters.removeAtKey(filterId)
            store.reload()
        }
    },
    listeners: {
        render: function(){
            var me = this;
            me.ownerCt.on('resize', function(){
                me.setWidth(this.getEl().getWidth())
            })
        },
        change: function() {
            if(this.autoSearch) this.setFilter(this.up().dataIndex, this.getValue())
        }
    }
});