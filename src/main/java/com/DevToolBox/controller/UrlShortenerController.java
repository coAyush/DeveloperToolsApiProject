/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.controller;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author USER
 */
@RestController
@RequestMapping("/api")
public class UrlShortenerController {

    private final Map<String, String> urlStore = new HashMap<>();

    @PostMapping("/shorten")
    public Map<String, Object> shorten(@RequestBody Map<String, String> body) {
        String longUrl = body.get("url");
        String alias = body.get("alias");

        if (longUrl == null || longUrl.isBlank()) {
            return Map.of("message", "URL is required");
        }

        // If alias provided, check for conflicts
        String code;
        if (alias != null && !alias.isBlank()) {
            if (urlStore.containsKey(alias)) {
                return Map.of("message", "Alias already in use");
            }
            code = alias;
        } else {
            // Generate random short code
            code = UUID.randomUUID().toString().substring(0, 6);
        }

        urlStore.put(code, longUrl);

        String shortUrl = "http://localhost:8080/DeveloperToolsApiProject/r/" + code;

        return Map.of(
                "shortUrl", shortUrl,
                "code", code
        );
    }

    // Redirect endpoint: GET /r/{code}
    @GetMapping("/r/{code}")
    public void redirect(@PathVariable String code, HttpServletResponse response) throws IOException {
        String longUrl = urlStore.get(code);
        if (longUrl != null) {
            response.sendRedirect(longUrl);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "URL not found");
        }
    }
}
