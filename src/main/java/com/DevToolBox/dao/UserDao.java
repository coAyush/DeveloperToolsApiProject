/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.DevToolBox.dao;

import com.DevToolBox.Model.Users;

/**
 *
 * @author USER
 */
public interface UserDao {
     void save(Users user);
    void update(Users user);
    Users findByUsername(String username);
    Users findByEmail(String email);
}
