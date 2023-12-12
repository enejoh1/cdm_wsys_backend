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
public class Menu extends CommonVo {
	public String type;
	public String is_menu;
	public Integer sort_no;
	public String parent_code;
	public String menu_code;
	public String menu_name;
	public String menu_link;
	public String menu_auth;
	public String icon_url;
}
