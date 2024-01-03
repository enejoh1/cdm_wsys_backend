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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.ModelAndViewDefiningException;

import com.wsys.Controller.base.BaseAbstractController;
import com.wsys.service.admin.AdminManager;
import com.wsys.service.admin.ExcelManager;
import com.wsys.service.admin.ExecManager;
import com.wsys.util.DatabasePage;
import com.wsys.vo.Company;
import com.wsys.vo.Item;
import com.wsys.vo.MainVo;
import com.wsys.vo.Menu;
import com.wsys.vo.SystemInfo;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.springframework.beans.factory.annotation.Value;

@Controller
@RequestMapping(value ={"/item.do"})
public class ItemController extends BaseAbstractController {

	@Resource(name="AdminManager")
	private AdminManager adminManager;
	@Resource(name="ExcelManager")
	private ExcelManager excelManager;
	@Resource(name="ExecManager")
	private ExecManager execManager;

	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;
    @Value("${STANDARD_EXCEL_TEMPLATE_URL}")
    private String excelPathEnv;

	@RequestMapping(params = "method=readItem")
	public String readItem(HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("------##DBG---String readItem(HttpServletRequest request, HttpServletResponse response) throws Exception----");
		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		if(uid_company == null || uid_company < 1L) return null;

		String barcode = this.getRequestUtf(request, "barcode");
		String item_code = this.getRequestUtf(request, "item_code");
		String item_name = this.getRequestUtf(request, "item_name");
		String search_item = this.getRequestUtf(request, "search_item");
		String command = this.getRequestString(request, "command");

		Map cond = new HashMap();
//		cond.put("uid_company", uid_company);
		if(barcode!=null && barcode.length()>0) cond.put("barcode", barcode);
		if(item_code!=null && item_code.length()>0) cond.put("item_code", "%" + item_code + "%");
		if(item_name!=null && item_name.length()>0) cond.put("item_name", "%" + item_name + "%");
		if(search_item!=null && search_item.length()>0) cond.put("search_item", "%" + search_item + "%");

		List<Item> itemList = new ArrayList<Item>();

		Map<String, Object> data = new HashMap<String, Object>();

		if(command!=null && "EXCEL".equals(command)) {
			String excelPath = null;
			page.setLimit(100000);
			itemList = this.execManager.readItem(uid_company, cond, page);
			excelPath = this.excelManager.createStockMgmtExcel(uid_company, itemList);
			data.put("result", excelPathEnv);
			// data.put("result", excelPath);
		} else {
			itemList = this.execManager.readItem(uid_company, cond, page);
			data.put("result", itemList);
			data.put("count", page.getCount());
		}
		System.out.println("---2---##DBG---String readItem(HttpServletRequest request, HttpServletResponse response) throws Exception----");
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

	@RequestMapping(params = "method=registItem")
	public String registItem(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		if(uid_company == null || uid_company < 1L) return null;

		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestUtf(request, "user_id");
		String user_name = this.getRequestUtf(request, "user_name");

		String item_code = this.getRequestUtf(request, "item_code");
		String item_name = this.getRequestUtf(request, "item_name");
		String specification = this.getRequestUtf(request, "specification");
		String detail_info = this.getRequestUtf(request, "detail_info");
		String unit_code = this.getRequestUtf(request, "unit_code");
		Double safe_quan = this.getRequestDouble(request, "safe_quan");

		if(item_code==null || item_code.length()<1) return null;
		if(item_name==null || item_name.length()<1) return null;

		if(specification==null || specification.length()<1) specification = "";
		if(detail_info==null || detail_info.length()<1) detail_info = "";

		Item item = new Item();
		item.setItem_code(item_code);
		item.setItem_name(item_name);
		item.setSpecification(specification);
		item.setDetail_info(detail_info);
		item.setUnit_code(unit_code);
		item.setSafe_quan(safe_quan);

		Long uid_item = this.execManager.addItem(uid_company, user_uid, user_id, user_name, item);

		boolean result = false;

		if(uid_item!=null && uid_item>1L) {
			result = true;
		} else {
			result = false;
		}

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

	@RequestMapping(params = "method=checkDuplicateItemCode")
	public String checkDuplicateItemCode(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		String item_code = this.getRequestUtf(request, "item_code");
		if(uid_company == null || uid_company < 1L) return null;
		if(item_code == null || item_code.length() < 1) return null;


		Map cond = new HashMap();
		cond.put("item_code", item_code);

		List<Item> itemList = this.execManager.readItem(uid_company, cond, page);

		boolean result = false;

		if(itemList!=null && itemList.size()>0) {
			result = false;
		} else {
			result = true;
		}

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

	@RequestMapping(params = "method=editItem")
	public String editItem(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		Long uid_item = this.getRequestAlphaLong(request, "uid_item");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestUtf(request, "user_id");
		String user_name = this.getRequestUtf(request, "user_name");
		if(uid_company == null || uid_company < 1L) return null;
		if(uid_item == null || uid_item < 1L) return null;

		String item_name = this.getRequestUtf(request, "item_name");
		String specification = this.getRequestUtf(request, "specification");
		String detail_info = this.getRequestUtf(request, "detail_info");
		String unit_code = this.getRequestUtf(request, "unit_code");
		Double safe_quan = this.getRequestDouble(request, "safe_quan");

		if(specification==null || specification.length()<1) specification = "";
		if(detail_info==null || detail_info.length()<1) detail_info = "";


		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("unique_id", uid_item);

		cond.put("item_name", item_name);
		cond.put("specification", specification);
		cond.put("detail_info", detail_info);
		cond.put("unit_code", unit_code);
		cond.put("safe_quan", safe_quan);

		this.execManager.editItem(uid_company, cond, user_uid, user_id, user_name);

		return null;
	}

	@RequestMapping(params = "method=removeItem")
	public String removeItem(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		Long uid_item = this.getRequestAlphaLong(request, "uid_item");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestUtf(request, "user_id");
		String user_name = this.getRequestUtf(request, "user_name");
		if(uid_company == null || uid_company < 1L) return null;
		if(uid_item == null || uid_item < 1L) return null;


		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("unique_id", uid_item);

		this.execManager.removeItem(uid_company, cond, user_uid, user_id, user_name);

//		boolean result = false;
//
//		if(itemList!=null && itemList.size()>0) {
//			result = false;
//		} else {
//			result = true;
//		}
//
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

	@RequestMapping(params = "method=itemExcelUpload")
	public String itemExcelUpload(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");

		String result = this.execManager.ExcelUploadItemTemplate(uid_company, user_uid, user_id, user_name, request, response);

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

	@RequestMapping(params = "method=itemExcelDownLoad")
	public String itemExcelDownLoad(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		String codeType = this.getRequestUtf(request, "codeType");

		Map cond = new HashMap();

		List<Item> listList = this.execManager.readItem(uid_company, cond, page);

		String excelPath = null;

		if(listList!=null && listList.size()>0) {
			String barcodeFolder = this.execManager.createItemBarcode(uid_company, listList, codeType);
			excelPath = this.execManager.createItemExcelTemplate(uid_company, listList, barcodeFolder, codeType);
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

	@RequestMapping(params = "method=itemTemplateDownLoad")
	public String itemTemplateDownLoad(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값

		Map cond = new HashMap();

//		List<Item> listList = this.execManager.readItem(uid_company, cond, page);

		String excelPath = null;

		excelPath = this.execManager.createItemTemplate(uid_company);

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

	@RequestMapping(params = "method=deleteItem")
	public String deleteItem(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "uid_company");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		Long unique_id = this.getRequestAlphaLong(request, "unique_id");

		Map cond = new HashMap();

		Map<String, Object> data = new HashMap<String, Object>();
		if(uid_company==null || uid_company<1L || unique_id==null || unique_id<1L) {
			data.put("result", "삭제실패");
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

		String result = this.execManager.deleteItem(uid_company, user_uid, user_id, user_name, unique_id);

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


}
