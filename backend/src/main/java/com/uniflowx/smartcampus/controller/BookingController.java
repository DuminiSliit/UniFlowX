package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.model.Booking;
import com.uniflowx.smartcampus.model.BookingStatus;
import com.uniflowx.smartcampus.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking, Authentication authentication) {
        // In a real OAuth setup, get the userId from authentication.getName() or attributes
        String userId = (authentication != null) ? authentication.getName() : "test-user";
        booking.setUserId(userId);
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String userId = (authentication != null) ? authentication.getName() : "test-user";
        return ResponseEntity.ok(bookingService.getMyBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        // TODO: Add Admin role check
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        // TODO: Add Admin role check
        BookingStatus status = BookingStatus.valueOf((String) payload.get("status"));
        String reason = (String) payload.get("rejectionReason");
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, Authentication authentication) {
        String userId = (authentication != null) ? authentication.getName() : "test-user";
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }
}
