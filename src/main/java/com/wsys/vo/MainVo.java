package com.wsys.vo;

import java.util.List;

import lombok.Data;

/**
 * 메인 및 로그인 페이지 정보 구성 VO
 * */

@Data
public class MainVo {

	private Long uid_company;
	private String cp_code;
	private String cp_name;

	private Long user_uid;
	private String user_id;
	private String user_name;
	private List<String> login_grades;

	private String main_content_path;

	private List<Company> companyList;

	private String topMenuList;
	private String childMenuList;
	private String treeMenuList;
}
