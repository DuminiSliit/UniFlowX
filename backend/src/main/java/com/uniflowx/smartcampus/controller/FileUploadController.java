package com.uniflowx.smartcampus.controller;

import com.uniflowx.smartcampus.dto.MessageResponse;
import com.uniflowx.smartcampus.model.TicketAttachment;
import com.uniflowx.smartcampus.model.User;
import com.uniflowx.smartcampus.service.FileUploadService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/tickets/{ticketId}/attachments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {
        try {
            TicketAttachment attachment = fileUploadService.uploadAttachment(ticketId, file);
            return ResponseEntity.ok(attachment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error uploading file: " + e.getMessage()));
        }
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<MessageResponse> deleteAttachment(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal User currentUser) {
        try {
            fileUploadService.deleteAttachment(attachmentId);
            return ResponseEntity.ok(new MessageResponse("Attachment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error deleting attachment: " + e.getMessage()));
        }
    }

    @GetMapping("/attachments/{attachmentId}/download")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN', 'STUDENT')")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) {
        try {
            // For now, return a placeholder - you can implement actual file download later
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
