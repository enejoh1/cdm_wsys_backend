package com.wsys.Controller.base;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.Writer;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.wsys.service.admin.AdminManager;
import com.wsys.util.DatabasePage;
import com.wsys.vo.SystemInfo;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

public class BaseAbstractController extends LicenseSecurityController{
	
//	private static final Logger logger = LoggerFactory.getLogger(BaseAbstractController.class);
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;
	
	@Resource(name="AdminManager")
	public AdminManager adminManager;
	
//	@Resource(name="SalesManager")
//	public SalesManager salesManager;
//	
//	@Resource(name="PrchManager")
//	public PrchManager prchManager;
//	
//	@Resource(name="ProduceManager")
//	public ProduceManager produceManager;
//	
//	@Resource(name="MasterManager")
//	public MasterManager masterManager;
//	
//	@Resource(name="DesignManager")
//	public DesignManager designManager;
//	
//	@Resource(name="StockManager")
//	private StockManager stockManager;
//	
//	@Resource(name="AprvManager")
//	public AprvManager aprvManager;

	public void printRequestParams(HttpServletRequest request) {
		StringBuffer buffer = new StringBuffer();
		logger.info("================================ Parameter List START");
		buffer.append("\n");
		for(Enumeration names = request.getParameterNames(); names.hasMoreElements();) {
			String name = (String) names.nextElement();
			String[] values = request.getParameterValues(name);
			int len = 0;
			if(values!=null) len = values.length;
			
			for(int i=0; i<len; i++) {
				String value = UtfStringConv(values[i]);
				buffer.append(name+"="+value+"\n");
			}
		};
		
		logger.info(buffer.toString());
		logger.info("================================ Parameter List END");
	};
	
	public DatabasePage settingPage(HttpServletRequest request) {
		DatabasePage page = new DatabasePage();
		
		Integer limit = this.getRequestInteger(request, "limit");
		Integer start = this.getRequestInteger(request, "start");
		String orderBy = this.getRequestString(request, "orderBy");
		String is_Asc = this.getRequestString(request, "isAsc");
		Boolean isAsc=false;
		if(orderBy == null || orderBy.length() < 1) {
			//orderBy = "unique_id DESC";
		}
		
		System.out.print("---------12-------");		
		System.out.println(is_Asc);	
		
		if(is_Asc != null && is_Asc.length()>=4) {
			System.out.print("---------13-------");		
			if(is_Asc.equalsIgnoreCase("TRUE")) {
				isAsc = true;//"asc";
			}
			else {
				isAsc = false;//"desc";
			}
		}
		System.out.print("---------14-------");		
		System.out.println(isAsc);	

		page.setLimit(limit);
		page.setStart(start);
		page.addSort(orderBy);
		page.addSortAsc(isAsc);
		
		return page;
	}
	
	public String getRequestString(HttpServletRequest request, String name) {
		try {
			String param = request.getParameter(name);
			if(param==null) {
				return null;
			}
			return param.trim();
		} catch (Exception e) {
			return null;
		}
	};
	
	public String[] getRequestStringArr(HttpServletRequest request, String name) {
		try {
			String[] arr = request.getParameterValues(name);
			if(arr == null) return null;
			
			return (arr.length==1) ? arr[0].split("[,]") : arr;
		} catch (Exception e) {
			return null;
		}
	};
	
	public int getRequestInteger(HttpServletRequest request, String name) {
		try {
			String param = request.getParameter(name);
			if(param==null) {
				return -1;
			}
			param = param.trim();
			int value = converToInt(param);
			return value;
		} catch (Exception e) {
			return -1;
		}
	};
	
	public int converToInt(String value) {
		try {
			return Integer.valueOf(value);
		} catch (NumberFormatException e) {
			return 0;
		}
	};
	
	public void makeDir(String path) throws IOException {
		Path directoryPath = Paths.get(path);
		File dir = new File(path);
		// �뵒�젆�넗由� �깮�꽦
		if (!dir.exists()) {
			dir.mkdirs();
			System.out.println(directoryPath + "디렉토리가 생성되었습니다.");
		}else {
			System.out.println(directoryPath + "이미 디렉토리가 생성되어 있습니다.");
		}
		
	}
	
	public JsonValueProcessor JsonValueProcessor() {
		JsonValueProcessor beanProcessor = new JsonValueProcessor() {
			DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			@Override
			public Object processArrayValue(Object param,JsonConfig config) {
				if (param != null) {
					return dateFormat.format(param);
				}

				return null;
			}

			@Override
		    public Object processObjectValue(String pString,Object param, JsonConfig config) {
				return processArrayValue(param, config);
		    }
		};
		return beanProcessor;
	}
	
	public void jsonWrite(Map data, HttpServletResponse response) throws Exception {
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor()); 
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);
	}
	
	public void condSetDefault(HttpServletRequest request, Map cond) {
		Long unique_id = this.getRequestAlphaLong(request, "unique_id");
		String com_name = this.getRequestString(request, "com_name");
		String creator = this.getRequestString(request, "creator");
		String create_date = this.getRequestString(request, "create_date");
		String changer = this.getRequestString(request, "changer");
		String change_date = this.getRequestString(request, "change_date");
		
		if(unique_id!=null && unique_id>1L) cond.put("unique_id", unique_id);
		if(com_name!=null && com_name.length()>0) cond.put("com_name", com_name);
		if(creator!=null && creator.length()>0) cond.put("creator", creator);
		if(create_date!=null && create_date.length()>0) this.condSetDate(cond, "create_date", create_date);
		if(changer!=null && changer.length()>0) cond.put("changer", creator);
		if(change_date!=null && change_date.length()>0) this.condSetDate(cond, "change_date", change_date);
		
	} 
	
	public void condSetDate(Map cond, String param_name, String date) {
		String[] split_date = date.split("~");
		
		if(split_date.length>1) {
			cond.put(param_name, "true");
			cond.put(param_name+"_s", split_date[0]);
			cond.put(param_name+"_e", split_date[1]);
		}else {
			cond.put(param_name, "true");
			cond.put(param_name+"_s", split_date[0]);
			cond.put(param_name+"_e", split_date[0]);
		}
	} 
	
	private void error(ServletOutputStream stream) throws IOException {
		stream.print("<html>\n\t<head>\n\t\t<title>Error</title>\n\t</head>\n\t<body>");
		stream.print("An error occured.\n\t</body>\n</html>");
	}
}
