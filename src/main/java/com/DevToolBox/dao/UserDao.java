package com.DevToolBox.dao;

import com.DevToolBox.Model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao {

    // you created a bean named "tem" in AppConfig
    @Autowired
    @Qualifier("tem")
    private JdbcTemplate jdbcTemplate;

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public void save(Users u) {
        String sql = "INSERT INTO users(name, email, password) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, u.getName(), u.getEmail(), u.getPassword());
    }

    public Users findByEmail(String email) {
        try {
            String sql = "SELECT id, name, email, password FROM users WHERE email = ?";
            return jdbcTemplate.queryForObject(sql,
                    new BeanPropertyRowMapper<>(Users.class),
                    email);
        } catch (Exception e) {
            return null;
        }
    }
}
