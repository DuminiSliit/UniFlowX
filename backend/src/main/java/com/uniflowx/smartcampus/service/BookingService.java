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

        if (status == BookingStatus.APPROVED) {
            // Re-verify conflicts before final approval
            List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                    booking.getResource().getId(),
                    booking.getStartTime(),
                    booking.getEndTime()
            );

            // Filter out the current booking if it was somehow already approved (shouldn't happen here)
            overlapping = overlapping.stream()
                    .filter(b -> !b.getId().equals(id))
                    .collect(java.util.stream.Collectors.toList());

            if (!overlapping.isEmpty()) {
                throw new RuntimeException("Conflict detected: This slot has already been booked and approved for another user.");
            }
        }

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

    @Transactional
    public Booking updateBooking(Long id, Booking update, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found."));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this booking.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be updated.");
        }

        // Check for conflicts if time or resource changed
        Long rId = update.getResourceId() != null ? update.getResourceId() : booking.getResource().getId();
        
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                rId,
                update.getStartTime() != null ? update.getStartTime() : booking.getStartTime(),
                update.getEndTime() != null ? update.getEndTime() : booking.getEndTime()
        );

        // Filter out current booking
        overlapping = overlapping.stream()
                .filter(b -> !b.getId().equals(id))
                .collect(java.util.stream.Collectors.toList());

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Scheduling conflict: The resource is already booked for the requested time range.");
        }

        // Update fields
        if (update.getStartTime() != null) booking.setStartTime(update.getStartTime());
        if (update.getEndTime() != null) booking.setEndTime(update.getEndTime());
        if (update.getPurpose() != null) booking.setPurpose(update.getPurpose());
        if (update.getExpectedAttendees() != null && update.getExpectedAttendees() != 0) {
            booking.setExpectedAttendees(update.getExpectedAttendees());
        }
        
        if (update.getResourceId() != null && !update.getResourceId().equals(booking.getResource().getId())) {
            com.uniflowx.smartcampus.model.Resource resource = resourceRepository.findById(update.getResourceId())
                    .orElseThrow(() -> new RuntimeException("Resource not found."));
            booking.setResource(resource);
        }

        return bookingRepository.save(booking);
    }
}
