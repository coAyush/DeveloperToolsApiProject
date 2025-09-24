/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.Config;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/**
 *
 * @author USER
 */
@Configuration
class AppConfig {
    @Bean(name = {"data"})
    public DriverManagerDataSource getSource(){
        DriverManagerDataSource source=new DriverManagerDataSource();
        source.setUrl("jdbc:mysql://localhost:3306/DevTools");
        source.setDriverClassName("com.mysql.cj.jdbc.Driver");
        source.setUsername("root");
        source.setPassword("ayush52141");
        return source;
    }
    @Bean(name={"tem"})
    public JdbcTemplate getTemplate(DriverManagerDataSource dataSource){
       return new JdbcTemplate(dataSource);
    }
}
