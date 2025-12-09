package com.DevToolBox.controller;

import com.DevToolBox.Model.Users;
import com.DevToolBox.Services.AuthService;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

// Matches your axios base: http://localhost:8080/api/auth
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ----- DTOs for clean JSON binding -----
    public static class SignupRequest {

        public String name;
        public String email;
        public String password;

        public SignupRequest() {
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginRequest {

        public String email;
        public String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // ----- Endpoints -----
    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public String signup(@RequestBody SignupRequest req) {
        return authService.signup(req.name, req.email, req.password);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> login(@RequestBody LoginRequest req, HttpSession session) {

        Map<String, Object> m = authService.login(req.email, req.password);
        Map<String, Object> response = new HashMap<>();

        if (m.containsKey("User")) {
            Users u = (Users) m.get("User");
            session.setAttribute("Name", u.getName());
            session.setAttribute("Email", u.getEmail());
            System.out.println((String) session.getAttribute("Name"));

            response.put("message", "Login successful!");
            response.put("name", u.getName());
            response.put("email", u.getEmail());
            return response;

        } else {
            response.put("message", "Login not successful!");
        }
        return response;
    }

    @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getUser(HttpSession session) {
        String name = (String) session.getAttribute("Name");
        String email = (String) session.getAttribute("Email");

        if (name == null || email == null) {
            return Map.of("authenticated", false);
        }

        return Map.of(
                "authenticated", true,
                "name", name,
                "email", email
        );
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        return Map.of("message", "Logged out successfully!");
    }
}
