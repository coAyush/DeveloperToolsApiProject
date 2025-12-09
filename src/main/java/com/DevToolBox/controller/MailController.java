package com.DevToolBox.controller;

import com.DevToolBox.Services.MailServiceImpl;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;

@RestController
@RequestMapping("/api")
public class MailController {

    private static final String USER = System.getenv("MAIL_USER");  // your Gmail
    private static final String PASS = System.getenv("MAIL_PASS");            // app password
    @Autowired
    JavaMailSender sender;
    @Autowired
    MailServiceImpl mail;

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> sendMail(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");
        String to="librarysystemxyz@gmail.com";
        if (isBlank(name) || isBlank(email) || isBlank(message)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "name, email and message are required"));
        }

        String subject = "New Contact Form Message from " + name;
        String body = "From: " + name + " <" + email + ">\n\n" + message;
       try{
           mail.sendMail(to, subject, body);
           return ResponseEntity.ok(Map.of("status", "sent"));
       }catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("status", "error", "message", e.getMessage()));
        }
    }

    private boolean isBlank(String name) {
        return name == null || name.isBlank(); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }
}
