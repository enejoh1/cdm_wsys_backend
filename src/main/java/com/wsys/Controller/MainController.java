package com.wsys.Controller;

import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.mobile.device.Device;
import org.springframework.mobile.device.DeviceUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;

import com.wsys.Controller.base.BaseAbstractController;
import com.wsys.service.admin.AdminManager;
import com.wsys.util.DatabasePage;
import com.wsys.vo.Company;
import com.wsys.vo.MainVo;
import com.wsys.vo.Menu;
import com.wsys.vo.SystemInfo;
import com.wsys.vo.User;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

//@CrossOrigin(origins= {"http://103.60.126.141:8080"})
@Controller
@RequestMapping(value ={"/index/main.do", "/"})
public class MainController extends BaseAbstractController {
	
	@Resource(name="AdminManager")
	private AdminManager adminManager;
	
	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;
	
	@RequestMapping("/hi")
	public String hi() {
		return "index";
	}
	
	@RequestMapping(params = "method=checkSession")
	public String checkSession(HttpServletRequest request, HttpServletResponse response) throws Exception {

		System.out.println("=== Main request" + request);
		System.out.println("=== Main response" + response);
		System.out.println("=== Main Check Session");
		
		HttpSession session = request.getSession(false);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", session);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);
	    
	    return null;
	}
	
//	@RequestMapping("")
//	public String main(HttpServletRequest request, HttpServletResponse response, MainVo mainVo) throws Exception {
//		HttpSession session = request.getSession(false);
//		System.out.println("==== session : " + session);
//		if(session == null) {
//			return "index";	
//		};
//		
//		Long session_uid = (Long) session.getAttribute("WSYS_SESSION_UID");
//		
////		String path = "http://103.60.126.200/view_contents";
////		mainVo.setMain_content_path(path);
//		
//		Long uid_company = mainVo.getUid_company();
//		uid_company = 1L;
//		
//		Map topCond = new HashMap();
//		topCond.put("type", "P");
//		List<Menu> topMenuList = this.adminManager.readMenuList(uid_company, topCond);
//		
//		Map childCond = new HashMap();
//		childCond.put("type", "C");
//		List<Menu> childMenuList = this.adminManager.readMenuList(uid_company, childCond);
//		
//		Map<String, Object> data = new HashMap<String, Object>();
//        data.put("count", topMenuList.size());
//        data.put("datas", topMenuList);
//        JsonConfig jsonConfig = new JsonConfig();
//		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());       
//        
//		if(topMenuList!=null && topMenuList.size()>0) {
//			String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
//			mainVo.setTopMenuList(jsonStr);
//		}
//		
//		if(childMenuList!=null && childMenuList.size()>0) {
//			String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
//			mainVo.setChildMenuList(jsonStr);
//		}
//		
//		List<Map<String, Object>> menuTreeList = new ArrayList<Map<String, Object>>();
//		if(topMenuList!=null && topMenuList.size()>0 && childMenuList!=null && childMenuList.size()>0) {
//			for(Menu top : topMenuList) {
//				Map<String, Object> menuMap = convertChildMap(top);
//				String top_code = top.getMenu_code();
//				if(top_code!=null && top_code.length()>0) {
//					List<Map<String, Object>> listChild = new ArrayList<Map<String, Object>>();
//					for(Menu child : childMenuList) {
//						String parent_code = child.getParent_code();
//						if(parent_code!=null && parent_code.equals(top_code)) {
//							Map<String, Object> childMap = convertChildMap(child);
//							listChild.add(childMap);
//						};
//					};
//					menuMap.put("child", listChild);
//				};
//				menuTreeList.add(menuMap);
//			};
//		};
//		
//		Map<String, Object> menuData = new HashMap<String, Object>();
//		menuData.put("count", menuTreeList.size());
//        menuData.put("datas", menuTreeList);
//		
//		mainVo.setMain_content_path(systemInfo.getCommon_source_path());
//		
//		JsonConfig jsonConfig_tree = new JsonConfig();
//        jsonConfig_tree.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
//        String jsonStr_tree = JSONObject.fromObject(menuData, jsonConfig).toString();
//        
//        mainVo.setTreeMenuList(jsonStr_tree);
//			
//        return "index";
//		
////		if(session_uid!=null) {
////			return new ModelAndView("/mobile/main", "MainVo", mainVo);
////		} else {
////			throw new ModelAndViewDefiningException(new ModelAndView("redirect:/login.do?method=loginForm"));			
////		}
//		
////		Device device = DeviceUtils.getCurrentDevice(request);
////		if (device.isMobile()) {
////			System.out.println("==== device is Mobile? : " + device.isMobile());
////			redirect = "redirect:/login.do?method=loginForm";
////		} else if (device.isTablet()) { 
////			System.out.println("==== device is Tablet? : " + device.isTablet());
////			redirect = "redirect:/login.do?method=loginForm";
////		} else { 
////			System.out.println("==== device is Mobile? : Nomal");
////			redirect = "redirect:/login.do?method=loginForm";
////		};
//	}
	
