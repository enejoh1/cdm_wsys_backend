package com.wsys.service.admin;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

import javax.annotation.Resource;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.wsys.util.DatabasePage;
import com.wsys.vo.Company;
import com.wsys.vo.MailVo;
import com.wsys.vo.Menu;
import com.wsys.vo.User;

import net.bytebuddy.asm.Advice.Return;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@Service("AdminManager")
public class DefaultAdminManager extends ExtendDaoAdmnManager implements InitializingBean {

	public void afterPropertiesSet() throws Exception {
		System.out.println("===== Default Admin Manage After Properties Set");
		this.setPropertyInfo();

		Map cond = new HashMap();
		List<Company> companyList = this.companyDao.select_cond(-1L, "company", cond);

		if(companyList!=null) {
			systemInfo.setCompanyList(companyList);
		};
	}

	@Override
	public List<User> getLoginUser(Long uid_company, Map cond) {
		return this.userDao.select_cond(uid_company, "user", cond);
	}

	@Override
	public List<Menu> readMenuList(Long uid_company, Map cond) {
		return this.menuDao.select_cond(uid_company, "menu", cond);
	}

	@Override
	public List<Company> getCustomers() {
		Map cond = new HashMap();
		return this.companyDao.select_cond(-1L, "company", cond);
	}

	@Override
	public List<Menu> getTotalMenu(Long uid_company, Map cond) {
		return this.menuDao.getTotalMenu(cond);
	}

	@Override
	public List<Company> checkCpCode(Map cond) {
		return this.companyDao.select_cond(1L, "company", cond);
	}

	@Override
	public void updateLastMenu(Long uid_company, Long user_uid, String user_id, String user_name, String menu_code) {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("unique_id", user_uid);
		map.put("last_menu", menu_code);
		this.userDao.updateByMap(user_name, user_uid, "user", map);
	}

	@Override
	public User getLastMenu(Long uid_company, Long user_uid) {
		return (User) this.userDao.select_uid("user", user_uid);
	}

	@Override
	public List<User> readUser(Long uid_company, Map cond, DatabasePage page) {
		return this.userDao.select_cond(uid_company, "user", cond, page);
	}

	@Override
	public String addUser(Long uid_company, Long user_uid, String user_id, String user_name, User user) {
		try {
			this.userDao.insert(uid_company, true, user_name, user_uid, "user", user);

			return "SUCCESS";
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return "등록실패";
		}
	}

	@Override
	public String editUser(Long uid_company, Long user_uid, String user_id, String user_name, Map map) {
		String result = "SUCCESS";

		try {
			this.userDao.updateByMap(user_name, user_uid, "user", map);
		} catch (Exception e) {
			// TODO: handle exception
			result = "수정실패";
		}

		return result;
	}

	@Override
	public String deleteUser(Long uid_company, Long user_uid, String user_id, String user_name, List<Long> unique_id_list) {
		String result = "SUCCESS";
		Map map = new HashMap();
		for(Long unique_id : unique_id_list) {
			map.put("unique_id", unique_id);
			try {
				this.userDao.deleteByMap(user_name, user_uid, "user", map);
			} catch (Exception e) {
				// TODO: handle exception
				result = "삭제실패";
			}
		}
		return result;
	}

	@Override
	public String changePwd(Long uid_company, Long user_uid, String user_id, String user_name, Long unique_id,
			String password, String cur_pwd) {
		String result = "SUCCESS";

		try {
			Map cond = new HashMap();
			cond.put("uid_company", uid_company);
			cond.put("unique_id", unique_id);

			String curUid = this.userDao.getUserPwd(cond);

			if(cur_pwd!=null && curUid!=null && !cur_pwd.equals(curUid)) {
				return "기존 비밀번호를 확인해주세요.";
			}

			Map map = new HashMap();
			map.put("unique_id", unique_id);
			map.put("u_pwd", password);

			this.userDao.updateByMap(user_name, user_uid, "user", map);
		} catch (Exception e) {
			result = "비밀번호 변경실패";
		}
		return result;
	}

	@Override
	public String resetPwd(Long uid_company, Long user_uid, String user_id, String user_name, Long unique_id) {
		String result = "SUCCESS";

		try {
			Map map = new HashMap();
			map.put("unique_id", unique_id);
			map.put("u_pwd", "0000");

			this.userDao.updateByMap(user_name, user_uid, "user", map);
		} catch (Exception e) {
			result = "비밀번호 초기화실패";
		}
		return result;
	}

	@Override
	public void apporovalWmsUser(List<String> user_id_list, List<String> user_name_list, List<String> cp_code_list,
			List<String> cp_name_list, List<String> email_list, List<String> address_list, List<String> tel_no_list) throws Exception {
		for(int i=0; i<user_id_list.size(); i++) {
			String user_id = user_id_list.get(i);
			String user_name = user_name_list.get(i);
			String cp_code = cp_code_list.get(i);
			String cp_name = cp_name_list.get(i);
			String email = email_list.get(i);
			String address = address_list.get(i);
			String tel_no = tel_no_list.get(i);

			if(cp_code==null || cp_code.length()<1) continue;

			// 1. Company 생성
			Company company = new Company();
			company.setCp_code(cp_code);
			company.setCp_name(cp_name);
			company.setAddress_kr(address);
			company.setTel_no(tel_no);
			company.setEmail_address(email);
			company.setCode_type("BARCODE");

			Long uid_company = this.companyDao.insert(null, true, "시스템", -1L, "company", company);

			// 2. User 생성
			String random_pwd = getRandomPassword();
			User user = new User();
			user.setUser_id(user_id); user.setUser_name(user_name); user.setEmail_address(address);
			user.setTel_no(tel_no); user.setU_pwd(random_pwd);

			this.userDao.insert(uid_company, true, "시스템", -1L, "user", user);

			// 3. 비밀번호 메일 전송
			sendWmsUserEmail(cp_code, cp_name, email, user_id, random_pwd);
		}
	}

	@Autowired
	private JavaMailSender javaMailSender;

	private void sendWmsUserEmail(String cp_code, String cp_name, String email, String user_id, String random_pwd) {

		SimpleDateFormat sendDate = new SimpleDateFormat("yyyyMMdd");

		// 신규계정 메일 전송
		String from_id = "";
		String from_pwd = "";

		String subject = "HBL WMS사용자 등록";
		String text = "";

		text += "HBL WMS 사용자 등록" + "\r\n\r\n";
		text += "회사코드: " + cp_code + "\r\n";
		text += "회사명: " + cp_name + "\r\n";
		text += "등록 아이디: " + user_id + "\r\n";
		text += "등록 비밀번호: " + random_pwd + "\r\n";
		text += "웹: https://www.hblwms.co.kr" + "\r\n";
		text += "모바일 웹: https://m.hblwms.co.kr" + "\r\n";
		text += "해당 비밀번호로 로그인 후 비밀번호를 변경해주세요." + "\r\n";


		MailVo mailVo = new MailVo();
		mailVo.setFrom(from_id);
		mailVo.setFrom_name("LogiForm WMS");
		mailVo.setTo(email);
		mailVo.setSubject(subject);
		mailVo.setText(text);

		mailService.sendMailAttach(mailVo);
	}

	private String getRandomPassword() {
		String generatedString = RandomStringUtils.randomAlphanumeric(10);
		return generatedString;
	}

	@Override
	public void updateCodeType(String user_id, String user_name, Long user_uid, Long unique_id, String codeType) {
		Map map = new HashMap();
		map.put("unique_id", unique_id);
		map.put("code_type", codeType);

		this.companyDao.updateByMap(user_name, user_uid, "company", map);
	}

}
