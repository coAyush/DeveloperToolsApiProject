package com.DevToolBox.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/chat")
public class ChatBotController {

    @Autowired
    private RestTemplate rest;

    private final String API_KEY = System.getenv("GEMINI_API_KEY");

    @PostMapping
    public Map<String, Object> chat(@RequestBody Map<String, String> body) {
        // 0) Safety: ensure API key exists
        if (API_KEY == null || API_KEY.isBlank()) {
            return Map.of("error", "Server is missing GEMINI_API_KEY");
        }

        // 1) Read user message
        String usermsg = body.get("message");
        if (usermsg == null || usermsg.isBlank()) {
            return Map.of("reply", "Hello 👋 I am your assistant. How can I help you today?");
        }

        // 2) Gemini endpoint
String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY;
        // 3) Build request body
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", usermsg);

        List<Map<String, Object>> parts = new ArrayList<>();
        parts.add(textPart);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", parts);

        List<Map<String, Object>> contents = new ArrayList<>();
        contents.add(content);

        Map<String, Object> request = new HashMap<>();
        request.put("contents", contents);

        // 4) Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 5) Call Gemini
        Map<?, ?> response = rest.postForObject(url, new HttpEntity<>(request, headers), Map.class);

        // 6) Extract reply text
        String reply = extractReply(response);

        // 7) Return clean JSON
        return Map.of("reply", reply == null ? "(no reply)" : reply);
    }

    @SuppressWarnings("unchecked")
    private String extractReply(Map<?, ?> response) {
        try {
            // Expected shape:
            // { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
            var candidates = (List<?>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                var first = (Map<?, ?>) candidates.get(0);
                var content = (Map<?, ?>) first.get("content");
                var parts = (List<?>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) ((Map<?, ?>) parts.get(0)).get("text");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null; // fallback
    }
}
