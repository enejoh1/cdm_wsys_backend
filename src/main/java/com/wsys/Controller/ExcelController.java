package com.wsys.Controller;

import java.io.Writer;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;

import com.wsys.Controller.base.BaseAbstractController;
import com.wsys.service.admin.AdminManager;
import com.wsys.service.admin.ExcelManager;
import com.wsys.service.admin.ExecManager;
import com.wsys.util.DatabasePage;
import com.wsys.vo.Bin;
import com.wsys.vo.BinMan;
import com.wsys.vo.Company;
import com.wsys.vo.History;
import com.wsys.vo.Item;
import com.wsys.vo.Location;
import com.wsys.vo.MainVo;
import com.wsys.vo.Menu;
import com.wsys.vo.Rack;
import com.wsys.vo.SystemInfo;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

@Controller
@RequestMapping(value ={"/template.do"})
public class ExcelController extends BaseAbstractController {

	@Resource(name="AdminManager")
	private AdminManager adminManager;
	@Resource(name="ExecManager")
	private ExecManager execManager;
	@Resource(name="ExcelManager")
	private ExcelManager excelManager;
	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;

	// 입고 엑셀 템플릿 다운
	@RequestMapping(params = "method=wearingExcelTemplateDown")
	public String wearingExcelTemplateDown(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); //필수값

		String excelPath = null;

		excelPath = this.excelManager.createWearingTemplate(uid_company);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", excelPath);
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

	// 출고 엑셀 템플릿 다운
	@RequestMapping(params = "method=releaseExcelTemplateDown")
	public String releaseExcelTemplateDown(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); //필수값

		String excelPath = null;

		excelPath = this.excelManager.createReleaseTemplate(uid_company);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", excelPath);
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

	// 재고이동 엑셀 템플릿 다운
	@RequestMapping(params = "method=stockMoveExcelTemplateDown")
	public String stockMoveExcelTemplateDown(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); //필수값

		String excelPath = null;

		excelPath = this.excelManager.createStockMoveTemplate(uid_company);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", excelPath);
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

	// 입고 엑셀 업로드
	@RequestMapping(params = "method=execWearingExcel")
	public String execWearingExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); //필수값
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");

		String result = this.excelManager.ExcelWearingUpload(uid_company, user_uid, user_id, user_name, request, response);

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

	// 출고 엑셀 업로드
	@RequestMapping(params = "method=execReleaseExcel")
	public String execReleaseExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");

		String result = this.excelManager.ExcelReleaseUpload(uid_company, user_uid, user_id, user_name, request, response);

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

	// 재고이동 엑셀 업로드
	@RequestMapping(params = "method=execStockMoveExcel")
	public String execStockMoveExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); //필수값
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");

		String result = this.excelManager.ExcelStockMoveUpload(uid_company, user_uid, user_id, user_name, request, response);

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

	@RequestMapping(params = "method=binExcelDownload")
	public String binExcelDownload(HttpServletRequest request,  HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(100000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값

		Long uid_whouse = this.getRequestAlphaLong(request, "uid_whouse"); // 창고UID
		String codeType = this.getRequestUtf(request, "codeType");
		Map cond = new HashMap();
		cond.put("over_quan_zero", true);
		cond.put("uid_whouse", uid_whouse);

		List<Bin> binList = this.execManager.readBin(uid_company, cond);

		String excelPath = null;

		if(binList!=null && binList.size()>0) {
			List<Rack> whouseGroup = this.execManager.getRackListByUidWhouse(uid_company, uid_whouse);//List<Map<String, Object>> whouseGroup = this.execManager.getRackGroup(uid_company, uid_whouse);
			String barcodeFolder = this.execManager.createBarcodeBinData(uid_company, binList, codeType);
			excelPath = this.execManager.createBinExcelTemplate(uid_company, binList, whouseGroup, barcodeFolder,codeType);//excelPath = createLocationExcelTemplate(uid_company, whouseGroup, barcodeFolder);
		}

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", excelPath);
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

}
