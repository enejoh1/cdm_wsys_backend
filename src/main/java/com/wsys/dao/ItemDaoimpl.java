package com.wsys.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.wsys.dao.base.CommonDao;
import com.wsys.vo.CommonVo;


@Repository("ItemDao")
public class ItemDaoimpl extends CommonDao implements ItemDao {
	
	public ItemDaoimpl() {
		super("item");
	}

	@Override
	public Long getUidItemByItemCode(Long uid_company, String item_code) {
		Map cond = new HashMap();
		cond.put("uid_company", uid_company);
		cond.put("item_code", item_code);
		return (Long) this.queryForObject("getUidItemByItemCode", cond);
	}

	@Override
	public Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName,
			String sqlName, CommonVo sdomain) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("##DBG---Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName,\r\n"
				+ "			String sqlName, CommonVo sdomain) throws Exception");
		return null;
	}


}
