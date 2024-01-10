package com.wsys.service.admin;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.wsys.vo.History;
import com.wsys.vo.Item;

public interface ExcelManager {

	public String ExcelWearingUpload(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String ExcelReleaseUpload(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String ExcelStockMoveUpload(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String createWearingTemplate(Long uid_company);
	public String createReleaseTemplate(Long uid_company);
	public String createStockMoveTemplate(Long uid_company);

	public byte[] createHistoryExcel(Long uid_company, List<History> historyList, String s_date, String e_date, String gubun);

	public String createStockMgmtExcel(Long uid_company, List<Item> itemList);
}
