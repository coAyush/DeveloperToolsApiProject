package com.DevToolBox.Services;

import com.DevToolBox.dao.UsagesDAO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class UsageLogger {

    @Autowired
    private UsagesDAO usageDao;

    public void log(HttpSession session, String toolName) {
        try {
            String user = (String) session.getAttribute("Name");
            if (user != null) {
                usageDao.saveUsage(user, toolName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
