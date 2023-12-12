package com.wsys.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class SessionSecurityManagerCore {

	protected static final String WSYS_SESSION_UID = "WSYS_SESSION_UID";
	protected static final String USER_SESSION_USER_INFO = "USER_SESSION_USRAST";
	protected static final String USER_SESSION_USER_UID = "USER_SESSION_USER_UID";
	protected static final String USER_SESSION_USER_ID = "USER_SESSION_USER_ID";
	protected static final String USER_SESSION_USER_NAME = "USER_SESSION_USER_NAME";
	protected static final String USER_SESSION_UID_COMPANY = "USER_SESSION_COMMST_UID";
	protected static final String USER_SESSION_CP_CODE = "USER_SESSION_CSTMST_UID";
	protected static final String USER_SESSION_CP_NAME ="USER_SESSION_COM_CODE";
	
	public static Long getThis_userUid(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		
		if(session==null) return null;
		
		return (Long)session.getAttribute(USER_SESSION_USER_UID);
	}
	
	public static String getThis_userId(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		
		if(session==null) return null;
		
		return (String)session.getAttribute(USER_SESSION_USER_ID);
	}
	
	public static String getThis_userName(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		
		if(session==null) return null;
		
		return (String)session.getAttribute(USER_SESSION_USER_NAME);
	}
	
	public static Long getThis_uidCompany(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		
		if(session==null) return null;
		
		return (Long)session.getAttribute(USER_SESSION_UID_COMPANY);
	}
	
	public static String getThis_cpCode(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		
		if(session==null) return null;
		
		return (String)session.getAttribute(USER_SESSION_CP_CODE);
	}
	
	public static String getThis_cpName(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		
		if(session==null) return null;
		
		return (String)session.getAttribute(USER_SESSION_CP_NAME);
	}
	
//	
//	protected static final String MSYS_USER_SESSION_MENU_CODE ="MSYS_USER_SESSION_MENU_CODE";
//	protected static final String MSYS_USER_SESSION_MENU_NAME ="MSYS_USER_SESSION_MENU_NAME";
//	
//	public static UsrMst getThis_userInfo(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (UsrMst)session.getAttribute(USER_SESSION_USER_INFO);
//	}
//	
//	public static Long getThis_userUid(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (Long)session.getAttribute(USER_SESSION_USER_UID);
//	}
//	
//	public static String getThis_userId(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (String) session.getAttribute(USER_SESSION_USER_ID);
//	}
//	
//	public static String getThis_userName(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (String) session.getAttribute(USER_SESSION_USER_NAME);
//	}
//	
//	public static Long getThis_commstUid(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (Long)session.getAttribute(USER_SESSION_COMMST_UID);
//	}
//
//	public static Long getThis_cstmstUid(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (Long)session.getAttribute(USER_SESSION_CSTMST_UID);
//	}	
//	
//	public static String getThis_companyCode(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (String) session.getAttribute(USER_SESSION_COMPANY_CODE);
//	}
//	
//	public static String getThis_companyName(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (String) session.getAttribute(USER_SESSION_COMPANY_NAME);
//	}	
//	
//	public static String getCur_menuCode(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (String) session.getAttribute(MSYS_USER_SESSION_MENU_CODE);
//	}	
//	
//	public static String getCur_menuName(HttpServletRequest request) {
//		HttpSession session = request.getSession(false);
//		if(session==null)
//			return null;
//		
//		return (String) session.getAttribute(MSYS_USER_SESSION_MENU_NAME);
//	}	
}
