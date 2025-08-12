package com.correos.masivos.campaign.infrastructure.repository;

import com.correos.masivos.campaign.domain.model.CampaignTargetList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignTargetListRepository extends JpaRepository<CampaignTargetList, Long> {
    
    List<CampaignTargetList> findByCampaignId(Long campaignId);
    void deleteByCampaignId(Long campaignId);
    boolean existsByCampaignIdAndTargetTypeAndTargetId(Long campaignId, 
                                                       CampaignTargetList.TargetType targetType, 
                                                       Long targetId);
}