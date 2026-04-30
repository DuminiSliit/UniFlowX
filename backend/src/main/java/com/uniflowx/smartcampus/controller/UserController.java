package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.repository.UserRepository;
import com.uniflowx.smartcampus.security.services.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.uniflowx.smartcampus.model.ERole;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(user -> {
            Map<String, Object> u = new HashMap<>();
            u.put("id", user.getId());
            u.put("email", user.getEmail());
            u.put("fullName", user.getFullName() != null ? user.getFullName() : "");
            u.put("phone", user.getPhone() != null ? user.getPhone() : "");
            u.put("roles", user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList()));
            return u;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/technicians")
    public ResponseEntity<?> getTechnicians() {
        List<User> techs = userRepository.findByRolesName(ERole.ROLE_TECHNICIAN);
        List<Map<String, Object>> result = techs.stream().map(user -> {
            Map<String, Object> u = new HashMap<>();
            u.put("id", user.getId());
            u.put("email", user.getEmail());
            u.put("fullName", user.getFullName() != null ? user.getFullName() : "");
            u.put("username", user.getEmail().split("@")[0]);
            return u;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("fullName", user.getFullName());
            response.put("phone", user.getPhone());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (payload.containsKey("fullName")) user.setFullName(payload.get("fullName"));
            if (payload.containsKey("phone")) user.setPhone(payload.get("phone"));
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("fullName", user.getFullName());
            response.put("phone", user.getPhone());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOpt = userRepository.findByEmail(userDetails.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String currentPassword = payload.get("currentPassword");
            String newPassword = payload.get("newPassword");

            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error: Current password is incorrect"));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
