package com.wsys.service.admin;

import java.util.List;
import java.util.Map;

import com.wsys.util.DatabasePage;
import com.wsys.vo.Company;
import com.wsys.vo.Menu;
import com.wsys.vo.User;

public interface AdminManager {

	public List<User> getLoginUser(Long uid_company, Map cond);

	public List<Menu> readMenuList(Long uid_company, Map cond);

	public List<Company> getCustomers();

	public List<Menu> getTotalMenu(Long uid_company, Map cond);

	public List<Company> checkCpCode(Map cond);

	public void updateLastMenu(Long uid_company, Long user_uid, String user_id, String user_name, String menu_code);

	public User getLastMenu(Long uid_company, Long user_uid);

	public List<User> readUser(Long uid_company, Map cond, DatabasePage page);

	public String addUser(Long uid_company, Long user_uid, String user_id, String user_name, User user);

	public String editUser(Long uid_company, Long user_uid, String user_id, String user_name, Map map);

	public String deleteUser(Long uid_company, Long user_uid, String user_id, String user_name, List<Long> unique_id_list);

	public String changePwd(Long uid_company, Long user_uid, String user_id, String user_name, Long unique_id,
			String password, String cur_pwd);

	public String resetPwd(Long uid_company, Long user_uid, String user_id, String user_name, Long unique_id);

	public void apporovalWmsUser(List<String> user_id_list, List<String> user_name_list, List<String> cp_code_list,
			List<String> cp_name_list, List<String> email_list, List<String> address_list, List<String> tel_no_list) throws Exception;

	public void updateCodeType(String user_id, String user_name, Long user_uid, Long unique_id, String codeType);
	
}
