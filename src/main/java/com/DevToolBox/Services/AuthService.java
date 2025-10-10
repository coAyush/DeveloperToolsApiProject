package com.DevToolBox.Services;

import com.DevToolBox.dao.UserDao;
import com.DevToolBox.Model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserDao userDao;

    // returns plain strings that contain "successful" to match your frontend check
    public String signup(String name, String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank() || name == null || name.isBlank()) {
            return "Signup failed: name, email and password are required";
        }
        if (userDao.existsByEmail(email)) {
            return "Signup failed: user already exists";
        }
        Users u = new Users();
        u.setName(name.trim());
        u.setEmail(email.trim().toLowerCase());
        u.setPassword(password); // for quick start; replace with hashed later
        userDao.save(u);
        return "Signup successful";
    }

    public String login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return "Login failed: email and password required";
        }
        Users u = userDao.findByEmail(email.trim().toLowerCase());
        if (u == null) return "Login failed: user not found";

        // plain-text compare for immediate functionality
        if (!password.equals(u.getPassword())) {
            return "Login failed: invalid credentials";
        }
        return "Login successful";
    }
}
