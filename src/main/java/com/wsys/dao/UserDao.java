package com.wsys.dao;

import java.util.List;
import java.util.Map;

import com.wsys.dao.base.BaseDao;

public interface UserDao extends BaseDao {

	public String getUserPwd(Map cond);

}
