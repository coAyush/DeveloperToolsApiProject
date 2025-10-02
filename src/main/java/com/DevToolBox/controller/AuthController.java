package com.DevToolBox.controller;

import com.DevToolBox.Model.Users;
import com.DevToolBox.Services.UserService;
import com.DevToolBox.util.OtpUtil;
import com.DevToolBox.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String signup(@RequestBody Users user) {
        user.setPassword(PasswordUtil.hashPassword(user.getPassword()));
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        return userService.validateUser(username, password);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return userService.initiatePasswordReset(email);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String email,
                                @RequestParam String otp,
                                @RequestParam String newPassword) {
        return userService.resetPassword(email, otp, newPassword);
    }
}