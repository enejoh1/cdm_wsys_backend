package com.wsys.service.admin;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.util.ImageUtils;
import org.apache.poi.util.IOUtils;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFCreationHelper;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFPicture;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFShape;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
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

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sourceforge.barbecue.Barcode;
import net.sourceforge.barbecue.BarcodeFactory;
import net.sourceforge.barbecue.BarcodeImageHandler;

@Service("ExecManager")
public class DefaultExecManager extends ExtendDaoExecManager implements InitializingBean {

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Item> readItem(Long uid_company, Map cond, DatabasePage page) {
		return this.itemDao.select_cond(uid_company, "item", cond, page);
	}

	@Override
	public List<Bin> readBin(Long uid_company, Map cond) {
		return this.binDao.select_cond(uid_company, "bin", cond);
	}

	@Override
	public List<Bin> readBin(Long uid_company, Map cond, DatabasePage page) {
		return this.binDao.select_cond(uid_company, "bin", cond, page);
	}

	@Override
	public List<BinMan> readBinMan(Long uid_company, Map cond) {
		return this.binManDao.select_cond(uid_company, "binMan", cond);
	}

	@Override
	public List<BinMan> readBinMan(Long uid_company, Map cond, DatabasePage page) {
		System.out.println("------readBinMan------30-----");
		System.out.println(cond);
		System.out.println(page);
		return this.binManDao.select_cond(uid_company, "binMan", cond, page);
	}

	// ##DBG lotno 수정.추가
	public void addLocationHistory(String lotno, Long uid_company, Long user_uid, String user_id, String user_name,
			Long uid_location, String is_inout, Double quan, Date date) throws Exception {
		History history = new History();
		history.setUid_location(uid_location);
		history.setIs_inout(is_inout);
		history.setHis_quan(quan);
		history.setHis_date(date);
		history.setHis_lotno(lotno); // ##DBG lotno 추가

		this.historyDao.insert(lotno, uid_company, true, user_name, user_uid, "history", history); // ##DBG lotno 수정.추가
	}

	// ##DBG lotno 수정.추가
	public void addLocationHistoryWearing(String lotno, Long uid_company, Long user_uid, String user_id, String user_name,
			Long uid_location, String is_inout, Double quan, Date date, String expiration_period, String supply_name, String batch_lot_id, String supply_lot_number, String supply_company_name) throws Exception {
		History history = new History();
		history.setUid_location(uid_location);
		history.setIs_inout(is_inout);
		history.setHis_quan(quan);
		history.setHis_date(date);
		history.setHis_lotno(lotno); // ##DBG lotno 추가
		history.setExpiration_period(String2Date(expiration_period));
		history.setSupply_name(supply_name);
		history.setBatch_lot_id(batch_lot_id);
		history.setSupply_lot_number(supply_lot_number);
		history.setSupply_company_name(supply_company_name);

		this.historyDao.insert(lotno, uid_company, true, user_name, user_uid, "history", history); // ##DBG lotno 수정.추가
	}

	@Override
	// ##DBG lotno 수정.추가
	public void execWearing(String lotno, Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> item_uids, List<Double> item_quans, Long bin_uid, String expiration_period, String supply_name, String batch_lot_id, String supply_lot_number, String supply_company_name) throws Exception {
		Date now = new Date();
		Location location = new Location();
		location.setUid_bin(bin_uid);
		location.setLast_in_date(now);

		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_bin", bin_uid);
		cond.put("lotno", lotno);// ##DBG lotno 추가

		System.out.println("----:a6----");
		System.out.println(lotno);
		for (int i = 0; i < item_uids.size(); i++) {
			Long item_uid = item_uids.get(i);
			Double item_quan = item_quans.get(i);

			location.setUid_item(item_uid);
			location.setQuan(item_quan);

			System.out.println("----:a6-1---");
			Long uid_location = this.locationDao.insert(lotno, uid_company, true, user_name, user_uid, "location",
					location); // ##DBG lotno 수정.추가

			System.out.println("----:a6-2---");
			cond.put("uid_item", item_uid);
			List<Location> loc = this.locationDao.select_cond(uid_company, "location", cond);
			if (loc != null && loc.size() > 0) {
				Location l = loc.get(0);
				uid_location = l.getUnique_id();
			}

			System.out.println("----:a7----");
			System.out.println(lotno);
			addLocationHistoryWearing(lotno, uid_company, user_uid, user_id, user_name, uid_location, "IN", item_quan, now, expiration_period, supply_name, batch_lot_id, supply_lot_number, supply_company_name);// ##DBG
																														// lotno
																														// 수정.추가
		}
		;
	};

	// ##DBG lotno 수정.추가
	@Override
	public void execRelease(String lotno, Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> location_uids, List<Double> location_quans) throws Exception {
		Date now = new Date();
		Map map = new HashMap();

		for (int i = 0; i < location_uids.size(); i++) {
			Long location_uid = location_uids.get(i);
			Double location_quan = location_quans.get(i);

			map.put("unique_id", location_uid);
			map.put("calculate_quan", -location_quan);
			map.put("last_out_date", new Date());

			this.locationDao.updateByMap(user_name, user_uid, "location", map);
			System.out.println("----:a8----");
			System.out.println(lotno);
			addLocationHistory(lotno, uid_company, user_uid, user_id, user_name, location_uid, "OUT", -location_quan,
					now);// ##DBG lotno 수정.추가
		}
	};

	@Override
	public void execMove(Long uid_company, Long user_uid, String user_id, String user_name, List<Long> location_uids,
			List<Double> location_quans, Long bin_uid) throws Exception {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("user_uid", user_uid);
		map.put("user_id", user_id);
		map.put("user_name", user_name);
		map.put("bin_uid", bin_uid);

		for (int i = 0; i < location_uids.size(); i++) {
			Long location_uid = location_uids.get(i);
			Double location_quan = location_quans.get(i);

			map.put("location_uid", location_uid);
			map.put("location_quan", location_quan);

			this.locationDao.execMove(map);
		}
	}

	// ##DBG lotno 추가
	@Override
	public void execMove(List<String> lotnos, Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> location_uids, List<Double> location_quans, Long bin_uid) throws Exception {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("user_uid", user_uid);
		map.put("user_id", user_id);
		map.put("user_name", user_name);
		map.put("bin_uid", bin_uid);

		System.out.println(
				"----##DBG ------- execMove(String lotno,Long uid_company, Long user_uid, String user_id, String user_name, List<Long> location_uids, List<Double> location_quans, Long bin_uid) throws Exception-----");
		for (int i = 0; i < location_uids.size(); i++) {
			Long location_uid = location_uids.get(i);
			Double location_quan = location_quans.get(i);
			System.out.println(lotnos);
			String lotno;

			try {
				lotno = lotnos.get(i);
			}
			catch(Exception e1) {
				lotno="";
			}

			map.put("location_uid", location_uid);
			map.put("location_quan", location_quan);
			map.put("lotno", lotno);
			map.put("set_lotno", lotno);

			System.out.print("lotno:");
			System.out.println(lotno);
			System.out.println(
					"----##DBG 2------- execMove(String lotno,Long uid_company, Long user_uid, String user_id, String user_name, List<Long> location_uids, List<Double> location_quans, Long bin_uid) throws Exception-----");
			System.out.println(map);
			this.locationDao.execMove(map);
		}
	}

	@Override
	public List<Location> readLocation(Long uid_company, Map cond, DatabasePage page) {
		System.out
				.println("//##DBG---------- readLocation(Long uid_company, Map cond, DatabasePage page) -------------");
		return this.locationDao.select_cond(uid_company, "location", cond, page);
	}

	@Override
	public List<History> readItemHistory(Long uid_company, Map cond, DatabasePage page) {
		return this.historyDao.select_cond(uid_company, "history", cond, page);
	}

	@Override
	public List<Item> readItemLocation(Long uid_company, Map itemCond, DatabasePage page) {
		return this.locationDao.select_cond(uid_company, "location", itemCond, page);
	}

	@Override
	public List<Item> readItemSafeQuan(Long uid_company, Map cond, DatabasePage page) {
		return this.itemDao.select_cond(uid_company, "item", cond, page);
	}

	@Override
	public List<Rack> readBinRate(Map cond) {
		return this.rackDao.readBinRate(cond);
	}

