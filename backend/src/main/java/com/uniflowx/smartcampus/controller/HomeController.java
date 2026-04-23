package com.uniflowx.smartcampus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Smart Campus API is running! 🚀\n\nAvailable endpoints:\n- POST /api/auth/signin\n- POST /api/auth/signup\n- GET /oauth2/authorization/google (OAuth login)";
    }
}
