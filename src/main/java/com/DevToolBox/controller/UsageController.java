package com.DevToolBox.controller;

import com.DevToolBox.Services.UsageLogger;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usage")
public class UsageController {

    @Autowired
    private UsageLogger usageLogger;

    @PostMapping("/track")
    public void trackUsage(@RequestParam("tool") String tool, HttpSession session) {
        usageLogger.log(session, tool);
    }
}
