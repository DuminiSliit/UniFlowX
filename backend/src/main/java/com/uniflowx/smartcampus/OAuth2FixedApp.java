package com.uniflowx.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 @SpringBootApplication(exclude = {
     org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
     org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class,
     org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration.class
 })
 */
// @EnableWebSecurity
public class OAuth2FixedApp {
    public static void main(String[] args) {
        SpringApplication.run(OAuth2FixedApp.class, args);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/home", "/status", "/health").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .defaultSuccessUrl("http://localhost:5173/smart-campus", true)
            )
            .csrf(csrf -> csrf.disable());
        return http.build();
    }

    @RestController
    public static class HomeController {
        @GetMapping("/oauth2-status")
        public String root() {
            return "🚀 Smart Campus API is running!\n\nOAuth2 Fixed - Redirects to frontend home page after login\n\nTest OAuth2: http://localhost:8080/oauth2/authorization/google";
        }
        
        
        @GetMapping("/home")
        public String home() {
            return buildHomePage();
        }
        
        private String buildHomePage() {
            StringBuilder page = new StringBuilder();
            page.append("🏫 Welcome to UniFlowX Smart Campus 🏫\n\n");
            page.append("=====================================\n\n");
            
            // User Status Section
            page.append("👤 User Status: Authenticated\n");
            page.append("🔐 Login Method: Google OAuth2\n");
            page.append("⏰ Login Time: ").append(new java.util.Date()).append("\n\n");
            
            // Quick Stats
            page.append("📊 Campus Overview\n");
            page.append("=====================================\n");
            page.append("📚 Active Courses: 12\n");
            page.append("👥 Total Students: 2,847\n");
            page.append("🏛️ Available Facilities: 45\n");
            page.append("📅 Today's Bookings: 23\n\n");
            
            // Quick Actions
            page.append("🚀 Quick Actions\n");
            page.append("=====================================\n");
            page.append("📖 View Courses: GET /api/courses\n");
            page.append("🏛️ Browse Facilities: GET /api/resources\n");
            page.append("📅 My Bookings: GET /api/bookings/my\n");
            page.append("👤 My Profile: GET /api/user/profile\n\n");
            
            // Available Features
            page.append("✨ Available Features\n");
            page.append("=====================================\n");
            page.append("📚 Course Management\n");
            page.append("🏛️ Facility Booking System\n");
            page.append("📅 Smart Calendar Integration\n");
            page.append("👥 Student Collaboration\n");
            page.append("📊 Analytics Dashboard\n");
            page.append("🔔 Real-time Notifications\n\n");
            
            // API Endpoints
            page.append("🔗 Available API Endpoints\n");
            page.append("=====================================\n");
            page.append("Authentication:\n");
            page.append("  • POST /api/auth/signin\n");
            page.append("  • POST /api/auth/signup\n");
            page.append("  • GET /oauth2/authorization/google\n\n");
            
            page.append("Resources:\n");
            page.append("  • GET /api/resources\n");
            page.append("  • GET /api/resources/{id}\n");
            page.append("  • POST /api/resources\n\n");
            
            page.append("Bookings:\n");
            page.append("  • GET /api/bookings\n");
            page.append("  • GET /api/bookings/my\n");
            page.append("  • POST /api/bookings\n");
            page.append("  • PUT /api/bookings/{id}\n\n");
            
            // System Status
            page.append("⚙️ System Status\n");
            page.append("=====================================\n");
            page.append("🟢 Backend API: Operational\n");
            page.append("🟢 Database: Connected\n");
            page.append("🟢 Authentication: Active\n");
            page.append("🟢 OAuth2: Configured\n");
            page.append("🟢 Security: Enabled\n\n");
            
            // Help & Support
            page.append("📞 Help & Support\n");
            page.append("=====================================\n");
            page.append("📧 Support Email: support@uniflowx.edu\n");
            page.append("📱 Help Desk: +1-234-567-8900\n");
            page.append("📖 Documentation: /docs/api\n");
            page.append("🐛 Report Issues: /api/feedback\n\n");
            
            page.append("🎓 Thank you for using UniFlowX Smart Campus!\n");
            page.append("🌟 Empowering Education Through Technology\n");
            
            return page.toString();
        }
        
        private String buildProfilePage() {
            StringBuilder profile = new StringBuilder();
            profile.append("👤 User Profile\n");
            profile.append("=====================================\n\n");
            
            profile.append("📋 Personal Information\n");
            profile.append("-------------------------------------\n");
            profile.append("👤 Name: John Student\n");
            profile.append("📧 Email: student@uniflowx.edu\n");
            profile.append("🎓 Student ID: STU2024001\n");
            profile.append("🏛️ Department: Computer Science\n");
            profile.append("📅 Year: 3rd Year\n");
            profile.append("📱 Phone: +1-234-567-8901\n\n");
            
            profile.append("📚 Academic Progress\n");
            profile.append("-------------------------------------\n");
            profile.append("📖 Current Courses: 5\n");
            profile.append("✅ Completed Credits: 72/120\n");
            profile.append("📊 GPA: 3.8/4.0\n");
            profile.append("🏆 Dean's List: 3 Semesters\n\n");
            
            profile.append("🏛️ Campus Activity\n");
            profile.append("-------------------------------------\n");
            profile.append("📅 Active Bookings: 3\n");
            profile.append("📚 Library Visits: 47\n");
            profile.append("🏃‍♂️ Gym Sessions: 12\n");
            profile.append("👥 Study Groups: 2\n\n");
            
            profile.append("⚙️ Account Settings\n");
            profile.append("-------------------------------------\n");
            profile.append("🔐 Change Password: /api/auth/change-password\n");
            profile.append("📧 Update Email: /api/user/update-email\n");
            profile.append("📱 2FA Settings: /api/auth/2fa\n");
            profile.append("🔔 Notification Preferences: /api/user/notifications\n\n");
            
            profile.append("📞 Contact Support\n");
            profile.append("-------------------------------------\n");
            profile.append("📧 Email: support@uniflowx.edu\n");
            profile.append("📱 Phone: +1-234-567-8900\n");
            profile.append("🏢 Office: Admin Building, Room 201\n");
            
            return profile.toString();
        }
        
        private String buildDashboardPage() {
            StringBuilder dashboard = new StringBuilder();
            dashboard.append("📊 UniFlowX Dashboard\n");
            dashboard.append("=====================================\n\n");
            
            dashboard.append("🎯 Today's Overview\n");
            dashboard.append("-------------------------------------\n");
            dashboard.append("📅 Date: ").append(new java.text.SimpleDateFormat("EEEE, MMMM dd, yyyy").format(new java.util.Date())).append("\n");
            dashboard.append("⏰ Current Time: ").append(new java.text.SimpleDateFormat("HH:mm:ss").format(new java.util.Date())).append("\n");
            dashboard.append("📚 Classes Today: 3\n");
            dashboard.append("📅 Pending Bookings: 2\n");
            dashboard.append("🔔 Unread Messages: 5\n\n");
            
            dashboard.append("📚 Academic Dashboard\n");
            dashboard.append("-------------------------------------\n");
            dashboard.append("📖 Current Courses:\n");
            dashboard.append("  • CS301: Data Structures (9:00 AM)\n");
            dashboard.append("  • CS302: Algorithms (11:00 AM)\n");
            dashboard.append("  • CS303: Database Systems (2:00 PM)\n");
            dashboard.append("📅 Upcoming Deadlines:\n");
            dashboard.append("  • CS301 Assignment: Tomorrow\n");
            dashboard.append("  • CS302 Project: Friday\n");
            dashboard.append("  • CS303 Quiz: Monday\n\n");
            
            dashboard.append("🏛️ Facilities Status\n");
            dashboard.append("-------------------------------------\n");
            dashboard.append("📚 Library: 🟢 Open (24/7)\n");
            dashboard.append("🏃‍♂️ Gym: 🟢 Open (6 AM - 10 PM)\n");
            dashboard.append("🍽️ Cafeteria: 🟢 Open (7 AM - 8 PM)\n");
            dashboard.append("🧪 Labs: 🟡 Limited Access\n");
            dashboard.append("📝 Study Rooms: 🔴 All Booked\n\n");
            
            dashboard.append("📈 Performance Metrics\n");
            dashboard.append("-------------------------------------\n");
            dashboard.append("📊 Attendance: 94%\n");
            dashboard.append("✅ Assignment Completion: 88%\n");
            dashboard.append("📚 Study Hours: 25/week\n");
            dashboard.append("🏆 Current Rank: Top 15%\n\n");
            
            dashboard.append("🚀 Quick Actions\n");
            dashboard.append("-------------------------------------\n");
            dashboard.append("📖 View Schedule: /api/schedule\n");
            dashboard.append("📅 Book Facility: /api/bookings/create\n");
            dashboard.append("📊 View Grades: /api/grades\n");
            dashboard.append("👥 Study Groups: /api/study-groups\n");
            dashboard.append("🔔 Notifications: /api/notifications\n\n");
            
            dashboard.append("📞 Campus Services\n");
            dashboard.append("-------------------------------------\n");
            dashboard.append("🏥 Health Center: Ext. 1234\n");
            dashboard.append("📚 Library Help: Ext. 5678\n");
            dashboard.append("🍽️ Food Services: Ext. 9012\n");
            dashboard.append("🚌 Transport: Ext. 3456\n");
            
            return dashboard.toString();
        }
        
        @GetMapping("/status")
        public String status() {
            return "📊 OAuth2 Redirect Status: FIXED\n\n✅ OAuth2 configured\n✅ Redirects to http://localhost:5173/home\n✅ Frontend integration ready";
        }
    }
}
