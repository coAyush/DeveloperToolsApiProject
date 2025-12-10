/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.controller;

import java.security.SecureRandom;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.DevToolBox.dao.UsagesDAO;
import com.DevToolBox.Services.UsageLogger;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author USER
 */
@RestController
@RequestMapping("/api/password")
public class PasswordGenerator {

    @Autowired
    private UsageLogger usageLogger;
    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMBERS = "0123456789";
    private static final String SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";
    private static final SecureRandom random = new SecureRandom();

    @PostMapping("/generate")
    public  Map<String, String> Password(@RequestBody Map<String, Object> payload, HttpSession session) {

        usageLogger.log(session, "Password Generator");
        int length = ((Number) payload.getOrDefault("length", 12)).intValue();
        boolean includeUpper = (Boolean) payload.getOrDefault("includeUpper", true);
        boolean includeNumbers = (Boolean) payload.getOrDefault("includeNumbers", true);
        boolean includeSymbols = (Boolean) payload.getOrDefault("includeSymbols", true);

        String chars = LOWERCASE; // lowercase always included
        if (includeUpper) {
            chars += UPPERCASE;
        }
        if (includeNumbers) {
            chars += NUMBERS;
        }
        if (includeSymbols) {
            chars += SYMBOLS;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return Map.of("password", sb.toString());
    }
}
