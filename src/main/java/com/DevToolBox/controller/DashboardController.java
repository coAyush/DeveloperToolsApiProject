package com.DevToolBox.controller;

import com.DevToolBox.dao.UsagesDAO;
import com.DevToolBox.Model.Usages;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private UsagesDAO usagesDAO;

    @GetMapping("/me")
    public ResponseEntity<?> getUserDashboard(HttpSession session) {

        String username = (String) session.getAttribute("Name");
        String email = (String) session.getAttribute("Email");

        if (username == null || email == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("authenticated", false, "message", "Not logged in"));
        }

        List<Usages> history = usagesDAO.findByUsername(username);
        List<UsagesDAO.ApiCount> apiStats = usagesDAO.getApiCountsByUser(username);

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("name", username);
        response.put("email", email);
        response.put("history", history);
        response.put("apiStats", apiStats);

        return ResponseEntity.ok(response);
    }

   @GetMapping("/usage-summary")
public ResponseEntity<?> globalUsageSummary() {

    List<Map<String, Object>> stats = usagesDAO.getGlobalUsageStats();

    Map<String, Object> result = new HashMap<>();
    result.put("authenticated", true);
    result.put("stats", stats);

    return ResponseEntity.ok(result);
}

}
