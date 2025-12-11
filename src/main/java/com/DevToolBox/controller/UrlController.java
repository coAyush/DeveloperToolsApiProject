package com.DevToolBox.controller;

import com.DevToolBox.Services.UrlService; // <-- ensure lowercase 'service'
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.DevToolBox.Services.UsageLogger;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/url")
public class UrlController {

    @Autowired
    UsageLogger usageLogger;
    HttpServletRequest request;
    private final UrlService urlService;

    @Autowired
    public UrlController(UrlService urlService, HttpServletRequest request) {
        this.urlService = urlService;
        this.request = request;
    }

    /**
     * Example calls: - POST /api/url/shorten?originalUrl=https://example.com -
     * POST /api/url/shorten?originalUrl=https://example.com&alias=myAlias
     *
     * @param body
     * @return
     */
    public static record ShortenResponse(String shortUrl, String code) {

    }

    @PostMapping("/shorten")
    public ResponseEntity shorten(@RequestBody Map<String, String> body,HttpSession session) {
        // urlService.shortenUrl should accept (originalUrl, alias) where alias may be null/blank
        usageLogger.log(session,"Url api");
        System.out.println("controller working");
        String originalUrl = body.get("url");
        String alias = body.get("alias");
        try {
           
            String code = urlService.shortenUrl(originalUrl, alias);
            String host = getHost(); // e.g., http://localhost:8080 or https://yourdomain
            String shortUrl = host + "/api/url/" + code;

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ShortenResponse(shortUrl, code));

        } catch (IllegalArgumentException ex) {
            // e.g., alias already in use
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/{code}")
    public void redirect(@PathVariable String code, HttpServletResponse response) throws IOException {
        String originalUrl = urlService.getOriginalUrl(code);
        if (originalUrl != null && !originalUrl.isBlank()) {
            response.sendRedirect(originalUrl);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "URL not found");
        }
    }

    private String getHost() {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .build()
                .toUriString();
    }
}
