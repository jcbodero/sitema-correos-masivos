package com.correos.masivos.campaign.infrastructure.repository;

import com.correos.masivos.campaign.domain.model.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    
    // Búsqueda básica
    Page<Campaign> findByUserId(Long userId, Pageable pageable);
    Page<Campaign> findByUserIdAndStatus(Long userId, Campaign.CampaignStatus status, Pageable pageable);
    
    // Búsqueda con texto
    @Query("SELECT c FROM Campaign c WHERE c.userId = :userId AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Campaign> searchByUserIdAndTerm(@Param("userId") Long userId, 
                                        @Param("searchTerm") String searchTerm, 
                                        Pageable pageable);
    
    // Campañas programadas
    @Query("SELECT c FROM Campaign c WHERE c.status = 'SCHEDULED' AND c.scheduledAt <= :beforeTime")
    List<Campaign> findScheduledCampaignsBefore(@Param("beforeTime") LocalDateTime beforeTime);
    
    // Contadores
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, Campaign.CampaignStatus status);
    
    // Campañas activas
    @Query("SELECT c FROM Campaign c WHERE c.userId = :userId AND c.status IN ('SENDING', 'SCHEDULED')")
    List<Campaign> findActiveCampaignsByUserId(@Param("userId") Long userId);
}