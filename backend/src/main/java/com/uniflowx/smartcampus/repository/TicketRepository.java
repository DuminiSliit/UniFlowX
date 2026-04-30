package com.uniflowx.smartcampus.repository;

import com.uniflowx.smartcampus.model.Ticket;
import com.uniflowx.smartcampus.model.TicketCategory;
import com.uniflowx.smartcampus.model.TicketPriority;
import com.uniflowx.smartcampus.model.TicketStatus;
import com.uniflowx.smartcampus.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Page<Ticket> findByCreatedBy(User createdBy, Pageable pageable);

    Page<Ticket> findByAssignedTo(User assignedTo, Pageable pageable);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByCategory(TicketCategory category, Pageable pageable);

    Page<Ticket> findByPriority(TicketPriority priority, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE t.title LIKE %:keyword% OR t.description LIKE %:keyword%")
    Page<Ticket> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:assignedToId IS NULL OR t.assignedTo.id = :assignedToId) AND " +
           "(:createdByUserId IS NULL OR t.createdBy.id = :createdByUserId)")
    Page<Ticket> findByFilters(@Param("keyword") String keyword,
                              @Param("status") TicketStatus status,
                              @Param("category") TicketCategory category,
                              @Param("priority") TicketPriority priority,
                              @Param("assignedToId") Long assignedToId,
                              @Param("createdByUserId") Long createdByUserId,
                              Pageable pageable);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = :status")
    long countByStatus(@Param("status") TicketStatus status);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.createdBy = :user AND t.status = :status")
    long countByCreatedByAndStatus(@Param("user") User user, @Param("status") TicketStatus status);

    List<Ticket> findByResource_Id(Long resourceId);

    boolean existsByResource_IdAndStatusNot(Long resourceId, TicketStatus status);
}
