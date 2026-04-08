package com.uniflowx.smartcampus.service;

import com.uniflowx.smartcampus.model.Booking;
import com.uniflowx.smartcampus.model.BookingStatus;
import com.uniflowx.smartcampus.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    @Transactional
    public Booking createBooking(Booking booking) {
        // Conflict Check: Check for overlapping approved bookings for the same resource
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Scheduling conflict: The resource is already booked for the requested time range.");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public Booking updateBookingStatus(Long id, BookingStatus status, String rejectionReason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        booking.setStatus(status);
        if (status == BookingStatus.REJECTED) {
            booking.setRejectionReason(rejectionReason);
        }
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.APPROVED || booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CANCELLED);
            return bookingRepository.save(booking);
        } else {
            throw new RuntimeException("Booking cannot be cancelled in its current state.");
        }
    }
}
