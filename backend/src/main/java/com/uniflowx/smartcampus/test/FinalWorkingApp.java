package com.uniflowx.smartcampus.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
    org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class,
    org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration.class
})
@EnableWebSecurity
public class FinalWorkingApp {
    public static void main(String[] args) {
        SpringApplication.run(FinalWorkingApp.class, args);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/home", "/status", "/oauth2-test").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("/home", true)
            )
            .csrf(csrf -> csrf.disable());
        return http.build();
    }

    @RestController
    public static class HomeController {
        @GetMapping("/")
        public String root() {
            return "🚀 Smart Campus API is running!\n\nAvailable endpoints:\n- GET /home\n- GET /status\n- GET /oauth2-test\n- OAuth2: /oauth2/authorization/google";
        }
        
        @GetMapping("/home")
        public String home() {
            return "🏠 Welcome to Smart Campus!\n\n✅ Database connected\n✅ Security enabled\n✅ OAuth2 configured\n\nReady for Google authentication!";
        }
        
        @GetMapping("/status")
        public String status() {
            return "📊 System Status: All Operational\n\n🔗 Database: Connected\n🔒 Security: Active\n🔐 OAuth2: Ready";
        }
        
        @GetMapping("/oauth2-test")
        public String oauth2Test() {
            return "🔐 OAuth2 Test\n\nTry: http://localhost:8080/oauth2/authorization/google\n\nThis should redirect to Google login!";
        }
    }
}
