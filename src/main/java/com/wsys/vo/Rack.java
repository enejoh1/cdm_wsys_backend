package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rack extends CommonVo {
	public Long uid_whouse;
	public String rack_code;
	public String rack_name;
	public Integer row_cnt;
	public Integer col_cnt;
	public String remark;
	
	public String wh_code;
	public String wh_name;

	public Integer total_bin;
	public Integer use_bin;
	
	public String getRack_rate() {
		String result = "0 %";
		
		if(this.total_bin == null || this.total_bin < 1) return result;
		if(this.use_bin == null || this.use_bin < 1) result = "100 %";
		
		double total_double = (double)this.total_bin;
		double use_double = (double)this.use_bin;
		
		result = String.valueOf(Math.round(use_double / total_double * 100)) + " %";
		
		return result;
	}
	
}
