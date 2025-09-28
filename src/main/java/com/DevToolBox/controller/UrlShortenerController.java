package com.DevToolBox.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.filter.ForwardedHeaderFilter;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
public class UrlShortenerController {

    // In-memory store (replace with DB for production)
    private final Map<String, String> urlStore = new ConcurrentHashMap<>();

    /**
     * Create a short link
     * POST /api/shorten
     * JSON: { "url": "https://long.url", "alias": "optional-custom-code" }
     * Returns: { "shortUrl": ".../r/{code}", "code": "{code}" }
     */
    @PostMapping("/api/shorten")
    public Map<String, Object> shorten(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String longUrl = body.get("url");
        String alias = body.get("alias");

        if (longUrl == null || longUrl.isBlank()) {
            return Map.of("message", "URL is required");
        }

        // pick alias or generate 6-char code
        String code;
        if (alias != null && !alias.isBlank()) {
            if (urlStore.containsKey(alias)) {
                return Map.of("message", "Alias already in use");
            }
            code = alias.trim();
        } else {
            code = UUID.randomUUID().toString().replace("-", "").substring(0, 6);
            // avoid rare collision
            while (urlStore.containsKey(code)) {
                code = UUID.randomUUID().toString().replace("-", "").substring(0, 6);
            }
        }

        urlStore.put(code, longUrl);

        // Build absolute URL from the current context (scheme/host/port/contextPath)
        // Works locally, on LAN, and behind reverse proxies when ForwardedHeaderFilter is active
        String shortUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()  // e.g. http(s)://host[:port]/<context>
                .path("/r/{code}")
                .buildAndExpand(code)
                .toUriString();

        return Map.of("shortUrl", shortUrl, "code", code);
    }

    /**
     * Resolve the short link
     * GET /r/{code}
     * Redirects to the original long URL
     */
    @GetMapping("/r/{code}")
    public void redirect(@PathVariable String code, HttpServletResponse response) throws IOException {
        String longUrl = urlStore.get(code);
        if (longUrl != null) {
            response.sendRedirect(longUrl);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "URL not found");
        }
    }

    // --- Optional utility endpoints for testing ---

    @GetMapping("/api/_debug/{code}")
    public Map<String, String> debug(@PathVariable String code) {
        return Map.of("code", code, "longUrl", urlStore.getOrDefault(code, "<missing>"));
    }
}

/**
 * Ensures Spring respects X-Forwarded-Proto/Host/etc. when behind a reverse proxy
 * so generated URLs have the correct public scheme/host/port.
 */
@Configuration
class ForwardedHeadersConfig {
    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }
}
