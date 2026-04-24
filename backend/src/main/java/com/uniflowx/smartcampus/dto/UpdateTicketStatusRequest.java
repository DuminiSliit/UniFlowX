package com.uniflowx.smartcampus.dto;

import com.uniflowx.smartcampus.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTicketStatusRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    private String reason;

    // Getters and Setters
    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
