package com.wsys.dao;

import java.util.List;
import java.util.Map;

import com.wsys.dao.base.BaseDao;

public interface ItemDao extends BaseDao {

	public Long getUidItemByItemCode(Long uid_company, String item_code);

}
