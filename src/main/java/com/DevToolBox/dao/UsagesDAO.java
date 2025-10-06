package com.DevToolBox.dao;

import com.DevToolBox.Model.Usages;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UsagesDAO {

    private final JdbcTemplate jdbc;
    // Constructor injection — preferred and testable
    public UsagesDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Save a usage record; returns rows affected (1 on success)
    public int saveUsage(String username, String api) {
        String sql = "INSERT INTO usages (username, api) VALUES (?, ?)";
        return jdbc.update(sql, username, api);
    }

    // Return all usage rows (optional)
    public List<Usages> findAll() {
        String sql = "SELECT id, username, api FROM usages ORDER BY id DESC";
        return jdbc.query(sql, new UsageRowMapper());
    }

    // Aggregated counts per API for a user (for pie chart)
    public List<ApiCount> getApiCountsByUser(String username) {
        String sql = "SELECT api, COUNT(*) AS cnt FROM usages WHERE username = ? GROUP BY api";
        return jdbc.query(sql, new Object[]{username}, (rs, rowNum) ->
            new ApiCount(rs.getString("api"), rs.getInt("cnt"))
        );
    }

    // RowMapper for Usages POJO
    private static class UsageRowMapper implements RowMapper<Usages> {
        @Override
        public Usages mapRow(ResultSet rs, int rowNum) throws SQLException {
            Usages u = new Usages();
            u.setId(rs.getInt("id"));
            u.setUsername(rs.getString("username"));
            u.setApi(rs.getString("api"));
            return u;
        }
    }

    // DTO for aggregated counts
    public static class ApiCount {
        private final String api;
        private final int count;

        public ApiCount(String api, int count) {
            this.api = api;
            this.count = count;
        }

        public String getApi() { return api; }
        public int getCount() { return count; }
    }
}
