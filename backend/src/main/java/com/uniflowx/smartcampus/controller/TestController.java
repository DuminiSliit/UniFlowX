package com.uniflowx.smartcampus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

<<<<<<< HEAD
@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Smart Campus API is working! 🚀\n\nAvailable endpoints:\n- GET /\n- Test successful!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test endpoint is working!";
    }
=======
// @RestController
public class TestController {

    // @GetMapping("/")
    // public String home() {
    //     return "Smart Campus API is working! 🚀\n\nAvailable endpoints:\n- GET /\n- Test successful!";
    // }

    // @GetMapping("/test")
    // public String test() {
    //     return "Test endpoint is working!";
    // }
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f
}
