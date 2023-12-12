package com.wsys.dao.base;

import java.util.List;
import java.util.Map;

import com.wsys.util.DatabasePage;
import com.wsys.vo.CommonVo;

public interface BaseDao {

	public Long	insert( boolean seq_yn, String creator, Long creator_uid,  String tableName, CommonVo sdomain) throws Exception;
	public Long	insert(Long uid_company, boolean use_seq, String creator, Long creator_uid,  String tableName, CommonVo sdomain) throws Exception;//public Long	insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid,  String tableName, CommonVo sdomain) throws Exception;
	public Long	insert(String lotno, Long uid_company, boolean seq_yn, String creator, Long creator_uid,  String tableName, CommonVo sdomain) throws Exception; //##DBG lotno ����.�߰�
	public Long	insert(Long uid_company, boolean seq_yn, String creator, Long creator_uid,  String tableName, String sqlName, CommonVo sdomain) throws Exception;
	public int updateByMap(String changer, Long changer_uid, String tableName, Map map);
	public int deleteByMap(String changer, Long changer_uid, String tableName, Map map);
	
	public List select_cond(Long uid_company, Map condition);
	public List select_cond(Long uid_company, String tableName, Map condition);
	public List select_cond(Long uid_company, Map condition, DatabasePage page);
	public List select_cond(Long uid_company, String tableName, Map condition, DatabasePage page);
	
	public CommonVo select_uid(Long unique_id);
	public CommonVo select_uid(String tableName, Long unique_id);
	
	public String getNextCode(Long uid_company, String tableName, String column_name, String first_code, int length);
	public String getAutoCode(Long uid_company, String tableName, String column_name, String first_code, int length);
	public Integer getNextSortNo(Long comast_uid, String table_name, String column_name, String where_name, String where_value, Map cond);

	public Long duplicateCodeCheck(Long uid_company, String tableName, String column_name, String code);
}
