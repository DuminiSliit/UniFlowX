package com.uniflowx.smartcampus.service;

import com.uniflowx.smartcampus.dto.CommentRequest;
import com.uniflowx.smartcampus.dto.CommentResponse;
import com.uniflowx.smartcampus.exception.ResourceNotFoundException;
import com.uniflowx.smartcampus.exception.UnauthorizedException;
import com.uniflowx.smartcampus.model.Ticket;
import com.uniflowx.smartcampus.model.TicketComment;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.model.ERole;
import com.uniflowx.smartcampus.repository.TicketCommentRepository;
import com.uniflowx.smartcampus.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// @Service
// @Transactional
public class TicketCommentService {

    private final TicketCommentRepository commentRepository;
    private final TicketRepository ticketRepository;

    public TicketCommentService(TicketCommentRepository commentRepository, TicketRepository ticketRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
    }

    public CommentResponse addComment(Long ticketId, CommentRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to comment on this ticket");
        }

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setUser(currentUser);
        comment.setContent(request.getContent());

        TicketComment savedComment = commentRepository.save(comment);
        return convertToResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getTicketComments(Long ticketId, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to view comments on this ticket");
        }

        return commentRepository.findByTicket(ticket).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse updateComment(Long commentId, CommentRequest request, User currentUser) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!canEditComment(comment, currentUser)) {
            throw new UnauthorizedException("You don't have permission to edit this comment");
        }

        comment.setContent(request.getContent());
        TicketComment updatedComment = commentRepository.save(comment);
        return convertToResponse(updatedComment);
    }

    public void deleteComment(Long commentId, User currentUser) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!canDeleteComment(comment, currentUser)) {
            throw new UnauthorizedException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private boolean canAccessTicket(Ticket ticket, User currentUser) {
        return hasAdminOrTechnicianRole(currentUser) || 
               ticket.getCreatedBy().getId().equals(currentUser.getId()) ||
               (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(currentUser.getId()));
    }

    private boolean canEditComment(TicketComment comment, User currentUser) {
        return comment.getUser().getId().equals(currentUser.getId()) || hasAdminRole(currentUser);
    }

    private boolean canDeleteComment(TicketComment comment, User currentUser) {
        return comment.getUser().getId().equals(currentUser.getId()) || 
               hasAdminRole(currentUser) ||
               comment.getTicket().getCreatedBy().getId().equals(currentUser.getId());
    }

    private boolean hasAdminOrTechnicianRole(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_ADMIN || role.getName() == ERole.ROLE_TECHNICIAN);
    }

    private boolean hasAdminRole(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_ADMIN);
    }

    private CommentResponse convertToResponse(TicketComment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());

        CommentResponse.UserResponse userResponse = new CommentResponse.UserResponse();
        userResponse.setId(comment.getUser().getId());
        userResponse.setUsername(comment.getUser().getUsername());
        userResponse.setEmail(comment.getUser().getEmail());
        response.setUser(userResponse);

        return response;
    }
}
