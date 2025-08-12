package com.correos.masivos.campaign.domain.service;

import com.correos.masivos.campaign.domain.model.Campaign;
import com.correos.masivos.campaign.domain.model.CampaignTargetList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CampaignService {
    
    // CRUD básico
    Campaign createCampaign(Campaign campaign);
    Optional<Campaign> findById(Long id);
    Page<Campaign> findByUserId(Long userId, Pageable pageable);
    Campaign updateCampaign(Campaign campaign);
    void deleteCampaign(Long id);
    
    // Búsqueda y filtrado
    Page<Campaign> searchCampaigns(Long userId, String searchTerm, Pageable pageable);
    Page<Campaign> findByUserIdAndStatus(Long userId, Campaign.CampaignStatus status, Pageable pageable);
    List<Campaign> findScheduledCampaigns(LocalDateTime beforeTime);
    
    // Gestión de estado
    void scheduleCampaign(Long campaignId, LocalDateTime scheduledAt);
    void startCampaign(Long campaignId);
    void pauseCampaign(Long campaignId);
    void resumeCampaign(Long campaignId);
    void cancelCampaign(Long campaignId);
    void completeCampaign(Long campaignId);
    
    // Gestión de destinatarios
    void addTargetList(Long campaignId, CampaignTargetList.TargetType targetType, Long targetId);
    void removeTargetList(Long campaignId, Long targetListId);
    List<CampaignTargetList> getTargetLists(Long campaignId);
    
    // Duplicación
    Campaign duplicateCampaign(Long campaignId, String newName);
    
    // Estadísticas
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, Campaign.CampaignStatus status);
    
    // Validaciones
    boolean canStart(Long campaignId);
    boolean canPause(Long campaignId);
    boolean canCancel(Long campaignId);
}