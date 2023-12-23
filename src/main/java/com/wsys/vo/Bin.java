package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Bin extends CommonVo {
	public Long uid_rack;
	public String bin_code;
	public String bin_name;
	public Integer bin_row;
	public Integer bin_col;
	public String remark;

	public String rack_code;
	public String rack_name;
	public String wh_code;
	public String wh_name;
}
