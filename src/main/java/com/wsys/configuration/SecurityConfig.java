package com.wsys.configuration;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	
	@Override
	protected void configure(HttpSecurity http) throws Exception{
		http.httpBasic().and().authorizeRequests()
        .antMatchers("/login.do/method=loginForm").permitAll()
        .and().logout().permitAll()
        .and().formLogin()
        .loginPage("/login.do/method=loginForm")
        .loginProcessingUrl("/login.do?method=loginProcess")
        .defaultSuccessUrl("/main")
        .and().csrf().disable();
		
	}
}
