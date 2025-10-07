package com.DevToolBox.dao;

import com.DevToolBox.Model.Url;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UrlDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void saveUrl(Url url) {
        String sql = "INSERT INTO urls (original_url, short_code, created_at) VALUES (?, ?, NOW())";
        jdbcTemplate.update(sql, url.getOriginalUrl(), url.getShortCode());
    }

    public Url findByCode(String code) {
        try {
            String sql = "SELECT * FROM urls WHERE short_code = ?";
            return jdbcTemplate.queryForObject(sql, new Object[]{code}, new BeanPropertyRowMapper<>(Url.class));
        } catch (Exception e) {
            return null;
        }
    }
}