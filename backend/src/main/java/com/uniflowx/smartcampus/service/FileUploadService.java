package com.uniflowx.smartcampus.service;

import com.uniflowx.smartcampus.exception.ValidationException;
import com.uniflowx.smartcampus.model.Ticket;
import com.uniflowx.smartcampus.model.TicketAttachment;
import com.uniflowx.smartcampus.repository.TicketAttachmentRepository;
import com.uniflowx.smartcampus.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class FileUploadService {

    private final TicketAttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;

    public FileUploadService(TicketAttachmentRepository attachmentRepository, TicketRepository ticketRepository) {
        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
    }

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg", 
            "image/png",
            "image/gif",
            "image/webp"
    );

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final int MAX_ATTACHMENTS_PER_TICKET = 3;

    public TicketAttachment uploadAttachment(Long ticketId, MultipartFile file) {
        validateFile(file);

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ValidationException("Ticket not found with id: " + ticketId));

        long currentAttachmentCount = attachmentRepository.countByTicket(ticket);
        if (currentAttachmentCount >= MAX_ATTACHMENTS_PER_TICKET) {
            throw new ValidationException("Maximum " + MAX_ATTACHMENTS_PER_TICKET + " attachments allowed per ticket");
        }

        try {
            String fileName = generateUniqueFileName(file.getOriginalFilename());
            Path uploadPath = Paths.get(uploadDir, "tickets", ticketId.toString());
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicket(ticket);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFilePath(filePath.toString());
            attachment.setFileSize(file.getSize());
            attachment.setContentType(file.getContentType());

            return attachmentRepository.save(attachment);

        } catch (IOException e) {
            throw new ValidationException("Failed to upload file: " + e.getMessage());
        }
    }

    public void deleteAttachment(Long attachmentId) {
        TicketAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ValidationException("Attachment not found with id: " + attachmentId));

        try {
            Path filePath = Paths.get(attachment.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            // Log error but continue with database deletion
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        attachmentRepository.delete(attachment);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ValidationException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("File size exceeds maximum limit of 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ValidationException("Only image files (JPEG, PNG, GIF, WebP) are allowed");
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }
}