	@Override
	public List<Rack> getRackListByUidBIN(Long uid_company, Long uid_bin) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_bin", uid_bin);
		return this.rackDao.getRackListByUidBIN(cond);
	}

	@Override
	public List<Rack> getRackListByUidWhouse(Long uid_company, Long uid_whouse) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_whouse", uid_whouse);
		return this.rackDao.getRackListByUidWhouse(cond);
	}

	@Override
	public List<Bin> getUsingBinList(Long uid_company, Long uid_bin) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_bin", uid_bin);
		return this.binDao.getUsingBinList(cond);
	}

	@Override
	public List<Bin> getUsingBinListByWhouseUid(Long uid_company, Long uid_whouse) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_whouse", uid_whouse);
		return this.binDao.getUsingBinListByWhouseUid(cond);
	}

	@Override
	public Long addItem(Long uid_company, Long user_uid, String user_id, String user_name, Item item) {
		try {
			System.out.println("##DBG----public Long addItem(Long uid_company, Long user_uid, String user_id, String user_name, Item item)----");
			return this.itemDao.insert("lotno", uid_company, true, user_name, user_uid, "item", item); // ##DBG lotno
																										// 수정.추가 : ##DBG
																										// error
		} catch (Exception e) {
			e.printStackTrace();
			return -1L;
		}
	}

	@Override
	public void removeItem(Long uid_company, Map cond, Long user_uid, String user_id, String user_name) {
		this.itemDao.deleteByMap(user_name, user_uid, "item", cond);
	}

	@Override
	public void editItem(Long uid_company, Map cond, Long user_uid, String user_id, String user_name) {
		this.itemDao.updateByMap(user_name, user_uid, "item", cond);
	}

	@Override
	public void execUpdateQuan(Long uid_company, Long user_uid, String user_id, String user_name, Map cond) {
		this.locationDao.updateByMap(user_name, user_uid, "location", cond);
	}

	@Override
	public void manageRackData(Long uid_company, Long user_uid, String user_id, String user_name, String type,
			String rack_barcode, String wh_name, String rack_name, Integer rack_row, Integer rack_col)
			throws Exception {

		//if (rack_barcode.contains("-"))
			//rack_barcode = rack_barcode.replaceAll("-", "");
//		String wh_code = rack_barcode.substring(0, 2);
//		String rack_code = rack_barcode.substring(0, 4);
//		String bin_col = rack_barcode.substring(4, 6);
//		String bin_row = rack_barcode.substring(6, 8);
		String wh_code = rack_barcode.substring(0, 2);
		String rack_code = rack_barcode.substring(0, rack_barcode.length()-6+2);
		String bin_col = rack_barcode.substring(rack_barcode.length()-4, rack_barcode.length()-2);
		String bin_row = rack_barcode.substring(rack_barcode.length()-2, rack_barcode.length());

		System.out.println(wh_code);
		System.out.println(rack_code);
		System.out.println(bin_col);
		System.out.println(bin_row);

		Map cond = new HashMap();
		List<Whouse> whouseList = new ArrayList<Whouse>();

		wh_code = wh_code.toUpperCase();
		rack_code = rack_code.toUpperCase();

		switch (type) {
		case "ADD":
			// 1. 창고 여부
			cond.put("wh_code", wh_code);
			whouseList = this.whouseDao.select_cond(uid_company, "whouse", cond);

			Long uid_whouse = -1L;

			if (whouseList != null && whouseList.size() > 0) {
				Whouse w = whouseList.get(0);
				uid_whouse = w.getUnique_id();
			} else {
				Whouse whouse = new Whouse();
				whouse.setWh_code(wh_code);
				whouse.setWh_name(wh_name);

				uid_whouse = this.whouseDao.insert(uid_company, true, user_name, user_uid, "whouse", whouse);
			}

			// 2. Rack 추가
			if (uid_whouse > 1L) {
				Rack rack = new Rack();
				rack.setUid_whouse(uid_whouse);
				rack.setRack_code(rack_code);
				rack.setRack_name(rack_name);
				rack.setRow_cnt(rack_row);
				rack.setCol_cnt(rack_col);

				Long uid_rack;
//				uid_rack = this.rackDao.insert(uid_company, false, user_name, user_uid, "rack", rack);
//
//						Map rackCond_t = new HashMap();
//						rackCond_t.put("rack_code", rack_code);
//						Long uid_rack_2;
//						uid_rack_2 = -1L;
//						System.out.println("------- uid_rack get code ---0---");
//						System.out.println("uid_whouse:" + uid_whouse);					System.out.println("rack_code:" + rack_code);
//						System.out.println("rack_name:" + rack_name);					System.out.println("rack_row:" + rack_row);
//						System.out.println("rack_col:" + rack_col);						System.out.println("uid_rack:" + uid_rack);
//						List<Rack> racks_t = this.rackDao.select_cond(uid_company, "rack", rackCond_t);
//						if (racks_t != null && racks_t.size() > 0) {
//							Rack r = racks_t.get(0);
//							Map updateRack = new HashMap();
//							System.out.println("------- uid_rack get code ---1---");
//							System.out.println("r.getUnique_id()" + r.getUnique_id());	System.out.println("r.getRack_code()" + r.getRack_code());
//								uid_rack_2 = Long.parseLong (r.getRack_code());
//						}
//						System.out.println("uid_rack_2:" + uid_rack_2);					System.out.println("------- uid_rack get code ---2---");
//
//				if(uid_rack==-1 || uid_rack != uid_rack_2){
					uid_rack = this.rackDao.insert(uid_company, true, user_name, user_uid, "rack", rack);
				//}

				// 3. Bin 추가
				for (int i = 1; i <= rack_col; i++) {
					String col = "";
					if (i < 10) {
						col = "0" + i;
					} else {
						col = i + "";
					}
					;

					for (int j = 1; j <= rack_row; j++) {
						String row = "";
						if (j < 10) {
							row = "0" + j;
						} else {
							row = j + "";
						}
						;

						Bin bin = new Bin();
						bin.setUid_rack(uid_rack);
						bin.setBin_code(rack_code + col + row);
						bin.setBin_name(rack_code + col + row);
						bin.setBin_col(i);
						bin.setBin_row(j);

						this.binDao.insert(uid_company, true, user_name, user_uid, "bin", bin);
					}
				}
			}
			break;
		case "EDIT":
			cond.put("wh_code", wh_code);
			whouseList = this.whouseDao.select_cond(uid_company, "whouse", cond);

			if (whouseList != null && whouseList.size() > 0) {
				Whouse w = whouseList.get(0);
				Map updateWhouse = new HashMap();
				updateWhouse.put("unique_id", w.getUnique_id());
				updateWhouse.put("wh_name", wh_name);

				this.whouseDao.updateByMap(user_name, user_uid, "whouse", updateWhouse);

				Map rackCond = new HashMap();
				rackCond.put("rack_code", rack_code);

				List<Rack> racks = this.rackDao.select_cond(uid_company, "rack", rackCond);
				if (racks != null && racks.size() > 0) {
					Rack r = racks.get(0);
					Map updateRack = new HashMap();
					updateRack.put("unique_id", r.getUnique_id());

					this.rackDao.updateByMap(user_name, user_uid, "rack", updateRack);
				}
			}
			break;
		case "REMOVE":
			Map rackMap = new HashMap();
			rackMap.put("rack_code", rack_code);

			List<Rack> racks = this.rackDao.select_cond(uid_company, "rack", rackMap);
			if (racks != null && racks.size() > 0) {
				Rack rack = racks.get(0);
				Long rackUid = rack.getUnique_id();
				if (rackUid != null && rackUid > 1L) {
					Map updateRack = new HashMap();
					updateRack.put("del_rack_code", true);
					updateRack.put("unique_id", rackUid);

					// 해당 Rack 에 해당하는 모든 location/bin 데이터 삭제
					this.rackDao.deleteRackAllData(user_name, user_uid, rackUid);
				}
			}
			break;
		}
	}

	public void checkFolder(File folder) {
		if (folder.exists() == true && folder.isDirectory()) {
			System.out.println(folder.getPath() + " 가 이미 존재합니다.");
		} else {
			try {
				folder.mkdirs();
			} catch (Exception e) {
				e.getStackTrace();
			}
		}
	}

	@Override
	public String ExcelUploadItemTemplate(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";

		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String uploadPath = first + "/works/LOGIFORM/" + uid_company;
		File Folder = new File(uploadPath);
		checkFolder(Folder);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

		String result = "success";
//
		for (Iterator<String> it = multipartRequest.getFileNames(); it.hasNext();) {
			String fileName = (String) it.next();
			MultipartFile multipartFile = (MultipartFile) multipartRequest.getFileMap().get(fileName);
			String originFileName = multipartFile.getOriginalFilename();

			InputStream is = multipartFile.getInputStream();
			if (originFileName != null && originFileName.length() > 0) {

				Date now = new Date();
				String fileId = sdf.format(now);
				String filePath = uploadPath + "/" + fileId;
				FileOutputStream os = new FileOutputStream(filePath);

				// File 생성
				int n = 0;
				byte data[];
				data = new byte[2048];

				while ((n = is.read(data)) != -1) {
					os.write(data, 0, n); // file에 저장
				} // while문 끝
				is.close();
				os.close();

				result = excelUploadItem(filePath, originFileName, uid_company, user_uid, user_id, user_name);

				// 업로드 후 파일 삭제
				File f = new File(filePath);
				if (f.exists()) {
					if (f.isFile()) {
						f.delete();
					}
				}
			}
		}
		;

		return result;
	}

	// 품목 정보 업로드
	private String excelUploadItem(String filePath, String originFileName, Long uid_company, Long user_uid,
			String user_id, String user_name) {
		String result = "success";
		try {
			DecimalFormat df = new DecimalFormat();
			FileInputStream file = new FileInputStream(filePath);

			int idx = originFileName.lastIndexOf(".");
			String ext = "";
			if (idx > 1)
				ext = originFileName.substring(idx);

			if (".xls".equalsIgnoreCase(ext)) {
				HSSFWorkbook workbook = new HSSFWorkbook(file);
				HSSFSheet sheet = workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				HSSFRow cell_header = sheet.getRow(0);

				for (int rowIndex = 1; rowIndex < rows + 1; rowIndex++) {
					HSSFRow row = sheet.getRow(rowIndex);

					if (row != null) {
						Item item = new Item();
						for (int colIndex = 0; colIndex < cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue() + "";

							HSSFCell cell = row.getCell(colIndex);
							String value = "";

							if (cell == null) {
								continue;
							} else {
								switch (evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
//		    		        		case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
									evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
//		    		                	value = cell.getNumericCellValue() + "";
//		    		        			value = String.valueOf(value);
									break;
								case STRING:
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
									break;
								case BLANK:
									break;
								case ERROR:
									value = cell.getErrorCellValue() + "";
									value = String.valueOf(value);
									break;
								case FORMULA:
									switch (evaluator.evaluateFormulaCell(cell)) {
									case NUMERIC:
										value = df.format(cell.getNumericCellValue());
										break;
									case STRING:
										value = cell.getStringCellValue();
										break;
									case BOOLEAN:
										value = String.valueOf(cell.getBooleanCellValue());
										break;
									}
									break;
								}
								;

								if (value != null && value.length() > 0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch (header_name) {
									case "품번":
										cell.setCellType(CellType.STRING);
										value = cell.getStringCellValue() + "";
										value = String.valueOf(value);
										if (value == null || value.length() < 1)
											break;
										value = value.trim();
										item.setItem_code(value);
										break;
									case "품명":
										if (value == null || value.length() < 1)
											break;
										item.setItem_name(value);
										break;
									case "규격":
										if (value == null || value.length() < 1) {
											value = "";
										}
										item.setSpecification(value);
										break;
									case "상세사양":
										if (value == null || value.length() < 1) {
											value = "";
										}
										item.setDetail_info(value);
										break;
									case "단위":
										item.setUnit_code(value);
										break;
									case "안전재고수량":
										Double safe_quan = 0.0;
										try {
											safe_quan = Double.parseDouble(value);
										} catch (Exception e) {
											safe_quan = 0.0;
//	    		                			e.getStackTrace();
										}
										item.setSafe_quan(safe_quan);
										break;
									}
								}
							}
						} // header_name 끝
							// item insert
						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else if (".xlsx".equalsIgnoreCase(ext)) {

				XSSFWorkbook workbook = new XSSFWorkbook(file);
				XSSFSheet sheet = workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				XSSFRow cell_header = sheet.getRow(0);

				for (int rowIndex = 1; rowIndex < rows + 1; rowIndex++) {
					XSSFRow row = sheet.getRow(rowIndex);

					if (row != null) {
						Item item = new Item();
						for (int colIndex = 0; colIndex < cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue() + "";

							XSSFCell cell = row.getCell(colIndex);
							String value = "";

							if (cell == null) {
								continue;
							} else {
								switch (evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
									evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
//		    		                	value = cell.getNumericCellValue() + "";
//		    		        			value = String.valueOf(value);
									break;
								case STRING:
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
									break;
								case BLANK:
									break;
								case ERROR:
									value = cell.getErrorCellValue() + "";
									value = String.valueOf(value);
									break;
								case FORMULA:
									switch (evaluator.evaluateFormulaCell(cell)) {
									case NUMERIC:
										value = df.format(cell.getNumericCellValue());
										break;
									case STRING:
										value = cell.getStringCellValue();
										break;
									case BOOLEAN:
										value = String.valueOf(cell.getBooleanCellValue());
										break;
									}
									break;
								}
								;

								if (value != null && value.length() > 0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch (header_name) {
									case "품번":
										cell.setCellType(CellType.STRING);
										value = cell.getStringCellValue() + "";
										value = String.valueOf(value);
										if (value == null || value.length() < 1)
											break;
										value = value.trim();
										item.setItem_code(value);
										break;
									case "품명":
										if (value == null || value.length() < 1)
											break;
										item.setItem_name(value);
										break;
									case "규격":
										if (value == null || value.length() < 1) {
											value = "";
										}
										item.setSpecification(value);
										break;
									case "상세사양":
										if (value == null || value.length() < 1) {
											value = "";
										}
										item.setDetail_info(value);
										break;
									case "단위":
										item.setUnit_code(value);
										break;
									case "안전재고수량":
										Double safe_quan = 0.0;
										try {
											safe_quan = Double.parseDouble(value);
										} catch (Exception e) {
											safe_quan = 0.0;
//	    		                			e.getStackTrace();
										}
										item.setSafe_quan(safe_quan);
										break;
									}
								}
							}
						} // header_name 끝
							// item insert
						//this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
						this.itemDao.insert("lotno",uid_company, true, user_name, user_uid, "item", item);
					}
				}
				result = "seccess";
			} else {
				result = "fail";
			}

		} catch (Exception e) {
			result = "fail";
		}

		return null;
	};

	@Override
	public String ExcelUploadLocationTemplate(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";

		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String uploadPath = first + "/works/LOGIFORM/" + uid_company;
		File Folder = new File(uploadPath);
		checkFolder(Folder);

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");

		String result = "success";
//
		for (Iterator<String> it = multipartRequest.getFileNames(); it.hasNext();) {
			String fileName = (String) it.next();
			MultipartFile multipartFile = (MultipartFile) multipartRequest.getFileMap().get(fileName);
			String originFileName = multipartFile.getOriginalFilename();

			InputStream is = multipartFile.getInputStream();
			if (originFileName != null && originFileName.length() > 0) {

				Date now = new Date();
				String fileId = sdf.format(now);
				String filePath = uploadPath + "/" + fileId;
				FileOutputStream os = new FileOutputStream(filePath);

				// File 생성
				int n = 0;
				byte data[];
				data = new byte[2048];

				while ((n = is.read(data)) != -1) {
					os.write(data, 0, n); // file에 저장
				} // while문 끝
				is.close();
				os.close();

				result = excelUploadLocation(filePath, originFileName, uid_company, user_uid, user_id, user_name);

				// 업로드 후 파일 삭제
				File f = new File(filePath);
				if (f.exists()) {
					if (f.isFile()) {
						f.delete();
					}
				}
			}
		}
		;

		return result;
	}

	// 위치정보 업로드
	private String excelUploadLocation(String filePath, String originFileName, Long uid_company, Long user_uid,
			String user_id, String user_name) {
		String result = "success";
		try {
			DecimalFormat df = new DecimalFormat();
			FileInputStream file = new FileInputStream(filePath);

			int idx = originFileName.lastIndexOf(".");
			String ext = "";
			if (idx > 1)
				ext = originFileName.substring(idx);

			List<Map> mapList = new ArrayList<Map>();

			if (".xls".equalsIgnoreCase(ext)) {
				HSSFWorkbook workbook = new HSSFWorkbook(file);
				HSSFSheet sheet = workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				HSSFRow cell_header = sheet.getRow(0);

				for (int rowIndex = 1; rowIndex < rows + 1; rowIndex++) {
					HSSFRow row = sheet.getRow(rowIndex);

					if (row != null) {
						Map map = new HashMap();
						for (int colIndex = 0; colIndex < cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue() + "";

							HSSFCell cell = row.getCell(colIndex);
							String value = "";

							if (cell == null) {
								continue;
							} else {
								switch (evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
									evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
//		    		                	value = cell.getNumericCellValue() + "";
//		    		        			value = String.valueOf(value);
									break;
								case STRING:
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
									break;
								case BLANK:
									break;
								case ERROR:
									value = cell.getErrorCellValue() + "";
									value = String.valueOf(value);
									break;
								case FORMULA:
									switch (evaluator.evaluateFormulaCell(cell)) {
									case NUMERIC:
										value = df.format(cell.getNumericCellValue());
										break;
									case STRING:
										value = cell.getStringCellValue();
										break;
									case BOOLEAN:
										value = String.valueOf(cell.getBooleanCellValue());
										break;
									}
									break;
								}
								;

								if (value != null && value.length() > 0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch (header_name) {
									case "위치코드":
										if (value == null || value.length() < 1)
											break;
										map.put("bin_code", value);
										break;
									case "품번":
										if (value == null || value.length() < 1)
											break;
										value = value.trim();
										map.put("item_code", value);
										break;
									case "수량":
										Double quan = 0.0;
										try {
											quan = Double.parseDouble(value);
										} catch (Exception e) {
											quan = 0.0;
										}
										map.put("quan", quan);
										break;
									}
								}
							}
						} // header_name 끝
						mapList.add(map);
					}
				}
				result = "seccess";
			} else if (".xlsx".equalsIgnoreCase(ext)) {

				XSSFWorkbook workbook = new XSSFWorkbook(file);
				XSSFSheet sheet = workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				XSSFRow cell_header = sheet.getRow(0);

				for (int rowIndex = 1; rowIndex < rows + 1; rowIndex++) {
					XSSFRow row = sheet.getRow(rowIndex);

					if (row != null) {
						Map map = new HashMap();
						for (int colIndex = 0; colIndex < cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue() + "";

							XSSFCell cell = row.getCell(colIndex);
							String value = "";

							if (cell == null) {
								continue;
							} else {
								switch (evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
									evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
//		    		                	value = cell.getNumericCellValue() + "";
//		    		        			value = String.valueOf(value);
									break;
								case STRING:
									value = cell.getStringCellValue() + "";
									value = String.valueOf(value);
									break;
								case BLANK:
									break;
								case ERROR:
									value = cell.getErrorCellValue() + "";
									value = String.valueOf(value);
									break;
								case FORMULA:
									switch (evaluator.evaluateFormulaCell(cell)) {
									case NUMERIC:
										value = df.format(cell.getNumericCellValue());
										break;
									case STRING:
										value = cell.getStringCellValue();
										break;
									case BOOLEAN:
										value = String.valueOf(cell.getBooleanCellValue());
										break;
									}
									break;
								}
								;

								if (value != null && value.length() > 0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch (header_name) {
									case "위치코드":
										if (value == null || value.length() < 1)
											break;
										map.put("bin_code", value);
										break;
									case "품번":
										if (value == null || value.length() < 1)
											break;
										value = value.trim();
										map.put("item_code", value);
										break;
									case "수량":
										Double quan = 0.0;
										try {
											quan = Double.parseDouble(value);
										} catch (Exception e) {
											quan = 0.0;
										}
										map.put("quan", quan);
										break;
									}
								}
							}
						} // header_name 끝
						mapList.add(map);
					}
				}
				result = "seccess";
			} else {
				result = "fail";
			}
System.out.println("##DBG--------1-");
			if (mapList != null && mapList.size() > 0) {
				for (Map m : mapList) {
					String item_code = (String) m.get("item_code");
					String bin_code = (String) m.get("bin_code");
					Double quan = (Double) m.get("quan");

					Long uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
					Long uid_bin = this.binDao.getUidBinByItemCode(uid_company, bin_code);

					Location location = new Location();
					location.setUid_bin(uid_bin);
					location.setUid_item(uid_item);
					location.setQuan(quan);
					location.setLast_in_date(new Date());

					this.locationDao.insert(uid_company, true, user_name, uid_company, "location", "location-upload",
							location);
				}
			}
		} catch (Exception e) {
			result = "fail";
		}

		return null;
	}

	// 품목 바코드 템플릿 다운
	@Override
	public String createItemExcelTemplate(Long uid_company, List<Item> listList, String barcodeFolder, String type) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String barcodePath = barcodeFolder;
		File Folder = new File(barcodePath);
		System.out.println("##DBG===folder: "+ barcodePath );
		checkFolder(Folder);
		System.out.println("##DBG===folder chk end " );

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short) 20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			xssfRow = xssfSheet.createRow(rowNum);

			CellStyle tableCellStyle = xssfWb.createCellStyle();
			CellStyle barcodeStyle = xssfWb.createCellStyle();

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽

			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);
			tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

			switch (type) {
			case "BARCODE":
				xssfSheet.setColumnWidth((short) 0, 10000);
				break;
			case "QRCODE":
				xssfSheet.setColumnWidth((short) 0, 3500);
				break;
			}

//			xssfSheet.setColumnWidth((short) 0, 4000);
//			xssfSheet.setColumnWidth((short) 1, 10000);
			xssfSheet.setColumnWidth((short) 1, 6000);
			xssfSheet.setColumnWidth((short) 2, 6000);
			xssfSheet.setColumnWidth((short) 3, 6000);
			xssfSheet.setColumnWidth((short) 4, 6000);
			xssfSheet.setColumnWidth((short) 5, 3000);
			xssfSheet.setColumnWidth((short) 6, 3000);
//			xssfRow.setHeight((short) 600);

			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(tableCellStyle);
			switch (type) {
			case "BARCODE":
				xssfCell.setCellValue("바코드");
				break;
			case "QRCODE":
				xssfCell.setCellValue("QR코드");
				break;
			}

//			xssfCell = xssfRow.createCell((short) 0);
//			xssfCell.setCellStyle(tableCellStyle);
//			xssfCell.setCellValue("QR코드");
//			xssfCell = xssfRow.createCell((short) 1);
//			xssfCell.setCellStyle(tableCellStyle);
//			xssfCell.setCellValue("바코드");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품명");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("규격");
			xssfCell = xssfRow.createCell((short) 4);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("상세사양");
			xssfCell = xssfRow.createCell((short) 5);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("단위");
			xssfCell = xssfRow.createCell((short) 6);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("안전재고수량");

			XSSFCreationHelper helper = xssfWb.getCreationHelper();
			XSSFDrawing drawing = xssfSheet.createDrawingPatriarch();
//			XSSFClientAnchor anchor = helper.createClientAnchor();

			int idx = 1;

			for (Item item : listList) {
				String unique_id_str = item.getUnique_id_str();
				String item_code = item.getItem_code();
				String item_name = item.getItem_name();
				String specification = item.getSpecification();
				String detail_info = item.getDetail_info();
				String unit_code = item.getUnit_code();
				Double safe_quan = item.getSafe_quan();

				if(safe_quan==null) {
					safe_quan=0.0;
				}

				rowNum++;

				xssfRow = xssfSheet.createRow(rowNum);
				switch (type) {
				case "BARCODE":
					xssfRow.setHeight((short) 1500);
					break;
				case "QRCODE":
					xssfRow.setHeight((short) 1500);
					break;
				}
				xssfRow.setHeight((short) 1500);

				File file = new File(barcodePath + "/" + unique_id_str + ".png");
				if (file.exists() && file.canRead()) {

					xssfCell = xssfRow.createCell((short) 0);
					xssfCell.setCellStyle(tableCellStyle);

					FileInputStream inputStream = new FileInputStream(file);
					byte[] bytes = IOUtils.toByteArray(inputStream);
					int pictureIdx = xssfWb.addPicture(bytes, XSSFWorkbook.PICTURE_TYPE_JPEG);

					inputStream.close();

					int dx1 = 10 * Units.EMU_PER_PIXEL;
					int dx2 = -5 * Units.EMU_PER_PIXEL;
					int dy1 = 10 * Units.EMU_PER_PIXEL;
					int dy2 = -5 * Units.EMU_PER_PIXEL;

					XSSFClientAnchor anchor = new XSSFClientAnchor(dx1, dy1, dx2, dy2, 0, idx, 1, idx + 1);
					XSSFPicture pict = drawing.createPicture(anchor, pictureIdx);
				}

//				file = new File(barcodePath + "/" + unique_id_str + ".png");
//				if(file.exists() && file.canRead()) {
//
//					xssfCell = xssfRow.createCell((short) 1);
//					xssfCell.setCellStyle(tableCellStyle);
//
//					FileInputStream inputStream  = new FileInputStream(file);
//					byte[] bytes = IOUtils.toByteArray(inputStream);
//					int pictureIdx = xssfWb.addPicture(bytes, XSSFWorkbook.PICTURE_TYPE_JPEG);
//
//					inputStream.close();
//
//					int dx1 = 10 * Units.EMU_PER_PIXEL;
//					int dx2 = -5 * Units.EMU_PER_PIXEL;
//					int dy1 = 10 * Units.EMU_PER_PIXEL;
//					int dy2 = -5 * Units.EMU_PER_PIXEL;
//
//					XSSFClientAnchor anchor = new XSSFClientAnchor(dx1, dy1, dx2, dy2, 1, idx, 2, idx+1);
//					XSSFPicture pict = drawing.createPicture(anchor, pictureIdx);
//				}

				idx++;

				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item_code);

				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item_name);

				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(specification);

				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(detail_info);

				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(unit_code);
				System.out.println(safe_quan);
				xssfCell = xssfRow.createCell((short) 6);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(safe_quan);

