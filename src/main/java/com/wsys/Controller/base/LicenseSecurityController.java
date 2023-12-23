package com.wsys.Controller.base;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.wsys.dao.base.CommonDao;
import com.wsys.security.SessionSecurityManagerCore;
import com.wsys.vo.SystemInfo;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


public class LicenseSecurityController {

	@Resource(name="systemInfo")
	protected SystemInfo systemInfo;

	private static final String ALPAHA_NUMERIC	= "ABCDEFGHIJKLMNOPQRSTUVWXYZ_-01234567890#";

	private DecimalFormat 	decimalFormat = new DecimalFormat("#,###.##");

	protected SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	protected SimpleDateFormat dateFormatSimple = new SimpleDateFormat("yyMMdd");
	protected SimpleDateFormat dateFormatLong = new SimpleDateFormat("yyyyMMddHHmmssSSS");
	protected SimpleDateFormat dateLongFormat1 = new SimpleDateFormat("yyyy-MM-dd HH:mm");
	protected SimpleDateFormat dateLongFormat2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	protected SimpleDateFormat dateLongFormat3 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss SSS");

	//페이지당 처리할 수 있는 최대 멀티Request의 갯수
	protected int MAX_RECORD_QUAN	=	512;
	protected int MAX_RECORD_QUAN_HW	=	10000;

	protected Log logger = LogFactory.getLog( getClass() );

//	public String getThis_userid(HttpServletRequest request) {
//
//		return SessionSecurityManagerCore.getThis_userId(request);
//	}

	private boolean checkPermission() throws Exception {
		Date toDay = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		String strDate = dateFormat.format(toDay);

//		if(Integer.parseInt(strDate)>20160418) {
//			System.out.println("checkPermission: " + strDate);
//			throw new Exception("Not Found Kernel License.");
//		}

		return true;
	}

//	public Long getThis_useruid(HttpServletRequest request) throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getThis_userUid(request);
//	}
//
//	public Long getThis_cstmstuid(HttpServletRequest request) throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getThis_cstmstUid(request);
//	}
//
//	public Long getThis_commstuid(HttpServletRequest request)  throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getThis_commstUid(request);
//	}
//
//
//	public String getThis_user_name(HttpServletRequest request)  throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getThis_userName(request);
//	}
//
//	public String getThis_companyCode(HttpServletRequest request) throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getThis_companyCode(request);
//	}
//
//	public String getThis_companyName(HttpServletRequest request) throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getThis_companyName(request);
//	}
//
//	public String getCur_menuCode(HttpServletRequest request)  throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getCur_menuCode(request);
//	}
//
//	public String getCur_menuName(HttpServletRequest request)  throws Exception {
//
//		checkPermission();	return SessionSecurityManagerCore.getCur_menuName(request);
//	}

	public Long getThis_useruid(HttpServletRequest request) throws Exception {

		checkPermission();	return SessionSecurityManagerCore.getThis_userUid(request);
	}

	public String getThis_userid(HttpServletRequest request) throws Exception {

		checkPermission();	return SessionSecurityManagerCore.getThis_userId(request);
	}

	public String getThis_username(HttpServletRequest request) throws Exception {

		checkPermission();	return SessionSecurityManagerCore.getThis_userName(request);
	}

	public Long getThis_uidCompany(HttpServletRequest request) throws Exception {

		checkPermission();	return SessionSecurityManagerCore.getThis_uidCompany(request);
	}

	public String getThis_cpCode(HttpServletRequest request) throws Exception {

		checkPermission();	return SessionSecurityManagerCore.getThis_cpCode(request);
	}

	public String getThis_cpName(HttpServletRequest request) throws Exception {

		checkPermission();	return SessionSecurityManagerCore.getThis_cpName(request);
	}

	public int String2Integer(String str)
	{
		try
		{
			return Integer.parseInt(str);
		}
		catch(NumberFormatException e)
		{
			return 0;
		}
	}

	public Double String2Double(String value) {
		if(value==null) {
			return 0.0;
		}
		if(value.length()==0) {
			return 0.0;
		}

		Number number = null;
		try {
			number = decimalFormat.parse(value);
		} catch (ParseException e) {
			return 0.0;
		}
		return number.doubleValue();
	}

