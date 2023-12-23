package com.wsys.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

public class JavaUtilDateJsonValueProcessor implements JsonValueProcessor {

    private final DateFormat defaultDateFormat;

    public JavaUtilDateJsonValueProcessor(){
        defaultDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    }

    public JavaUtilDateJsonValueProcessor(String format){
        defaultDateFormat = new SimpleDateFormat(format);
    }

    @Override
    public Object processArrayValue(Object paramObject, JsonConfig paramJsonConfig) {
//    	if(paramObject == null) return null;
    	if(paramObject == null) paramObject = new Date();
    		return defaultDateFormat.format(paramObject);
    }

    @Override
    public Object processObjectValue(String paramString, Object paramObject, JsonConfig paramJsonConfig) {
    	return processArrayValue(paramObject, paramJsonConfig);
    }

}
