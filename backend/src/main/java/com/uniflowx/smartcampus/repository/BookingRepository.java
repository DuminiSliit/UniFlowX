package com.uniflowx.smartcampus.repository;

import com.uniflowx.smartcampus.model.Booking;
import com.uniflowx.smartcampus.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(String userId);

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.status = 'APPROVED' " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findOverlappingBookings(@Param("resourceId") Long resourceId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    List<Booking> findByStatus(BookingStatus status);
}
