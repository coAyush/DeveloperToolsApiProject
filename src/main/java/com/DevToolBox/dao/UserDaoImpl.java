/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.dao;

import com.DevToolBox.Model.Users;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void save(Users user) {
        em.persist(user);
    }

    @Override
    public void update(Users user) {
        em.merge(user);
    }

    @Override
    public Users findByUsername(String username) {
        try {
            return em.createQuery("FROM Users u WHERE u.username = :username", Users.class)
                     .setParameter("username", username)
                     .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public Users findByEmail(String email) {
        try {
            return em.createQuery("FROM Users u WHERE u.email = :email", Users.class)
                     .setParameter("email", email)
                     .getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }
}