//				idx++;
			}

			// 공백 1줄 추가
//			rowNum++;
//			xssfRow = xssfSheet.createRow(rowNum);
//			xssfRow.setHeight((short) 1200);

			System.out.println("##DBG----1234----");
			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			System.out.println("##DBG===excel folder: "+ excelPath );
			checkFolder(f);
			System.out.println("##DBG===chk folder end " );

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

			// 다운로드 후 폴더 및 하위 파일 삭제
			this.clearFileData(barcodeFolder);

		} catch (Exception e) {
			result = null;
		}

		return result;
	};

	// 품목 템플릿 다운
	@Override
	public String createItemTemplate(Long uid_company) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short) 20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			xssfRow = xssfSheet.createRow(rowNum++);

			CellStyle tableCellStyle = xssfWb.createCellStyle();

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽

			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);
			tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품명");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("규격");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("상세사양");
			xssfCell = xssfRow.createCell((short) 4);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("단위");
			xssfCell = xssfRow.createCell((short) 5);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("안전재고수량");

			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			checkFolder(f);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

		} catch (Exception e) {
			result = null;
		}

		return result;
	};

	// 위치 바코드 템플릿 다운
	@Override
	public String createLocationExcelTemplate(Long uid_company, List<Location> locationList, String barcodeFolder) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String barcodePath = barcodeFolder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short) 20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			xssfRow = xssfSheet.createRow(rowNum);

			CellStyle tableCellStyle = xssfWb.createCellStyle();

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽

			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);
			tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

			xssfSheet.setColumnWidth((short) 0, 10000);
			xssfSheet.setColumnWidth((short) 1, 6000);
			xssfSheet.setColumnWidth((short) 2, 6000);
			xssfSheet.setColumnWidth((short) 3, 6000);
			xssfSheet.setColumnWidth((short) 4, 6000);
			xssfSheet.setColumnWidth((short) 5, 6000);
			xssfRow.setHeight((short) 500);

			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("바코드");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("창고");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("랙");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("위치");
			xssfCell = xssfRow.createCell((short) 4);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 5);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("수량");

			XSSFCreationHelper helper = xssfWb.getCreationHelper();
			XSSFDrawing drawing = xssfSheet.createDrawingPatriarch();
