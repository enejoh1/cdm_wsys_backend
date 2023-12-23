package com.wsys.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.wsys.dao.base.CommonDao;
import com.wsys.vo.CommonVo;
import com.wsys.vo.Rack;


@Repository("RackDao")
public class RackDaoimpl extends CommonDao implements RackDao {

	public RackDaoimpl() {
		super("rack");
	}

	@Override
	public List<Rack> readBinRate(Map cond) {
		return this.queryForList("getBinRate", cond);
	}

	@Override
	public List<Rack> getRackListByUidBIN(Map cond) {
		return this.queryForList("getRackListByUidBIN", cond);
	}

	@Override
	public List<Rack> getRackListByUidWhouse(Map cond) {
		return this.queryForList("getRackListByUidWhouse", cond);
	}

	@Override
	public void deleteRackData(Map deleteRack) {
		this.update("deleteRackData", deleteRack);
	}

	@Override
	public void deleteRackAllData(String user_name, Long user_uid, Long rackUid) {
		Map map = new HashMap();
		map.put("changer", user_name);
		map.put("changer_uid", user_uid);
		map.put("uid_rack", rackUid);
		// Location -> Bin -> Rack �닚�쑝濡� �궘�젣
		this.update("deleteLocationByRackUid", map);
		this.update("deleteBinByRackUid", map);
		this.update("deleteRackByRackUid", map);
	}

	@Override
	public Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName,
			String sqlName, CommonVo sdomain) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}


}
