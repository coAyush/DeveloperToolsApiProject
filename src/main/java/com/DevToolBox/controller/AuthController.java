package com.DevToolBox.controller;

import com.DevToolBox.Model.Users;
import com.DevToolBox.Services.AuthService;
import com.DevToolBox.dao.UserDao;
import com.DevToolBox.Services.MailServiceImpl;
import com.DevToolBox.util.PasswordUtil;
import com.DevToolBox.util.OtpUtil;
import jakarta.servlet.http.HttpSession;

import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private MailServiceImpl mailService;

    @Autowired
    private PasswordUtil passwordUtil;

    // Store OTP temporarily in memory
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    // ================= SIGNUP =====================
    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> signup(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(authService.signup(req.get("name"), req.get("email"), req.get("password")));
    }

    // ================= LOGIN ======================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req, HttpSession session) {

        Map<String, Object> m = authService.login(req.get("email"), req.get("password"));
        if (m.containsKey("User")) {
            Users u = (Users) m.get("User");
            session.setAttribute("Name", u.getName());
            session.setAttribute("Email", u.getEmail());

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful!",
                    "name", u.getName(),
                    "email", u.getEmail()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid Credentials!"));
    }

    // ================= SESSION CHECK ======================
    @GetMapping("/me")
    public ResponseEntity<?> getUser(HttpSession session) {
        String name = (String) session.getAttribute("Name");
        String email = (String) session.getAttribute("Email");

        if (name == null || email == null)
            return ResponseEntity.ok(Map.of("authenticated", false));

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "name", name,
                "email", email
        ));
    }

    // ================= OTP - REQUEST ======================
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> req) {

        String email = req.get("email");

        Users user = userDao.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Email not registered"));
        }

        String otp = OtpUtil.generateOtp();
        otpStore.put(email, otp);

        mailService.sendMail(email, "Password Reset OTP", "Your OTP is: " + otp);

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
    }

    // ================= OTP - VERIFY ======================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String otp = req.get("otp");

        String correctOtp = otpStore.get(email);

        return correctOtp != null && correctOtp.equals(otp)
                ? ResponseEntity.ok(Map.of("valid", true))
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("valid", false, "message", "Invalid OTP"));
    }

    // ================= PASSWORD RESET ======================
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> req) {

        String email = req.get("email");
        String newPassword = req.get("newPassword");

        String hashed = passwordUtil.hashPassword(newPassword);
        int updated = userDao.updatePassword(email, hashed);

        if (updated > 0) {
            otpStore.remove(email);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Update failed"));
    }

    // ================= LOGOUT ======================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully!"));
    }
}
