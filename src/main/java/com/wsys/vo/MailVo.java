package com.wsys.vo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MailVo extends CommonVo{
	private String from;
	private String from_name;
	private String to;
	private String subject;
	private String text;
}
