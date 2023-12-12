package com.wsys.dao.base;

import java.io.ByteArrayOutputStream;
import java.io.ObjectOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.Configuration;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import com.wsys.util.DatabasePage;
import com.wsys.vo.CommonVo;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

import java.util.Map;
import java.util.Properties;

public class CommonDao implements InitializingBean{
	protected Log log = LogFactory.getLog(CommonDao.class);

	@Autowired
	protected SqlSessionTemplate sqlSession;

	protected String tableName = "UN-DEFINED";
	
	public CommonDao(String tableName) {
		super();
		this.tableName = tableName;
	}
	
	@Override
	public void afterPropertiesSet() throws Exception {
		SqlSessionFactory sf = sqlSession.getSqlSessionFactory();
		Configuration conf = sf.getConfiguration();
		Properties props = conf.getVariables();
		// printProps(props);

	}
	
	protected void printQueryId(String queryId) {
		if (log.isDebugEnabled()) {
			log.debug(queryId);
		}
	}
	
	@SuppressWarnings("rawtypes")
	public List selectList(String queryId) {
		printQueryId(queryId);
		return sqlSession.selectList(queryId);
	}

	@SuppressWarnings("rawtypes")
	public List selectList(String queryId, Object params) {
		printQueryId(queryId);
		return sqlSession.selectList(queryId, params);
	}
	
	public Object insert(String queryId, Object params) {
		printQueryId(queryId);
		return sqlSession.insert(queryId, params);
	}
	
	public Object insertLogBatch(String queryId, Object params) {
		printQueryId(queryId);
		return sqlSession.insert(queryId, params);
	}
	
	public int update(String queryId) {
		printQueryId(queryId);
		return (int) sqlSession.update(queryId);
	}
	
	public int update(String queryId, Object params) {
		System.out.println("--##DBG----int update(String queryId, Object params)-----------------");
		System.out.println(queryId);
		System.out.println(params);

		printQueryId(queryId);
		return (int) sqlSession.update(queryId, params);
	}
	
	public Object selectOne(String queryId) {
		printQueryId(queryId);
		return sqlSession.selectOne(queryId);
	}

	public Object selectOne(String queryId, Object cond) {
		printQueryId(queryId);
		return sqlSession.selectOne(queryId, cond);
	}
	
	public Object selectOne(String queryId, Map cond) {
		printQueryId(queryId);
		return sqlSession.selectOne(queryId, cond);
	}

	public Object queryForObject(String queryId) {
		printQueryId(queryId);
		return sqlSession.selectOne(queryId);
	}
	
	public Object queryForObject(String queryId, Object params) {
		printQueryId(queryId);
		return sqlSession.selectOne(queryId, params);
	}
	
	public List queryForList(String queryId, Object params) {
		printQueryId(queryId);
		return sqlSession.selectList(queryId, params);
	}

	public Object callProcedure(String queryId, Object params) {
		printQueryId(queryId);
		return (Object) sqlSession.update(queryId, params);
	}
	
	public Long getNextUid(String tableName) {
		String seq_name = "getNextSeqId";
		
		Map<String, String> mapSequenceName = new HashMap<String, String>();
		mapSequenceName.put("seq_name", "sq_" + tableName.toLowerCase());

		return ((Long) this.queryForObject(seq_name, mapSequenceName));
	}

	public Long getCurUid(String tableName) {
		String curSeqName = "getCurSeqId";
		
		Map<String, String> seqCond = new HashMap<String, String>();
			seqCond.put("seq_name", "sq_" + tableName.toLowerCase());

		return ((Long) this.queryForObject(curSeqName, seqCond));
	}
	
	public Long getTableLastUid(String tableName) {
		String curSeqName = "getTableLastUid";
		
		Map<String, String> seqCond = new HashMap<String, String>();
			seqCond.put("table_name", "tb_" + tableName.toLowerCase());

		return ((Long) this.queryForObject(curSeqName, seqCond));
	}
	
	public int updateLastSeqId(String tableName) {
		String queryId = "updateLastSeqId";
		//현재테이블에 사용되고 있는 마지막 UID 가져오기
		Long curUId = getTableLastUid(tableName);
		
		//해당 시퀀스에 마지막 UID 업데이트 
		Map seqCond = new HashMap<String, String>();
			seqCond.put("seq_name", "SQ_" + tableName.toLowerCase());
			seqCond.put("lastSeqId", curUId);
		return update(queryId, seqCond);
	}

	protected Long insert(String qryName, CommonVo sdomain, Exception[] exception) {
		try {
			insert("insert-" + qryName.toLowerCase(), sdomain);
//			insert("insert-" + tableName.toLowerCase(), sdomain);
		} catch (Exception e) {
			exception[0] = e;
			return -1L;

		}
		return sdomain.getUnique_id();
	}
	
//CRUD
	public Long insert(boolean use_seq, String creator, Long creator_uid, String tableName, CommonVo sdomain)
			throws Exception {

		sdomain.setCreator(creator);
		sdomain.setCreator_uid(creator_uid);

		return this.insert(use_seq, tableName, sdomain);

	}

