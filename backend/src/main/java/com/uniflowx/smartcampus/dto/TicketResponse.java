package com.uniflowx.smartcampus.dto;

import com.uniflowx.smartcampus.model.TicketCategory;
import com.uniflowx.smartcampus.model.TicketPriority;
import com.uniflowx.smartcampus.model.TicketStatus;

import java.time.LocalDateTime;
import java.util.List;

public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private ResourceResponse resource;
    private String location;
    private UserResponse createdBy;
    private UserResponse assignedTo;
    private String preferredContact;
    private Integer estimatedTime;
    private List<TicketAttachmentResponse> attachments;
    private List<TicketCommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String resolutionNotes;

    public static class ResourceResponse {
        private Long id;
        private String name;
        private String type;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }

    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class TicketAttachmentResponse {
        private Long id;
        private String fileName;
        private Long fileSize;
        private String contentType;
        private LocalDateTime createdAt;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class TicketCommentResponse {
        private Long id;
        private String content;
        private UserResponse user;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public UserResponse getUser() { return user; }
        public void setUser(UserResponse user) { this.user = user; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TicketCategory getCategory() { return category; }
    public void setCategory(TicketCategory category) { this.category = category; }
    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
    public ResourceResponse getResource() { return resource; }
    public void setResource(ResourceResponse resource) { this.resource = resource; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public UserResponse getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserResponse createdBy) { this.createdBy = createdBy; }
    public UserResponse getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UserResponse assignedTo) { this.assignedTo = assignedTo; }
    public String getPreferredContact() { return preferredContact; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }
    public Integer getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(Integer estimatedTime) { this.estimatedTime = estimatedTime; }
    public List<TicketAttachmentResponse> getAttachments() { return attachments; }
    public void setAttachments(List<TicketAttachmentResponse> attachments) { this.attachments = attachments; }
    public List<TicketCommentResponse> getComments() { return comments; }
    public void setComments(List<TicketCommentResponse> comments) { this.comments = comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
