package com.wsys.dao;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.wsys.dao.base.BaseDao;
import com.wsys.vo.Bin;

public interface BinDao extends BaseDao {

	public List<Bin> getUsingBinList(Map cond);

	public Long getUidBinByItemCode(Long uid_company, String bin_code);

	public List<Bin> getUsingBinListByWhouseUid(Map cond);

	public Long getUidBinByBinCode(Long uid_company, String bin_code);

	public List<Map<String, Object>> getRackGroup(Map cond);

}