	public Long insert(Long uid_company, boolean use_seq, String creator, Long creator_uid, String tableName, CommonVo sdomain)
			throws Exception {
		sdomain.setCreator(creator);
		sdomain.setCreator_uid(creator_uid);
		sdomain.setUid_company(uid_company);
		
		return this.insert(use_seq, tableName, sdomain);
		
	}

	//##DBG lotno 수정.추가
	public Long insert(String lotno, Long uid_company, boolean use_seq, String creator, Long creator_uid, String tableName, CommonVo sdomain)
			throws Exception {
		System.out.println(lotno + ","  + uid_company +"," + use_seq + "," + creator + "," + creator_uid + "," +  tableName + "," +  sdomain);
		System.out.println("----:a6-1-1--");
		sdomain.setCreator(creator);
		System.out.println("----:a6-1-2--");
		sdomain.setCreator_uid(creator_uid);
		System.out.println("----:a6-1-3--");
		sdomain.setUid_company(uid_company);
		System.out.println("----:a6-1-4--");
		sdomain.setLotno(lotno);//##DBG lotno 추가
		
		return this.insert(use_seq, tableName, sdomain);		
	}
	
	//##DBG lotno 수정.추가
	public Long insert(String lotno, Long uid_company, boolean use_seq, String creator, Long creator_uid, String tableName, String sqlName, CommonVo sdomain)
			throws Exception {
		System.out.println("##DBG----public Long insert(String lotno, Long uid_company, boolean use_seq, String creator, Long creator_uid, String tableName, String sqlName, CommonVo sdomain)\r\n"
				+ "			throws Exception-------");
		sdomain.setCreator(creator);
		sdomain.setCreator_uid(creator_uid);
		sdomain.setUid_company(uid_company);
		sdomain.setLotno(lotno);//##DBG lotno 추가
		
		return this.insert(use_seq, tableName, sqlName, sdomain);
		
	}

	protected Long insert(boolean use_seq, String tableName, CommonVo sdomain) {
		
		Exception[] e = new Exception[1];
		Date today = new Date();
		sdomain.setCreate_date(today);

		System.out.println("----:a6-1-5--");
		Long nextUid = sdomain.getUnique_id();
		System.out.println("----:a6-1-6--");
		
		//seq 사용할 경우
		if (use_seq == true) {
			System.out.println("----:a6-1-7--");
			Long tbLastUid = getTableLastUid(tableName);
			System.out.println("----:a6-1-8--");
			nextUid = getNextUid(tableName);
			System.out.println("----:a6-1-9--");
			if(tbLastUid!=null) {
				if(tbLastUid>=nextUid) {
					//해당테이블 마지막 unique_id sequence에 업데이트
					System.out.println("----:a6-1-10--");
					updateLastSeqId(tableName);
					System.out.println("----:a6-1-11--");
					//SEQID 다시 불러온 후 넣어줌
					nextUid = getNextUid(tableName);
					System.out.println("----:a6-1-12--");
				}
			}	
			
			System.out.println("----:a6-1-13--");
			sdomain.setUnique_id(nextUid);
			System.out.println("----:a6-1-14--");
		}
		
		System.out.println("----:a6-1-15--");
		Long retUid = this.insert(/* "insert-" + */tableName.toLowerCase(), sdomain, e);
		System.out.println("----:a6-1-16--");
		
		return retUid;

	}
	
	protected Long insert(boolean use_seq, String tableName, String sqlName, CommonVo sdomain) {
		
		Exception[] e = new Exception[1];
		Date today = new Date();
		sdomain.setCreate_date(today);
		
		Long nextUid = sdomain.getUnique_id();
		
		//seq 사용할 경우
		if (use_seq == true) {
			Long tbLastUid = getTableLastUid(tableName);
			nextUid = getNextUid(tableName);
			if(tbLastUid!=null) {
				if(tbLastUid>=nextUid) {
					//해당테이블 마지막 unique_id sequence에 업데이트
					updateLastSeqId(tableName);
					//SEQID 다시 불러온 후 넣어줌
					nextUid = getNextUid(tableName);
				}
			}	
			
			sdomain.setUnique_id(nextUid);
		}
		
		Long retUid = this.insert(/* "insert-" + */sqlName.toLowerCase(), sdomain, e);
		
		return retUid;
		
	}
	
	protected Long insertSysLog(String tableName, Map logMap) {
		try {
			insertLogBatch(tableName, logMap);
		} catch (Exception excep) {
			return -1L;
		}
		return -1L;
	}
	
