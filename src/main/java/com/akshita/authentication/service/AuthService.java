package com.akshita.authentication.service;

import com.akshita.authentication.dto.LoginRequest;
import com.akshita.authentication.dto.RegisterRequest;
import com.akshita.authentication.model.User;
import com.akshita.authentication.repository.UserRepository;
import com.akshita.authentication.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) throws Exception {
        Optional<User> existingUser = userRepo.findFirstByUsernameOrderByIdAsc(request.getUsername());

        if (existingUser.isPresent()) {
            throw new Exception("Username already exists!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepo.save(user);
        return savedUser;
    }

    public String login(LoginRequest request) throws Exception {
        Optional<User> dbUser = userRepo.findFirstByUsernameOrderByIdAsc(request.getUsername());

        if (dbUser.isPresent()) {
            User user = dbUser.get();

            if (passwordEncoder.matches(request.getPassword(), user.getPassword())){
                String token = jwtUtil.generateToken(user.getUsername());
                return token;
            }
        }

        throw new Exception("Invalid Credentials");
    }

    public void sendOtp(String email) {
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        otpService.storeOtp(email, otp);

        emailService.sendOtpEmail(email, otp);
        System.out.println("OTP for " + email + ": " + otp);
    }

    public String verifyOtp(String email, String otp) throws Exception {
        if (otpService.validateOtp(email, otp)) {
            return jwtUtil.generateToken(email);
        } else {
            throw new Exception("Invalid or Expired OTP");
        }
    }

}
