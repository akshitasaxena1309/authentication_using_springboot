package com.akshita.authentication.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    public void storeOtp(String email, String otp) {
        otpStore.put(email, new OtpData(otp, System.currentTimeMillis() + 5 * 60 * 1000));
    }

    public boolean validateOtp(String email, String otp) {
        OtpData data = otpStore.get(email);

        if (data == null) return false;

        if (System.currentTimeMillis() > data.expiryTime) {
            otpStore.remove(email);
            return false;
        }

        // remove after success
        if (data.otp.equals(otp)) {
            otpStore.remove(email);
            return true;
        }

        return false;
    }

    static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}