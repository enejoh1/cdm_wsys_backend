package com.wsys.util;

import java.util.ArrayList;
import java.util.List;

public class DatabasePage {
	private Integer limit = -1;
	private Integer start = -1;
	private Integer count = 0;
	private Boolean sortAsc = false;
	
	private List<String> listSort;  //first: property, second: direction
	
	// syslog 瑜� �쐞�븳 ���옣
	public String user_id = null;
	public String ip_address = null;
	public String menu_code = null;
	public String menu_name = null;
	public String event_type = "議고쉶";
	public Double data_size = 0.0;
	
	public DatabasePage() {
		super();
		limit = 100;
		start = 0;
		count = 100;
		listSort = new ArrayList<String>();
	}
	public DatabasePage(int max) {
		super();
		limit = max;
		start = 0;
		count = max;
		listSort = new ArrayList<String>();
	}
	
	public void setDefault() {
		limit = 100;
		start = 0;
		count = 100;
		listSort = new ArrayList<String>();
		listSort.add("unique_id");
	}
	
	public DatabasePage(String sort_order) {
		limit = 100;
		start = 0;
		count = 100;
		listSort = new ArrayList<String>();
		listSort.add(sort_order);
	}
	
	public DatabasePage(DatabasePage page) {
		this.limit = page.getLimit();
		this.start = page.getStart();
		this.count = page.getCount();
		
		 List<String> list = page.getListSort();
		 if(list!=null) {
			 for(String sort : list) {
				 this.addSort(sort);
			 }
		 }
	}
	public Integer getLimit() {
		return limit;
	}
	public void setLimit(Integer limit) {
		this.limit = limit;
	}
	public Integer getStart() {
		return start;
	}
	public void setStart(Integer start) {
		this.start = start;
	}
	
	public List<String> getListSort() {
		return listSort;
	}
	public void setListSort(List<String> listSort) {
		this.listSort = listSort;
	}
	
	public void addSort(String sort) {
		if(this.listSort==null) {
			this.listSort = new ArrayList<String>();
		}
		listSort.add(sort);
	}
	
	//##DBG 정렬 추가
	public Boolean getListSortAsc() {
		return sortAsc;
	}
	//##DBG 정렬 추가
	public void addSortAsc(Boolean sort_Asc) {
		sortAsc = sort_Asc;
	}
	
	public void removeAllSort() {
		if(this.listSort!=null) {
			this.listSort.clear();
		}
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public String getIp_address() {
		return ip_address;
	}
	public void setIp_address(String ip_address) {
		this.ip_address = ip_address;
	}
	public String getEvent_type() {
		return event_type;
	}
	public void setEvent_type(String event_type) {
		this.event_type = event_type;
	}
	public Double getData_size() {
		return data_size;
	}
	public void setData_size(Double data_size) {
		this.data_size = data_size;
	}
	public String getMenu_code() {
		return menu_code;
	}
	public void setMenu_code(String menu_code) {
		this.menu_code = menu_code;
	}
	public String getMenu_name() {
		return menu_name;
	}
	public void setMenu_name(String menu_name) {
		this.menu_name = menu_name;
	}
	
}



