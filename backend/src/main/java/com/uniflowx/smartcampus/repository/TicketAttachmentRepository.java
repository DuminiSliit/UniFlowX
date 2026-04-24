package com.uniflowx.smartcampus.repository;

import com.uniflowx.smartcampus.model.Ticket;
import com.uniflowx.smartcampus.model.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

    List<TicketAttachment> findByTicket(Ticket ticket);

    @Query("SELECT COUNT(a) FROM TicketAttachment a WHERE a.ticket = :ticket")
    long countByTicket(@Param("ticket") Ticket ticket);

    void deleteByTicket(Ticket ticket);
}
