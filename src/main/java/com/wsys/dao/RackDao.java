package com.wsys.dao;

import java.util.List;
import java.util.Map;

import com.wsys.dao.base.BaseDao;
import com.wsys.vo.Rack;

public interface RackDao extends BaseDao {

	public List<Rack> readBinRate(Map cond);

	public List<Rack> getRackListByUidBIN(Map cond);

	public List<Rack> getRackListByUidWhouse(Map cond);

	public void deleteRackData(Map deleteRack);

	public void deleteRackAllData(String user_name, Long user_uid, Long rackUid);

}
