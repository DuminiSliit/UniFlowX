package com.uniflowx.smartcampus;

<<<<<<< HEAD
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
=======
import com.uniflowx.smartcampus.model.ERole;
import com.uniflowx.smartcampus.model.Role;
import com.uniflowx.smartcampus.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f

@SpringBootApplication
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f
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
<<<<<<< HEAD
>>>>>>> 5c24315 (make google authentication)
=======
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f
}
