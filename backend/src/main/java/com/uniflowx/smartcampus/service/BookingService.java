package com.uniflowx.smartcampus.service;

import com.uniflowx.smartcampus.model.Booking;
import com.uniflowx.smartcampus.model.BookingStatus;
import com.uniflowx.smartcampus.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final com.uniflowx.smartcampus.repository.ResourceRepository resourceRepository;

    public BookingService(BookingRepository bookingRepository, com.uniflowx.smartcampus.repository.ResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        Long rId = booking.getResourceId();
        if (rId == null && booking.getResource() != null) {
            rId = booking.getResource().getId();
        }
        
        if (rId == null) {
            throw new RuntimeException("Resource ID must be provided.");
        }

        // Fetch resource to ensure it exists and link it
        com.uniflowx.smartcampus.model.Resource resource = resourceRepository.findById(rId)
                .orElseThrow(() -> new RuntimeException("Resource not found."));
        booking.setResource(resource);

        // Conflict Check: Check for overlapping approved bookings for the same resource
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                rId,
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
