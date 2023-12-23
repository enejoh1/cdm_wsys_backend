package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Whouse extends CommonVo {
	public String wh_code;
	public String wh_name;
	public String remark;

	public String getSearch_wh_code() {
		String result = "";
		if(wh_code!=null && wh_code.length()>0) {
			result = "[" + wh_code + "]";
			if(wh_name!=null && wh_name.length()>0) {
				result += wh_name;
			}
		}

		return result;
	}
}
