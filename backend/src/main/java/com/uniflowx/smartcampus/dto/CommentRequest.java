package com.uniflowx.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentRequest {

    @NotBlank(message = "Comment content is required")
    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String content;

    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
