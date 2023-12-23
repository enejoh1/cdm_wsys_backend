package com.wsys.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.wsys.dao.base.CommonDao;
import com.wsys.vo.BinMan;
import com.wsys.vo.CommonVo;


@Repository("BinManDao")
public class BinManDaoimpl extends CommonDao implements BinManDao {

	public BinManDaoimpl() {
		super("BinMan");
	}

	@Override
	public List<BinMan> getUsingBinManList(Map cond) {
		return this.queryForList("getUsingBinManList", cond);
	}

	@Override
	public Long getUidBinByItemCode(Long uid_company, String bin_code) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("bin_code", bin_code);
		return (Long) this.queryForObject("getUidBinByItemCode", cond);
	}

	@Override
	public List<BinMan> getUsingBinListByWhouseUid(Map cond) {
		return this.queryForList("getUsingBinListByWhouseUid", cond);
	}

	@Override
	public Long getUidBinManByBinCode(Long uid_company, String bin_code) {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("bin_code", bin_code);
		return (Long) this.queryForObject("getUidBinManByBinCode", map);
	}

	@Override
	public List<Map<String, Object>> getRackGroup(Map cond) {
		return this.queryForList("getRackGroup", cond);
	}

	@Override
	public Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName,
			String sqlName, CommonVo sdomain) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}


}