	public int updateByMap(String changer, Long changer_uid, String tableName, Map map) {
		map.put("changer_uid", changer_uid);
		map.put("changer", changer);
		map.put("change_date", new Date());
		
		int n = 0;
		
		try {
			n = this.update("update-bymap-" + tableName.toLowerCase(), map);
		} catch (Exception e) {
			e.printStackTrace();	
		}
		
		return n;
	}

	public int deleteByMap(String changer, Long changer_uid, String tableName, Map map) {
		map.put("changer_uid", changer_uid);
		map.put("changer", changer);
		map.put("change_date", new Date());
		
		return this.update("delete-bymap-" + tableName.toLowerCase(), map);
	}
	
	public CommonVo select_uid(Long unique_id) {
		if (tableName.compareToIgnoreCase("UN-DEFINED") == 0)
			return null;
		return select_uid(this.tableName, unique_id);
	}
	
	public CommonVo select_uid(String tableName, Long unique_id) {
		return (CommonVo) this.queryForObject("selectuid-" + tableName.toLowerCase(), unique_id);
	}
	
	public List select_cond(Long uid_comast, Map condition) {
		if (tableName.compareToIgnoreCase("UN-DEFINED") == 0)
			return null;
		return select_cond(uid_comast, this.tableName, condition);
	}
	
	public List select_cond(Long uid_company, String tableName, Map condition) {
		if (uid_company == null) {//세션이 끊어진경우.
			return null;
		}else {
			if (uid_company == 0) {
				condition.put("uid_company", "%");
			} else {
				condition.put("uid_company", uid_company);
			}
		}
		return select_cond(tableName, condition);
	}
	
	public List select_cond(Long uid_comast, Map condition, DatabasePage page) {
		if (tableName.compareToIgnoreCase("UN-DEFINED") == 0)
			return null;
		return select_cond(uid_comast, this.tableName, condition, page);
	}

	public List select_cond(Long uid_company, String tableName, Map condition, DatabasePage page) {
		System.out.println("-##DBG------List select_cond(Long uid_company, String tableName, Map condition, DatabasePage page)-------------");
		if (uid_company == null) {//세션이 끊어진경우.
			return null;
		}else {
			if (uid_company == 0) {
				condition.put("uid_company", "%");
			} else {
				condition.put("uid_company", uid_company);
			}
		}
		
		String order_by = null;
		if (page != null && page.getListSort() != null) {
			for (String sort : page.getListSort()) {
				System.out.print(">>>>>>1>>>>>>");		
				System.out.print(sort);		
				System.out.println("<<<<1<<<<<<<");		
				log.debug("sort = " + sort);

				if (order_by == null) {
					order_by = sort;
				} else {
					order_by = order_by + ", " + sort;
					log.debug("order_by = " + order_by);
				}
			}
		} else {
			order_by = " unique_id desc ";
		}

		System.out.println("##DBG-----selectcond-" + tableName + "-count");
		System.out.println("##DBG-----" + condition);
		Integer count = (Integer) this.queryForObject("selectcond-" + tableName + "-count", condition);
		page.setCount(count);
		System.out.println("##DBG-----" + count);

		int start = page.getStart();
		int limit = page.getLimit();
		if (start < 0) {
			start = 0;
		}
		if (limit < 0) {
//			limit = 100;
			limit = 10000;
		}
		

		Boolean isAsc = null;	//##DBG 정렬 추가
		isAsc = page.getListSortAsc(); //##DBG 추가

//		}		
		List list = select_cond(tableName + "-page", condition, start, limit, order_by, isAsc); //##DBG 정렬 수정
//		this.addSysLogs(uid_company, list, page);

		return list;
	}

	public List select_cond(String tableName, Map condition, int start, int record_quan, String order_by, Boolean is_asc) {
		System.out.println("-##DBG--------List select_cond(String tableName, Map condition, int start, int record_quan, String order_by, Boolean is_asc)------------");
		int start_point = start;
		int end_point = start;

		String order_by_full = null;

		if (order_by != null && order_by.length() > 0) {

			order_by_full = "order by " + order_by;

			if (is_asc != null) {
				if (is_asc == false) {
					order_by_full = order_by_full + " desc";
				} else {
					order_by_full = order_by_full + " asc";
				}
			}
			condition.put("order_by", order_by_full);

		}

		String limit = null;
			start_point = start;
			end_point = record_quan;
			condition.put("start_point", start_point);
			condition.put("end_point", end_point);

		return select_cond(tableName/* + "-paging" */, condition);
	}
	
	public List select_cond(String tableName, Map condition) {
		System.out.println("-##DBG-----List select_cond(String tableName, Map condition)---------");
		try {
			return this.queryForList("selectcond-" + tableName, condition);
		} catch (Exception e) { // 일반쿼리로 한번 더 실행한다.
			e.printStackTrace();
			return null;
		}
	}
	
