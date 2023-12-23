package com.wsys.service.admin;

import java.util.List;

import javax.annotation.Resource;

import com.wsys.dao.BinDao;
import com.wsys.dao.BinManDao;
import com.wsys.dao.CompanyDao;
import com.wsys.dao.HistoryDao;
import com.wsys.dao.ItemDao;
import com.wsys.dao.LocationDao;
import com.wsys.dao.MenuDao;
import com.wsys.dao.RackDao;
import com.wsys.dao.UserDao;
import com.wsys.dao.WhouseDao;
import com.wsys.vo.SystemInfo;

public abstract class ExtendDaoExcelManager implements ExcelManager {

	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;

	@Resource(name = "CompanyDao")
	protected CompanyDao companyDao;

	@Resource(name = "UserDao")
	protected UserDao userDao;

	@Resource(name = "MenuDao")
	protected MenuDao menuDao;

	@Resource(name = "ItemDao")
	protected ItemDao itemDao;

	@Resource(name = "BinDao")
	protected BinDao binDao;

	@Resource(name = "BinManDao")
	protected BinManDao binManDao;

	@Resource(name = "LocationDao")
	protected LocationDao locationDao;

	@Resource(name = "HistoryDao")
	protected HistoryDao historyDao;

	@Resource(name = "RackDao")
	protected RackDao rackDao;

	@Resource(name = "WhouseDao")
	protected WhouseDao whouseDao;


}
