package com.DevToolBox.dao;

import com.DevToolBox.Model.Usages;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class UsagesDAO {

    public final JdbcTemplate jdbc;

    public UsagesDAO(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Insert usage log
    public int saveUsage(String username, String api) {
        String sql = "INSERT INTO usages (username, api) VALUES (?, ?)";
        return jdbc.update(sql, username, api);
    }

    // History only for a specific user
    public List<Usages> findByUsername(String username) {
        String sql = "SELECT id, username, api FROM usages WHERE username = ? ORDER BY id DESC";
        return jdbc.query(sql, new UsageRowMapper(), username);
    }

    // Count stats for one user (pie chart)
    public List<ApiCount> getApiCountsByUser(String username) {
        String sql = "SELECT api, COUNT(*) AS cnt FROM usages WHERE username = ? GROUP BY api ORDER BY cnt DESC";
        return jdbc.query(sql, new Object[]{username}, (rs, rowNum) ->
                new ApiCount(rs.getString("api"), rs.getInt("cnt"))
        );
    }

    // Global stats for bar chart
    public List<Map<String, Object>> getGlobalUsageStats() {
        String sql = "SELECT api, COUNT(*) AS cnt FROM usages GROUP BY api ORDER BY cnt DESC";
        return jdbc.queryForList(sql);
    }

    // --- Mappers ---
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
