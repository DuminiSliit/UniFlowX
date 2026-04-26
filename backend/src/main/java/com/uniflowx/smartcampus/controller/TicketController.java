package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.dto.*;
import com.uniflowx.smartcampus.model.TicketCategory;
import com.uniflowx.smartcampus.model.TicketPriority;
import com.uniflowx.smartcampus.model.TicketStatus;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.service.TicketService;
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

    // Temporarily disabled to fix startup issues
    // private final TicketService ticketService;

    public TicketController() {
        // this.ticketService = ticketService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket creation temporarily disabled");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket listing temporarily disabled");
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> searchTickets(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketCategory category,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket search temporarily disabled");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> getTicketById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket details temporarily disabled");
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket status update temporarily disabled");
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket assignment temporarily disabled");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MessageResponse> deleteTicket(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        MessageResponse response = new MessageResponse("Ticket deletion temporarily disabled");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> getTicketStats(@AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Ticket stats temporarily disabled");
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
