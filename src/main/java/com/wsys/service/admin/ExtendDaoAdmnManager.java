package com.wsys.service.admin;

import java.util.List;

import javax.annotation.Resource;

import com.wsys.dao.CompanyDao;
import com.wsys.dao.MenuDao;
import com.wsys.dao.UserDao;
import com.wsys.util.MailService;
import com.wsys.vo.SystemInfo;

public abstract class ExtendDaoAdmnManager implements AdminManager {
	
	@Resource(name = "systemInfo")
	protected SystemInfo systemInfo;
	
	@Resource(name = "CompanyDao")
	protected CompanyDao companyDao;
	
	@Resource(name = "UserDao")
	protected UserDao userDao;
	
	@Resource(name = "MenuDao")
	protected MenuDao menuDao;

	@Resource(name="MailService")
	protected MailService mailService;
	
	
	public void setPropertyInfo() {
		systemInfo.setPropertyInfo();
	}
	
}
