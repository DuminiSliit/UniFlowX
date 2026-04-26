package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.dto.*;
import com.uniflowx.smartcampus.exception.ResourceNotFoundException;
import com.uniflowx.smartcampus.exception.UnauthorizedException;
import com.uniflowx.smartcampus.model.TicketCategory;
import com.uniflowx.smartcampus.model.TicketPriority;
import com.uniflowx.smartcampus.model.TicketStatus;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.repository.UserRepository;
import com.uniflowx.smartcampus.security.services.UserDetailsImpl;
import com.uniflowx.smartcampus.service.TicketService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<?> createTicket(
            @Valid @RequestBody CreateTicketRequest request) {
        try {
            User currentUser = getCurrentUser();
            return ResponseEntity.ok(ticketService.createTicket(request, currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error creating ticket: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        try {
            User currentUser = getCurrentUser();
            
            // Convert string parameters to enums and Long
            TicketStatus statusEnum = null;
            if (status != null && !status.isEmpty()) {
                statusEnum = TicketStatus.valueOf(status.toUpperCase());
            }
            
            TicketCategory categoryEnum = null;
            if (category != null && !category.isEmpty()) {
                categoryEnum = TicketCategory.valueOf(category.toUpperCase());
            }
            
            TicketPriority priorityEnum = null;
            if (priority != null && !priority.isEmpty()) {
                priorityEnum = TicketPriority.valueOf(priority.toUpperCase());
            }
            
            return ResponseEntity.ok(ticketService.getFilteredTickets(statusEnum, categoryEnum, priorityEnum, null, 
                PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy)), currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error fetching tickets: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<?> searchTickets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketCategory category,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            User currentUser = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            
            User assignedTo = null;
            if (assignedToId != null) {
                assignedTo = userRepository.findById(assignedToId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assignedToId));
            }
            
            return ResponseEntity.ok(ticketService.getFilteredTickets(status, category, priority, assignedToId, 
                PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sortDir), sortBy)), currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error searching tickets: " + e.getMessage()));
        }
    }

    @GetMapping("/auth-test")
    public ResponseEntity<String> testAuthentication() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
                return ResponseEntity.ok("No authentication found");
            }
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return ResponseEntity.ok("Authentication working! User: " + userDetails.getEmail());
        } catch (Exception e) {
            return ResponseEntity.ok("Authentication error: " + e.getMessage());
        }
    }

    @GetMapping("/test-db")
    public ResponseEntity<String> testDatabase() {
        try {
            // Test database connection by creating a simple user fetch
            User testUser = userRepository.findById(1L)
                    .orElse(null);
            if (testUser != null) {
                return ResponseEntity.ok("Database connection working! Found user: " + testUser.getEmail());
            } else {
                return ResponseEntity.ok("Database connected but no user found with ID 1");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Database error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            TicketResponse ticket = ticketService.getTicketById(id, currentUser);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error fetching ticket: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketRequest request) {
        try {
            User currentUser = getCurrentUser();
            TicketResponse ticket = ticketService.updateTicket(id, request, currentUser);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating ticket: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        try {
            User currentUser = getCurrentUser();
            TicketResponse ticket = ticketService.updateTicketStatus(id, request, currentUser);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating ticket status: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request) {
        try {
            User currentUser = getCurrentUser();
            TicketResponse ticket = ticketService.assignTicket(id, request, currentUser);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error assigning ticket: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<MessageResponse> deleteTicket(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            ticketService.deleteTicket(id, currentUser);
            return ResponseEntity.ok(new MessageResponse("Ticket deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error deleting ticket: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> getTicketStats(@AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket stats temporarily disabled");
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            throw new UnauthorizedException("User not authenticated");
        }
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public static class TicketStatsResponse {
        private long totalTickets;
        private long openTickets;
        private long inProgressTickets;
        private long resolvedTickets;
        private long closedTickets;
        private long rejectedTickets;

        // Getters and setters
        public long getTotalTickets() { return totalTickets; }
        public void setTotalTickets(long totalTickets) { this.totalTickets = totalTickets; }
        public long getOpenTickets() { return openTickets; }
        public void setOpenTickets(long openTickets) { this.openTickets = openTickets; }
        public long getInProgressTickets() { return inProgressTickets; }
        public void setInProgressTickets(long inProgressTickets) { this.inProgressTickets = inProgressTickets; }
        public long getResolvedTickets() { return resolvedTickets; }
        public void setResolvedTickets(long resolvedTickets) { this.resolvedTickets = resolvedTickets; }
        public long getClosedTickets() { return closedTickets; }
        public void setClosedTickets(long closedTickets) { this.closedTickets = closedTickets; }
        public long getRejectedTickets() { return rejectedTickets; }
        public void setRejectedTickets(long rejectedTickets) { this.rejectedTickets = rejectedTickets; }
    }
}
