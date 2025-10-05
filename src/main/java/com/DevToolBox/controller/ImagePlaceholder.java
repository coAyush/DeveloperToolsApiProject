package com.DevToolBox.controller;

import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/imageplaceholder")
public class ImagePlaceholder {

    @Autowired
    private RestTemplate template;

    // Read from OS/Tomcat environment variables
    private static final String OPENAI_KEY = System.getenv("OPEN_AI_API_KEY");

    @GetMapping("/_debug")
    public ResponseEntity<String> debug() {
        int len = OPENAI_KEY == null ? 0 : OPENAI_KEY.length();
        return ResponseEntity.ok("OPEN_AI_API_KEY length=" + len + " @ " + Instant.now());
    }

    @GetMapping("/_health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK " + Instant.now());
    }

    @GetMapping(value = "/placeholder/{category}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> placeholder(@PathVariable String category) {
        if (OPENAI_KEY == null || OPENAI_KEY.isBlank()) {
            return png(tinyPng(), "fallback-no-key");
        }

        String prompt = switch (category.toLowerCase()) {
            case "avatar" ->
                "Simple avatar placeholder illustration, flat style, minimal.";
            case "landscape" ->
                "Simple scenic landscape placeholder illustration, flat style.";
            case "food" ->
                "Simple food placeholder illustration, flat style.";
            case "product" ->
                "Simple product thumbnail placeholder illustration, flat style.";
            default ->
                "Generic placeholder illustration, flat style.";
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
            headers.setBearerAuth(OPENAI_KEY);

            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> resp = template.postForObject(url, req, Map.class);
            if (resp == null) {
                return png(tinyPng(), "fallback-null-response");
            }

            Object dataObj = resp.get("data");
            if (!(dataObj instanceof List<?> data) || data.isEmpty()) {
                return png(tinyPng(), "fallback-empty-data");
            }

            Object firstObj = data.get(0);
            if (!(firstObj instanceof Map<?, ?> first)) {
                return png(tinyPng(), "fallback-bad-first");
            }

            Object b64Obj = first.get("b64_json");
            if (!(b64Obj instanceof String b64) || b64.isBlank()) {
                return png(tinyPng(), "fallback-no-b64");
            }

            byte[] pngBytes = Base64.getDecoder().decode(b64);
            return png(pngBytes, "openai");

        } catch (HttpClientErrorException e) {
            System.out.println("OpenAI HTTP " + e.getStatusCode());
            System.out.println("OpenAI error body: " + e.getResponseBodyAsString()); // <-- the reason
            return png(tinyPng(), "fallback-openai-error");
        } catch (Exception e) {
            e.printStackTrace();
            return png(tinyPng(), "fallback-exception");
        }

    }

    // ---------- helpers ----------
    private ResponseEntity<byte[]> png(byte[] bytes, String sourceTag) {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.IMAGE_PNG);
        h.setCacheControl(CacheControl.noCache().getHeaderValue());
        h.add("X-Source", sourceTag); // openai or fallback-*
        return new ResponseEntity<>(bytes, h, HttpStatus.OK);
        // Content-Disposition not set: this is intended for inline display; add if you want downloads.
    }

    private byte[] tinyPng() {
        // 1x1 transparent PNG
        return Base64.getDecoder().decode(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
        );
    }
}
