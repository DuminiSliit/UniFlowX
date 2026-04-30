package com.uniflowx.smartcampus.service;

import com.uniflowx.smartcampus.dto.*;
import com.uniflowx.smartcampus.exception.ResourceNotFoundException;
import com.uniflowx.smartcampus.exception.UnauthorizedException;
import com.uniflowx.smartcampus.exception.ValidationException;
import com.uniflowx.smartcampus.model.*;
import com.uniflowx.smartcampus.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final TicketCommentRepository commentRepository;

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, 
                        ResourceRepository resourceRepository, TicketAttachmentRepository attachmentRepository,
                        TicketCommentRepository commentRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.attachmentRepository = attachmentRepository;
        this.commentRepository = commentRepository;
    }

    public TicketResponse createTicket(CreateTicketRequest request, User currentUser) {
        Resource resource = null;
        if (request.getResourceId() != null) {
            resource = resourceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + request.getResourceId()));
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setResource(resource);
        ticket.setLocation(request.getLocation());
        ticket.setCreatedBy(currentUser);
        ticket.setPreferredContact(request.getPreferredContact());
        ticket.setEstimatedTime(request.getEstimatedTime());

        if (request.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
            ticket.setAssignedTo(assignedTo);
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        return convertToResponse(savedTicket);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getAllTickets(Pageable pageable, User currentUser) {
        System.out.println("Fetching tickets for user: " + currentUser.getEmail());
        System.out.println("User roles size: " + currentUser.getRoles().size());
        boolean isAdmin = hasAdminOrTechnicianRole(currentUser);
        System.out.println("Is Admin or Tech: " + isAdmin);
        
        if (isAdmin) {
            return ticketRepository.findAll(pageable).map(this::convertToResponse);
        } else {
            return ticketRepository.findByCreatedBy(currentUser, pageable).map(this::convertToResponse);
        }
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getFilteredTickets(String keyword, TicketStatus status, TicketCategory category, 
                                                  TicketPriority priority, Long assignedToId, 
                                                  Pageable pageable, User currentUser) {
        
        Long createdByUserId = null;
        if (!hasAdminOrTechnicianRole(currentUser)) {
            createdByUserId = currentUser.getId();
        }

        return ticketRepository.findByFilters(keyword, status, category, priority, assignedToId, createdByUserId, pageable)
                .map(this::convertToResponse);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to access this ticket");
        }

        return convertToResponse(ticket);
    }

    public TicketResponse updateTicketStatus(Long id, UpdateTicketStatusRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (!canUpdateTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to update this ticket");
        }

        validateStatusTransition(ticket.getStatus(), request.getStatus());

        ticket.setStatus(request.getStatus());
        if (request.getReason() != null && !request.getReason().isEmpty()) {
            ticket.setResolutionNotes(request.getReason());
        }
        
        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToResponse(updatedTicket);
    }

    public TicketResponse assignTicket(Long id, AssignTicketRequest request, User currentUser) {
        if (!hasAdminOrTechnicianRole(currentUser)) {
            throw new UnauthorizedException("Only admin or technician can assign tickets");
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));

        ticket.setAssignedTo(assignedTo);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToResponse(updatedTicket);
    }

    public void deleteTicket(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (!hasAdminRole(currentUser) && !ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this ticket");
        }

        if (ticket.getStatus() != TicketStatus.OPEN && ticket.getStatus() != TicketStatus.REJECTED && !hasAdminRole(currentUser)) {
            throw new ValidationException("Only admin can delete tickets that are not open or rejected");
        }

        ticketRepository.delete(ticket);
    }

    // Comment methods
    public TicketResponse.TicketCommentResponse addComment(Long ticketId, CommentRequest request, User currentUser) {
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
        return convertCommentToResponse(savedComment);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse.TicketCommentResponse> getTicketComments(Long ticketId, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to access this ticket");
        }

        return commentRepository.findByTicket(ticket).stream()
                .map(this::convertCommentToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse.TicketCommentResponse updateComment(Long commentId, CommentRequest request, User currentUser) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getId().equals(currentUser.getId()) && !hasAdminRole(currentUser)) {
            throw new UnauthorizedException("You don't have permission to update this comment");
        }

        comment.setContent(request.getContent());
        TicketComment updatedComment = commentRepository.save(comment);
        return convertCommentToResponse(updatedComment);
    }

    public void deleteComment(Long commentId, User currentUser) {
        TicketComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getUser().getId().equals(currentUser.getId()) && !hasAdminRole(currentUser)) {
            throw new UnauthorizedException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    // Attachment methods
    public TicketResponse.TicketAttachmentResponse uploadAttachment(Long ticketId, String fileName, String contentType, byte[] data, User currentUser) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (!canAccessTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to add attachments to this ticket");
        }

        if (ticket.getAttachments().size() >= 3) {
            throw new ValidationException("Maximum 3 attachments allowed per ticket");
        }

        TicketAttachment attachment = new TicketAttachment();
        attachment.setTicket(ticket);
        attachment.setFileName(fileName);
        attachment.setContentType(contentType);
        attachment.setData(data);
        attachment.setFileSize((long) data.length);

        TicketAttachment savedAttachment = attachmentRepository.save(attachment);
        return convertAttachmentToResponse(savedAttachment);
    }

    public void deleteAttachment(Long attachmentId, User currentUser) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

        if (!canUpdateTicket(attachment.getTicket(), currentUser)) {
            throw new UnauthorizedException("You don't have permission to delete this attachment");
        }

        attachmentRepository.delete(attachment);
    }

    @Transactional(readOnly = true)
    public TicketAttachment getAttachmentData(Long attachmentId, User currentUser) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

        if (!canAccessTicket(attachment.getTicket(), currentUser)) {
            throw new UnauthorizedException("You don't have permission to access this attachment");
        }

        return attachment;
    }

    private boolean canAccessTicket(Ticket ticket, User currentUser) {
        return hasAdminOrTechnicianRole(currentUser) || 
               ticket.getCreatedBy().getId().equals(currentUser.getId()) ||
               (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(currentUser.getId()));
    }

    private boolean canUpdateTicket(Ticket ticket, User currentUser) {
        return hasAdminOrTechnicianRole(currentUser) || 
               ticket.getCreatedBy().getId().equals(currentUser.getId());
    }

    private boolean hasAdminOrTechnicianRole(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().name().equals("ROLE_ADMIN") || role.getName().name().equals("ROLE_TECHNICIAN"));
    }

    private boolean hasAdminRole(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().name().equals("ROLE_ADMIN"));
    }

    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus) {
        switch (currentStatus) {
            case OPEN:
                if (newStatus != TicketStatus.IN_PROGRESS && 
                    newStatus != TicketStatus.RESOLVED && 
                    newStatus != TicketStatus.REJECTED && 
                    newStatus != TicketStatus.CLOSED) {
                    throw new ValidationException("Invalid status transition from OPEN");
                }
                break;
            case IN_PROGRESS:
                if (newStatus != TicketStatus.RESOLVED && 
                    newStatus != TicketStatus.REJECTED && 
                    newStatus != TicketStatus.CLOSED) {
                    throw new ValidationException("Invalid status transition from IN_PROGRESS");
                }
                break;
            case RESOLVED:
                if (newStatus != TicketStatus.CLOSED) {
                    throw new ValidationException("Invalid status transition from RESOLVED");
                }
                break;
            case CLOSED:
            case REJECTED:
                throw new ValidationException("Cannot change status from " + currentStatus);
        }
    }

    private TicketResponse convertToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setCategory(ticket.getCategory());
        response.setPriority(ticket.getPriority());
        response.setStatus(ticket.getStatus());
        response.setLocation(ticket.getLocation());
        response.setPreferredContact(ticket.getPreferredContact());
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        response.setEstimatedTime(ticket.getEstimatedTime());
        response.setResolutionNotes(ticket.getResolutionNotes());

        if (ticket.getResource() != null) {
            TicketResponse.ResourceResponse resourceResponse = new TicketResponse.ResourceResponse();
            resourceResponse.setId(ticket.getResource().getId());
            resourceResponse.setName(ticket.getResource().getName());
            resourceResponse.setType(ticket.getResource().getType());
            response.setResource(resourceResponse);
        }

        if (ticket.getCreatedBy() != null) {
            response.setCreatedBy(convertUserToResponse(ticket.getCreatedBy()));
        }

        if (ticket.getAssignedTo() != null) {
            response.setAssignedTo(convertUserToResponse(ticket.getAssignedTo()));
        }

        if (ticket.getAttachments() != null) {
            response.setAttachments(ticket.getAttachments().stream()
                    .map(this::convertAttachmentToResponse)
                    .collect(Collectors.toList()));
        }

        if (ticket.getComments() != null) {
            response.setComments(ticket.getComments().stream()
                    .map(this::convertCommentToResponse)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private TicketResponse.UserResponse convertUserToResponse(User user) {
        TicketResponse.UserResponse response = new TicketResponse.UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        return response;
    }

    private TicketResponse.TicketAttachmentResponse convertAttachmentToResponse(TicketAttachment attachment) {
        TicketResponse.TicketAttachmentResponse response = new TicketResponse.TicketAttachmentResponse();
        response.setId(attachment.getId());
        response.setFileName(attachment.getFileName());
        response.setFileSize(attachment.getFileSize());
        response.setContentType(attachment.getContentType());
        response.setCreatedAt(attachment.getCreatedAt());
        return response;
    }

    private TicketResponse.TicketCommentResponse convertCommentToResponse(TicketComment comment) {
        TicketResponse.TicketCommentResponse response = new TicketResponse.TicketCommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUser(convertUserToResponse(comment.getUser()));
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());
        return response;
    }
}
