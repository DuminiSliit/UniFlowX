package com.uniflowx.smartcampus.config;

import com.uniflowx.smartcampus.model.ERole;
import com.uniflowx.smartcampus.model.Role;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.model.Resource;
import com.uniflowx.smartcampus.repository.RoleRepository;
import com.uniflowx.smartcampus.repository.UserRepository;
import com.uniflowx.smartcampus.repository.ResourceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, ResourceRepository resourceRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Starting Data Initialization...");
        
        try {
            System.out.println("Dropping outdated roles_name_check constraint if exists...");
            jdbcTemplate.execute("ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_name_check");
        } catch (Exception e) {
            System.err.println("Could not drop constraint: " + e.getMessage());
        }

        // Initialize Roles
        ensureRole(ERole.ROLE_STUDENT);
        ensureRole(ERole.ROLE_STAFF);
        ensureRole(ERole.ROLE_ADMIN);
        ensureRole(ERole.ROLE_TECHNICIAN);

        System.out.println("Roles Initialized.");

        // Create Default Admin if doesn't exist
        if (!userRepository.existsByEmail("admin@uniflowx.com")) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).get();
            User admin = new User("admin@uniflowx.com", passwordEncoder.encode("admin123"));
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);
            userRepository.save(admin);
            System.out.println("Admin User Created.");
        }

        // Auto-promote kamal.p@sliit.lk to Technician for testing
        userRepository.findByEmail("kamal.p@sliit.lk").ifPresent(user -> {
            Role techRole = roleRepository.findByName(ERole.ROLE_TECHNICIAN).get();
            Set<Role> roles = user.getRoles();
            if (roles.stream().noneMatch(r -> r.getName() == ERole.ROLE_TECHNICIAN)) {
                roles.add(techRole);
                user.setRoles(roles);
                userRepository.save(user);
                System.out.println("User kamal.p@sliit.lk promoted to Technician.");
            }
        });

        long techCount = userRepository.findByRolesName(ERole.ROLE_TECHNICIAN).size();
        System.out.println("Current Technician Count in DB: " + techCount);

        userRepository.findByEmail("d.nihara15@gmail.com").ifPresent(user -> {
            System.out.println("User d.nihara15@gmail.com found. Roles: " + 
                user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.joining(", ")));
        });

        // Initialize Sample Resources
        if (resourceRepository.count() == 0) {
            System.out.println("No resources found. Initializing sample resources...");
            resourceRepository.save(new Resource(null, "Computing Lab 01", "Laboratory", "Main Building 3rd Floor", 40, "ACTIVE", null));
            resourceRepository.save(new Resource(null, "Main Auditorium", "Lecture Hall", "Block A", 300, "ACTIVE", null));
            resourceRepository.save(new Resource(null, "Discussion Room A", "Classroom", "Library 2nd Floor", 10, "ACTIVE", null));
            resourceRepository.save(new Resource(null, "Basketball Court", "Sports Facility", "Sports Complex", 50, "ACTIVE", null));
            resourceRepository.save(new Resource(null, "Projector 4K", "Equipment", "IT Support Desk", null, "ACTIVE", null));
            System.out.println("Sample resources created.");
        }
    }

    private void ensureRole(ERole roleName) {
        if (!roleRepository.findByName(roleName).isPresent()) {
            roleRepository.save(new Role(roleName));
            System.out.println("Created role: " + roleName);
        }
    }
}
