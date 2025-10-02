package com.DevToolBox.Services;

import com.DevToolBox.dao.UserDao;
import com.DevToolBox.Model.Users;
import com.DevToolBox.util.PasswordUtil;
import com.DevToolBox.util.OtpUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private MailService mailService;

    private Map<String, String> otpStore = new HashMap<>();

    @Override
    public String registerUser(Users user) {
        if (userDao.findByUsername(user.getUsername()) != null) {
            return "Username already exists!";
        }
        userDao.save(user);
        return "User registered successfully!";
    }

    @Override
    public String validateUser(String username, String password) {
        Users user = userDao.findByUsername(username);
        if (user != null && PasswordUtil.verifyPassword(password, user.getPassword())) {
            return "Login successful!";
        }
        return "Invalid credentials!";
    }

    @Override
    public String initiatePasswordReset(String email) {
        Users user = userDao.findByEmail(email);
        if (user == null) return "Email not found!";

        String otp = OtpUtil.generateOtp();
        otpStore.put(email, otp);
        mailService.sendMail(email, "Password Reset OTP", "Your OTP is: " + otp);
        return "OTP sent to email!";
    }

    @Override
    public String resetPassword(String email, String otp, String newPassword) {
        if (otpStore.containsKey(email) && otpStore.get(email).equals(otp)) {
            Users user = userDao.findByEmail(email);
            user.setPassword(PasswordUtil.hashPassword(newPassword));
            userDao.update(user);
            otpStore.remove(email);
            return "Password updated successfully!";
        }
        return "Invalid OTP!";
    }
}