	public List select_cond(String tableName, Map condition, DatabasePage page) {
		String order_by = null;
		if (page != null && page.getListSort() != null) {
			for (String sort : page.getListSort()) {
				if (sort != null && sort.length() > 0) {
					if (order_by == null) {
						order_by = sort;
					} else {
						order_by = order_by + ", " + sort;
					}
				}
			}
		} else {
			order_by = " create_date desc ";
		}

		Integer count = 0;

		try {
			count = (Integer) this.queryForObject("selectcond-" + tableName + "-count", condition);
		} catch (Exception e) { 
			e.printStackTrace();
		}

		int start = 0;
		int limit = 1000;
		if (page != null) {
			page.setCount(count);
			start = page.getStart();
			limit = page.getLimit();
			if (start < 0) {
				start = 0;
			}
		}
		if (limit < 0) {
			limit = 100;
//			limit = 1000;
		}
		
		List list = select_cond(tableName + "-page", condition, start, limit, order_by, null);
		
		Long uid_company = (Long) condition.get("uid_company");
//		this.addSysLogs(uid_company, list, page);
		
		return list;
	}
	
	public String getNextCode(Long uid_company, String tableName, String column_name, String first_code, int length) {
		String queryName = "getNextCode";
		
		Map<String, Object> cond = new HashMap<String, Object>();
			cond.put("table_name", "tb_" + tableName.toLowerCase());
			cond.put("column_name", column_name);
			cond.put("first_code", first_code);
			cond.put("length", length);
		return ((String) this.queryForObject(queryName, cond));
	}
	
	public String getAutoCode(Long uid_company, String tableName, String column_name, String first_code, int length) {
		String queryName = "getAutoCode";
		
		Map<String, Object> cond = new HashMap<String, Object>();
			cond.put("table_name", "tb_" + tableName.toLowerCase());
			cond.put("column_name", column_name);
			cond.put("first_code", first_code);
			cond.put("length", length);
		return ((String) this.queryForObject(queryName, cond));
	}
	
	public Integer getNextSortNo(Long uid_company, String table_name, String column_name, String where_name,
			String where_value, Map cond) {
		cond.put("table_name", "tb_" + tableName.toLowerCase());
		cond.put("uid_company", uid_company);
		cond.put("column_name", column_name);
		cond.put("where_name", where_name);
		cond.put("where_value", where_value);
		
		return (Integer) this.queryForObject("getNextSortNo", cond);
	}
	
	public Long duplicateCodeCheck(Long uid_company, String tableName, String column_name, String code) {
		String queryName = "duplicateCodeCheck";
		
		Map<String, Object> cond = new HashMap<String, Object>();
			cond.put("table_name", "tb_" + tableName.toLowerCase());
			cond.put("column_name", column_name);
			cond.put("code", code);
		return ((Long) this.queryForObject(queryName, cond));
	}
	
//	public void addSysLogs(Long uid_company, List list, DatabasePage page) {
//		Map<String, Object> data = new HashMap<String, Object>();
//		data.put("datas", list);
//		
//		JsonValueProcessor beanProcessor = new JavaUtilDateJsonValueProcessor();
//		JsonConfig jsonConfig = new JsonConfig();
//		jsonConfig.registerJsonValueProcessor(java.util.Date.class, beanProcessor);		 
//		String jsonStr = JSONObject.fromObject(data, jsonConfig).toString();
//		
//		int bytes = jsonStr.getBytes(StandardCharsets.UTF_8).length;
//		
//		try {
//		    
//		    String ip = page.getIp_address();
//			String menu_code = page.getMenu_code();
//			String menu_name = page.getMenu_name();
//			SysLog syslog = new SysLog();
//			Double dataDouble = (double) bytes;
//			SysLog log = new SysLog(uid_company, page.getUser_id(), ip, menu_code, menu_name, page.getEvent_type(), 
//					new Date(), null, dataDouble);
//			
//			Map logMap = new HashMap();
//			logMap.put("uid_company", uid_company);
//			logMap.put("user_id", page.getUser_id());
//			logMap.put("ip_address", ip);
//			logMap.put("menu_code", menu_code);
//			logMap.put("menu_name", menu_name);
//			logMap.put("event_type", page.getEvent_type());
//			logMap.put("event_date", new Date());
//			logMap.put("event_reason", null);
//			logMap.put("data_size", dataDouble);
//			
//			Long uid_syslog = this.insertSysLog("PC_INSERT_SYSLOG", logMap);
//			
//		} catch(Exception e) {
//			
//		}
//	}
	
	
	private void printProps(Properties props) {
		// System.out.println("\n");
		if (props != null) {
			for (Object key : props.keySet()) {
				System.out.println(key + "=" + props.get((String) key));
			}
		}
	}

}
