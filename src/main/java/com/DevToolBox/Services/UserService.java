package com.DevToolBox.Services;

import com.DevToolBox.Model.Users;

public interface UserService {
    String registerUser(Users user);
    String validateUser(String username, String password);
    String initiatePasswordReset(String email);
    String resetPassword(String email, String otp, String newPassword);
}
