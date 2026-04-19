package com.akshita.authentication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🔐 Your OTP for Login Verification");

        message.setText(
                "Hello,\n\n" +

                        "We received a request to log in to your account.\n\n" +

                        "Your One-Time Password (OTP) is:\n\n" +
                        "👉 " + otp + "\n\n" +

                        "⏳ This OTP is valid for 5 minutes.\n\n" +

                        "If you did not request this, please ignore this email or secure your account.\n\n" +

                        "For security reasons, do not share this OTP with anyone.\n\n" +

                        "Thanks & Regards,\n" +
                        "Akshita Saxena"
        );

        mailSender.send(message);
    }
}