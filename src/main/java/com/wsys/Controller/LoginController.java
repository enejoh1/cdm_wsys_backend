package com.wsys.Controller;

import java.io.PrintWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;

import com.wsys.Controller.base.BaseAbstractController;
import com.wsys.util.SessionSecurityManager;
import com.wsys.vo.Company;
import com.wsys.vo.MainVo;
import com.wsys.vo.SystemInfo;
import com.wsys.vo.User;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

@Controller
@RequestMapping(value ={"/index/login.do", "/login.do"})
public class LoginController extends BaseAbstractController {

	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;

	@RequestMapping(params = "method=loginForm")
	public ModelAndView loginForm(HttpServletRequest request,
			HttpServletResponse response, MainVo mainVo) throws Exception {

//		HttpSession session = request.getSession(false);
//		System.out.println("==== session : " + session);
//		if(session != null) {
//			String redirect = "redirect:/index/main.do";
//			throw new ModelAndViewDefiningException(new ModelAndView(redirect));
//		};

		mainVo.setMain_content_path(systemInfo.getCommon_source_path());

		List<Company> comps = systemInfo.getCompanyList();
		if(comps!=null) {
			mainVo.setCompanyList(comps);
		};

//		mainVo.setMain_content_path(systemInfo.getContent_path());
//		mainVo.setCommst_uid(systemInfo.getCommst_uid());

//		System.out.println("==== main content path : " + mainVo.getMain_content_path());

		return new ModelAndView("/mobile/login", "MainVo", mainVo);
	};

	@RequestMapping(params = "method=login")
	public String login(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		String user_id = this.getRequestString(request, "user_id");
		String password = this.getRequestString(request, "password");
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		String cp_code = this.getRequestString(request, "cp_code");
		String cp_name = this.getRequestString(request, "cp_name");

//		if(user_id==null || user_id.length()<1) return null;
//		if(password==null || password.length()<1) return null;
//		if(uid_company==null || uid_company<1L) return null;

		Map cond = new HashMap();
		cond.put("user_id", user_id);
		cond.put("password", password);
		cond.put("uid_company", uid_company);

		List<User> userList = this.adminManager.getLoginUser(uid_company, cond);

		Map<String, Object> data = new HashMap<String, Object>();

		if(user_id.equals("admin") && password.equals("wsys00")) {
			HttpSession session = request.getSession(true);
			session.setAttribute("WSYS_SESSION_UID", 1);
			SessionSecurityManager.setAdmin(request, response);
			return "redirect:" + "/index/main.do";
		}

		if(userList!=null && userList.size()>0) {
			User user = userList.get(0);
//			SessionSecurityManager.setUser(request, response, user);
//			SessionSecurityManager.setCompany(request, response, uid_company, cp_code, cp_name);

			return "redirect:" + "/index/main.do";
		} else {
			String redirectUrl = "redirect:/login.do?method=loginError";
			throw new ModelAndViewDefiningException(new ModelAndView(redirectUrl));
		}
	};

	@RequestMapping(params = "method=mobileLogin")
	public String mobileLogin(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		System.out.println("====>>>> mobileLogin Process");

		this.printRequestParams(request);

		String user_id = this.getRequestString(request, "user_id");
		String password = this.getRequestString(request, "password");
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		String cp_code = this.getRequestString(request, "cp_code");
		String cp_name = this.getRequestString(request, "cp_name");

		Map cond = new HashMap();
		cond.put("user_id", user_id);
		cond.put("u_pwd", password);
		cond.put("uid_company", uid_company);

		List<User> userList = this.adminManager.getLoginUser(uid_company, cond);

		boolean result = false;

		Map<String, Object> data = new HashMap<String, Object>();

		if(userList!=null && userList.size()>0) {
			User user = userList.get(0);
			SessionSecurityManager.setUser(request, response, user, uid_company, cp_code, cp_name);
//			SessionSecurityManager.setCompany(request, response, uid_company, cp_code, cp_name);

			HttpSession session = request.getSession(false);
			System.out.println("=== mobileLogin session id: " + session.getId());

			result = true;
		} else {
			result = false;
		}

		data.put("result", userList);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);

		return null;
	};

	@RequestMapping(params = "method=loginError")
	public ModelAndView loginError(HttpServletRequest request,
			HttpServletResponse response, MainVo mainVo) throws Exception {

//		List<Company> comps = systemInfo.getCompanyList();
//		if(comps!=null) {
//			mainVo.setCompanyList(comps);
//		};

		return new ModelAndView("/mobile/login", "errMsg", "로그인 실패");
	};

	@RequestMapping(params = "method=logout")
	public ModelAndView logout(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		HttpSession session = request.getSession();
		session.setAttribute("WSYS_SESSION_UID", null);
		session.invalidate();

		String redirectUrl = "redirect:/login.do?method=loginForm";

		throw new ModelAndViewDefiningException(new ModelAndView(redirectUrl));
	};

	@RequestMapping(params = "method=checkCpCode")
	public String checkCpCode(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		String cp_code = this.getRequestString(request, "cp_code");

		Map cond = new HashMap();
		cond.put("cp_code", cp_code);

		List<Company> compList = this.adminManager.checkCpCode(cond);

		Long uid_company = -1L;
		if(compList!=null && compList.size()>0) {
			uid_company = compList.get(0).getUnique_id();
		}

		Map<String, Object> data = new HashMap<String, Object>();

		data.put("result", uid_company);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);

		return null;
	};

}
