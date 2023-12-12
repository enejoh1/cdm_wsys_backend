package com.wsys.vo;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.stereotype.Repository;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Repository("systemInfo")
@Data
public class SystemInfo{

	private Map<String, String> propertyMap = new HashMap<String, String>();
	
	private List<Company> companyList;
	private Long uid_company;
	private String common_source_path;
	
	private String system_type;
	private String db_type;
	private String upload_path;
	private String download_path;
	private String excel_path;
	private String image_path;
	private String pdf_path;
	
	public SystemInfo() throws Exception {
		super();
		
		String property_name = "/application.properties";
		InputStream is = getClass().getResourceAsStream(property_name);
		
		if(is != null) {
			Properties prop = new Properties();
	        prop.load(is);
	        
	        for(Object key : prop.keySet()) {
	        	String k = (String)key;
	        	
	        	this.propertyMap.put(k, prop.getProperty(k));
	        }
		}
	}
	
	public void setPropertyInfo() {
		this.common_source_path = this.propertyMap.get("common_source_path");
		System.out.println("==== set propert info : " + this.common_source_path);
	}
	
}
