package com.wsys.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.wsys.dao.base.CommonDao;
import com.wsys.vo.CommonVo;


@Repository("CompEnvDao")
public class CompEnvDaoimpl extends CommonDao implements CompEnvDao {

	public CompEnvDaoimpl() {
		super("compenv");
	}

	@Override
	public Long insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid, String tableName,
			String sqlName, CommonVo sdomain) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}


}