	@RequestMapping("")
	public ModelAndView main(HttpServletRequest request, HttpServletResponse response, MainVo mainVo) throws Exception {
		HttpSession session = request.getSession(false);
		System.out.println("==== session : " + session);
		
		return new ModelAndView("/main", "MainVo", mainVo);
		
//		if(session == null) {
//			String redirect = "redirect:/login.do?method=loginForm";
////			String redirect = "redirect:/login.do?method=loginForm";
//			throw new ModelAndViewDefiningException(new ModelAndView(redirect));			
//		};
//		
//		Long session_uid = (Long) session.getAttribute("WSYS_SESSION_UID");
//		
////		String path = "http://103.60.126.200/view_contents";
////		mainVo.setMain_content_path(path);
//		
//		Long uid_company = mainVo.getUid_company();
//		uid_company = 1L;
//		
//		Map topCond = new HashMap();
//		topCond.put("type", "P");
//		List<Menu> topMenuList = this.adminManager.readMenuList(uid_company, topCond);
//		
//		Map childCond = new HashMap();
//		childCond.put("type", "C");
//		List<Menu> childMenuList = this.adminManager.readMenuList(uid_company, childCond);
//		
//		Map<String, Object> data = new HashMap<String, Object>();
//		data.put("count", topMenuList.size());
//		data.put("datas", topMenuList);
//		JsonConfig jsonConfig = new JsonConfig();
//		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());       
//		
//		if(topMenuList!=null && topMenuList.size()>0) {
//			String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
//			mainVo.setTopMenuList(jsonStr);
//		}
//		
//		if(childMenuList!=null && childMenuList.size()>0) {
//			String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
//			mainVo.setChildMenuList(jsonStr);
//		}
//		
//		List<Map<String, Object>> menuTreeList = new ArrayList<Map<String, Object>>();
//		if(topMenuList!=null && topMenuList.size()>0 && childMenuList!=null && childMenuList.size()>0) {
//			for(Menu top : topMenuList) {
//				Map<String, Object> menuMap = convertChildMap(top);
//				String top_code = top.getMenu_code();
//				if(top_code!=null && top_code.length()>0) {
//					List<Map<String, Object>> listChild = new ArrayList<Map<String, Object>>();
//					for(Menu child : childMenuList) {
//						String parent_code = child.getParent_code();
//						if(parent_code!=null && parent_code.equals(top_code)) {
//							Map<String, Object> childMap = convertChildMap(child);
//							listChild.add(childMap);
//						};
//					};
//					menuMap.put("child", listChild);
//				};
//				menuTreeList.add(menuMap);
//			};
//		};
//		
//		Map<String, Object> menuData = new HashMap<String, Object>();
//		menuData.put("count", menuTreeList.size());
//		menuData.put("datas", menuTreeList);
//		
//		mainVo.setMain_content_path(systemInfo.getCommon_source_path());
//		
//		JsonConfig jsonConfig_tree = new JsonConfig();
//		jsonConfig_tree.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
//		String jsonStr_tree = JSONObject.fromObject(menuData, jsonConfig).toString();
//		
//		mainVo.setTreeMenuList(jsonStr_tree);
//		
//		if(session_uid!=null) {
//			return new ModelAndView("/mobile/main", "MainVo", mainVo);
//		} else {
//			throw new ModelAndViewDefiningException(new ModelAndView("redirect:/login.do?method=loginForm"));			
//		}
	}
	
	public Map<String, Object> convertChildMap(Menu menu) {
		Map<String, Object> result = new HashMap<String, Object>();
		String menu_type = menu.getType();
		int level = 1;
		switch(menu_type) {
		case "P":
			level = 1;
			break;
		default:
			level = 2;
			break;
		};
		
		if(menu!=null) {
			result.put("level", level);
			result.put("type", menu.getType());
			result.put("menu_code", menu.getMenu_code());
			result.put("menu_name", menu.getMenu_name());
			result.put("icon_url", menu.getIcon_url());
			result.put("menu_link", menu.getMenu_link());
			result.put("parent_code", menu.getParent_code());
			
		}
		
		return result;
	}
	
