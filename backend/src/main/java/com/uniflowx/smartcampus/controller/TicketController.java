package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.dto.*;
import com.uniflowx.smartcampus.model.TicketCategory;
import com.uniflowx.smartcampus.model.TicketPriority;
import com.uniflowx.smartcampus.model.TicketStatus;
import com.uniflowx.smartcampus.model.TicketAttachment;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.repository.UserRepository;
import com.uniflowx.smartcampus.security.services.UserDetailsImpl;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(UserDetailsImpl userDetails) {
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.createTicket(request, currentUser));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Page<TicketResponse>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                    Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ticketService.getAllTickets(pageable, currentUser));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Page<TicketResponse>> searchTickets(
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
        User currentUser = getCurrentUser(userDetails);
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                    Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(ticketService.getFilteredTickets(keyword, status, category, priority, assignedToId, pageable, currentUser));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> getTicketById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.getTicketById(id, currentUser));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request, currentUser));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse> assignTicket(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.assignTicket(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MessageResponse> deleteTicket(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        ticketService.deleteTicket(id, currentUser);
        return ResponseEntity.ok(new MessageResponse("Ticket deleted successfully"));
    }

    // Comment Endpoints
    @PostMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse.TicketCommentResponse> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.addComment(id, request, currentUser));
    }

    @GetMapping("/{id}/comments")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<TicketResponse.TicketCommentResponse>> getTicketComments(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.getTicketComments(id, currentUser));
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse.TicketCommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.updateComment(commentId, request, currentUser));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MessageResponse> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        ticketService.deleteComment(commentId, currentUser);
        return ResponseEntity.ok(new MessageResponse("Comment deleted successfully"));
    }

    // Attachment Endpoints
    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<TicketResponse.TicketAttachmentResponse> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetailsImpl userDetails) throws IOException {
        User currentUser = getCurrentUser(userDetails);
        return ResponseEntity.ok(ticketService.uploadAttachment(
                id, 
                file.getOriginalFilename(), 
                file.getContentType(), 
                file.getBytes(), 
                currentUser));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MessageResponse> deleteAttachment(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        ticketService.deleteAttachment(attachmentId, currentUser);
        return ResponseEntity.ok(new MessageResponse("Attachment deleted successfully"));
    }

    @GetMapping("/attachments/{attachmentId}/download")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<byte[]> downloadAttachment(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = getCurrentUser(userDetails);
        TicketAttachment attachment = ticketService.getAttachmentData(attachmentId, currentUser);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .body(attachment.getData());
    }
}
