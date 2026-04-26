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

    public TicketService(TicketRepository ticketRepository, UserRepository userRepository, 
                        ResourceRepository resourceRepository, TicketAttachmentRepository attachmentRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
        this.attachmentRepository = attachmentRepository;
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

        Ticket savedTicket = ticketRepository.save(ticket);
        return convertToResponse(savedTicket);
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getAllTickets(Pageable pageable, User currentUser) {
        if (hasAdminOrTechnicianRole(currentUser)) {
            return ticketRepository.findAll(pageable).map(this::convertToResponse);
        } else {
            return ticketRepository.findByCreatedBy(currentUser, pageable).map(this::convertToResponse);
        }
    }

    @Transactional(readOnly = true)
    public Page<TicketResponse> getFilteredTickets(TicketStatus status, TicketCategory category, 
                                                  TicketPriority priority, Long assignedToId, 
                                                  Pageable pageable, User currentUser) {
        
        User assignedTo = null;
        if (assignedToId != null) {
            assignedTo = userRepository.findById(assignedToId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + assignedToId));
        }

        if (!hasAdminOrTechnicianRole(currentUser)) {
            return ticketRepository.findByCreatedBy(currentUser, pageable).map(this::convertToResponse);
        }

        return ticketRepository.findByFilters(status, category, priority, assignedTo, pageable)
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

    public TicketResponse updateTicket(Long id, UpdateTicketRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (!canUpdateTicket(ticket, currentUser)) {
            throw new UnauthorizedException("You don't have permission to update this ticket");
        }

        // Update ticket fields
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            ticket.setTitle(request.getTitle());
        }
        if (request.getDescription() != null && !request.getDescription().trim().isEmpty()) {
            ticket.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            ticket.setCategory(request.getCategory());
        }
        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }
        if (request.getLocation() != null && !request.getLocation().trim().isEmpty()) {
            ticket.setLocation(request.getLocation());
        }
        if (request.getPreferredContact() != null) {
            ticket.setPreferredContact(request.getPreferredContact());
        }
        if (request.getResourceId() != null) {
            Resource resource = resourceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + request.getResourceId()));
            ticket.setResource(resource);
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
        if (user == null || user.getRoles() == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_ADMIN || role.getName() == ERole.ROLE_TECHNICIAN);
    }

    private boolean hasAdminRole(User user) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_ADMIN);
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
