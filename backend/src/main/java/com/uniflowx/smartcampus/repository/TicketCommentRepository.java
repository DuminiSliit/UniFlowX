package com.uniflowx.smartcampus.repository;

import com.uniflowx.smartcampus.model.Ticket;
import com.uniflowx.smartcampus.model.TicketComment;
import com.uniflowx.smartcampus.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

    List<TicketComment> findByTicket(Ticket ticket);

    Page<TicketComment> findByTicket(Ticket ticket, Pageable pageable);

    List<TicketComment> findByUser(User user);

    boolean existsByTicketAndUser(Ticket ticket, User user);

    void deleteByTicket(Ticket ticket);
}
