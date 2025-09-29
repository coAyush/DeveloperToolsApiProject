package com.DevToolBox.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@RestController
public class UrlShortenerController {

    private final Cloudinary cloudinary;

    public UrlShortenerController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * POST /api/shorten
     * Body: { "url": "https://long.url", "alias": "optional-custom" }
     */
    @PostMapping("/api/shorten")
    public Map<String, Object> shorten(@RequestBody Map<String, String> body) {
        String longUrl = body.get("url");
        String alias   = body.get("alias");

        if (!StringUtils.hasText(longUrl)) {
            return Map.of("error", "URL is required");
        }

        // Pick alias or generate random code
        String code = (StringUtils.hasText(alias) ? alias.trim() : randomCode());

        try {
            // Encode the mapping into JSON (just the long URL)
            String json = "{\"longUrl\":\"" + longUrl + "\"}";
            byte[] bytes = json.getBytes(StandardCharsets.UTF_8);

            // Upload to Cloudinary as raw (non-image) resource
            cloudinary.uploader().upload(
                    bytes,
                    ObjectUtils.asMap(
                            "public_id", "shortlinks/" + code,
                            "resource_type", "raw",
                            "overwrite", true
                    )
            );

            // Build redirect URL served by *your app*
            String shortUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/r/{code}")
                    .buildAndExpand(code)
                    .toUriString();

            return Map.of("shortUrl", shortUrl, "code", code, "longUrl", longUrl);
        } catch (Exception e) {
            return Map.of("error", "Cloudinary upload failed: " + e.getMessage());
        }
    }

    /**
     * GET /r/{code}
     * Reads mapping from Cloudinary and redirects.
     */
    @GetMapping("/r/{code}")
    public void redirect(@PathVariable String code, HttpServletResponse response) throws IOException {
        try {
            Map result = cloudinary.api().resource("shortlinks/" + code,
                    ObjectUtils.asMap("resource_type", "raw"));

            // Download content (JSON we stored earlier)
            String url = (String) result.get("secure_url");
            String json = new String(new java.net.URL(url).openStream().readAllBytes(), StandardCharsets.UTF_8);

            // Extract longUrl manually (since JSON is tiny)
            String longUrl = json.replace("{\"longUrl\":\"", "").replace("\"}", "");

            response.sendRedirect(longUrl);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Short link not found");
        }
    }

    private static String randomCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 6);
    }
}
