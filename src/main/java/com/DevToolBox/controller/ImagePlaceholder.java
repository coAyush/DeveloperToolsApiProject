/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.DevToolBox.controller;

import java.util.Base64;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;   // ✅ correct
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author USER
 */
@RestController
@RequestMapping("/api/imageplaceholder")
public class ImagePlaceholder {
    
    @Autowired
    RestTemplate template;
    private static final String OPEN_AI_API_KEY=System.getProperty("OPEN_AI_API_KEY");
    @GetMapping(value = "/placeholder/{category}", produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] placeholder(@PathVariable String category) {
        if (OPEN_AI_API_KEY == null || OPEN_AI_API_KEY.isBlank()) {
            return tinyPng();
        }

        String prompt = switch (category.toLowerCase()) 
        {
            case "avatar"    -> "Simple avatar placeholder illustration, flat style, minimal.";
            case "landscape" -> "Simple scenic landscape placeholder illustration, flat style.";
            case "food"      -> "Simple food placeholder illustration, flat style.";
            case "product"   -> "Simple product thumbnail placeholder illustration, flat style.";
            default          -> "Generic placeholder illustration, flat style.";
        };
        
        try {
            String url = "https://api.openai.com/v1/images/generations";

            Map<String, Object> body = Map.of(
                    "model", "gpt-image-1",
                    "prompt", prompt,
                    "size", "512x512",
                    "response_format", "b64_json"
            );
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(OPEN_AI_API_KEY);

            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);
            Map<?, ?> resp = template.postForObject(url, req, Map.class);

            List<?> data = (List<?>) resp.get("data");
            if (data == null || data.isEmpty()) return tinyPng();

            Map<?, ?> first = (Map<?, ?>) data.get(0);
            String b64 = (String) first.get("b64_json");
            if (b64 == null) return tinyPng();

            return Base64.getDecoder().decode(b64);

        } catch (Exception e) {
            e.printStackTrace();
            return tinyPng();
        }
    }

    private byte[] tinyPng() {
        return Base64.getDecoder().decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
        );
    }
}
    
