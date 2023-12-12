package com.wsys.vo;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.This;

@Data
@AllArgsConstructor
@NoArgsConstructor
// 자재 정보
public class SysConf extends CommonVo {
	public String sys_code;
	public String sys_value;
}