//			XSSFClientAnchor anchor = helper.createClientAnchor();

			int idx = 1;

			for (Location loc : locationList) {
				String wh_code = loc.getWh_code();
				String wh_name = loc.getWh_name();
				String rack_code = loc.getRack_code();
				String rack_name = loc.getRack_name();
				String bin_code = loc.getBin_code();
				String item_code = loc.getItem_code();
				Double quan = loc.getQuan();

				rowNum++;

				xssfRow = xssfSheet.createRow(rowNum);
				xssfRow.setHeight((short) 1200);

				File file = new File(barcodePath + "/" + bin_code + ".png");
				if (file.exists() && file.canRead()) {
					xssfCell = xssfRow.createCell((short) 0);
					xssfCell.setCellStyle(tableCellStyle);

					FileInputStream inputStream = new FileInputStream(file);
					byte[] bytes = IOUtils.toByteArray(inputStream);
					int pictureIdx = xssfWb.addPicture(bytes, XSSFWorkbook.PICTURE_TYPE_JPEG);

					inputStream.close();

					int dx1 = 10 * Units.EMU_PER_PIXEL;
					int dx2 = -5 * Units.EMU_PER_PIXEL;
					int dy1 = 10 * Units.EMU_PER_PIXEL;
					int dy2 = -5 * Units.EMU_PER_PIXEL;

					XSSFClientAnchor anchor = new XSSFClientAnchor(dx1, dy1, dx2, dy2, 0, idx, 1, idx + 1);
					idx++;
					XSSFPicture pict = drawing.createPicture(anchor, pictureIdx);
				}

//				xssfCell = xssfRow.createCell((short) 0);
//				xssfCell.setCellStyle(tableCellStyle);
//				xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(rack_code + "(" + rack_code + ")");

				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(bin_code);

				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item_code);

				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(quan);
			}

