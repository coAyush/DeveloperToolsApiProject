package com.DevToolBox.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.docx4j.com.google.common.collect.HashBiMap;

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
        String prompt = """
                      You are DevToolBox AI Assistant.
                      Answer only about the DevToolBox project, which provides APIs like:
                      - URL Shortener
                      - UUID Generator
                      - QR Code Generator
                      - PDF Converter
                      - Image placeholder
                      - User Accounts
                      - Pdf Compressor
                      
                        Other tan these question if anything else has been asked just say its out of knowledge i can't help you with that sorry!!
                      
                      Here are examples of how you should respond:
                      
                      Q: What can DevToolBox do?
                      A: DevToolBox is a centralized platform that provides developers with APIs like URL shortener, QR code generator, PDF converter, and more.
                      
                      Q: How do I generate a QR code?
                      A: Use the QR Code Generator API. Provide text or a URL, and DevToolBox returns a PNG QR code.But remember while 
                        pasting the url separte the text part in case u give both image and text then oly the respective image be opened.
                      
                      Q: Can DevToolBox convert Word to PDF?
                      A: Yes. Upload your Word or Image file, and the API returns a PDF.
                        
                      Q: Can DevToolBox compress  PDF?
                        A: Yes just upload your pdf and select the compression level amongst low medium high and u will get your desired pdf.
                
                      Q : Can we contact the developer in case of feedback or issues needed to be reported to the developer?
                      A ; Yes head to the contact us section and ther type your complaint or feedback. In case if you want i can help to write our complaint or feedack.
                        
                
                      """;
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
        
        //Model Training
        Map<String,Object>systempart=new HashMap<>();
        systempart.put("text", prompt);
        
        parts.add(systempart);
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
