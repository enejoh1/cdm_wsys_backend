package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class History extends CommonVo {
	public Long uid_location;
	public String is_inout;
	public Double his_quan;
	public Date his_date;
	public String remark;

	public Double quan;
	public Date last_in_date;
	public String item_code;
	public String item_name;
	public String specification;
	public String detail_info;
	public String unit_code;

	public String bin_code;
	public String bin_name;
	public String lotno;	//##DBG lotno추가
	public String his_lotno;	//##DBG lotno추가
}
