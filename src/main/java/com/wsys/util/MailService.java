package com.wsys.util;

import java.io.File;
import java.util.ArrayList;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.wsys.util.MailHandler;
import com.wsys.vo.MailVo;

import lombok.AllArgsConstructor;

@Service("MailService")
public class MailService {
	@Autowired
	private JavaMailSender javaMailSender;

	public void sendMailAttach(MailVo mailVo) {
		try {
				MimeMessage message = javaMailSender.createMimeMessage();
				MimeMessageHelper mailHandler = new MimeMessageHelper(message, true);
				mailHandler.setTo(mailVo.getTo());
				mailHandler.setSubject(mailVo.getSubject());
				mailHandler.setFrom(mailVo.getFrom(), mailVo.getFrom_name());
				String htmlContent = mailVo.getText();
				mailHandler.setText(htmlContent, false);
//				if(mailVo.getAttachments()!=null&&mailVo.getAttachments().size()>0) {
//					for(Pair attachment:mailVo.getAttachments()) {
//						FileSystemResource file = new FileSystemResource(new File((String) attachment.getSecond()));
//						mailHandler.addAttachment((String) attachment.getFirst(), file);
//					}
//				}
				javaMailSender.send(message);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
}
