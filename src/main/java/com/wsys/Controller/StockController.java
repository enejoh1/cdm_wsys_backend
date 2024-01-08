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
import com.wsys.vo.Whouse;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.springframework.beans.factory.annotation.Value;

@Controller
@RequestMapping(value ={"/stock.do"})
public class StockController extends BaseAbstractController {

	@Resource(name="AdminManager")
	private AdminManager adminManager;
	@Resource(name="ExecManager")
	private ExecManager execManager;
	@Resource(name="ExcelManager")
	private ExcelManager excelManager;

	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;

    @Value("${WEARING_EXCEL_TEMPLATE_URL}")
    private String excelPathEnv;

	@RequestMapping(params = "method=readwhouse")
	public String readwhouse(HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("---##DBG---String readwhouse(HttpServletRequest request, HttpServletResponse response) throws Exception-----");
		this.printRequestParams(request);
		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		if(uid_company==null || uid_company<1L) return null;

		String wh_code = this.getRequestString(request, "wh_code");
		String wh_name = this.getRequestString(request, "wh_name");

		Map cond = new HashMap();
		if(wh_code!=null&&wh_code.length()>0) cond.put("wh_code", "%" + wh_code + "%");
		if(wh_name!=null&&wh_name.length()>0) cond.put("wh_name", "%" + wh_name + "%");

		List<Whouse> whouseList = this.execManager.readWhouse(uid_company, cond, page);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", whouseList);
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

	@RequestMapping(params = "method=readBin")
	public String readBin(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		Long barcode = this.getRequestAlphaLong(request, "barcode");
		String bin_code = this.getRequestString(request, "bin_code");
		String exec_bin_code = this.getRequestString(request, "exec_bin_code");
		String wh_code = this.getRequestString(request, "wh_code");
		String rack_code = this.getRequestString(request, "rack_code");
		Long bin_row = this.getRequestAlphaLong(request, "bin_row");
		Long bin_col = this.getRequestAlphaLong(request, "bin_col");
		String lotno = this.getRequestString(request, "lotno");

		Map cond = new HashMap();
		if(barcode!=null && barcode > 1L) cond.put("barcode", barcode);
		if(bin_code!=null && bin_code.length() > 0) {
			//if(bin_code.contains("-")) bin_code = bin_code.replaceAll("-", "");
			cond.put("bin_code", "%" + bin_code + "%");
		}
		if(exec_bin_code!=null && exec_bin_code.length() > 0) {
			if(exec_bin_code!=null && exec_bin_code.length() > 0) {
				//if(exec_bin_code.contains("-")) exec_bin_code = exec_bin_code.replaceAll("-", "");
				cond.put("bin_code", exec_bin_code);
			}
		}
		if(wh_code!=null && wh_code.length() > 0) {
			if(wh_code!=null && wh_code.length() > 0) {
				if(wh_code.contains("-")) wh_code = wh_code.replaceAll("-", "");
				cond.put("wh_code", "%" + wh_code + "%");
			}
		}

		if(rack_code!=null && rack_code.length() > 0) {
			if(rack_code!=null && rack_code.length() > 0) {
				//if(rack_code.contains("-")) rack_code = rack_code.replaceAll("-", "");
				cond.put("rack_code", "%" + rack_code + "%");
			}
		}
		if(bin_row!=null && bin_row > 0L) cond.put("bin_row", bin_row);
		if(bin_col!=null && bin_col > 0L) cond.put("bin_col", bin_col);
		if(lotno!=null && lotno.length() > 0) {
			if(lotno!=null && lotno.length() > 0) {
				if(lotno.contains("-")) lotno = lotno.replaceAll("-", "");
				cond.put("lotno", "%" + lotno + "%");
			}
		}

		List<Bin> binList = this.execManager.readBin(uid_company, cond, page);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", binList);
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

	@RequestMapping(params = "method=readBinMan")
	public String readBinMan(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		Long barcode = this.getRequestAlphaLong(request, "barcode");
		String bin_code = this.getRequestString(request, "bin_code");
		String exec_bin_code = this.getRequestString(request, "exec_bin_code");
		String wh_code = this.getRequestString(request, "wh_code");
		String rack_code = this.getRequestString(request, "rack_code");
		Long bin_row = this.getRequestAlphaLong(request, "bin_row");
		Long bin_col = this.getRequestAlphaLong(request, "bin_col");
		String lotno = this.getRequestString(request, "lotno");

		Map cond = new HashMap();
		if(barcode!=null && barcode > 1L) cond.put("barcode", barcode);
		if(bin_code!=null && bin_code.length() > 0) {
			if(bin_code.contains("-")) bin_code = bin_code.replaceAll("-", "");
			cond.put("bin_code", "%" + bin_code + "%");
		}
		if(exec_bin_code!=null && exec_bin_code.length() > 0) {
			if(exec_bin_code!=null && exec_bin_code.length() > 0) {
				if(exec_bin_code.contains("-")) exec_bin_code = exec_bin_code.replaceAll("-", "");
				cond.put("bin_code", exec_bin_code);
			}
		}

		if(wh_code!=null && wh_code.length() > 0) {
			if(wh_code!=null && wh_code.length() > 0) {
				if(wh_code.contains("-")) wh_code = wh_code.replaceAll("-", "");
				cond.put("wh_code", "%" + wh_code + "%");
			}
		}

		if(rack_code!=null && rack_code.length() > 0) {
			if(rack_code!=null && rack_code.length() > 0) {
				if(rack_code.contains("-")) rack_code = rack_code.replaceAll("-", "");
				cond.put("rack_code", "%" + rack_code + "%");
			}
		}
		if(bin_row!=null && bin_row > 0L) cond.put("bin_row", bin_row);
		if(bin_col!=null && bin_col > 0L) cond.put("bin_col", bin_col);
		if(lotno!=null && lotno.length() > 0) {
			if(lotno!=null && lotno.length() > 0) {
				if(lotno.contains("-")) lotno = lotno.replaceAll("-", "");
				cond.put("lotno", "%" + lotno + "%");
			}
		}

		System.out.println("-------------readBinMan----2-----");
		List<BinMan> binList = this.execManager.readBinMan(uid_company, cond, page);
		System.out.println("-------------readBinMan----3-----");

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", binList);
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, this.JsonValueProcessor());
		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();

		System.out.println("-------------readBinMan----4-----");

        response.setHeader("Content-Type", "text/html; charset=UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");
		Writer out = response.getWriter();
	    response.setContentType("application/x-json");
	    out.write(jsonStr);

		System.out.println("-------------readBinMan----5-----");

	    return null;
	}

	@RequestMapping(params = "method=readLocation")
	public String readLocation(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		Long barcode = this.getRequestAlphaLong(request, "barcode");
		Long bin_uid = this.getRequestAlphaLong(request, "bin_uid");
		Long uid_item = this.getRequestAlphaLong(request, "uid_item");

		String item_code = this.getRequestString(request, "item_code");
		String item_name = this.getRequestString(request, "item_name");
		String bin_code = this.getRequestString(request, "bin_code");
		String lotno = this.getRequestString(request, "lotno");

		Map cond = new HashMap();
		if(barcode!=null && barcode > 1L) cond.put("barcode", barcode);
		if(bin_uid!=null && bin_uid > 1L) cond.put("uid_bin", bin_uid);
		if(item_code!=null && item_code.length()>0) cond.put("item_code", "%" + item_code + "%");
		if(item_name!=null && item_name.length()>0) cond.put("item_name", "%" + item_name + "%");
		if(bin_code!=null && bin_code.length()>0) cond.put("bin_code", "%" + bin_code + "%");
		if(uid_item!=null && uid_item>1L) cond.put("uid_item", uid_item);
		if(lotno!=null && lotno.length()>0) cond.put("lotno", "%" + lotno + "%");
		cond.put("over_quan_zero", true);

		List<Location> locationList = this.execManager.readLocation(uid_company, cond, page);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", locationList);
		data.put("count", page.getCount());
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

	@RequestMapping(params = "method=readLocationByUidItem")
	public String readLocationByUidItem(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		Long uid_item = this.getRequestAlphaLong(request, "uid_item");
		String lotno = this.getRequestString(request, "lotno");

		Map cond = new HashMap();
		if(uid_item!=null && uid_item > 1L) cond.put("uid_item", uid_item);
		if(lotno!=null && lotno.length() > 0)cond.put("lotno", "%" + lotno + "%");
		cond.put("over_quan_zero", true);

		List<Location> locationList = this.execManager.readLocation(uid_company, cond, page);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", locationList);
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

	//##DBG 추가 : readLocationByLotNo
	@RequestMapping(params = "method=readLocationByLotNo")
	public String readLocationByLotNo(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		String lotno = this.getRequestString(request, "lotno");

		Map cond = new HashMap();
		if(lotno!=null && lotno.length() > 0) cond.put("lotno", "%" + lotno + "%");
		cond.put("over_quan_zero", true);

		System.out.println("-##DBG--readLocationByLotNo---");
		System.out.println(cond);

		List<Location> locationList = this.execManager.readLocation(uid_company, cond, page);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("result", locationList);
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

	@RequestMapping(params = "method=execWearingBinCode")
	public String execWearingBinCode(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		String lotno = this.getRequestString(request, "set_lotno");//##DBG lotno 추가
		if(uid_company==null || uid_company<1L) return null;

		List<Long> item_uids = this.getRequestUniqueIds(request, "item_uids");
		List<Double> item_quans = this.getRequestDoubles(request, "item_quans");
		String bin_code = this.getRequestString(request, "bin_code");
		String expiration_period = this.getRequestString(request, "expiration_period");
		String supply_name = this.getRequestString(request, "supply_name");
		String batch_lot_id = this.getRequestString(request, "batch_lot_id");
		String supply_lot_number = this.getRequestString(request, "supply_lot_number");
		String supply_company_name = this.getRequestString(request, "supply_company_name");
		String item_id = this.getRequestString(request, "item_id");
		String item_code = this.getRequestString(request, "add_item_code");
		String item_name = this.getRequestString(request, "add_item_name");
		String specification = this.getRequestString(request, "add_specification");
		String detail_info = this.getRequestString(request, "add_detail_info");
		String type = this.getRequestString(request, "add_type");

		if(bin_code==null||bin_code.length()<1) return null;
		if(item_uids==null||item_uids.size()<1 || item_quans==null||item_quans.size()<1) return null;

		List<Bin> binList = this.execManager.getBinInfo(uid_company, bin_code);
		DatabasePage page = this.settingPage(request);

		Long bin_uid = null;
		Map<String, Object> data = new HashMap<String, Object>();

		System.out.println("----:a2----");
		System.out.println(lotno);

		List<Location> locationDetail = this.execManager.readLocationByBinAndItem(uid_company, item_id, bin_code, page);
		if (!locationDetail.isEmpty())
		{
			data.put("result", false);
			data.put("description", "Failed");
		} else {
			if(binList!=null && binList.size()>0) {
				bin_uid = binList.get(0).getUnique_id();
				this.execManager.execWearing(lotno, uid_company, user_uid, user_id, user_name, item_uids, item_quans, bin_uid, expiration_period, supply_name, batch_lot_id, supply_lot_number, supply_company_name, item_id, item_code, item_name, specification, detail_info, type);//##DBG lotno 수정.추가

				data.put("result", true);
			} else {
				data.put("result", false);
			}
		}

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

	@RequestMapping(params = "method=execWearing")
	public String execWearing(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		String lotno = this.getRequestString(request, "set_lotno");//##DBG lotno 추가
		String expiration_period = this.getRequestString(request, "expiration_period");
		String supply_name = this.getRequestString(request, "supply_name");
		String batch_lot_id = this.getRequestString(request, "batch_lot_id");
		String supply_lot_number = this.getRequestString(request, "supply_lot_number");
		String supply_company_name = this.getRequestString(request, "supply_company_name");
		String item_id = this.getRequestString(request, "item_id");
		String item_code = this.getRequestString(request, "add_item_code");
		String item_name = this.getRequestString(request, "add_item_name");
		String specification = this.getRequestString(request, "add_specification");
		String detail_info = this.getRequestString(request, "add_detail_info");
		String type = this.getRequestString(request, "add_type");

		System.out.println("----:a1----");
		System.out.println(lotno);
		if(uid_company==null || uid_company<1L) return null;

		List<Long> item_uids = this.getRequestUniqueIds(request, "item_uids");
		List<Double> item_quans = this.getRequestDoubles(request, "item_quans");
		Long bin_uid = this.getRequestAlphaLong(request, "bin_uid");

		if(bin_uid==null||bin_uid<1L) return null;
		if(item_uids==null||item_uids.size()<1 || item_quans==null||item_quans.size()<1) return null;

		System.out.println("----:a3----");
		System.out.println(lotno);
		this.execManager.execWearing(lotno, uid_company, user_uid, user_id, user_name, item_uids, item_quans, bin_uid, expiration_period, supply_name, batch_lot_id, supply_lot_number, supply_company_name, item_id, item_code, item_name, specification, detail_info, type);//##DBG lotno 수정.추가

		return null;
	}

	@RequestMapping(params = "method=execRelease")
	public String execRelease(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		String lotno = this.getRequestString(request, "set_lotno"); //##DBG lotno 추가
		System.out.println("----:a0----");
		System.out.println(lotno);
		if(uid_company==null || uid_company<1L) return null;

		List<Long> location_uids = this.getRequestUniqueIds(request, "location_uids");
		List<Double> location_quans = this.getRequestDoubles(request, "location_quans");

		if(location_uids==null || location_uids.size()<1 || location_quans==null || location_quans.size()<1) return null;

		this.execManager.execRelease(lotno, uid_company, user_uid, user_id, user_name, location_uids, location_quans); //#3DBG lotno 수정.추가

		return null;
	}

	@RequestMapping(params = "method=execMove")
	public String execMove(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		if(uid_company==null || uid_company<1L) return null;

		List<Long> location_uids = this.getRequestUniqueIds(request, "location_uids");
		List<Double> location_quans = this.getRequestDoubles(request, "location_quans");
		List<String> lotnos = this.getRequestStringList(request, "lotnos");//##DBG lotno 추가
		Long bin_uid = this.getRequestAlphaLong(request, "bin_uid");

		if(location_uids==null || location_uids.size()<1 || location_quans==null || location_quans.size()<1) return null;
		if(bin_uid==null || bin_uid<1L) return null;
		System.out.println("---##DBG-----String execMove(HttpServletRequest request, HttpServletResponse response) throws Exception-----");
		//this.execManager.execMove(uid_company, user_uid, user_id, user_name, location_uids, location_quans, bin_uid);
		this.execManager.execMove(lotnos,uid_company, user_uid, user_id, user_name, location_uids, location_quans, bin_uid); //##DBBG lotno 수정

		return null;
	}

	@RequestMapping(params = "method=readItemHistory")
	public String readItemHistory(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		String apiType = this.getRequestString(request, "apiType");
		String type = this.getRequestString(request, "type");
		String gubun = this.getRequestString(request, "gubun");
		if(type==null || type.length()<1) type = "";

		Map cond = new HashMap();
		cond.put("type", type);
		if(gubun!=null && gubun.length()>0) cond.put("is_inout", gubun);

		Long uid_item = this.getRequestAlphaLong(request, "uid_item");
		if(uid_item!=null && uid_item>1L) cond.put("uid_item", uid_item);

		String start_date = null;
		String end_date = null;

		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());

		switch(type) {
		case "SELECT":
			start_date = this.getRequestString(request, "start_date");
			end_date = this.getRequestString(request, "end_date");

			if(start_date==null || start_date.length()<1) return null;
			if(end_date==null || end_date.length()<1) return null;

			cond.put("select_date", true);
			cond.put("start_date", start_date);
			cond.put("end_date", end_date);
			break;
		case "WEEK":
			cal.add(Calendar.DATE, -7);
			start_date = df.format(cal.getTime());
			end_date = df.format(new Date());

			cond.put("select_date", true);
			cond.put("start_date", start_date);
			cond.put("end_date", end_date);
			break;
		case "MONTH":
			cal.add(Calendar.MONTH, -1);
			start_date = df.format(cal.getTime());
			end_date = df.format(new Date());

			cond.put("select_date", true);
			cond.put("start_date", start_date);
			cond.put("end_date", end_date);
			break;
		}


		Map<String, Object> data = new HashMap<String, Object>();

		switch(apiType) {
			case "ITEM":
				Map itemCond = new HashMap();
				itemCond.put("uid_item", uid_item);
				List<Item> itemList = this.execManager.readItemLocation(uid_company, itemCond, page);
				data.put("datas", itemList);
				break;
			default:
				List<History> historyList = this.execManager.readItemHistory(uid_company, cond, page);
				data.put("datas", historyList);
				break;
		}

		data.put("count", page.getCount());

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

	@RequestMapping(params = "method=readLocationHistory")
	public String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("------##DBG------String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception ------");
		this.printRequestParams(request);
		System.out.println("1");
		DatabasePage page = this.settingPage(request);
		System.out.println("2");

		String command = this.getRequestString(request, "command");

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		String apiType = this.getRequestString(request, "apiType");
		String type = this.getRequestString(request, "type");
		String gubun = this.getRequestString(request, "gubun");
		if(type==null || type.length()<1) type = "";

		String item_code = this.getRequestString(request, "item_code");
		String item_name = this.getRequestString(request, "item_name");
		String bin_code = this.getRequestString(request, "bin_code");

		String his_s_date = this.getRequestString(request, "his_s_date");
		String his_e_date = this.getRequestString(request, "his_e_date");
		String lotno = this.getRequestString(request, "lotno");

		String is_exp_date = this.getRequestString(request, "is_exp_date");
		String batch_lot_id = this.getRequestString(request, "batch_lot_id");
		String supply_name = this.getRequestString(request, "supply_name");
		String supply_lot_number = this.getRequestString(request, "supply_lot_number");
		String supply_company_name = this.getRequestString(request, "supply_company_name");
		System.out.println("--2----##DBG------String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception ------");

		Map cond = new HashMap();
		cond.put("type", type);
		if(gubun!=null && gubun.length()>0) cond.put("is_inout", gubun);

		Long uid_bin = this.getRequestAlphaLong(request, "uid_bin");
		if(uid_bin!=null && uid_bin>1L) cond.put("uid_bin", uid_bin);

		if(item_code!=null && item_code.length()>0) cond.put("item_code", "%" + item_code + "%");
		if(item_name!=null && item_name.length()>0) cond.put("item_name", "%" + item_name + "%");
		if(bin_code!=null && bin_code.length()>0) cond.put("bin_code", "%" + bin_code + "%");
		if(lotno!=null && lotno.length()>0) cond.put("lotno", "%" + lotno + "%");
		if(is_exp_date!=null && is_exp_date.length()>0) cond.put("is_exp_date", is_exp_date);
		if(batch_lot_id!=null && batch_lot_id.length()>0) cond.put("batch_lot_id", "%" + batch_lot_id + "%");
		if(supply_name!=null && supply_name.length()>0) cond.put("supply_name", "%" + supply_name + "%");
		if(supply_lot_number!=null && supply_lot_number.length()>0) cond.put("supply_lot_number", "%" + supply_lot_number + "%");
		if(supply_company_name!=null && supply_company_name.length()>0) cond.put("supply_company_name", "%" + supply_company_name + "%");

		if(his_s_date!=null && his_s_date.length()>0 &&
				his_e_date!=null && his_e_date.length()>0) {
			cond.put("his_date_range", true);
			cond.put("his_s_date", his_s_date);
			cond.put("his_e_date", his_e_date);
		}
		System.out.println("---3---##DBG------String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception ------");

		String start_date = null;
		String end_date = null;

		DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		System.out.println("---4---##DBG------String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception ------");

		switch(type) {
		case "SELECT":
			start_date = this.getRequestString(request, "start_date");
			end_date = this.getRequestString(request, "end_date");

			if(start_date==null || start_date.length()<1) return null;
			if(end_date==null || end_date.length()<1) return null;

			cond.put("select_date", true);
			cond.put("start_date", start_date);
			cond.put("end_date", end_date);
			break;
		case "WEEK":
			cal.add(Calendar.DATE, -7);
			start_date = df.format(cal.getTime());
			end_date = df.format(new Date());

			cond.put("select_date", true);
			cond.put("start_date", start_date);
			cond.put("end_date", end_date);
			break;
		case "MONTH":
			cal.add(Calendar.MONTH, -1);
			start_date = df.format(cal.getTime());
			end_date = df.format(new Date());

			cond.put("select_date", true);
			cond.put("start_date", start_date);
			cond.put("end_date", end_date);
			break;
		}


		Map<String, Object> data = new HashMap<String, Object>();

		System.out.println("-------------<1>-----------");


		switch(apiType) {
		case "ITEM":
			Map itemCond = new HashMap();
			itemCond.put("uid_bin", uid_bin);
			List<Item> itemList = this.execManager.readItemLocation(uid_company, itemCond, page);
			data.put("datas", itemList);
			break;
		default:
			List<History> historyList = new ArrayList<History>();

			if(command!=null && "EXCEL".equals(command)) {
				String excelPath = null;
				page.setLimit(100000);
				historyList = this.execManager.readItemHistory(uid_company, cond, page);
				excelPath = this.excelManager.createHistoryExcel(uid_company, historyList, his_s_date, his_e_date, gubun);
				data.put("result", excelPathEnv);
				// data.put("result", excelPath);
			} else {
				System.out.println("-------------<2>-----------");
				historyList = this.execManager.readItemHistory(uid_company, cond, page);
				System.out.println("-------------<3>-----------");
				data.put("datas", historyList);
				System.out.println("-------------<4>-----------");


			}
			break;
		}
		System.out.println("---5---##DBG------String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception ------");

		cond.put("is_inout", "IN");
		Integer totalHistoryIn = this.execManager.countItemHistory(uid_company, cond);
		data.put("total_in", totalHistoryIn);

		cond.remove("is_inout");
		cond.put("is_inout", "OUT");
		Integer totalHistoryOut = this.execManager.countItemHistory(uid_company, cond);
		data.put("total_out", totalHistoryOut);

		data.put("count", page.getCount());
		System.out.println("---6---##DBG------String readLocationHistory(HttpServletRequest request, HttpServletResponse response) throws Exception ------");

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

	@RequestMapping(params = "method=readItemSafeQuan")
	public String readItemSafeQuan(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;

		Long uid_item = this.getRequestAlphaLong(request, "uid_item");

		Map cond = new HashMap();

		if(uid_item!=null && uid_item>1L) cond.put("unique_id", uid_item);

		List<Item> itemList = this.execManager.readItemSafeQuan(uid_company, cond, page);

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", itemList);
		data.put("count", page.getCount());

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

	@RequestMapping(params = "method=readBinRate")
	public String readBinRate(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		Long uid_bin = this.getRequestAlphaLong(request, "uid_bin");
		if(uid_bin==null || uid_bin<1L) return null;

		Map cond = new HashMap();

		cond.put("uid_company", uid_company);
		cond.put("uid_bin", uid_bin);

//		List<Rack> rackList = this.execManager.readBinRate(cond);

		// 1. BIN UID 값으로 해당 창고 전체 Rack 정보 조회
		List<Rack> rackList = this.execManager.getRackListByUidBIN(uid_company, uid_bin);
		// 2. BIN UID 값으로 해당 창고 전체 사용중인 BIN 정보 조회
		List<Bin> binList = this.execManager.getUsingBinList(uid_company, uid_bin);

		if(rackList!=null && rackList.size()>0 && binList!=null && binList.size()>0) {
			for(Rack r : rackList) {
				Long uidRack = r.getUnique_id();
				Integer totalBin = r.getRow_cnt() * r.getCol_cnt();
				r.setTotal_bin(totalBin);
				int use = 0;
				for(Bin b : binList) {
					Long uidBin = b.getUid_rack();
					if(uidRack.compareTo(uidBin) == 0) {
						use++;
					}
				}
				r.setUse_bin(use);
			}
		}

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", rackList);
		data.put("count", page.getCount());

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

	@RequestMapping(params = "method=readWhouseRackRate")
	public String readWhouseRackRate(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		if(uid_company==null || uid_company<1L) return null;
		Long uid_whouse = this.getRequestAlphaLong(request, "uid_whouse");
		if(uid_whouse==null || uid_whouse<1L) return null;

		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_whouse", uid_whouse);


		// 1. WHOUSE UID 값으로 창고에 속한 모든 Rack 조회
		List<Rack> rackList = this.execManager.getRackListByUidWhouse(uid_company, uid_whouse);
		// 2. WHOUSE UID 값으로 창고에 속한 모든 Rack 중에 사용중인 BIN 조회
		List<Bin> binList = this.execManager.getUsingBinListByWhouseUid(uid_company, uid_whouse);

//		// 전체BIN
//		int totalBin = 0;
//		if(rackList!=null && rackList.size()>0) {
//			for(Rack rack : rackList) {
//				int tBin = rack.getRow_cnt() * rack.getCol_cnt();
//				totalBin += tBin;
//			};
//		};

		if(rackList!=null && rackList.size()>0 && binList!=null && binList.size()>0) {
			int total_bin = 0;
			int use_bin = 0;
			for(Rack r : rackList) {
				Long uidRack = r.getUnique_id();
				Integer totalBin = r.getRow_cnt() * r.getCol_cnt();
				r.setTotal_bin(totalBin);
				total_bin += totalBin;
				int use = 0;
				for(Bin b : binList) {
					Long uidBin = b.getUid_rack();
					if(uidRack.compareTo(uidBin) == 0) {
						use++;
					}
				}
				r.setUse_bin(use);
				use_bin += use;
			};

			// 맨위에 종합으로 1건 추가
			Rack r1 = rackList.get(0);
			Rack sumRack = new Rack();
			sumRack.setUnique_id(1L);
			sumRack.setRack_code(r1.getWh_code());
			sumRack.setRack_name(r1.getWh_name());
			sumRack.setWh_code(r1.getWh_code());
			sumRack.setWh_name(r1.getWh_name());
			sumRack.setTotal_bin(total_bin);
			sumRack.setUse_bin(use_bin);

			rackList.add(0, sumRack);
		}

		Map<String, Object> data = new HashMap<String, Object>();
		data.put("datas", rackList);
		data.put("count", page.getCount());

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

	@RequestMapping(params = "method=execUpdateQuan")
	public String execUpdateQuan(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		Long uid_location = this.getRequestAlphaLong(request, "uid_location");
		Double quan = this.getRequestDouble(request, "quan");

		if(uid_company==null || uid_company<1L) return null;
		if(uid_location==null || uid_location<1L) return null;
		if(quan==null) return null;

		Map cond = new HashMap();
		cond.put("quan", quan);
		cond.put("unique_id", uid_location);

		this.execManager.execUpdateQuan(uid_company, user_uid, user_id, user_name, cond);

		return null;
	}

	@RequestMapping(params = "method=manageRackData")
	public String manageRackData(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company");
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");
		if(uid_company==null || uid_company<1L) return null;

		String type = this.getRequestString(request, "type");
		String rack_barcode = this.getRequestString(request, "rack_barcode");
		String wh_name = this.getRequestString(request, "wh_name");
		String rack_name = this.getRequestString(request, "rack_name");
		Integer rack_row = this.getRequestInteger(request, "rack_row");
		Integer rack_col = this.getRequestInteger(request, "rack_col");

		if(type==null || type.length()<1) return null;
		if(rack_barcode==null || rack_barcode.length()<1) return null;
		if(rack_row==null || rack_row<1) return null;
		if(rack_col==null || rack_col<1) return null;

		this.execManager.manageRackData(uid_company, user_uid, user_id, user_name,
				type, rack_barcode, wh_name, rack_name, rack_row, rack_col);

		return null;
	}

	@RequestMapping(params = "method=locationExcelUpload")
	public String locationExcelUpload(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestString(request, "user_id");
		String user_name = this.getRequestString(request, "user_name");

		String result = this.execManager.ExcelUploadLocationTemplate(uid_company, user_uid, user_id, user_name, request, response);

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

	@RequestMapping(params = "method=stockExcelDownLoad")
	public String stockExcelDownLoad(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		String codeType = this.getRequestUtf(request, "codeType");

		Map cond = new HashMap();
		cond.put("over_quan_zero", true);

		List<Location> locationList = this.execManager.readLocation(uid_company, cond, page);

		String excelPath = null;

		if(locationList!=null && locationList.size()>0) {
			String barcodeFolder = this.execManager.createBinCodeBarcode(uid_company, locationList,codeType);
			excelPath = this.execManager.createLocationExcelTemplate(uid_company, locationList, barcodeFolder, codeType);
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

	@RequestMapping(params = "method=stockTemplateDownLoad")
	public String stockTemplateDownLoad(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		DatabasePage page = this.settingPage(request);
		page.setLimit(50000);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값

		String excelPath = null;

		excelPath = this.execManager.createLocationTemplate(uid_company);

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

	@RequestMapping(params = "method=adjustLocationQuan")
	public String adjustLocationQuan(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestUtf(request, "user_id");
		String user_name = this.getRequestUtf(request, "user_name");
		List<Long> uid_locations = this.getRequestUniqueIds(request, "uid_locations");
		List<Double> location_quans = this.getRequestDoubles(request, "location_quans");

		if(uid_company==null || uid_company<1L) return null;
		if(uid_locations==null || uid_locations.size()<1) return null;
		if(location_quans==null || location_quans.size()<1) return null;

		boolean result = this.execManager.adjustLocationQuan(uid_company, user_uid, user_id, user_name, uid_locations, location_quans);

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

	@RequestMapping(params = "method=searchStockTypeCombo")
	public String searchStockTypeCombo(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);
		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		if(uid_company==null || uid_company<1L) return null;

		String selectType = this.getRequestUtf(request, "selectType");
		String value = this.getRequestUtf(request, "value");

		if(selectType==null || selectType.length()<1) return null;
//		if(value==null || value.length()<1) return null;
		if(value==null || value.length()<1) value = "";

		Map cond = new HashMap();

		Map<String, Object> data = new HashMap<String, Object>();
		switch(selectType) {
			case "BIN":   // BIN 단위
				cond.put("bin_code", "%" + value + "%");
				List<Bin> binList = this.execManager.readBin(uid_company, cond, page);
				data.put("datas", binList);
				break;
			case "WHOUSE": // 창고
				cond.put("wh_code", "%" + value + "%");
				List<Whouse> whouseList = this.execManager.readWhouse(uid_company, cond, page);
				data.put("datas", whouseList);
				break;
			case "RACK":   // 동
				cond.put("rack_code", "%" + value + "%");
				List<Rack> rackList = this.execManager.readRack(uid_company, cond, page);
				data.put("datas", rackList);
				break;
		}

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

	@RequestMapping(params = "method=searchStockTypeDatas")
	public String searchStockTypeDatas(HttpServletRequest request, HttpServletResponse response) throws Exception {

		this.printRequestParams(request);
		DatabasePage page = this.settingPage(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // �븘�닔媛�
		if(uid_company==null || uid_company<1L) return null;

		String selectType = this.getRequestUtf(request, "selectType");
		String value = this.getRequestUtf(request, "value");

		if(selectType==null || selectType.length()<1) return null;
		if(value==null || value.length()<1) return null;

		Map sumCond = new HashMap();
		Map cond = new HashMap();

		String key = null;

		switch(selectType) {
		case "BIN": // BIN 단위
			key = "bin_code";
			break;
		case "WHOUSE": // 창고
			key = "wh_code";
			break;
		case "RACK":   // 동
			key = "rack_code";
			break;
		}

		sumCond.put(key, value);
		sumCond.put("uid_company", uid_company);
		cond.put(key, value);

		List<Location> sumRack = this.execManager.getSumRackLocation(sumCond);
		List<Location> locationList = this.execManager.getGroupLocation(uid_company, cond, page);

		Map sumResult = new HashMap();
		if(sumRack!=null && sumRack.size()>0) {
			int count = sumRack.size();
			int total_quan = 0;
			for(Location loc : sumRack) {
				Double sum_quan = loc.getSum_quan();
				total_quan += sum_quan;
			}
			sumResult.put("total_quan", total_quan);
			sumResult.put("count", count);
		}

		Map<String, Object> data = new HashMap<String, Object>();
//		data.put("sum", sumRack);
		data.put("sum", sumResult);
		data.put("datas", locationList);
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

	@RequestMapping(params = "method=webRegistLocationData")
	public String webRegistLocationData(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		if(uid_company==null || uid_company<1L) return null;

		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestUtf(request, "user_id");
		String user_name = this.getRequestUtf(request, "user_name");

		String wh_code = this.getRequestString(request, "wh_code");
		String rack_code = this.getRequestString(request, "rack_code");
		Integer row = this.getRequestInteger(request, "row");
		Integer col = this.getRequestInteger(request, "col");
		Integer capacity = this.getRequestInteger(request, "capacity");

		if(wh_code==null || wh_code.length()<1) return null;
		if(rack_code==null || rack_code.length()<1) return null;
		if(row==null || row<1) return null;
		if(col==null || col<1) return null;

		this.execManager.webRegistLocationData(uid_company, user_uid, user_id, user_name,
				wh_code, rack_code, row, col, capacity);

		return null;
	}

	@RequestMapping(params = "method=cancelInOut")
	public String cancelInOut(HttpServletRequest request, HttpServletResponse response) throws Exception {
		this.printRequestParams(request);

		Long uid_company = this.getRequestAlphaLong(request, "uid_company"); // 필수값
		if(uid_company==null || uid_company<1L) return null;

		List<Long> unique_id_list = this.getRequestUniqueIds(request, "unique_id_list");
		if(unique_id_list==null || unique_id_list.size()<1) return null;

		Long user_uid = this.getRequestAlphaLong(request, "user_uid");
		String user_id = this.getRequestUtf(request, "user_id");
		String user_name = this.getRequestUtf(request, "user_name");

		this.execManager.cancelInOut(uid_company, user_uid, user_id, user_name,
				unique_id_list);

		return null;
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
}
