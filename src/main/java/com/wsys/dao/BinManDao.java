package com.wsys.dao;

import java.util.List;
import java.util.Map;

import com.wsys.dao.base.BaseDao;
import com.wsys.vo.BinMan;

public interface BinManDao extends BaseDao {

	public List<BinMan> getUsingBinManList(Map cond);

	public Long getUidBinByItemCode(Long uid_company, String bin_code);

	public List<BinMan> getUsingBinListByWhouseUid(Map cond);

	public Long getUidBinManByBinCode(Long uid_company, String bin_code);

	public List<Map<String, Object>> getRackGroup(Map cond);

}
