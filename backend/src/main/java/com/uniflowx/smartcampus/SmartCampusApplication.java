package com.uniflowx.smartcampus;

import com.uniflowx.smartcampus.model.ERole;
import com.uniflowx.smartcampus.model.Role;
import com.uniflowx.smartcampus.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
// @EnableJpaRepositories
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }

    // @Bean
    // public CommandLineRunner initRoles(RoleRepository roleRepository) {
    //     return args -> {
    //         for (ERole roleName : ERole.values()) {
    //             if (!roleRepository.findByName(roleName).isPresent()) {
    //                 Role role = new Role();
    //                 role.setName(roleName);
    //                 roleRepository.save(role);
    //                 System.out.println("Initialized role: " + roleName);
    //             }
    //         }
    //     };
    // }
}
