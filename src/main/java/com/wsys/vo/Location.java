package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Location extends CommonVo {
//	public Long uid_company;
	public Long uid_bin;
	public Long uid_item;
	public Double quan;
	public Date last_in_date;
	public Date last_out_date;
	public String remark;
	public String item_code;
	public String item_name;
	public String specification;
	public String detail_info;
	public String unit_code;

	public String bin_code;
	public String bin_name;
	public Integer bin_row;																																																																																				
	public Integer bin_col;
	public String rack_code;
	public String rack_name;
	public String wh_code;
	public String wh_name;
	
	public Double sum_quan;
	public Double sum_location_quan;
	public String lotno;		//##DBG lotno추가
}
