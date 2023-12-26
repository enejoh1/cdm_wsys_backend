package com.wsys.vo;

import java.io.Serializable;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class CommonVo implements Serializable{

	protected Long		unique_id;		//unique_id
	protected Long		uid_company;		//회사UID
	protected String	del_yn = null;	//삭제여부
	protected Long		creator_uid = null;	//만든사람UID
	protected String	creator = null;		//만든사람
	protected Date		create_date = null;	//생성일자
	protected Long		changer_uid = null;	//수정한사람 UID
	protected String	changer = null;		//수정한사람
	protected Date	 	change_date = null;	//수정일자
	protected Long		rownum = null;			//row수

	protected String    lotno = null;	//##DBG lotno 추가

	protected JSONObject	jsonObject;
	protected JSONArray		jsonArray;

	protected SimpleDateFormat	dateFormat 		= new SimpleDateFormat("yyyy-MM-dd");
	protected SimpleDateFormat	dateFormatDetail = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	protected DecimalFormat 	decimalFormat 		= new DecimalFormat("#,###.##");
	protected Date 				expiration_period;
	protected String 			supply_name = null;
	protected String 			batch_lot_id = null;

	protected String 			supply_lot_number = null;
	protected String 			supply_company_name = null;


	public Long getId() {
		if(unique_id == null || unique_id < 1L) unique_id = null;
		return unique_id;
	}

	public Long getUnique_id() {
		return unique_id;
	}

	public void setUnique_id(Long unique_id) {
		this.unique_id = unique_id;
	}

	public Long getKey() {
		return unique_id;
	}

	public String getUnique_id_str() {
		return String.valueOf(unique_id);
	}

	public Long getUid_company() {
		return uid_company;
	}

	public void setUid_company(Long uid_company) {
		this.uid_company = uid_company;
	}

	//##DBG lotno 추가
	public void setLotno(String lotno) {
		System.out.println("----:a6-1-9-1-");
		this.lotno = lotno;
	}

	public String getdel_yn() {
		return del_yn;
	}

	public void setdel_yn(String del_yn) {
		this.del_yn = del_yn;
	}

	public Long getCreator_uid() {
		return creator_uid;
	}

	public void setCreator_uid(Long creator_uid) {
		this.creator_uid = creator_uid;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getCreate_date() {
		return create_date;
	}

	public void setCreate_date(Date create_date) {
		this.create_date = create_date;
	}

	public Long getChanger_uid() {
		return changer_uid;
	}

	public void setChanger_uid(Long changer_uid) {
		this.changer_uid = changer_uid;
	}

	public String getChanger() {
		return changer;
	}

	public void setChanger(String changer) {
		this.changer = changer;
	}

	public Date getChange_date() {
		return change_date;
	}

	public void setChange_date(Date change_date) {
		this.change_date = change_date;
	}

	public Long getRownum() {
		return rownum;
	}

	public void setRownum(Long rownum) {
		this.rownum = rownum;
	}

	public String Double2String(Double value) {
		if(value==null)
			return "0";
		return decimalFormat.format(value);
	}

	public String Date2String(Date date) {
		if(date==null)
			return "0000-00-00";
		return dateFormat.format(date);
	}

	public String Date2String_Long(Date date) {
		if(date==null)
			return "0000/00/00 00:00:00";
		return dateFormatDetail.format(date);
	}

	public Date String2Date(String value) {

		Date date = null;
		if(value==null || value.length()==0) {
			return new Date();
		}
		try {
			date = dateFormat.parse(value);
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return date;
	}

	public Date getNullDate(Date date) {
		if(date==null) {
			return null;
		}
		String strDate = Date2String(date);
		if(strDate.compareTo("2001-01-01")==0) {
			return null;
		}
		return date;
	}

	public Date getExpiration_period() {
		return expiration_period;
	}

	public void setExpiration_period(Date expiration_period) {
		this.expiration_period = expiration_period;
	}

	public String getSupply_name() {
		return supply_name;
	}

	public void setSupply_name(String supply_name) {
		this.supply_name = supply_name;
	}

	public String getBatch_lot_id() {
		return batch_lot_id;
	}

	public void setBatch_lot_id(String batch_lot_id) {
		this.batch_lot_id = batch_lot_id;
	}

	public String getSupply_lot_number() {
		return supply_lot_number;
	}

	public void setSupply_lot_number(String supply_lot_number) {
		this.supply_lot_number = supply_lot_number;
	}

	public String getSupply_company_name() {
		return supply_company_name;
	}

	public void setSupply_company_name(String supply_company_name) {
		this.supply_company_name = supply_company_name;
	}
}
