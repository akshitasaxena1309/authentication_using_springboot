package com.akshita.authentication.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/login-page")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/signup-page")
    public String signupPage() {
        return "signup";
    }

    @GetMapping("/otp-login-page")
    public String otpLoginPage() {
        return "otp-login";
    }

    @GetMapping("/verify-otp-page")
    public String verifyOtpPage() {
        return "verify-otp";
    }

    @GetMapping("/home")
    public String homePage() {
        return "home";
    }
}