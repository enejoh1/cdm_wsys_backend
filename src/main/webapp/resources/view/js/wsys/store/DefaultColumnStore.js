Ext.define('Msys.store.DefaultColumnStore', {
	extend : 'Ext.data.Store',
    fields: [
		{ name: 'name', 		type: "string"    }           
		,{ name: 'type',   		type: "string"    }
		,{ name: 'text', 		type: "string"    }
		,{ name: 'width',		type: "int"        } 
		,{ name: 'sortable', 	type: "boolean"    }
		,{ name: 'dataIndex', 	type: "string" }
		,{ name: 'set_object', type: "string"    }  
	],
	proxy: {
		type: 'ajax',
		async: false,
		api: {
			read: CONTEXT_PATH + '/fields.do?method=read'
		},
		reader: {
			type: 'json',
			root: 'datas',
			totalProperty: 'count',
			successProperty: 'success'
		}
	}
});
