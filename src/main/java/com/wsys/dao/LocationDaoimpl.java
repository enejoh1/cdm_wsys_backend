package com.wsys.dao;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.wsys.dao.base.CommonDao;
import com.wsys.vo.CommonVo;
import com.wsys.vo.Location;


@Repository("LocationDao")
public class LocationDaoimpl extends CommonDao implements LocationDao {
	
	public LocationDaoimpl() {
		super("location");
	}

	@Override
	public void execMove(Map map) {
		System.out.println("----##DBG---void execMove(Map map)--------");
		System.out.println(map);
		this.update("PC_EXEC_MOVE", map);
	}

	@Override
	public List<Location> getSumRackLocation(Map sumCond) {
		return this.queryForList("getSumRackLocation", sumCond);
	}

	@Override
	public void updateLocationByUniqueData(Long uid_company, Long uid_location, Double quan, 
			Long user_uid, String user_name, String type) {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("unique_id", uid_location);
		map.put("quan", quan);
		map.put("changer_uid", user_uid);
		map.put("changer", user_name);
		map.put("change_date", new Date());
		if(type!=null) {
			switch(type) {
			case "IN":
				map.put("last_in_date", new Date());
				break;
			case "OUT":
				map.put("last_out_date", new Date());
				break;
			}
		}
		System.out.println("--##DBG----updateLocationByUniqueData(Long uid_company, Long uid_location, Double quan, Long user_uid, String user_name, String type)---------------");
		System.out.println(map);
		this.update("updateLocationByUniqueData", map);
	}

	@Override
	public void updateLocationByUniqueData(String lotno, Long uid_company, Long uid_location, Double quan, 
			Long user_uid, String user_name, String type) {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("unique_id", uid_location);
		map.put("quan", quan);
		map.put("changer_uid", user_uid);
		map.put("changer", user_name);
		map.put("change_date", new Date());
		map.put("lotno", lotno);
		if(type!=null) {
			switch(type) {
			case "IN":
				map.put("last_in_date", new Date());
				break;
			case "OUT":
				map.put("last_out_date", new Date());
				break;
			}
		}
		
		System.out.println("--##DBG----updateLocationByUniqueData(String lotno, Long uid_company, Long uid_location, Double quan, Long user_uid, String user_name, String type)---------------");
		System.out.println(map);
		this.update("updateLocationByUniqueData", map);
	}

	@Override
	public Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName,
			String sqlName, CommonVo sdomain) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("##DBG--public Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName, String sqlName, CommonVo sdomain) throws Exception--");
		//this.insert(uid_company, seq_yn, creator, creator_uid, tableName, sqlName, sdomain);
		return null;
	}

}
