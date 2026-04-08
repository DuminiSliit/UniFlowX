package com.uniflowx.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for easier testing of REST APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/bookings/**").permitAll() // Temporarily permit all for testing
                .anyRequest().authenticated()
            )
            .oauth2Login(withDefaults()); // Enable OAuth2 Login
        
        return http.build();
    }
}
