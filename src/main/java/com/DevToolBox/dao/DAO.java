/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.dao;

import com.DevToolBox.Model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 *
 * @author USER
 */
@Repository
public class DAO {
    @Autowired
    @Qualifier("tem")
    JdbcTemplate template;
    
    public int saveUser(Users user){
        String query="INSERT INTO users(Name,Email,password) VALUES(?,?,?)";
        return template.update(query,user.getUsername(),user.getEmail(),user.getPassword());
    }
    
    public Users selectUser(int id){
        String q="SELECT * FROM users WHERE ID = ?";
        return template.queryForObject(q,
                (rs,rowNum)->{
                 Users u = new Users();
   
            u.setUsername(rs.getString("name"));
            u.setEmail(rs.getString("email"));
            return u;},
                id);
    }
}
