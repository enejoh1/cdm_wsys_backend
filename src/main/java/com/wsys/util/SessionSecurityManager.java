package com.wsys.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.wsys.security.SessionSecurityManagerCore;
import com.wsys.vo.User;

public class SessionSecurityManager extends SessionSecurityManagerCore{

	public static void setUser(HttpServletRequest request, HttpServletResponse response, User user,
			Long uid_company, String cp_code, String cp_name) {
		HttpSession session = request.getSession(true);

		// 유저 정보
		if (user != null) {
			session.setAttribute(WSYS_SESSION_UID, user.getUnique_id());
			session.setAttribute(USER_SESSION_USER_ID, user.getUser_id());
			session.setAttribute(USER_SESSION_USER_UID, user.getUnique_id());
			session.setAttribute(USER_SESSION_USER_NAME, user.getUser_name());
			session.setAttribute(USER_SESSION_USER_INFO, user);
		}

		// 업체 정보
		if(uid_company!=null) session.setAttribute(USER_SESSION_UID_COMPANY, uid_company);
		if(cp_code!=null) session.setAttribute(USER_SESSION_CP_CODE, cp_code);
		if(cp_name!=null) session.setAttribute(USER_SESSION_CP_NAME, cp_name);

	};

//	public static void setCompany(HttpServletRequest request, HttpServletResponse response,
//			Long uid_company, String cp_code, String cp_name) {
//		HttpSession session = request.getSession(true);
//
//		if(uid_company!=null) {
//			session.setAttribute(USER_SESSION_UID_COMPANY, uid_company);
//			session.setAttribute(USER_SESSION_CP_CODE, cp_code);
//			session.setAttribute(USER_SESSION_CP_NAME, cp_name);
//		}
//	};

	public static void setAdmin(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);

		session.setAttribute(WSYS_SESSION_UID, 1L);
	};

}
