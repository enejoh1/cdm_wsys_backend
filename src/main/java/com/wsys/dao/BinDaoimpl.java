package com.wsys.dao;

import java.io.Writer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wsys.dao.base.CommonDao;
import com.wsys.util.DatabasePage;
import com.wsys.vo.Bin;
import com.wsys.vo.CommonVo;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

@Repository("BinDao")
public class BinDaoimpl extends CommonDao implements BinDao {
	
	public BinDaoimpl() {
		super("bin");
	}

	@Override
	public List<Bin> getUsingBinList(Map cond) {
		return this.queryForList("getUsingBinList", cond);
	}

	@Override
	public Long getUidBinByItemCode(Long uid_company, String bin_code) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("bin_code", bin_code);
		return (Long) this.queryForObject("getUidBinByItemCode", cond);
	}

	@Override
	public List<Bin> getUsingBinListByWhouseUid(Map cond) {
		return this.queryForList("getUsingBinListByWhouseUid", cond);
	}

	@Override
	public Long getUidBinByBinCode(Long uid_company, String bin_code) {
		Map map = new HashMap();
		map.put("uid_company", uid_company);
		map.put("bin_code", bin_code);
		return (Long) this.queryForObject("getUidBinByBinCode", map);
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
