package com.wsys.service.admin;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.wsys.util.DatabasePage;
import com.wsys.vo.Bin;
import com.wsys.vo.BinMan;
import com.wsys.vo.Company;
import com.wsys.vo.History;
import com.wsys.vo.Item;
import com.wsys.vo.Location;
import com.wsys.vo.Menu;
import com.wsys.vo.Rack;
import com.wsys.vo.User;
import com.wsys.vo.Whouse;

public interface ExecManager {

	public List<Item> readItem(Long uid_company, Map cond, DatabasePage page);

	public List<Bin> readBin(Long uid_company, Map cond);
	public List<Bin> readBin(Long uid_company, Map cond, DatabasePage page);
	public List<BinMan> readBinMan(Long uid_company, Map cond);
	public List<BinMan> readBinMan(Long uid_company, Map cond, DatabasePage page);

	public void execWearing(String lotno, Long uid_company, Long user_uid, String user_id, String user_name, List<Long> item_uids,
			List<Double> item_quans, Long bin_uid, Date exp_date) throws Exception;//##DBG lotno ����.�߰�

	public void execRelease(String lotno, Long uid_company, Long user_uid, String user_id, String user_name, List<Long> location_uids,
			List<Double> location_quans) throws Exception;//##DBG lotno ����.�߰�

	public void execMove(Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> location_uids, List<Double> location_quans, Long bin_uid) throws Exception;

	public void execMove(List<String> lotnos, Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> location_uids, List<Double> location_quans, Long bin_uid) throws Exception; //##DBG lotno �߰�

	public List<Location> readLocation(Long uid_company, Map cond, DatabasePage page);

	public List<Location> readLocationByItem(Long uid_company, Map cond, DatabasePage page);

	//##DBG 추가 : readLocationByLotNo
	public List<Location> readLocationByLotNo(Long uid_company, Map cond, DatabasePage page);

	public List<History> readItemHistory(Long uid_company, Map cond, DatabasePage page);

	public List<Item> readItemLocation(Long uid_company, Map itemCond, DatabasePage page);

	public List<Item> readItemSafeQuan(Long uid_company, Map cond, DatabasePage page);

	public List<Rack> readBinRate(Map cond);

	public List<Rack> getRackListByUidBIN(Long uid_company, Long uid_bin);

	public List<Bin> getUsingBinList(Long uid_company, Long uid_bin);

	public Long addItem(Long uid_company, Long user_uid, String user_id, String user_name, Item item);

	public void removeItem(Long uid_company, Map cond, Long user_uid, String user_id, String user_name);

	public void editItem(Long uid_company, Map cond, Long user_uid, String user_id, String user_name);

	public void execUpdateQuan(Long uid_company, Long user_uid, String user_id, String user_name, Map cond);

	public void manageRackData(Long uid_company, Long user_uid, String user_id, String user_name, String type,
			String rack_barcode, String wh_name, String rack_name, Integer rack_row, Integer rack_col) throws Exception;

	public String ExcelUploadItemTemplate(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String ExcelUploadLocationTemplate(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception;

	public String createItemExcelTemplate(Long uid_company, List<Item> listList, String barcodeFolder, String type);

	public String createLocationExcelTemplate(Long uid_company, List<Location> locationList, String barcodeFolder);
	public String createLocationExcelTemplate(Long uid_company, List<Location> locationList, String barcodeFolder, String type);
	public String createBinExcelTemplate(Long uid_company, List<Bin> binList, List<Map<String, Object>> whouseGroup, String barcodeFolder);

	public boolean adjustLocationQuan(Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> uid_locations, List<Double> location_quans);

	public String createItemBarcode(Long uid_company, List<Item> listList, String type);
	public String createBinCodeBarcode(Long uid_company, List<Location> locationList);
	public String createBinCodeBarcode(Long uid_company, List<Location> locationList, String type);
	public String createBarcodeBinData(Long uid_company, List<Bin> binList);

	public String createItemTemplate(Long uid_company);
	public String createLocationTemplate(Long uid_company);

	public List<Bin> getBinInfo(Long uid_company, String bin_code);
	public List<BinMan> getBinManInfo(Long uid_company, String bin_code);

	public List<Location> getSumRackLocation(Map sumCond);

	public List<Location> getGroupLocation(Long uid_company, Map cond, DatabasePage page);

	public List<Whouse> readWhouse(Long uid_company, Map cond, DatabasePage page);

	public List<Rack> readRack(Long uid_company, Map cond, DatabasePage page);

	public List<Rack> getRackListByUidWhouse(Long uid_company, Long uid_whouse);

	public List<Bin> getUsingBinListByWhouseUid(Long uid_company, Long uid_whouse);

	public void webRegistLocationData(Long uid_company, Long user_uid, String user_id, String user_name, String wh_code,
			String rack_code, Integer row, Integer col) throws Exception;

	public List<Map<String, Object>> getRackGroup(Long uid_company, Long uid_whouse);

	public String deleteItem(Long uid_company, Long user_uid, String user_id, String user_name, Long unique_id);

	public void cancelInOut(Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> unique_id_list);

	public String createBinExcelTemplate(Long uid_company, List<Bin> binList, List<Rack> whouseGroup,
			String barcodeFolder, String type); //##DBG 추가
	public String createBarcodeBinData(Long uid_company, List<Bin> binList, String type); //##DBG추가
}
