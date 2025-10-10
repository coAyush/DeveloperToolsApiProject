package com.DevToolBox.controller;

import com.DevToolBox.Services.AuthService;
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

        public SignupRequest() {}
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginRequest {
        public String email;
        public String password;

        public LoginRequest() {}
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
    }

    // ----- Endpoints -----

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public String signup(@RequestBody SignupRequest req) {
        return authService.signup(req.name, req.email, req.password);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_PLAIN_VALUE)
    public String login(@RequestBody LoginRequest req) {
        return authService.login(req.email, req.password);
    }
}
