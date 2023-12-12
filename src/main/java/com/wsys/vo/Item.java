package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Item extends CommonVo {
	public String item_code;
	public String item_name;
	public String specification = "";
	public String detail_info = "";
	public String unit_code;
	public Double safe_quan;
	public String remark;
	public Double sum_quan;
	
	public String getSearch_name() {
		String result = "";
		
		result += this.item_code;
		result += " / " + this.item_name;
		if(this.specification!=null && this.specification.length()>0) {
			result += " / " + this.specification;
		} else {
			result += " / -";
		}
		if(this.detail_info!=null && this.detail_info.length()>0) {
			result += " / " + this.detail_info;
		} else {
			result += " / -";
		}
		
//		result += this.item_name;
//		if(this.specification!=null && this.specification.length()>0) {
//			result += " / " + this.specification;
//		}
//		if(this.detail_info!=null && this.detail_info.length()>0) {
//			result += " / " + this.detail_info;
//		}
		
		return result;
	}
	
	public void setSpecification() {
		if(this.specification==null || this.specification.length()<1) {
			this.specification = "";
		}
	}
	
	public void setDetail_info() {
		if(this.detail_info==null || this.detail_info.length()<1) {
			this.detail_info = "";
		}
	}

}
