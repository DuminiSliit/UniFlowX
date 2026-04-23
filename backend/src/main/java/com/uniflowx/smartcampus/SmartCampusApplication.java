package com.uniflowx.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }

<<<<<<< HEAD
=======
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
>>>>>>> 5c24315 (make google authentication)
}
