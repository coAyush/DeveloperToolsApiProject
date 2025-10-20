package com.DevToolBox.Services;

import com.DevToolBox.dao.UserDao;
import com.DevToolBox.Model.Users;
import com.DevToolBox.util.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class AuthService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private PasswordUtil passwordUtil;

    public String signup(String name, String email, String password) {
        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || password == null || password.isBlank()) {
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

    public Map<String, Object> login(String email, String password) {
        Map<String, Object> map = new HashMap<>();
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            map.put("result", "Login failed: email and password required");
            return map;
        }

        String normalizedEmail = email.trim().toLowerCase();
        Users u = userDao.findByEmail(normalizedEmail);
        if (u == null) {
            map.put("result", "Login failed: invalid credentials");
            return map;
        }

        boolean ok = passwordUtil.verifyPassword(password, u.getPassword());
        if (!ok) {
            map.put("result", "Login failed: invalid credentials");
            return map;
        }
        map.put("User",u);
        return map;

    }

}
