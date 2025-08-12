package com.correos.masivos.email.infrastructure.repository;

import com.correos.masivos.email.domain.model.EmailLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    
    // Búsqueda básica
    Page<EmailLog> findByCampaignId(Long campaignId, Pageable pageable);
    Page<EmailLog> findByStatus(EmailLog.EmailStatus status, Pageable pageable);
    Page<EmailLog> findByCampaignIdAndStatus(Long campaignId, EmailLog.EmailStatus status, Pageable pageable);
    
    // Búsqueda por external ID
    Optional<EmailLog> findByExternalId(String externalId);
    
    // Emails fallidos para reintento
    @Query("SELECT e FROM EmailLog e WHERE e.campaignId = :campaignId AND e.status = 'FAILED' AND e.retryCount < e.maxRetries")
    List<EmailLog> findFailedEmailsForRetry(@Param("campaignId") Long campaignId);
    
    // Contadores
    long countByStatus(EmailLog.EmailStatus status);
    long countByCampaignIdAndStatus(Long campaignId, EmailLog.EmailStatus status);
    
    // Rate limiting queries
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.smtpProvider = :provider AND e.sentAt >= :since")
    long countByProviderSince(@Param("provider") String provider, @Param("since") LocalDateTime since);
    
    // Emails pendientes
    @Query("SELECT e FROM EmailLog e WHERE e.status = 'PENDING' ORDER BY e.createdAt ASC")
    List<EmailLog> findPendingEmails(Pageable pageable);
    
    // Estadísticas por campaña
    @Query("SELECT e.status, COUNT(e) FROM EmailLog e WHERE e.campaignId = :campaignId GROUP BY e.status")
    List<Object[]> getCampaignStats(@Param("campaignId") Long campaignId);
    
    // Estadísticas globales
    @Query("SELECT e.status, COUNT(e) FROM EmailLog e GROUP BY e.status")
    List<Object[]> getGlobalStats();
    
    // Estadísticas por rango de fechas
    @Query("SELECT e.status, COUNT(e) FROM EmailLog e WHERE e.createdAt BETWEEN :fromDate AND :toDate GROUP BY e.status")
    List<Object[]> getStatsByDateRange(@Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    // Estadísticas por campaña y rango de fechas
    @Query("SELECT e.status, COUNT(e) FROM EmailLog e WHERE e.campaignId = :campaignId AND e.createdAt BETWEEN :fromDate AND :toDate GROUP BY e.status")
    List<Object[]> getCampaignStatsByDateRange(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    // Contadores específicos para estadísticas
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countTotalEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'SENT' AND (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countSentEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'DELIVERED' AND (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countDeliveredEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'OPENED' AND (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countOpenedEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'CLICKED' AND (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countClickedEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'BOUNCED' AND (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countBouncedEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
    
    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'FAILED' AND (:campaignId IS NULL OR e.campaignId = :campaignId) AND (:fromDate IS NULL OR e.createdAt >= :fromDate) AND (:toDate IS NULL OR e.createdAt <= :toDate)")
    long countFailedEmails(@Param("campaignId") Long campaignId, @Param("fromDate") LocalDateTime fromDate, @Param("toDate") LocalDateTime toDate);
}