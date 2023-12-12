package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
// 자재 정보
public class Company extends CommonVo {
	public String cp_code;
	public String cp_name;
	public String biz_no;
	public String biz_cond;
	public String biz_category;
	public String cp_president;
	public String zip_code;
	public String address_kr;
	public String address_en;
	public String tel_no;
	public String fax_no;
	public String email_address;
	public String code_type;
}
