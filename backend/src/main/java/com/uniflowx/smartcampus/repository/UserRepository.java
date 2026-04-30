package com.uniflowx.smartcampus.repository;

import com.uniflowx.smartcampus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    java.util.List<User> findByRolesName(com.uniflowx.smartcampus.model.ERole name);
}
