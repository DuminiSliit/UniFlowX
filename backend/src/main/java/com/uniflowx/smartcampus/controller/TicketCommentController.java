package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.dto.CommentRequest;
import com.uniflowx.smartcampus.dto.CommentResponse;
import com.uniflowx.smartcampus.dto.MessageResponse;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.security.services.UserDetailsImpl;
import com.uniflowx.smartcampus.service.TicketCommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TicketCommentController {

    // Temporarily disabled to fix startup issues
    // private final TicketCommentService commentService;

    public TicketCommentController() {
        // this.commentService = commentService;
    }

    @PostMapping("/tickets/{ticketId}/comments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("Comment creation temporarily disabled");
    }

    @GetMapping("/tickets/{ticketId}/comments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<CommentResponse>> getTicketComments(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok(java.util.Collections.emptyList());
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MessageResponse> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        // Temporarily disabled - return placeholder response
        MessageResponse response = new MessageResponse("Comment deletion temporarily disabled");
        return ResponseEntity.ok(response);
    }
}
