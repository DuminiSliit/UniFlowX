package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.model.Booking;
import com.uniflowx.smartcampus.model.BookingStatus;
import com.uniflowx.smartcampus.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    public ResponseEntity<?> createBooking(@RequestBody Booking booking, Authentication authentication) {
        String userEmail = authentication.getName();
        booking.setUserId(userEmail);
        try {
            return ResponseEntity.ok(bookingService.createBooking(booking));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        List<Booking> bookings = bookingService.getMyBookings(userEmail);
        bookings.forEach(b -> System.out.println("Booking ID: " + b.getId() + " - Resource: " + (b.getResource() != null ? b.getResource().getName() : "NULL")));
        return ResponseEntity.ok(bookings);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        try {
            BookingStatus status = BookingStatus.valueOf((String) payload.get("status"));
            String reason = (String) payload.get("rejectionReason");
            return ResponseEntity.ok(bookingService.updateBookingStatus(id, status, reason));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.cancelBooking(id, userEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Long id,
            @RequestBody Booking bookingUpdate,
            Authentication authentication) {
        String userEmail = authentication.getName();
        try {
            return ResponseEntity.ok(bookingService.updateBooking(id, bookingUpdate, userEmail));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
