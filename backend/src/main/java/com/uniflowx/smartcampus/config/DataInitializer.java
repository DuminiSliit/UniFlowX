package com.uniflowx.smartcampus.config;

import com.uniflowx.smartcampus.model.ERole;
import com.uniflowx.smartcampus.model.Role;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.repository.RoleRepository;
import com.uniflowx.smartcampus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT).orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_STUDENT)));
        Role staffRole = roleRepository.findByName(ERole.ROLE_STAFF).orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_STAFF)));
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));

        // Create Default Admin if doesn't exist
        if (!userRepository.existsByEmail("admin@uniflowx.com")) {
            User admin = new User("admin@uniflowx.com", passwordEncoder.encode("admin123"));
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);
            userRepository.save(admin);
        }
// Reset password for admin1@uniflowx.com as requested
        userRepository.findByEmail("admin1@uniflowx.com").ifPresent(user -> {
            user.setPassword(passwordEncoder.encode("admin@123"));
            userRepository.save(user);
        });
    }
}