//			String osName = System.getProperty("os.name").toLowerCase();
//
//			String first = "";
//			if(osName.contains("win")) {
//				first = "C:";
//			} else {
//				first = "";
//			}

			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			checkFolder(f);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

			// 다운로드 후 폴더 및 하위 파일 삭제
			this.clearFileData(barcodeFolder);
		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	// 위치 바코드 템플릿 다운
	@Override
	public String createLocationExcelTemplate(Long uid_company, List<Location> locationList, String barcodeFolder, String type) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String barcodePath = barcodeFolder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short) 20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			xssfRow = xssfSheet.createRow(rowNum);

			CellStyle tableCellStyle = xssfWb.createCellStyle();

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽

			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);
			tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

			xssfSheet.setColumnWidth((short) 0, 6000);

			switch (type) {
			case "BARCODE":
				xssfSheet.setColumnWidth((short) 0, 10000);
				break;
			case "QRCODE":
				xssfSheet.setColumnWidth((short) 0, 4000);
				break;
			}

			xssfSheet.setColumnWidth((short) 1, 6000);
			xssfSheet.setColumnWidth((short) 2, 6000);
			xssfSheet.setColumnWidth((short) 3, 6000);
			xssfSheet.setColumnWidth((short) 4, 6000);
			xssfSheet.setColumnWidth((short) 5, 6000);
			xssfRow.setHeight((short) 500);

			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(tableCellStyle);

			switch (type) {
			case "BARCODE":
				xssfCell.setCellValue("바코드");
				break;
			case "QRCODE":
				xssfCell.setCellValue("QR코드");
				break;
			}

			//xssfCell.setCellValue("바코드");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("창고");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("랙");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("위치");
			xssfCell = xssfRow.createCell((short) 4);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 5);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("수량");

			XSSFCreationHelper helper = xssfWb.getCreationHelper();
			XSSFDrawing drawing = xssfSheet.createDrawingPatriarch();
//			XSSFClientAnchor anchor = helper.createClientAnchor();

			int idx = 1;

			for (Location loc : locationList) {
				String wh_code = loc.getWh_code();
				String wh_name = loc.getWh_name();
				String rack_code = loc.getRack_code();
				String rack_name = loc.getRack_name();
				String bin_code = loc.getBin_code();
				String item_code = loc.getItem_code();
				Double quan = loc.getQuan();

				rowNum++;

				xssfRow = xssfSheet.createRow(rowNum);
				switch (type) {
				case "BARCODE":
					xssfRow.setHeight((short) 1500);
					break;
				case "QRCODE":
					xssfRow.setHeight((short) 1500);
					break;
				}
				xssfRow.setHeight((short) 1500);

				File file = new File(barcodePath + "/" + bin_code + ".png");
				if (file.exists() && file.canRead()) {
					xssfCell = xssfRow.createCell((short) 0);
					xssfCell.setCellStyle(tableCellStyle);

					FileInputStream inputStream = new FileInputStream(file);
					byte[] bytes = IOUtils.toByteArray(inputStream);
					int pictureIdx = xssfWb.addPicture(bytes, XSSFWorkbook.PICTURE_TYPE_JPEG);

					inputStream.close();

					int dx1 = 10 * Units.EMU_PER_PIXEL;
					int dx2 = -5 * Units.EMU_PER_PIXEL;
					int dy1 = 10 * Units.EMU_PER_PIXEL;
					int dy2 = -5 * Units.EMU_PER_PIXEL;

					XSSFClientAnchor anchor = new XSSFClientAnchor(dx1, dy1, dx2, dy2, 0, idx, 1, idx + 1);
					idx++;
					XSSFPicture pict = drawing.createPicture(anchor, pictureIdx);
				}

//				xssfCell = xssfRow.createCell((short) 0);
//				xssfCell.setCellStyle(tableCellStyle);
//				xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(rack_code + "(" + rack_code + ")");

				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(bin_code);

				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item_code);

				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(quan);
			}

