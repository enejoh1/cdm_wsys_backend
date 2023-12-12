package com.wsys.dao;

import java.util.List;
import java.util.Map;

import com.wsys.dao.base.BaseDao;
import com.wsys.vo.Menu;

public interface MenuDao extends BaseDao {

	public List<Menu> getTotalMenu(Map cond);

}
