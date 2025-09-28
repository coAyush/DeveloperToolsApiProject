package com.DevToolBox.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class MailController {

    private static final String USER = "librarysystemxyz@gmail.com";  // your Gmail
    private static final String PASS = "vprtzczxtnuoazdb";            // app password

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> sendMail(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String message = payload.get("message");

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");

        try {
            Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(USER, PASS);
                }
            });

            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(USER));
            msg.addRecipient(Message.RecipientType.TO, new InternetAddress(USER)); // send to yourself
            msg.setSubject("New Contact Form Message from " + name);
            msg.setText("From: " + name + " <" + email + ">\n\n" + message);

            Transport.send(msg);

            return ResponseEntity.ok(Map.of("status", "sent"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
        }
    }
}
