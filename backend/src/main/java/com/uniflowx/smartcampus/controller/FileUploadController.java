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

    // Temporarily disabled to fix startup issues
    // private final FileUploadService fileUploadService;

    public FileUploadController() {
        // this.fileUploadService = fileUploadService;
    }

    @PostMapping("/tickets/{ticketId}/attachments")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<String> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.ok("File upload temporarily disabled");
    }

    @DeleteMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<MessageResponse> deleteAttachment(
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal User currentUser) {
        // Temporarily disabled - return placeholder response
        MessageResponse response = new MessageResponse("File deletion temporarily disabled");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/attachments/{attachmentId}/download")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId) {
        // Temporarily disabled - return placeholder response
        return ResponseEntity.notFound().build();
    }
}