	public Date String2Date(String value) {
		String ret= value;

		if(value==null || value.length()==0) {
			ret = "0000/00/00";
			return null;
		}
		Date date = null;
		try {
			ret = ret.replaceAll("/", "-");
			date = dateFormat.parse(ret);
		} catch (ParseException e) {}

		return date;
	}

	public Date String2LongDate(String value) {
		String ret= value;

		if(value==null || value.length()==0) {
			ret = "0000/00/00";
		}
		Date date = null;
		try {
			date = dateFormat.parse(ret);
//			date = dateLongFormat2.parse(ret);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return date;
	}

	public String Double2String(Double value) {
		if(value==null) {
			return "0.0";
		}

		return decimalFormat.format(value);
	}

	protected String getRequestUtf(HttpServletRequest request, String name) {
    	String value = request.getParameter(name);
    	if(value==null) {
    		return "";
    	} else {

    		return UtfStringConv(value);
    	}
    }

	protected String getRequestUtfEnconding(HttpServletRequest request, String name) {
    	String value = request.getParameter(name);
    	if(value==null) {
    		return "";
    	} else {

    		String encoding = null;
    		try {
				encoding = new String(UtfStringConv(value).getBytes("8859_1"), "UTF-8");

			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    		return encoding;
    	}
    }

	public String getRequestString(HttpServletRequest request, String argment, String def) {
		String ret = request.getParameter( argment );
		if(ret==null) {
			return def;
		} else {
			return ret.trim();
		}
	}

	public String getRequestString(HttpServletRequest request, String argment) {
		String ret = request.getParameter( argment );
		if(ret==null)
			return "";
		return ret/*.replaceAll("\"",  "")*/.trim();
	}

	public String[] getRequestStringArr(HttpServletRequest request, String argment) {

		String[] arr = request.getParameterValues(argment);
		if(arr == null) {
			return null;
		} else {
			return (arr.length==1) ? arr[0].split("[,]") : arr;
		}

	}

	public List<String> getRequestStringList(HttpServletRequest request, String argment) {
		List<String> list = new ArrayList<String>();
		String[] arr = getRequestStringArr( request, argment);

		if(arr!=null) {
			for(String val : arr) {
				list.add(val);
			}
		}
		return list;
	}

	protected Long[] getRequestUniqueIdArr(HttpServletRequest request, String paramName) {

		String in     	= request.getParameter(paramName);
		if(in==null) {
			return null;
		}
		String[] strUids = in.split("[,]");

		if(strUids==null || strUids.length==0) {
			return null;
		}

		Long[] uids = new Long[strUids.length];
		for(int i=0; i<strUids.length; i++ ) {
			uids[i] = Long.parseLong(strUids[i]);
		}

		return uids;
	}

	protected List<Long> getRequestUniqueIds(HttpServletRequest request, String paramName) {
		String[] strUids     	= request.getParameterValues(paramName);

		List<Long> listUids = new ArrayList<Long>();

		if(strUids!=null) {

			for(String strUid : strUids) {
				if(strUid!=null && strUid.length()>0) {
					String[] arr = strUid.split("[,]");
					for(String s : arr) {
						if(s!=null && s.length()>0) {
							Long uid = -1L;
							try {
								uid = Long.parseLong(s);
							} catch (Exception e) {
								uid = -1L;
							}
							listUids.add( uid );
						}
					}
				}

			}
		}

		return listUids;
	}

	/**
	 * N: Unchecked
	 * Y: Checked
	 * */
	public String getRequestCheckbox(HttpServletRequest request, String argment) {
		String ret = request.getParameter( argment );
		if(ret==null)
			return "N";
		return ret.trim();
	}


	public int getRequestInteger(HttpServletRequest request, String argment) {
		try {
			String ret = request.getParameter( argment ).trim();
			if(ret==null || ret.length()<1)
				return -1;
			return String2Integer(ret);
		} catch(Exception e) {return -1;}
	}


	public long getRequestAlphaLong(HttpServletRequest request, String argment) {
		String ret = request.getParameter( argment );
		if(ret==null || ret.length()<1)
			return -1;
		return Long.parseLong(ret);
	}

	public Double getRequestDouble(HttpServletRequest request, String argment) {
		String ret = request.getParameter( argment );
		if(ret==null)
			return 0.0;
		return String2Double(ret);
	}

	public Date getRequestDate(HttpServletRequest request, String argment) {
		String ret = request.getParameter( argment );
		if(ret==null)
			ret = "0000/00/00";
		if(ret.length()<12) {
			return String2Date(ret);
		} else {
			return String2LongDate(ret);
		}
	}

	public int	getRequestUniqueIds(HttpServletRequest request, String argment, long[] int_uid) {

		String[] str_uids		= request.getParameterValues(argment);

		if(str_uids==null)
			return -1;
		int quan = str_uids.length;

		if(quan==0) {
			return quan;
		}

		if(quan>MAX_RECORD_QUAN)
			quan=MAX_RECORD_QUAN;

		for(int i=0; i < quan; i++) {
			int_uid[i]		=	Integer.parseInt(str_uids[i]);
		}
		return quan;
	}

	public List<Double> getRequestDoubles(HttpServletRequest request, String argment) {
		List<Double> list = new ArrayList<Double>();
		String[] arr = getRequestStrings( request, argment);

		if(arr!=null) {
			for(String val : arr) {
				list.add(String2Double(val));
			}
		}
		return list;
	}

	public String[] getRequestStrings(HttpServletRequest request, String argment) {

		String[] arr = request.getParameterValues(argment);
		if(arr == null) {
			return null;
		} else {
			return (arr.length==1) ? arr[0].split("[,]") : arr;
		}

	}

	public long createRandNumber() {
		Random ran = new Random();
		long iRand = ran.nextLong();
		if(iRand < 0) {
			return (-1)* iRand;
		}
		return iRand;
	}


    protected String[] getRequestUtfList(HttpServletRequest request, String name) {
    	String[] strings = this.getRequestStringArr(request, name);

    	if(strings==null || strings.length==0) {
    		return strings;
    	}
    	for(int i=0; i<strings.length; i++) {
    		strings[i] = UtfStringConv(strings[i]);
    	}

    	return strings;
    }

    protected String UtfStringConv(String in) {
		String value1 = in.replaceAll("\"", "");
		Pattern unicode = Pattern.compile("\\\\u(.{4})");
		Matcher matcher = unicode.matcher(value1);
		StringBuffer sb = new StringBuffer();
		while (matcher.find()) {
		    int code = Integer.parseInt(matcher.group(1), 16);
		    matcher.appendReplacement(sb, new String(Character.toChars(code)));
		}
		matcher.appendTail(sb);

		return  sb.toString();

    }

//    protected CommonDao getVoByTablename(String tableName, String className, JSONObject obj) {
//
//    	//풀 클레스 명이 있으면 찾고 없으면 alias를 찾는다.
//    	if(className!=null) {
//	    	try {
//				return (CommonDao)JSONObject.toBean(obj, Class.forName(className));
//			} catch (ClassNotFoundException noError) {}
//    	}
//
//    	switch(tableName.toLowerCase()) {
//
////	    	case "commst" : 			return (CommonDao)JSONObject.toBean(obj, com.msys.mes.vo.master.ComMst.class);
////	    	case "cstmst" : 			return (CommonDao)JSONObject.toBean(obj, com.msys.mes.vo.master.CstMst.class);
////	    	case "divmst" : 			return (CommonDao)JSONObject.toBean(obj, com.msys.mes.vo.master.DivMst.class);
////	    	case "depmst" : 			return (CommonDao)JSONObject.toBean(obj, com.msys.mes.vo.master.DepMst.class);
//	//    	case "cominfo" : 			return (CommonDao)JSONObject.toBean(obj, com.msys.mes.vo.ComInfo.class);
//    	default:
//    		new Exception("unlnown table alias name");
//    	}
//
//    	return null;
//    }

    private Date startTime;
    private String callCont;

    protected void printRequest(HttpServletRequest req) throws Exception {

    	this.startTime = new Date();

    	callCont = "";
    	try {
    		callCont = "########### START TIME:" + dateLongFormat3.format(startTime);
    	} catch(Exception e) {}
    	callCont = callCont + " | " + req.getRequestURI() + " >>>> ";;

    	StringBuffer sb = new StringBuffer();
    	//logger.info("######################################################");

		for (Enumeration e = req.getParameterNames() ; e.hasMoreElements() ;) {
			String parameterName = (String) e.nextElement();
			String[] parameterValues = req.getParameterValues(parameterName);
			int parameterValuesLength = (parameterValues != null) ? parameterValues.length : 0;
			for(int i=0; i < parameterValuesLength; i++) {
				String value = UtfStringConv(parameterValues[i]);
				//String utfValue = UtfStringConv(value);
				sb.append(parameterName + "=");
				sb.append(value + "\n");
				callCont = callCont + "|" +  parameterName + "=" + value;
			}
		}
		System.out.print(sb.toString());
		//logger.info("######################################################");

    }


    protected String getReauestParamAll(HttpServletRequest request) {
    	StringBuffer sb = new StringBuffer();
		for (Enumeration e = request.getParameterNames() ; e.hasMoreElements() ;) {
			String parameterName = (String) e.nextElement();
			String[] parameterValues = request.getParameterValues(parameterName);
			int parameterValuesLength = (parameterValues != null) ? parameterValues.length : 0;
			for(int i=0; i < parameterValuesLength; i++) {
				String value = UtfStringConv(parameterValues[i]);
				//String utfValue = UtfStringConv(value);
				sb.append(parameterName + "=");
				sb.append(value + "|");
			}
		}
		return sb.toString();
    }

    protected void printOutJson(Writer out, String jsonStr, boolean silent) throws IOException {

		if(silent==true) {
	    	out.write(jsonStr);
		} else {
			printOutJson(out, jsonStr);
		}


    }

    protected void printSafeJson(Writer out, Object value) throws IOException {
    	Map<String, Object> map = new HashMap<String, Object>();
    	map.put("result", value);
    	String jsonStr = JSONObject.fromObject(map).toString();
    	printOutJson(out, jsonStr);
    }

    protected void printOutJson(Writer out, String jsonStr) throws IOException {

    	/**
    	 * Silent Send.
    	 */
    	try {
        	Date endTime = new Date();

        	if(startTime!=null && this.callCont!=null) {
        		System.out.println(this.callCont);
        		System.out.println("########### elapsed  :" + new Long(endTime.getTime()-startTime.getTime() ));
        	}
        	System.out.println("########### END TIME :" + dateLongFormat3.format(endTime));
    	} catch(Exception e) {}

    	this.startTime = null;
		this.callCont = null;
    	out.write(jsonStr);

    }


    protected void printOutJson(HttpServletResponse response, String jsonStr) throws IOException {
    	Date endTime = new Date();

    	if(startTime!=null && this.callCont!=null) {
    		System.out.println(this.callCont);
    		System.out.println("########### elapsed  :" + new Long(endTime.getTime()-startTime.getTime() ));
    	}
    	System.out.println("########### END TIME :" + dateLongFormat3.format(endTime));
    	this.startTime = null;
		this.callCont = null;

		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		Writer out = response.getWriter();
		response.setContentType("application/x-json");
    	out.write(jsonStr);
    }


	protected void writeAjax(boolean force, HttpServletResponse response, String jsonStr) throws IOException {

		if(force==true){
			writeAjaxForce(response, jsonStr);
		} else {
			writeAjax(response, jsonStr);
		}
	}

	protected void writeAjax(HttpServletResponse response, String jsonStr) throws IOException {
		//logger.debug("결과값################################################################");
		//logger.debug(jsonStr);
		//logger.debug("결과값################################################################");

        response.setHeader("Content-Type", "text/html; charset=UTF-8");

		Writer out = response.getWriter();
		response.setContentType("application/x-json");
	    printOutJson(out, jsonStr);

	}
	protected void writeAjaxForce(HttpServletResponse response, String inStr) throws IOException {
        response.setHeader("Content-Type", "text/html; charset=UTF-8");

		Writer out = response.getWriter();
		response.setContentType("application/x-json");

		String jsonStr = inStr;

		if(jsonStr==null) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("result", "null");

			jsonStr = JSONObject.fromObject(map).toString();

		} else {

			try {
				JSONObject.fromObject(jsonStr);
			} catch(Exception e) {

				Map<String, Object> map = new HashMap<String, Object>();
				map.put("result", inStr);

				jsonStr = JSONObject.fromObject(map).toString();
			}
		}


	    printOutJson(out, jsonStr);

	}
}
