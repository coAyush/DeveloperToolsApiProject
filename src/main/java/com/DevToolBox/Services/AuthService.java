package com.DevToolBox.Services;

import com.DevToolBox.dao.UserDao;
import com.DevToolBox.Model.Users;
import com.DevToolBox.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private  UserDao userDao;
    @Autowired
    private  PasswordUtil passwordUtil;

    public String signup(String name, String email, String password) {
        if (name == null || name.isBlank() ||
            email == null || email.isBlank() ||
            password == null || password.isBlank()) {
            return "Signup failed: name, email and password are required";
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (userDao.existsByEmail(normalizedEmail)) {
            return "Signup failed: user already exists";
        }

        Users u = new Users();
        u.setName(name.trim());
        u.setEmail(normalizedEmail);
        u.setPassword(passwordUtil.hashPassword(password));
        userDao.save(u);

        return "Signup successful";
    }

    public String login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return "Login failed: email and password required";
        }

        String normalizedEmail = email.trim().toLowerCase();
        Users u = userDao.findByEmail(normalizedEmail);
        if (u == null) {
            return "Login failed: invalid credentials";
        }

        boolean ok = passwordUtil.verifyPassword(password, u.getPassword());
        if (!ok) {
            return "Login failed: invalid credentials";
        }

        return "Login successful";
    }
}
