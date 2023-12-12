package com.wsys.dao;

import java.util.List;
import java.util.Map;

import com.wsys.dao.base.BaseDao;
import com.wsys.vo.Location;

public interface LocationDao extends BaseDao {

	public void execMove(Map map);

	public List<Location> getSumRackLocation(Map sumCond);

	public void updateLocationByUniqueData(Long uid_company, Long uid_location, Double quan, 
			Long user_uid, String user_name, String type);
	public void updateLocationByUniqueData(String lotno, Long uid_company, Long uid_location, Double quan, 
			Long user_uid, String user_name, String type);

}
