package com.uniflowx.smartcampus.security.oauth2;

import com.uniflowx.smartcampus.model.ERole;
import com.uniflowx.smartcampus.model.Role;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.repository.RoleRepository;
import com.uniflowx.smartcampus.repository.UserRepository;
import com.uniflowx.smartcampus.security.JwtUtils;
import com.uniflowx.smartcampus.security.services.UserDetailsImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
<<<<<<< HEAD
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
=======
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

<<<<<<< HEAD
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private static final Logger logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);
=======
// @Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
<<<<<<< HEAD
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    public OAuth2LoginSuccessHandler(JwtUtils jwtUtils, 
                                   UserRepository userRepository, 
                                   RoleRepository roleRepository,
                                   HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.httpCookieOAuth2AuthorizationRequestRepository = httpCookieOAuth2AuthorizationRequestRepository;
=======

    public OAuth2LoginSuccessHandler(JwtUtils jwtUtils, UserRepository userRepository, RoleRepository roleRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
<<<<<<< HEAD
        logger.info("[OAuth2Success] Successfully authenticated. Processing user matching...");
        try {
            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oAuth2User.getAttributes();
            String email = (String) attributes.get("email");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setPassword(UUID.randomUUID().toString()); // Placeholder password
                Role userRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                newUser.setRoles(Collections.singleton(userRole));
                return userRepository.save(newUser);
            });

            UserDetailsImpl userDetails = UserDetailsImpl.build(user);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            String jwt = jwtUtils.generateJwtToken(authenticationToken);

<<<<<<< HEAD
            String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5174/oauth2/redirect")
                    .queryParam("token", jwt)
                    .build().toUriString();
=======
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", jwt)
                .build().toUriString();
>>>>>>> 5c24315 (make google authentication)

            clearAuthenticationAttributes(request, response);
            getRedirectStrategy().sendRedirect(request, response, targetUrl);
        } catch (Exception ex) {
            logger.error("[OAuth2Success] Error during post-login processing: {} | Error Stack Trace:", ex.getMessage(), ex);
            String errorUrl = UriComponentsBuilder.fromUriString("http://localhost:5174/login")
                    .queryParam("error", "Database error or role missing: " + ex.getMessage())
                    .build().toUriString();
            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
=======
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(UUID.randomUUID().toString()); // Placeholder password
            Role userRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            newUser.setRoles(Collections.singleton(userRole));
            return userRepository.save(newUser);
        });

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        String jwt = jwtUtils.generateJwtToken(authenticationToken);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/redirect")
                .queryParam("token", jwt)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
>>>>>>> ab89632e0e431b93b556bb1e88b872dc3901228f
    }
}