	@RequestMapping("/login")
	public String login(HttpServletRequest request, HttpServletResponse response) {
		return "/view/mobile/login";
	}
	
//	@RequestMapping
//	public ModelAndView main(HttpServletRequest request,
//			HttpServletResponse response/* , MainVo mainVo */) throws Exception {
//		System.out.println("==== main?");
//		return new ModelAndView("main", "MainVo", null);
////		HttpSession session = request.getSession(false);
////		
////		//Session 정보가 없으면 로그인 창으로.
////		if(session == null) {
////			throw new ModelAndViewDefiningException(new ModelAndView("redirect:/login.do?method=loginForm"));			
////		}
////		Long session_uid = (Long) session.getAttribute("MSYS_MES_SESSION_UID");
////		System.out.println("==== session: " + session_uid);
////		
////		Long uid_comast = 1L;
//        
////        mainVo.setTreeMenuList(jsonStr_tree);
////        
////        setMainVoUserInfo(mainVo, request);
////        
////        mainVo.setMain_content_path(systemInfo.getContent_path());
////        mainVo.setCommst_uid(systemInfo.getCommst_uid());
//		
////		return new ModelAndView("main", "MainVo", null);
//		
////		String viewName = null;
////		viewName = "main";
////		
////		if(session_uid!=null) {
////			return new ModelAndView(viewName, "MainVo", null);
////		} else {
////			throw new ModelAndViewDefiningException(new ModelAndView("redirect:/login.do?method=loginForm"));			
////		}
//	};
	
	@RequestMapping(params = "method=getCustomers")
	public String getCustomers(HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		List<Company> companyList = adminManager.getCustomers();
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", companyList);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);
	    
	    return null;
	}
	
	@RequestMapping(params = "method=getMenuList")
	public String getMenuList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
//		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		
		Map cond = new HashMap();
//		cond.put("uid_company", uid_company);
		
