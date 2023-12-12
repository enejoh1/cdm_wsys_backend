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
public class User extends CommonVo {
	public String user_id;
	public String user_name;
	public String u_pwd;
	public String u_type; // 부서 
	public String u_role; 
	public String u_position; // 직책
	public String emp_no;
	public String email_address; // 이메일
	public String tel_no;  // 전화번호
	public String hp_no; 
	public String is_login;
	public String login_ip;
	public Date login_date;
	public Date logout_date;
	public Integer login_fail_cnt;
	public Date pw_change_date;
	
	public String cp_code;
	public String cp_name;
	public String code_type;
	
	public String last_menu;
}