//			String osName = System.getProperty("os.name").toLowerCase();
//
//			String first = "";
//			if(osName.contains("win")) {
//				first = "C:";
//			} else {
//				first = "";
//			}

			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			checkFolder(f);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

			// 다운로드 후 폴더 및 하위 파일 삭제
			this.clearFileData(barcodeFolder);
		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	// 위치 템플릿 다운
	@Override
	public String createLocationTemplate(Long uid_company) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String barcodePath = first + "/works/BARCODE/" + uid_company;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// width 설정
			xssfSheet.setColumnWidth(0, 5000);
			xssfSheet.setColumnWidth(1, 5000);
			xssfSheet.setColumnWidth(2, 5000);

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short) 20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			xssfRow = xssfSheet.createRow(rowNum++);

			CellStyle tableCellStyle = xssfWb.createCellStyle();

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);

//			xssfSheet.setColumnWidth((short) 0, 7000);
//			xssfRow.setHeight((short) 500);

//			xssfCell = xssfRow.createCell((short) 0);
//			xssfCell.setCellStyle(tableCellStyle);
//			xssfCell.setCellValue("창고");
//			xssfCell = xssfRow.createCell((short) 1);
//			xssfCell.setCellStyle(tableCellStyle);
//			xssfCell.setCellValue("랙");
			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("위치");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("입고수량");

			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			checkFolder(f);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	@Override
	public boolean adjustLocationQuan(Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> uid_locations, List<Double> location_quans) {
		try {
			Map map = new HashMap();
			map.put("uid_company", uid_company);

			for (int i = 0; i < uid_locations.size(); i++) {
				Long uid_location = uid_locations.get(i);
				Double location_quan = location_quans.get(i);
				map.put("unique_id", uid_location);
				map.put("quan", location_quan);

				this.locationDao.updateByMap(user_name, user_uid, "location", map);
			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Override
	public String createItemBarcode(Long uid_company, List<Item> itemList, String type) {
		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date now = new Date();
		String now_folder = sdf.format(now);
		String barcodePath = first + "/works/BARCODE/" + uid_company + "/" + now_folder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		File file = null;

		Barcode barcode;
		QRCodeWriter writer;

		int qrColor = 0xff020202;
		int backgroundColor = 0xFFFFFFFF;

		System.out.println("-------<1>-----");
		for (Item item : itemList) {
			String item_code = item.item_code;//item.getItem_code();
			String unique_id = item.getUnique_id_str();
			String item_name = item.item_name;// item.getItem_name();
			if (item_code == null || item_code.length() < 1) {
				System.out.println("ITEM CODE EMPTY: " + item_code);
			}

			switch (type) {
			case "BARCODE":
				// 바코드 생성
				try {
					barcode = BarcodeFactory.createCode128(item_code);
//						barcode = BarcodeFactory.createCode128(unique_id);
					String path = barcodePath + "/" + unique_id + ".png";
					file = new File(path);

					if (!file.exists()) {
						BarcodeImageHandler.savePNG(barcode, file);
						file = null;
					}

				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
			case "QRCODE":
				// QR코드 생성
				writer = new QRCodeWriter();
				try {
					String param = new String(item_code.getBytes("UTF-8"), "ISO-8859-1");
//						String param = new String(unique_id.getBytes("UTF-8"), "ISO-8859-1");
					BitMatrix matrix = writer.encode(param, BarcodeFormat.QR_CODE, 500, 500);
					MatrixToImageConfig config = new MatrixToImageConfig(qrColor, 0xFFFFFFFF);
					BufferedImage image = new BufferedImage(10, 10, BufferedImage.TYPE_BYTE_BINARY);
					BufferedImage qrimage = MatrixToImageWriter.toBufferedImage(matrix, config);

					String path = barcodePath + "/" + unique_id + ".png";

					file = new File(path);

					if (!file.exists()) {
						ImageIO.write(qrimage, "jpg", new File(path));
						file = null;
					}

				} catch (Exception e) {
					// TODO: handle exception
				}
				break;
			}
		}
		return barcodePath;
	};

	@Override
	public String createBinCodeBarcode(Long uid_company, List<Location> locationList) {
		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date now = new Date();
		String now_folder = sdf.format(now);
		String barcodePath = first + "/works/BARCODE/" + uid_company + "/" + now_folder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		File file = null;

		for (Location loc : locationList) {
			String bin_code = loc.getBin_code();
			try {
				Barcode barcode = BarcodeFactory.createCode128(bin_code);

				String path = barcodePath + "/" + bin_code + ".png";
				file = new File(path);

				if (!file.exists()) {
					BarcodeImageHandler.savePNG(barcode, file);
					file = null;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return barcodePath;
	}

	@Override
	public String createBinCodeBarcode(Long uid_company, List<Location> locationList, String type) {
		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date now = new Date();
		String now_folder = sdf.format(now);
		String barcodePath = first + "/works/BARCODE/" + uid_company + "/" + now_folder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		File file = null;

		//Barcode barcode;
		QRCodeWriter writer;

		int qrColor = 0xff020202;
		int backgroundColor = 0xFFFFFFFF;

		for (Location loc : locationList) {
			String bin_code = loc.getBin_code();
			switch (type) {
			case "BARCODE":
				// 바코드 생성
				try {
					Barcode barcode = BarcodeFactory.createCode128(bin_code);

					String path = barcodePath + "/" + bin_code + ".png";
					file = new File(path);

					if (!file.exists()) {
						BarcodeImageHandler.savePNG(barcode, file);
						file = null;
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
			case "QRCODE":
				// QR코드 생성
				writer = new QRCodeWriter();
				try {
					String param = new String(bin_code.getBytes("UTF-8"), "ISO-8859-1");
//						String param = new String(unique_id.getBytes("UTF-8"), "ISO-8859-1");
					BitMatrix matrix = writer.encode(param, BarcodeFormat.QR_CODE, 500, 500);
					MatrixToImageConfig config = new MatrixToImageConfig(qrColor, 0xFFFFFFFF);
					BufferedImage image = new BufferedImage(10, 10, BufferedImage.TYPE_BYTE_BINARY);
					BufferedImage qrimage = MatrixToImageWriter.toBufferedImage(matrix, config);

					String path = barcodePath + "/" + bin_code + ".png";

					file = new File(path);

					if (!file.exists()) {
						ImageIO.write(qrimage, "jpg", new File(path));
						file = null;
					}

				} catch (Exception e) {
					// TODO: handle exception
				}
				break;
			}
		}
		return barcodePath;
	}

	@Override
	public String createBarcodeBinData(Long uid_company, List<Bin> binList) {
		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date now = new Date();
		String now_folder = sdf.format(now);
		String barcodePath = first + "/works/BARCODE/" + uid_company + "/" + now_folder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		File file = null;

		for (Bin bin : binList) {
			String bin_code = bin.getBin_code();
			try {
				Barcode barcode = BarcodeFactory.createCode128(bin_code);

				String path = barcodePath + "/" + bin_code + ".png";
				file = new File(path);

				if (!file.exists()) {
					BarcodeImageHandler.savePNG(barcode, file);
					file = null;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return barcodePath;
	}

	@Override
	public List<Location> readLocationByItem(Long uid_company, Map cond, DatabasePage page) {
		return this.locationDao.select_cond(uid_company, "location-item", cond, page);
	}

	// ##DBG 추가 : readLocationByLotNo
	@Override
	public List<Location> readLocationByLotNo(Long uid_company, Map cond, DatabasePage page) {
		return this.locationDao.select_cond(uid_company, "location-item", cond, page);
	}

	@Override
	public List<Bin> getBinInfo(Long uid_company, String bin_code) {
		Map cond = new HashMap();
		cond.put("bin_code", bin_code);
		return this.binDao.select_cond(uid_company, "bin", cond);
	}

	@Override
	public List<BinMan> getBinManInfo(Long uid_company, String bin_code) {
		Map cond = new HashMap();
		cond.put("bin_code", bin_code);
		return this.binManDao.select_cond(uid_company, "BinMan", cond);
	}

	@Override
	public List<Location> getSumRackLocation(Map sumCond) {
		return this.locationDao.getSumRackLocation(sumCond);
	}

	@Override
	public List<Location> getGroupLocation(Long uid_company, Map cond, DatabasePage page) {
		return this.locationDao.select_cond(uid_company, "location-item-group", cond, page);
	}

	@Override
	public List<Whouse> readWhouse(Long uid_company, Map cond, DatabasePage page) {
		return this.whouseDao.select_cond(uid_company, "whouse", cond, page);
	}

	@Override
	public List<Rack> readRack(Long uid_company, Map cond, DatabasePage page) {
		return this.rackDao.select_cond(uid_company, "rack", cond, page);
	}

	@Override
	public void webRegistLocationData(Long uid_company, Long user_uid, String user_id, String user_name, String wh_code,
			String rack_code, Integer row, Integer col, Integer capacity) throws Exception {
		Map cond = new HashMap();
		List<Whouse> whouseList = new ArrayList<Whouse>();

		wh_code = wh_code.toUpperCase();
		rack_code = rack_code.toUpperCase();

		cond.put("wh_code", wh_code);
		whouseList = this.whouseDao.select_cond(uid_company, "whouse", cond);

		Long uid_whouse = -1L;

		if (whouseList != null && whouseList.size() > 0) {
			Whouse w = whouseList.get(0);
			uid_whouse = w.getUnique_id();
		} else {
			Whouse whouse = new Whouse();
			whouse.setWh_code(wh_code);
			whouse.setWh_name(wh_code);

			uid_whouse = this.whouseDao.insert(uid_company, true, user_name, user_uid, "whouse", whouse);
		}

		// 2. Rack 추가
		if (uid_whouse > 1L) {
			rack_code = wh_code + rack_code;
			Rack rack = new Rack();
			rack.setUid_whouse(uid_whouse);
			rack.setRack_code(rack_code);
			rack.setRack_name(rack_code);
			rack.setRow_cnt(row);
			rack.setCol_cnt(col);

			Long uid_rack = this.rackDao.insert(uid_company, true, user_name, user_uid, "rack", rack);

			// 3. Bin 추가
			for (int i = 1; i <= col; i++) {
				String col_s = "";
				if (i < 10) {
					col_s = "0" + i;
				} else {
					col_s = i + "";
				}
				;

				for (int j = 1; j <= row; j++) {
					String row_s = "";
					if (j < 10) {
						row_s = "0" + j;
					} else {
						row_s = j + "";
					}
					;

					String bin_code = rack_code + col_s + row_s;

					Bin bin = new Bin();
					bin.setUid_rack(uid_rack);
					bin.setBin_code(bin_code);
					bin.setBin_name(bin_code);
					bin.setBin_col(i);
					bin.setBin_row(j);
					bin.setCapacity(capacity);

					this.binDao.insert(uid_company, true, user_name, user_uid, "bin", bin);
				}
			}
		}

	};

	// BIN 바코드 엑셀 다운
	@Override
	public String createBinExcelTemplate(Long uid_company, List<Bin> binList, List<Map<String, Object>> whouseGroup,
			String barcodeFolder) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String barcodePath = barcodeFolder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성

			for (int i = 0; i < whouseGroup.size(); i++) {
				Map<String, Object> m = whouseGroup.get(i);
				String rackCode = (String) m.get("rack_code");
				if (rackCode == null || rackCode.length() < 1)
					continue;

				String sheetName = "";
				for (Bin b : binList) {
					String _rackCode = b.getRack_code();
					if (_rackCode.equals(rackCode)) {
						sheetName = b.getRack_code();
						break;
					}
				}

				xssfSheet = xssfWb.createSheet(sheetName); // 워크시트 이름 설정
//				xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

				// 폰트 스타일
				XSSFFont font = xssfWb.createFont();
				font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
				font.setFontHeightInPoints((short) 20); // 폰트 크기
				font.setBold(true); // Bold 설정
				font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

				CellStyle cellStyle = xssfWb.createCellStyle();
				cellStyle.setAlignment(HorizontalAlignment.CENTER);

				int rowNum = 0;

				xssfRow = xssfSheet.createRow(rowNum);

				CellStyle tableCellStyle = xssfWb.createCellStyle();

				tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
				tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
				tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
				tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽

				tableCellStyle.setAlignment(HorizontalAlignment.CENTER);
				tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

				xssfSheet.setColumnWidth((short) 0, 10000);
				xssfSheet.setColumnWidth((short) 1, 6000);
				xssfSheet.setColumnWidth((short) 2, 6000);
				xssfSheet.setColumnWidth((short) 3, 6000);
				xssfSheet.setColumnWidth((short) 4, 6000);
				xssfSheet.setColumnWidth((short) 5, 6000);
				xssfRow.setHeight((short) 500);

				xssfCell = xssfRow.createCell((short) 0);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("바코드");
				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("창고");
				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("랙");
				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("위치");
				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("열");
				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("층");

				XSSFCreationHelper helper = xssfWb.getCreationHelper();
				XSSFDrawing drawing = xssfSheet.createDrawingPatriarch();
//				XSSFClientAnchor anchor = helper.createClientAnchor();

				int idx = 1;

				for (Bin bin : binList) {
					String wh_code = bin.getWh_code();
					String wh_name = bin.getWh_name();
					String rack_code = bin.getRack_code();
					if (!rackCode.equals(rack_code))
						continue;
					String rack_name = bin.getRack_name();
					String bin_code = bin.getBin_code();
					Integer col = bin.getBin_col();
					Integer row = bin.getBin_row();

					rowNum++;

					xssfRow = xssfSheet.createRow(rowNum);
					xssfRow.setHeight((short) 1200);

					File file = new File(barcodePath + "/" + bin_code + ".png");
					if (file.exists() && file.canRead()) {
						xssfCell = xssfRow.createCell((short) 0);
						xssfCell.setCellStyle(tableCellStyle);

						FileInputStream inputStream = new FileInputStream(file);
						byte[] bytes = IOUtils.toByteArray(inputStream);
						int pictureIdx = xssfWb.addPicture(bytes, XSSFWorkbook.PICTURE_TYPE_JPEG);

						inputStream.close();

						int dx1 = 10 * Units.EMU_PER_PIXEL;
						int dx2 = -5 * Units.EMU_PER_PIXEL;
						int dy1 = 10 * Units.EMU_PER_PIXEL;
						int dy2 = -5 * Units.EMU_PER_PIXEL;

						XSSFClientAnchor anchor = new XSSFClientAnchor(dx1, dy1, dx2, dy2, 0, idx, 1, idx + 1);
						idx++;
						XSSFPicture pict = drawing.createPicture(anchor, pictureIdx);
					}

//					xssfCell = xssfRow.createCell((short) 0);
//					xssfCell.setCellStyle(tableCellStyle);
//					xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

					xssfCell = xssfRow.createCell((short) 1);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

					xssfCell = xssfRow.createCell((short) 2);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(rack_code + "(" + rack_code + ")");

					xssfCell = xssfRow.createCell((short) 3);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(bin_code);

					xssfCell = xssfRow.createCell((short) 4);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(col);

					xssfCell = xssfRow.createCell((short) 5);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(row);
				}

			}

			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			checkFolder(f);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

			// 다운로드 후 폴더 및 하위 파일 삭제
			this.clearFileData(barcodeFolder);

		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	@Override
	public List<Map<String, Object>> getRackGroup(Long uid_company, Long uid_whouse) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("uid_whouse", uid_whouse);
		return this.binDao.getRackGroup(cond);
	}

	public void clearFileData(String path) throws Exception {
		File fd = new File(path);
		Files.walk(fd.toPath()).sorted(Comparator.reverseOrder()).map(Path::toFile).forEach((_file) -> {
			System.out.println("Remove file: " + _file.getPath());
			_file.delete();
		});
	}

	@Override
	public String deleteItem(Long uid_company, Long user_uid, String user_id, String user_name, Long unique_id) {
		String result = "SUCCESS";

		Map map = new HashMap();
		map.put("unique_id", unique_id);

		try {
			this.itemDao.deleteByMap(user_name, user_uid, "item", map);
		} catch (Exception e) {
			// TODO: handle exception
			result = "삭제실패";
		}

		return result;
	}

	@Override
	public void cancelInOut(Long uid_company, Long user_uid, String user_id, String user_name,
			List<Long> unique_id_list) {

		Map hisMap = new HashMap();
		Map locationMap = new HashMap();
		hisMap.put("uid_company", uid_company);
		hisMap.put("user_uid", user_uid);
		hisMap.put("user_id", user_id);
		hisMap.put("user_name", user_name);

		locationMap.put("uid_company", uid_company);
		locationMap.put("user_uid", user_uid);
		locationMap.put("user_id", user_id);
		locationMap.put("user_name", user_name);

		for (Long unique_id : unique_id_list) {
			History history = (History) this.historyDao.select_uid("history", unique_id);
			if (history != null) {
				Long uid_location = history.getUid_location();
				Double hisQuan = history.getHis_quan();
				String is_inout = history.getIs_inout();

				// 1. History 삭제
				hisMap.put("unique_id", unique_id);
				this.historyDao.deleteByMap(user_id, user_uid, "history", hisMap);

				// 2. Location 위치에서 수량 감소 ==> 수량이 부족한 경우는?
				locationMap.put("unique_id", uid_location);

				this.locationDao.updateLocationByUniqueData(uid_company, uid_location, -hisQuan, user_uid, user_name,
						null);
			}
		}
	}
	// BIN 바코드 엑셀 다운 : ##DBG 추가
	@Override
	public String createBinExcelTemplate(Long uid_company, List<Bin> binList, List<Rack> whouseGroup,
			String barcodeFolder, String type) {
		String result = null;
		int i=0;
		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		String barcodePath = barcodeFolder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); // XSSFWorkbook 객체 생성

//			for (int i = 0; i < whouseGroup.size(); i++) {
//			List<Rack> m =(List<Rack>) whouseGroup.get(i);
//			String rackCode = (String) m.get("rack_code");//String rackCode = (String) m.get("rack_code");
//			if (rackCode == null || rackCode.length() < 1)
//				continue;

			for (Rack m : whouseGroup) {
				String rackCode = m.getRack_code();
				if (rackCode == null || rackCode.length() < 1)
				continue;

				String sheetName = "";
				for (Bin b : binList) {
					String _rackCode = b.getRack_code();
					if (_rackCode.equals(rackCode)) {
						sheetName = b.getRack_code();
						break;
					}
				}

				xssfSheet = xssfWb.createSheet(sheetName); // 워크시트 이름 설정
//				xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

				// 폰트 스타일
				XSSFFont font = xssfWb.createFont();
				font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
				font.setFontHeightInPoints((short) 20); // 폰트 크기
				font.setBold(true); // Bold 설정
				font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

				CellStyle cellStyle = xssfWb.createCellStyle();
				cellStyle.setAlignment(HorizontalAlignment.CENTER);

				int rowNum = 0;

				xssfRow = xssfSheet.createRow(rowNum);

				switch (type) {
				case "BARCODE":
					xssfRow.setHeight((short) 1500);
					break;
				case "QRCODE":
					xssfRow.setHeight((short) 1500);
					break;
				}
				CellStyle tableCellStyle = xssfWb.createCellStyle();

				tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
				tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
				tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
				tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽

				tableCellStyle.setAlignment(HorizontalAlignment.CENTER);
				tableCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

				switch (type) {
				case "BARCODE":
					xssfSheet.setColumnWidth((short) 0, 10000);
					break;
				case "QRCODE":
					xssfSheet.setColumnWidth((short) 0, 3000);
					break;
				}
				xssfSheet.setColumnWidth((short) 1, 6000);
				xssfSheet.setColumnWidth((short) 2, 6000);
				xssfSheet.setColumnWidth((short) 3, 6000);
				xssfSheet.setColumnWidth((short) 4, 6000);
				xssfSheet.setColumnWidth((short) 5, 6000);
				xssfRow.setHeight((short) 500);

				xssfCell = xssfRow.createCell((short) 0);
				xssfCell.setCellStyle(tableCellStyle);
				switch (type) {
				case "BARCODE":
					xssfCell.setCellValue("바코드");
					break;
				case "QRCODE":
					xssfCell.setCellValue("QR코드");
					break;
				}
				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("창고");
				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("랙");
				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("위치");
				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("열");
				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue("층");

				XSSFCreationHelper helper = xssfWb.getCreationHelper();
				XSSFDrawing drawing = xssfSheet.createDrawingPatriarch();
//				XSSFClientAnchor anchor = helper.createClientAnchor();

				int idx = 1;

				for (Bin bin : binList) {
					String wh_code = bin.getWh_code();
					String wh_name = bin.getWh_name();
					String rack_code = bin.getRack_code();
					if (!rackCode.equals(rack_code))
						continue;
					String rack_name = bin.getRack_name();
					String bin_code = bin.getBin_code();
					Integer col = bin.getBin_col();
					Integer row = bin.getBin_row();

					rowNum++;

					xssfRow = xssfSheet.createRow(rowNum);
					switch (type) {
						case "BARCODE":
							xssfRow.setHeight((short) 1200);
							break;
						case "QRCODE":
							xssfRow.setHeight((short) 1300);
							break;
					}

					File file = new File(barcodePath + "/" + bin_code + ".png");
					if (file.exists() && file.canRead()) {
						xssfCell = xssfRow.createCell((short) 0);
						xssfCell.setCellStyle(tableCellStyle);

						FileInputStream inputStream = new FileInputStream(file);
						byte[] bytes = IOUtils.toByteArray(inputStream);
						int pictureIdx = xssfWb.addPicture(bytes, XSSFWorkbook.PICTURE_TYPE_JPEG);

						inputStream.close();

						int dx1 = 10 * Units.EMU_PER_PIXEL;
						int dx2 = -5 * Units.EMU_PER_PIXEL;
						int dy1 = 10 * Units.EMU_PER_PIXEL;
						int dy2 = -5 * Units.EMU_PER_PIXEL;

						XSSFClientAnchor anchor = new XSSFClientAnchor(dx1, dy1, dx2, dy2, 0, idx, 1, idx + 1);
						idx++;
						XSSFPicture pict = drawing.createPicture(anchor, pictureIdx);
					}

//					xssfCell = xssfRow.createCell((short) 0);
//					xssfCell.setCellStyle(tableCellStyle);
//					xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

					xssfCell = xssfRow.createCell((short) 1);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(wh_code + "(" + wh_name + ")");

					xssfCell = xssfRow.createCell((short) 2);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(rack_code + "(" + rack_code + ")");

					xssfCell = xssfRow.createCell((short) 3);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(bin_code);

					xssfCell = xssfRow.createCell((short) 4);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(col);

					xssfCell = xssfRow.createCell((short) 5);
					xssfCell.setCellStyle(tableCellStyle);
					xssfCell.setCellValue(row);
				}

			}

			String excelPath = first + "/works/LOGIFORM/" + uid_company;
			File f = new File(excelPath);
			checkFolder(f);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			Date now = new Date();
			String fileId = sdf.format(now);

			excelPath = excelPath + "/" + fileId + ".xlsx";

			result = uid_company + "/" + fileId + ".xlsx";

			File file = new File(excelPath);
			FileOutputStream fos = null;
			fos = new FileOutputStream(file);
			xssfWb.write(fos);
			if (fos != null)
				fos.close();

			// 다운로드 후 폴더 및 하위 파일 삭제
			this.clearFileData(barcodeFolder);

		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	//##DBG 추가.createBinCodeBarcode
	@Override
	public String createBarcodeBinData(Long uid_company, List<Bin> binList, String type) {
		String osName = System.getProperty("os.name").toLowerCase();
		QRCodeWriter writer;
		int qrColor = 0xff020202;
		String first = "";
		if (osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		Date now = new Date();
		String now_folder = sdf.format(now);
		String barcodePath = first + "/works/BARCODE/" + uid_company + "/" + now_folder;
		File Folder = new File(barcodePath);
		checkFolder(Folder);

		File file = null;

		for (Bin bin : binList) {
			String bin_code = bin.getBin_code();
			switch (type) {
			case "BARCODE":
				// 바코드 생성
				try {
					Barcode barcode = BarcodeFactory.createCode128(bin_code);

					String path = barcodePath + "/" + bin_code + ".png";
					file = new File(path);

					if (!file.exists()) {
						BarcodeImageHandler.savePNG(barcode, file);
						file = null;
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				break;
			case "QRCODE":
				// QR코드 생성
				writer = new QRCodeWriter();
				try {
					String param = new String(bin_code.getBytes("UTF-8"), "ISO-8859-1");
//						String param = new String(unique_id.getBytes("UTF-8"), "ISO-8859-1");
					BitMatrix matrix = writer.encode(param, BarcodeFormat.QR_CODE, 500, 500);
					MatrixToImageConfig config = new MatrixToImageConfig(qrColor, 0xFFFFFFFF);
					BufferedImage image = new BufferedImage(10, 10, BufferedImage.TYPE_BYTE_BINARY);
					BufferedImage qrimage = MatrixToImageWriter.toBufferedImage(matrix, config);

					String path = barcodePath + "/" + bin_code + ".png";

					file = new File(path);

					if (!file.exists()) {
						ImageIO.write(qrimage, "jpg", new File(path));
						file = null;
					}

				} catch (Exception e) {
					// TODO: handle exception
				}
				break;
			}

		}
		return barcodePath;
	}

	public Date String2Date(String value) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		String ret= value;

		if(value.isEmpty()) {
			return null;
		}
		Date date = null;
		try {
			ret = ret.replaceAll("/", "-");
			date = dateFormat.parse(ret);
		} catch (ParseException e) {}

		return date;
	}

}