		List<Menu> menuList = this.adminManager.getTotalMenu(null, cond);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", menuList);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=updateLastMenu")
	public String updateLastMenu(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		String menu_code = this.getRequestString(request, "menu_code");
		
		if(uid_company==null || uid_company<1L || user_uid==null || user_uid<1L || menu_code==null || menu_code.length()<1) return null;
		
		if(menu_code!=null && menu_code.length()>0 && "LOGIN".equals(menu_code)) {
			menu_code = "STANDARD";
		};
		
		this.adminManager.updateLastMenu(uid_company, user_uid, user_id, user_name, menu_code);
		
		return null;
	}
	
	@RequestMapping(params = "method=getLastMenu")
	public String getLastMenu(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		
		if(uid_company==null || uid_company<1L || user_uid==null || user_uid<1L) return null;
		
		User user = this.adminManager.getLastMenu(uid_company, user_uid);
		
		String result = null;
		
		if(user!=null) result = user.getLast_menu();
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", result);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=readUser")
	public String readUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		DatabasePage page = this.settingPage(request);
		
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		String email_address = this.getRequestString(request, "email_address");
		String u_type = this.getRequestUtf(request, "u_type");	// ##DBG 정렬 추가
		//String is_asc = this.getRequestUtf(request, "isAsc");	// ##DBG 추가

		System.out.print("------0-------");		
		System.out.println("--------0-------");		
		Map cond = new HashMap();
		if(user_id!=null && user_id.length()>0) cond.put("user_id", "%" + user_id + "%");
		if(user_name!=null && user_name.length()>0) cond.put("user_name", "%" + user_name + "%");
		if(email_address!=null && email_address.length()>0) cond.put("email_address", "%" + email_address + "%");
		if(u_type!=null && u_type.length()>0) cond.put("u_type", "%" + u_type + "%");	//##DBG  정렬 추가
		//if(is_asc!=null && is_asc.length()>0) cond.put("is_asc", is_asc);	//##DBG 추가
		
		System.out.print("--------1--------");		
		System.out.println(cond);		

		System.out.print("---------2-------");		
		System.out.println(page);		
	
		List<User> userList = this.adminManager.readUser(uid_company, cond, page);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", userList);
		data.put("count", page.getCount());
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		System.out.print("--------3---------");		
		System.out.println(jsonStr);		//##DBG 설명 : back-end에서받은 json형식 데이트 리스트

		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		return null;
	}
	
	@RequestMapping(params = "method=addUser")
	public String addUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		
		Long user_uid = this.getRequestAlphaLong(request, "uid_company");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		
		String add_user_id = this.getRequestString(request, "add_user_id");
		String add_user_pw = this.getRequestString(request, "add_user_pw");
		String add_user_name = this.getRequestString(request, "add_user_name");
		String add_u_type = this.getRequestString(request, "add_u_type");
		String add_u_position = this.getRequestString(request, "add_u_position");
		String add_tel_no = this.getRequestString(request, "add_tel_no");
		String add_email_address = this.getRequestString(request, "add_email_address");
		
		
		User user = new User();
		user.setUser_id(add_user_id); user.setUser_name(add_user_name);
		user.setU_pwd(add_user_pw); user.setU_type(add_u_type);
		user.setU_position(add_u_position); user.setTel_no(add_tel_no);
		user.setEmail_address(add_email_address);
		
		String result = this.adminManager.addUser(uid_company, user_uid, user_id, user_name, user);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", result);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=editUser")
	public String editUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		
		Long user_uid = this.getRequestAlphaLong(request, "uid_company");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		
		Long edit_user_uid = this.getRequestAlphaLong(request, "edit_user_uid");
		String edit_user_name = this.getRequestString(request, "edit_user_name");
		String edit_u_type = this.getRequestString(request, "edit_u_type");
		String edit_u_position = this.getRequestString(request, "edit_u_position");
		String edit_tel_no = this.getRequestString(request, "edit_tel_no");
		String edit_email_address = this.getRequestString(request, "edit_email_address");
		
		if(edit_user_uid==null || edit_user_uid<1L) return null;
		
		Map map = new HashMap();
		map.put("unique_id", edit_user_uid);
		map.put("user_name", edit_user_name); map.put("u_type", edit_u_type);
		map.put("u_position", edit_u_position); map.put("tel_no", edit_tel_no);
		map.put("email_address", edit_email_address);
		
		String result = this.adminManager.editUser(uid_company, user_uid, user_id, user_name, map);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", result);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=deleteUser")
	public String deleteUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		
		Long user_uid = this.getRequestAlphaLong(request, "uid_company");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		
		Long unique_id = this.getRequestAlphaLong(request, "unique_id");
		
		List<Long> unique_id_list = this.getRequestUniqueIds(request, "unique_id_list");
		
		if(unique_id_list==null || unique_id_list.size()<1) return null;
		
		String result = this.adminManager.deleteUser(uid_company, user_uid, user_id, user_name, unique_id_list);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", result);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=changePwd")
	public String changePwd(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		
		Long user_uid = this.getRequestAlphaLong(request, "uid_company");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		
		Long unique_id = this.getRequestAlphaLong(request, "unique_id");
		String cur_pwd = this.getRequestString(request, "cur_pwd");
		String password = this.getRequestString(request, "password");
		

		if(unique_id==null || unique_id<1L) return null;
		if(cur_pwd==null || cur_pwd.length()<1) return null;
		if(password==null || password.length()<1) return null;
		
		String result = this.adminManager.changePwd(uid_company, user_uid, user_id, user_name, unique_id, password, cur_pwd);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", result);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=resetPwd")
	public String resetPwd(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		
		Long user_uid = this.getRequestAlphaLong(request, "uid_company");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		
		Long unique_id = this.getRequestAlphaLong(request, "unique_id");
		
		if(unique_id==null || unique_id<1L) return null;
		
		String result = this.adminManager.resetPwd(uid_company, user_uid, user_id, user_name, unique_id);
		
		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", result);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
		
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=apporovalWmsUser")
	public String apporovalWmsUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		List<String> user_id_list = this.getRequestStringList(request, "user_id_list");
		List<String> user_name_list = this.getRequestStringList(request, "user_name_list");
		List<String> cp_code_list = this.getRequestStringList(request, "cp_code_list");
		List<String> cp_name_list = this.getRequestStringList(request, "cp_name_list");
		List<String> email_list = this.getRequestStringList(request, "email_list");
		List<String> address_list = this.getRequestStringList(request, "address_list");
		List<String> tel_no_list = this.getRequestStringList(request, "tel_no_list");
		
		this.adminManager.apporovalWmsUser(user_id_list, user_name_list, cp_code_list,
				cp_name_list, email_list, address_list, tel_no_list);
		
//		Map<String, Object> data = new HashMap<String, Object>();
//		data.put("result", result);
//		JsonConfig jsonConfig = new JsonConfig();
//		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
//		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
//		
//		response.setHeader("Content-Type", "text/html; charset=UTF-8");
//		response.setHeader("Access-Control-Allow-Origin", "*");
//		Writer out = response.getWriter();
//		response.setContentType("application/x-json");
//		out.write(jsonStr);
		
		return null;
	}
	
	@RequestMapping(params = "method=updateCodeType")
	public String updateCodeType(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);
		
		Long unique_id = this.getRequestAlphaLong(request, "unique_id");
		String codeType = this.getRequestString(request, "codeType");

		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		
		if(unique_id==null || unique_id<1L || codeType==null || codeType.length()<1) return null;
		
		this.adminManager.updateCodeType(user_id, user_name,  user_uid, unique_id, codeType);
		
		return null;
	}
	
}
