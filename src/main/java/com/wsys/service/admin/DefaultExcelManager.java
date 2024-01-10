package com.wsys.service.admin;

import java.awt.Color;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.wsys.vo.History;
import com.wsys.vo.Item;
import com.wsys.vo.Location;

@Service("ExcelManager")
public class DefaultExcelManager extends ExtendDaoExcelManager implements InitializingBean {

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub

	}

	public void checkFolder(File folder) {
		if(folder.exists()==true && folder.isDirectory()) {
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
	public String ExcelWearingUpload(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";

		if(osName.contains("win")) {
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

				result = excelWearingUpload(filePath, originFileName, uid_company, user_uid, user_id, user_name);

				// 업로드 후 파일 삭제
				File f = new File(filePath);
				if(f.exists()) {
					if(f.isFile()) {
						f.delete();
					}
				}
			}
		};

		return result;
	};

	private String excelWearingUpload(String filePath, String originFileName, Long uid_company, Long user_uid, String user_id, String user_name) {
		String result = "success";
		try {
			DecimalFormat df = new DecimalFormat();
			FileInputStream file = new FileInputStream(filePath);

			int idx = originFileName.lastIndexOf(".");
			String ext = "";
			if(idx>1) ext = originFileName.substring(idx);

			List<Map<String, Object>> listMap = new ArrayList<Map<String, Object>>();

			System.out.println("##DBG-------(0)");
			if(".xls".equalsIgnoreCase(ext)) {
				HSSFWorkbook workbook=new HSSFWorkbook(file);
				HSSFSheet sheet=workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(1).getPhysicalNumberOfCells();

				HSSFRow cell_header = sheet.getRow(1);

				for(int rowIndex=1; rowIndex<rows+1; rowIndex++) {
					HSSFRow row=sheet.getRow(rowIndex);

					if(row!=null) {
						Map<String, Object> map = new HashMap<String, Object>();
						for(int colIndex=0; colIndex<cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue()+"";

							HSSFCell cell = row.getCell(colIndex);
							String value = "";

							if(cell==null) {
								continue;
							} else {
								switch(evaluator.evaluateInCell(cell).getCellType()) {
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
		    		                	switch(evaluator.evaluateFormulaCell(cell)) {
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
	    		                };

	    		                if(value!=null && value.length()>0) {
	    		                	header_name = header_name.trim().toUpperCase();
	    		                	header_name = header_name.replaceAll(" ", "");

	    		                	switch(header_name) {
	    		                	case "위치":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("bin_code", value);
	    		                		break;
	    		                	case "품번":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("item_code", value);
	    		                		break;
	    		                	case "입고수량":
	    		                		Double quan = 0.0;
	    		                		try {
	    		                			quan = Double.parseDouble(value);
	    		                		} catch(Exception e) {
	    		                			quan = 0.0;
//	    		                			e.getStackTrace();
	    		                		}
	    		                		map.put("quan", quan);
	    		                		break;
	    		                	}
	    		                }
							}
						} // header_name 끝
						listMap.add(map);
						// item insert
//						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else if(".xlsx".equalsIgnoreCase(ext)){

				XSSFWorkbook workbook=new XSSFWorkbook(file);
				XSSFSheet sheet=workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(1).getPhysicalNumberOfCells();

				XSSFRow cell_header = sheet.getRow(1);

				for(int rowIndex=1; rowIndex<rows+1; rowIndex++) {
					XSSFRow row=sheet.getRow(rowIndex);

					if(row!=null) {
						Map<String, Object> map = new HashMap<String, Object>();
						for(int colIndex=0; colIndex<cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue()+"";

							XSSFCell cell = row.getCell(colIndex);
							String value = "";

							if(cell==null) {
								continue;
							} else {
								switch(evaluator.evaluateInCell(cell).getCellType()) {
		    		        		case BOOLEAN:
		    		        			value = cell.getBooleanCellValue() + "";
		    		        			value = String.valueOf(value);
		    		                    break;
		    		                case NUMERIC:
		    		                	evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
		    		                	value = cell.getStringCellValue() + "";
		    		        			value = String.valueOf(value);
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
		    		                	switch(evaluator.evaluateFormulaCell(cell)) {
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
	    		                };

	    		                if(value!=null && value.length()>0) {
//	    		                	header_name = header_name.trim().toUpperCase();
//	    		                	header_name = header_name.replaceAll(" ", "");

	    		                	switch(header_name) {
	    		                	case "LOTNO":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("lotno", value);
	    		                		break;
	    		                	case "위치":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("bin_code", value);
	    		                		break;
	    		                	case "품번":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("item_code", value);
	    		                		break;
	    		                	case "입고수량":
	    		                		Double quan = 0.0;
	    		                		try {
	    		                			quan = Double.parseDouble(value);
	    		                		} catch(Exception e) {
	    		                			quan = 0.0;
	    		                		}
	    		                		map.put("quan", quan);
	    		                		break;
	    		                	case "Batch LOT ID":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("batch_lot_id", value);
	    		                		break;
	    		                	case "공급처 LOT 번호":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("supply_lot_number", value);
	    		                		break;
	    		                	case "유효기간":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("expiration_period", value);
	    		                		break;
	    		                	case "공급사":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("supply_name", value);
	    		                		break;
	    		                	case "급업체명":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("supply_company_name", value);
	    		                		break;
	    		                	}
	    		                }
							}
						} // header_name 끝
						listMap.add(map);
						// item insert

//						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else {
				result = "fail";
			}


			System.out.println("##DBG-------(1)" + "," + listMap);
			Map updateMap = new HashMap();
			Map locationCond = new HashMap();
			Map distinctCond = new HashMap();
			Map updateCond = new HashMap();

			System.out.println("##DBG-------(2)");
			if(listMap!=null && listMap.size()>0) {
				for(Map<String, Object> m : listMap) {
					String bin_code = (String) m.get("bin_code");
					String item_code = (String) m.get("item_code");
					Double quan = (Double) m.get("quan");
					String lotno = (String)m.get("lotno");
					String batch_lot_id = (String) m.get("batch_lot_id");
					String supply_lot_number = (String) m.get("supply_lot_number");
					String expiration_period = (String) m.get("expiration_period");
					String supply_name = (String) m.get("supply_name");
					String supply_company_name = (String) m.get("supply_company_name");
					System.out.println("##DBG---LOTNO: " + lotno);
					if(bin_code==null||bin_code.length()<1 || item_code==null||item_code.length()<1 || quan==null) {
						continue;
					};

					Long uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
					if(uid_item==null||uid_item<1L) continue;
					System.out.println("##DBG-------(2.4)");

					Long uid_bin = this.binDao.getUidBinByBinCode(uid_company, bin_code);
					if(uid_bin==null||uid_bin<1L) continue;
					System.out.println("##DBG-------(2.5)");

					Location location = new Location();
					location.setUid_bin(uid_bin);
					location.setUid_item(uid_item);
					location.setQuan(quan);
					location.setLast_in_date(new Date());
					location.setLotno(lotno);
					System.out.println("##DBG-------(2.6)");

					distinctCond.put("uid_company", uid_company);
					distinctCond.put("uid_bin", uid_bin);
					distinctCond.put("uid_item", uid_item);

					System.out.println("##DBG-------(3)");
					System.out.println(uid_company + "," + "location" + "," + distinctCond);
					List<Location> distinctLoc = this.locationDao.select_cond(uid_company, "location", distinctCond);

					Long uid_location = -1L;
					if(distinctLoc!=null && distinctLoc.size()>0) {
						uid_location = distinctLoc.get(0).getUnique_id();
						updateCond.put("unique_id", uid_location);
						updateCond.put("calculate_quan", quan);
						updateCond.put("lotno", lotno);
						System.out.println("##DBG-------(4)");
						this.locationDao.updateByMap(user_name, user_uid, "location", updateCond);//##DBG : 이 품목이 이 bin에 재고가 존재하면 update
					} else {
						System.out.println("##DBG-------(5)");
						//uid_location = this.locationDao.insert(uid_company, true, user_name, user_uid, "location", "location-excel-upload", location);//##DBG : 재고가 없으면 재고로 등록
						uid_location = this.locationDao.insert(lotno,uid_company, true, user_name, user_uid, "location", location);//##DBG : 재고가 없으면 재고로 등록
					}


					if(uid_location!=null && uid_location>1L) {
						// 입고이력
						History history = new History();
						history.setUid_location(uid_location);
						history.setIs_inout("IN");
						history.setHis_quan(quan);
						history.setHis_date(new Date());
						history.setLotno(lotno);
						history.setExpiration_period(String2Date(expiration_period));
						history.setSupply_name(supply_name);
						history.setBatch_lot_id(batch_lot_id);
						history.setSupply_lot_number(supply_lot_number);
						history.setSupply_company_name(supply_company_name);

						System.out.println("##DBG-------(6)");
						this.historyDao.insert(lotno,uid_company, true, user_name, user_uid, "history", history);
					}
				}
			}

		} catch (Exception e) {
			System.out.println("##DBG-------(7)");
			result = "fail";
		}

		return null;
	};

	@Override
	public String ExcelReleaseUpload(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";

		if(osName.contains("win")) {
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

				result = excelReleaseUpload(filePath, originFileName, uid_company, user_uid, user_id, user_name);

				// 업로드 후 파일 삭제
				File f = new File(filePath);
				if(f.exists()) {
					if(f.isFile()) {
						f.delete();
					}
				}
			}
		};

		return result;
	};

	private String excelReleaseUpload(String filePath, String originFileName, Long uid_company, Long user_uid, String user_id, String user_name) {
		String result = "success";
		try {
			DecimalFormat df = new DecimalFormat();
			FileInputStream file = new FileInputStream(filePath);

			int idx = originFileName.lastIndexOf(".");
			String ext = "";
			if(idx>1) ext = originFileName.substring(idx);

			List<Map<String, Object>> listMap = new ArrayList<Map<String, Object>>();

			if(".xls".equalsIgnoreCase(ext)) {
				HSSFWorkbook workbook=new HSSFWorkbook(file);
				HSSFSheet sheet=workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				HSSFRow cell_header = sheet.getRow(0);

				for(int rowIndex=1; rowIndex<rows+1; rowIndex++) {
					HSSFRow row=sheet.getRow(rowIndex);

					if(row!=null) {
						Map<String, Object> map = new HashMap<String, Object>();
						for(int colIndex=0; colIndex<cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue()+"";

							HSSFCell cell = row.getCell(colIndex);
							String value = "";

							if(cell==null) {
								continue;
							} else {
								switch(evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
	    		                	evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
	    		                	value = cell.getStringCellValue() + "";
	    		        			value = String.valueOf(value);
//									value = cell.getNumericCellValue() + "";
//									value = String.valueOf(value);
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
									switch(evaluator.evaluateFormulaCell(cell)) {
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
								};

								if(value!=null && value.length()>0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch(header_name) {
									case "위치":
										if(value==null || value.length()<1) break;
										map.put("bin_code", value);
										break;
									case "품번":
										if(value==null || value.length()<1) break;
										map.put("item_code", value);
										break;
									case "출고수량":
										Double quan = 0.0;
										try {
											quan = Double.parseDouble(value);
										} catch(Exception e) {
											quan = 0.0;
//	    		                			e.getStackTrace();
										}
										map.put("quan", quan);
										break;
									}
								}
							}
						} // header_name 끝
						listMap.add(map);
						// item insert
//						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else if(".xlsx".equalsIgnoreCase(ext)){

				XSSFWorkbook workbook=new XSSFWorkbook(file);
				XSSFSheet sheet=workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				XSSFRow cell_header = sheet.getRow(0);

				for(int rowIndex=1; rowIndex<rows+1; rowIndex++) {
					XSSFRow row=sheet.getRow(rowIndex);

					if(row!=null) {
						Map<String, Object> map = new HashMap<String, Object>();
						for(int colIndex=0; colIndex<cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue()+"";

							XSSFCell cell = row.getCell(colIndex);
							String value = "";

							if(cell==null) {
								continue;
							} else {
								switch(evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
	    		                	evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
	    		                	value = cell.getStringCellValue() + "";
	    		        			value = String.valueOf(value);
//									value = cell.getNumericCellValue() + "";
//									value = String.valueOf(value);
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
									switch(evaluator.evaluateFormulaCell(cell)) {
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
								};

								if(value!=null && value.length()>0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch(header_name) {
	    		                	case "LOTNO":
	    		                		if(value==null || value.length()<1) break;
	    		                		map.put("lotno", value);
	    		                		break;
									case "위치":
										if(value==null || value.length()<1) break;
										map.put("bin_code", value);
										break;
									case "품번":
										if(value==null || value.length()<1) break;
										map.put("item_code", value);
										break;
									case "출고수량":
										Double quan = 0.0;
										try {
											quan = Double.parseDouble(value);
										} catch(Exception e) {
											quan = 0.0;
										}
										map.put("quan", quan);
										break;
									}
								}
							}
						} // header_name 끝
						listMap.add(map);
						// item insert
//						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else {
				result = "fail";
			}

			System.out.println("##DBG----1-");

			Map updateMap = new HashMap();
			Map locationCond = new HashMap();
			Map distinctCond = new HashMap();
			Map updateCond = new HashMap();

			if(listMap!=null && listMap.size()>0) {
				System.out.println("##DBG----2-");
				for(Map<String, Object> m : listMap) {
					String bin_code = (String) m.get("bin_code");
					String item_code = (String) m.get("item_code");
					Double quan = (Double) m.get("quan");
					String lotno = (String)m.get("lotno");
					System.out.println("##DBG----3-");

					if(bin_code==null||bin_code.length()<1
							|| item_code==null||item_code.length()<1
							|| quan==null) {
						continue;
					};
					System.out.println("##DBG----4-uid_company, item_code : " + uid_company + "," + item_code);

					Long uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
					if(uid_item==null||uid_item<1L) continue;
					System.out.println("##DBG----5-uid_company , bin_code : " + uid_company   + "," + bin_code);

					Long uid_bin = this.binDao.getUidBinByBinCode(uid_company, bin_code);
					if(uid_bin==null||uid_bin<1L) continue;
					System.out.println("##DBG----6-");

					Location location = new Location();
					location.setUid_bin(uid_bin);
					location.setUid_item(uid_item);
					location.setQuan(-quan);
					location.setLast_out_date(new Date());
					location.setLotno(lotno);
					System.out.println("##DBG----7-");

					distinctCond.put("uid_company", uid_company);
					distinctCond.put("uid_bin", uid_bin);
					distinctCond.put("uid_item", uid_item);

					System.out.println("##DBG------distinctCond : " + distinctCond);

					List<Location> distinctLoc = this.locationDao.select_cond(uid_company, "location", distinctCond);

					Long uid_location = -1L;
					if(distinctLoc!=null && distinctLoc.size()>0) {
						uid_location = distinctLoc.get(0).getUnique_id();
						updateCond.put("unique_id", uid_location);
						updateCond.put("calculate_quan", -quan);
						updateCond.put("lotno", lotno);
						this.locationDao.updateByMap(user_name, user_uid, "location", updateCond);
					} else {
						//uid_location = this.locationDao.insert(uid_company, true, user_name, user_uid, "location", "location-excel-upload", location);
						uid_location = this.locationDao.insert(lotno, uid_company, true, user_name, user_uid, "location", location);
					}

					if(uid_location!=null && uid_location>1L) {
						// 출고이력
						History history = new History();
						history.setUid_location(uid_location);
						history.setIs_inout("OUT");
						history.setHis_quan(-quan);
						history.setHis_date(new Date());
						history.setLotno(lotno);

						this.historyDao.insert(lotno, uid_company, true, user_name, user_uid, "history", history);
					}
				}
			}

//			if(listMap!=null && listMap.size()>0) {
//				for(Map<String, Object> m : listMap) {
//					String bin_code = (String) m.get("bin_code");
//					String item_code = (String) m.get("item_code");
//					Double quan = (Double) m.get("quan");
//
//					if(bin_code==null||bin_code.length()<1
//							|| item_code==null||item_code.length()<1
//							|| quan==null) {
//						continue;
//					};
//
//					Long uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
//					if(uid_item==null||uid_item<1L) continue;
//
//					Long uid_bin = this.binDao.getUidBinByBinCode(uid_company, bin_code);
//					if(uid_bin==null||uid_bin<1L) continue;
//
//					locationCond.put("uid_item", uid_item);
//					locationCond.put("uid_bin", uid_bin);
//					List<Location> locationList = this.locationDao.select_cond(uid_company, "location", locationCond);
//
//					if(locationList!=null && locationList.size()>0) {
//						Location location = locationList.get(0);
//						Long uid_location = location.getUnique_id();
//						this.locationDao.updateLocationByUniqueData(uid_company, uid_location, -quan, user_uid, user_name, "OUT");
//
//						// 입고이력
//						History history = new History();
//						history.setUid_location(uid_location);
//						history.setIs_inout("OUT");
//						history.setHis_quan(-quan);
//						history.setHis_date(new Date());
//
//						this.historyDao.insert(uid_company, true, user_name, user_uid, "history", history);
//					}
//				}
//			}

		} catch (Exception e) {
			result = "fail";
		}

		return null;
	};

	@Override
	public String ExcelStockMoveUpload(Long uid_company, Long user_uid, String user_id, String user_name,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";

		if(osName.contains("win")) {
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

				result = excelStockMoveUpload(filePath, originFileName, uid_company, user_uid, user_id, user_name);

				// 업로드 후 파일 삭제
				File f = new File(filePath);
				if(f.exists()) {
					if(f.isFile()) {
						f.delete();
					}
				}
			}
		};

		return result;
	};

	private String excelStockMoveUpload(String filePath, String originFileName, Long uid_company, Long user_uid, String user_id, String user_name) {
		String result = "success";
		try {
			DecimalFormat df = new DecimalFormat();
			FileInputStream file = new FileInputStream(filePath);

			int idx = originFileName.lastIndexOf(".");
			String ext = "";
			if(idx>1) ext = originFileName.substring(idx);

			List<Map<String, Object>> listMap = new ArrayList<Map<String, Object>>();

			if(".xls".equalsIgnoreCase(ext)) {
				HSSFWorkbook workbook=new HSSFWorkbook(file);
				HSSFSheet sheet=workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				HSSFRow cell_header = sheet.getRow(0);

				for(int rowIndex=1; rowIndex<rows+1; rowIndex++) {
					HSSFRow row=sheet.getRow(rowIndex);

					if(row!=null) {
						Map<String, Object> map = new HashMap<String, Object>();
						for(int colIndex=0; colIndex<cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue()+"";

							HSSFCell cell = row.getCell(colIndex);
							String value = "";

							if(cell==null) {
								continue;
							} else {
								switch(evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
	    		                	evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
	    		                	value = cell.getStringCellValue() + "";
	    		        			value = String.valueOf(value);
//									value = cell.getNumericCellValue() + "";
//									value = String.valueOf(value);
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
									switch(evaluator.evaluateFormulaCell(cell)) {
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
								};

								if(value!=null && value.length()>0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch(header_name) {
									case "현재위치":
										if(value==null || value.length()<1) break;
										map.put("cur_bin_code", value);
										break;
									case "이동위치":
										if(value==null || value.length()<1) break;
										map.put("move_bin_code", value);
										break;
									case "품번":
										if(value==null || value.length()<1) break;
										map.put("item_code", value);
										break;
									case "이동수량":
										Double quan = 0.0;
										try {
											quan = Double.parseDouble(value);
										} catch(Exception e) {
											quan = 0.0;
//	    		                			e.getStackTrace();
										}
										map.put("quan", quan);
										break;
									}
								}
							}
						} // header_name 끝
						listMap.add(map);
						// item insert
//						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else if(".xlsx".equalsIgnoreCase(ext)){

				XSSFWorkbook workbook=new XSSFWorkbook(file);
				XSSFSheet sheet=workbook.getSheetAt(0);

				FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();

				int rows = sheet.getPhysicalNumberOfRows();
				int cols = sheet.getRow(0).getPhysicalNumberOfCells();

				XSSFRow cell_header = sheet.getRow(0);

				for(int rowIndex=1; rowIndex<rows+1; rowIndex++) {
					XSSFRow row=sheet.getRow(rowIndex);

					if(row!=null) {
						Map<String, Object> map = new HashMap<String, Object>();
						for(int colIndex=0; colIndex<cols; colIndex++) {
							String header_name = cell_header.getCell(colIndex).getStringCellValue()+"";

							XSSFCell cell = row.getCell(colIndex);
							String value = "";

							if(cell==null) {
								continue;
							} else {
								switch(evaluator.evaluateInCell(cell).getCellType()) {
								case BOOLEAN:
									value = cell.getBooleanCellValue() + "";
									value = String.valueOf(value);
									break;
								case NUMERIC:
	    		                	evaluator.evaluateInCell(cell).setCellType(CellType.STRING);
	    		                	value = cell.getStringCellValue() + "";
	    		        			value = String.valueOf(value);
//									value = cell.getNumericCellValue() + "";
//									value = String.valueOf(value);
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
									switch(evaluator.evaluateFormulaCell(cell)) {
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
								};

								if(value!=null && value.length()>0) {
									header_name = header_name.trim().toUpperCase();
									header_name = header_name.replaceAll(" ", "");

									switch(header_name) {
									case "현재위치":
										if(value==null || value.length()<1) break;
										map.put("cur_bin_code", value);
										break;
									case "이동위치":
										if(value==null || value.length()<1) break;
										map.put("move_bin_code", value);
										break;
									case "품번":
										if(value==null || value.length()<1) break;
										map.put("item_code", value);
										break;
									case "이동수량":
										Double quan = 0.0;
										try {
											quan = Double.parseDouble(value);
										} catch(Exception e) {
											quan = 0.0;
										}
										map.put("quan", quan);
										break;
									}
								}
							}
						} // header_name 끝
						listMap.add(map);
						// item insert
//						this.itemDao.insert(uid_company, true, user_name, user_uid, "item", "item-upload", item);
					}
				}
				result = "seccess";
			} else {
				result = "fail";
			}

			Map updateMap = new HashMap();
			Map locationCond = new HashMap();

			if(listMap!=null && listMap.size()>0) {
				for(Map<String, Object> m : listMap) {
					String cur_bin_code = (String) m.get("cur_bin_code");
					String move_bin_code = (String) m.get("move_bin_code");
					String item_code = (String) m.get("item_code");
					Double quan = (Double) m.get("quan");

					if(cur_bin_code==null||cur_bin_code.length()<1 || move_bin_code==null||move_bin_code.length()<1
							|| item_code==null||item_code.length()<1) {
						continue;
					};

					// 현재위치 출고
					Long uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
					if(uid_item==null||uid_item<1L) continue;

					Long uid_bin = this.binDao.getUidBinByBinCode(uid_company, cur_bin_code);
					if(uid_bin==null||uid_bin<1L) continue;

					locationCond.put("uid_item", uid_item);
					locationCond.put("uid_bin", uid_bin);
					List<Location> locationList = this.locationDao.select_cond(uid_company, "location", locationCond);

					if(locationList!=null && locationList.size()>0) {
						Location location = locationList.get(0);
						Long uid_location = location.getUnique_id();
						this.locationDao.updateLocationByUniqueData(uid_company, uid_location, -quan, user_uid, user_name, "OUT");

						// 입고이력
						History history = new History();
						history.setUid_location(uid_location);
						history.setIs_inout("OUT");
						history.setHis_quan(-quan);
						history.setHis_date(new Date());

						this.historyDao.insert(uid_company, true, user_name, user_uid, "history", history);
					}

					// 이동위치 입고
//					uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
//					if(uid_item==null||uid_item<1L) continue;

					uid_bin = this.binDao.getUidBinByBinCode(uid_company, move_bin_code);
					if(uid_bin==null||uid_bin<1L) continue;

					Location location = new Location();
					location.setUid_bin(uid_bin);
					location.setUid_item(uid_item);
					location.setQuan(quan);
					location.setLast_in_date(new Date());

					Long uid_location = this.locationDao.insert(uid_company, true, user_name, user_uid, "location", "location-upload", location);

					if(uid_location!=null && uid_location>1L) {
						// 입고이력
						History history = new History();
						history.setUid_location(uid_location);
						history.setIs_inout("IN");
						history.setHis_quan(quan);
						history.setHis_date(new Date());

						this.historyDao.insert(uid_company, true, user_name, user_uid, "history", history);
					}

//					locationCond.put("uid_item", uid_item);
//					locationCond.put("uid_bin", uid_bin);
//					locationList = this.locationDao.select_cond(uid_company, "location", locationCond);
//
//					if(locationList!=null && locationList.size()>0) {
//						Location location = locationList.get(0);
//						Long uid_location = location.getUnique_id();
//						this.locationDao.updateLocationByUniqueData(uid_company, uid_location, quan, user_uid, user_name, "IN");
//
//						// 입고이력
//						History history = new History();
//						history.setUid_location(uid_location);
//						history.setIs_inout("IN");
//						history.setHis_quan(quan);
//						history.setHis_date(new Date());
//
//						this.historyDao.insert(uid_company, true, user_name, user_uid, "history", history);
//					};

//					String bin_code = (String) m.get("bin_code");
//					String item_code = (String) m.get("item_code");
//					Double quan = (Double) m.get("quan");
//
//					if(bin_code==null||bin_code.length()<1
//						|| item_code==null||item_code.length()<1) {
//						continue;
//					};
//
//					Long uid_item = this.itemDao.getUidItemByItemCode(uid_company, item_code);
//					if(uid_item==null||uid_item<1L) continue;
//
//					Long uid_bin = this.binDao.getUidBinByBinCode(uid_company, bin_code);
//					if(uid_bin==null||uid_bin<1L) continue;
//
//					Location location = new Location();
//					location.setUid_bin(uid_bin);
//					location.setUid_item(uid_item);
//					location.setQuan(quan);
//					location.setLast_in_date(new Date());
//
//					Long uid_location = this.locationDao.insert(uid_company, true, user_name, user_uid, "location", "location-upload", location);
//
//					if(uid_location!=null && uid_location>1L) {
//						// 입고이력
//						History history = new History();
//						history.setUid_location(uid_location);
//						history.setIs_inout("IN");
//						history.setHis_quan(quan);
//						history.setHis_date(new Date());
//
//						this.historyDao.insert(uid_company, true, user_name, user_uid, "history", history);
//					}

				}
			}

		} catch (Exception e) {
			result = "fail";
		}

		return null;
	};

	@Override
	public String createWearingTemplate(Long uid_company) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if(osName.contains("win")) {
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
			xssfWb = new XSSFWorkbook(); //XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// width 설정
			xssfSheet.setColumnWidth(0, 5000);
			xssfSheet.setColumnWidth(1, 5000);
			xssfSheet.setColumnWidth(2, 5000);

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short)20); // 폰트 크기
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
			xssfCell.setCellValue("lotno");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("위치");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 3);
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
			if (fos != null) fos.close();

		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	@Override
	public String createReleaseTemplate(Long uid_company) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if(osName.contains("win")) {
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
			xssfWb = new XSSFWorkbook(); //XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// width 설정
			xssfSheet.setColumnWidth(0, 5000);
			xssfSheet.setColumnWidth(1, 5000);
			xssfSheet.setColumnWidth(2, 5000);

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short)20); // 폰트 크기
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
			xssfCell.setCellValue("Lotno");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("위치");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("출고수량");

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
			if (fos != null) fos.close();

		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	@Override
	public String createStockMoveTemplate(Long uid_company) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if(osName.contains("win")) {
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
			xssfWb = new XSSFWorkbook(); //XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			// width 설정
			xssfSheet.setColumnWidth(0, 5000);
			xssfSheet.setColumnWidth(1, 5000);
			xssfSheet.setColumnWidth(2, 5000);
			xssfSheet.setColumnWidth(3, 5000);

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short)20); // 폰트 크기
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
			xssfCell.setCellValue("현재위치");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("이동위치");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(tableCellStyle);
			xssfCell.setCellValue("이동수량");

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
			if (fos != null) fos.close();

		} catch (Exception e) {
			result = null;
		}

		return result;
	}

	@Override
	public byte[] createHistoryExcel(Long uid_company, List<History> historyList, String s_date, String e_date, String gubun) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = ".";

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); //XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			CreationHelper createHelper = xssfWb.getCreationHelper();

			// width 설정
			xssfSheet.setColumnWidth(0, 6000); // 품번
			xssfSheet.setColumnWidth(1, 8000); // 품명
			xssfSheet.setColumnWidth(2, 8000); // 규격
			xssfSheet.setColumnWidth(3, 8000); // 상세사양
			xssfSheet.setColumnWidth(4, 3000); // 입고량
			xssfSheet.setColumnWidth(5, 5000); // 위치정보
			xssfSheet.setColumnWidth(6, 7000); // 입고일자
			xssfSheet.setColumnWidth(7, 5000); // 위치정보
			xssfSheet.setColumnWidth(8, 5000); // 위치정보
			xssfSheet.setColumnWidth(9, 5000); // 위치정보
			xssfSheet.setColumnWidth(10, 5000); // 위치정보
			xssfSheet.setColumnWidth(11, 5000); // 위치정보
			xssfSheet.setColumnWidth(12, 5000); // 위치정보

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short)20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			CellStyle titleCellStyle = xssfWb.createCellStyle();
			CellStyle headerCellStyle = xssfWb.createCellStyle();
			CellStyle tableCellStyle = xssfWb.createCellStyle();
			CellStyle dateCellStyle = xssfWb.createCellStyle();
			CellStyle dateYMDCellStyle = xssfWb.createCellStyle();

			XSSFFont titleFont = xssfWb.createFont();
			titleFont.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			titleFont.setFontHeightInPoints((short)24); // 폰트 크기
			titleFont.setBold(true); // Bold 설정
			titleFont.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			// Title
			xssfRow = xssfSheet.createRow(rowNum++);
			xssfSheet.addMergedRegion(new CellRangeAddress(0,0,0,12));
			xssfCell = xssfRow.createCell((short) 0);

			titleCellStyle.setAlignment(HorizontalAlignment.CENTER);
			titleCellStyle.setFont(titleFont);
			titleCellStyle.setFillForegroundColor(IndexedColors.TAN.getIndex());
			titleCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			xssfCell.setCellStyle(titleCellStyle);

			String title = "";
			switch(gubun) {
			case "IN":
				title = "입고내역";
				break;
			case "OUT":
				title = "출고내역";
				break;
			}

			if(s_date!=null && s_date.length()>0 && e_date!=null && e_date.length()>0)
				title += " (" + s_date + "~" + e_date + ")";
			xssfCell.setCellValue(title);

			xssfRow = xssfSheet.createRow(rowNum++);

			headerCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			headerCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			headerCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			headerCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
			headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
			headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);

			dateCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			dateCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			dateCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			dateCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			dateCellStyle.setAlignment(HorizontalAlignment.CENTER);

			dateCellStyle.setDataFormat(
						createHelper.createDataFormat().getFormat("YYYY-mm-dd HH:mm:ss")
					);

			dateYMDCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			dateYMDCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			dateYMDCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			dateYMDCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			dateYMDCellStyle.setAlignment(HorizontalAlignment.CENTER);

			dateYMDCellStyle.setDataFormat(
						createHelper.createDataFormat().getFormat("YYYY-mm-dd")
					);

			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("품명");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("규격");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("상세사양");

			xssfCell = xssfRow.createCell((short) 4);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("입고수량");
			// switch(gubun) {
			// case "IN":
			// 	xssfCell.setCellValue("입고량");
			// 	break;
			// case "OUT":
			// 	xssfCell.setCellValue("출고량");
			// 	break;
			// }

			xssfCell = xssfRow.createCell((short) 5);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("위치");

			xssfCell = xssfRow.createCell((short) 6);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("위치정보");

			xssfCell = xssfRow.createCell((short) 7);
			xssfCell.setCellStyle(headerCellStyle);


			switch(gubun) {
			case "IN":
				xssfCell.setCellValue("입고날짜");
				break;
			case "OUT":
				xssfCell.setCellValue("출고날짜");
				break;
			};
			xssfCell = xssfRow.createCell((short) 8);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("Batch LOT ID");
			xssfCell = xssfRow.createCell((short) 9);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("공급처 LOT 번호");
			xssfCell = xssfRow.createCell((short) 10);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("유효기간");
			xssfCell = xssfRow.createCell((short) 11);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("공급사");
			xssfCell = xssfRow.createCell((short) 12);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("급업체명");

			int i=0;
			for(History history : historyList) {
				xssfRow = xssfSheet.createRow(rowNum++);
				xssfCell = xssfRow.createCell((short) 0);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getItem_code());
				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getItem_name());
				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getSpecification());
				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getDetail_info());
				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getHis_quan());
				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getBin_code());
				xssfCell = xssfRow.createCell((short) 6);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getBin_name());
				xssfCell = xssfRow.createCell((short) 7);
				xssfCell.setCellStyle(dateCellStyle);
				xssfCell.setCellValue(history.getHis_date());
				xssfCell = xssfRow.createCell((short) 8);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getBatch_lot_id());
				xssfCell = xssfRow.createCell((short) 9);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getSupply_lot_number());
				xssfCell = xssfRow.createCell((short) 10);
				xssfCell.setCellStyle(dateYMDCellStyle);
				xssfCell.setCellValue(history.getExpiration_period());
				xssfCell = xssfRow.createCell((short) 11);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getSupply_name());
				xssfCell = xssfRow.createCell((short) 12);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(history.getSupply_company_name());
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
			if (fos != null) fos.close();
			byte[] bytes = new byte[(int) file.length()];
			return bytes;
		} catch (Exception e) {
			result = null;
		}

        return new byte[0];
    }

	@Override
	public String createStockMgmtExcel(Long uid_company, List<Item> itemList) {
		String result = null;

		String osName = System.getProperty("os.name").toLowerCase();

		String first = "";
		if(osName.contains("win")) {
			first = "C:";
		} else {
			first = "";
		}

		XSSFWorkbook xssfWb = null;
		XSSFSheet xssfSheet = null;
		XSSFRow xssfRow = null;
		XSSFCell xssfCell = null;

		try {
			xssfWb = new XSSFWorkbook(); //XSSFWorkbook 객체 생성
			xssfSheet = xssfWb.createSheet("Sheet1"); // 워크시트 이름 설정

			CreationHelper createHelper = xssfWb.getCreationHelper();

			// width 설정
			xssfSheet.setColumnWidth(0, 6000); // 품번
			xssfSheet.setColumnWidth(1, 8000); // 품명
			xssfSheet.setColumnWidth(2, 8000); // 규격
			xssfSheet.setColumnWidth(3, 8000); // 상세사양
			xssfSheet.setColumnWidth(4, 3000); // 단위
			xssfSheet.setColumnWidth(5, 5000); // 수량
			xssfSheet.setColumnWidth(6, 7000); // 안전재고

			// 폰트 스타일
			XSSFFont font = xssfWb.createFont();
			font.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			font.setFontHeightInPoints((short)20); // 폰트 크기
			font.setBold(true); // Bold 설정
			font.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			CellStyle cellStyle = xssfWb.createCellStyle();
			cellStyle.setAlignment(HorizontalAlignment.CENTER);

			int rowNum = 0;

			CellStyle titleCellStyle = xssfWb.createCellStyle();
			CellStyle headerCellStyle = xssfWb.createCellStyle();
			CellStyle tableCellStyle = xssfWb.createCellStyle();
			CellStyle dateCellStyle = xssfWb.createCellStyle();

			XSSFFont titleFont = xssfWb.createFont();
			titleFont.setFontName(HSSFFont.FONT_ARIAL); // 폰트 스타일
			titleFont.setFontHeightInPoints((short)24); // 폰트 크기
			titleFont.setBold(true); // Bold 설정
			titleFont.setColor(new XSSFColor(Color.decode("#457ba2"))); // 폰트 색 지정

			// Title
			xssfRow = xssfSheet.createRow(rowNum++);
			xssfSheet.addMergedRegion(new CellRangeAddress(0,0,0,6));
			xssfCell = xssfRow.createCell((short) 0);

			titleCellStyle.setAlignment(HorizontalAlignment.CENTER);
			titleCellStyle.setFont(titleFont);
			titleCellStyle.setFillForegroundColor(IndexedColors.TAN.getIndex());
			titleCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			xssfCell.setCellStyle(titleCellStyle);

			String title = "재고현황";
			xssfCell.setCellValue(title);

			xssfRow = xssfSheet.createRow(rowNum++);

			headerCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			headerCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			headerCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			headerCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
			headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
			headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			tableCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			tableCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			tableCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			tableCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			tableCellStyle.setAlignment(HorizontalAlignment.CENTER);

			dateCellStyle.setBorderTop(BorderStyle.THIN); // 테두리 위쪽
			dateCellStyle.setBorderBottom(BorderStyle.THIN); // 테두리 아래쪽
			dateCellStyle.setBorderLeft(BorderStyle.THIN); // 테두리 왼쪽
			dateCellStyle.setBorderRight(BorderStyle.THIN); // 테두리 오른쪽
			dateCellStyle.setAlignment(HorizontalAlignment.CENTER);

			dateCellStyle.setDataFormat(
						createHelper.createDataFormat().getFormat("YYYY-mm-dd HH:mm:ss")
					);

			xssfCell = xssfRow.createCell((short) 0);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("품번");
			xssfCell = xssfRow.createCell((short) 1);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("품명");
			xssfCell = xssfRow.createCell((short) 2);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("규격");
			xssfCell = xssfRow.createCell((short) 3);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("상세사양");
			xssfCell = xssfRow.createCell((short) 4);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("단위");
			xssfCell = xssfRow.createCell((short) 5);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("수량");
			xssfCell = xssfRow.createCell((short) 6);
			xssfCell.setCellStyle(headerCellStyle);
			xssfCell.setCellValue("안전재고");

			int i=0;
			for(Item item : itemList) {
				xssfRow = xssfSheet.createRow(rowNum++);
				xssfCell = xssfRow.createCell((short) 0);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getItem_code());
				xssfCell = xssfRow.createCell((short) 1);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getItem_name());
				xssfCell = xssfRow.createCell((short) 2);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getSpecification());
				xssfCell = xssfRow.createCell((short) 3);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getDetail_info());
				xssfCell = xssfRow.createCell((short) 4);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getUnit_code());
				xssfCell = xssfRow.createCell((short) 5);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getSum_quan());
				xssfCell = xssfRow.createCell((short) 6);
				xssfCell.setCellStyle(tableCellStyle);
				xssfCell.setCellValue(item.getSafe_quan());
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
			if (fos != null) fos.close();

		} catch (Exception e) {
			result = null;
		}

		return result;
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
