package com.DevToolBox.controller;

import com.DevToolBox.Services.UrlService; // <-- ensure lowercase 'service'
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/url")
@CrossOrigin(origins = "*") // for local dev; lock this down in production
public class UrlController {

    private final UrlService urlService;

    @Autowired
    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    /**
     * Example calls:
     *  - POST /api/url/shorten?originalUrl=https://example.com
     *  - POST /api/url/shorten?originalUrl=https://example.com&alias=myAlias
     * @param body
     * @return 
     */
    @PostMapping("/shorten")
    public String shorten(@RequestBody Map<String,String> body) {
        // urlService.shortenUrl should accept (originalUrl, alias) where alias may be null/blank
        System.out.println("controller working");
        return urlService.shortenUrl(body.get("url"),body.get("alias"));
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
}
