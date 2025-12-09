package com.DevToolBox.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.internet.MimeMessage;

@Service
public class MailServiceImpl implements MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendMail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            // Always send from your mediator Gmail
            String from = System.getenv("MAIL_FROM");
            if (from == null || from.isBlank()) {
                from = "librarysystemxyz@gmail.com";
            }

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, false); // plain text

            mailSender.send(message);
            logger.info("Mail sent successfully to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send mail to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send mail", e);
        }
    }
}
