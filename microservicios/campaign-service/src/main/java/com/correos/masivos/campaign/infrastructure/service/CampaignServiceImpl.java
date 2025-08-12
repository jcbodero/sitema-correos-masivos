package com.correos.masivos.campaign.infrastructure.service;

import com.correos.masivos.campaign.domain.model.Campaign;
import com.correos.masivos.campaign.domain.model.CampaignTargetList;
import com.correos.masivos.campaign.domain.service.CampaignService;
import com.correos.masivos.campaign.infrastructure.repository.CampaignRepository;
import com.correos.masivos.campaign.infrastructure.repository.CampaignTargetListRepository;
import com.correos.masivos.queue.model.CampaignJob;
import com.correos.masivos.queue.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CampaignServiceImpl implements CampaignService {

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private CampaignTargetListRepository targetListRepository;

    @Autowired
    private QueueService queueService;

    @Override
    public Campaign createCampaign(Campaign campaign) {
        return campaignRepository.save(campaign);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Campaign> findById(Long id) {
        return campaignRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Campaign> findByUserId(Long userId, Pageable pageable) {
        return campaignRepository.findByUserId(userId, pageable);
    }

    @Override
    public Campaign updateCampaign(Campaign campaign) {
        return campaignRepository.save(campaign);
    }

    @Override
    public void deleteCampaign(Long id) {
        targetListRepository.deleteByCampaignId(id);
        campaignRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Campaign> searchCampaigns(Long userId, String searchTerm, Pageable pageable) {
        return campaignRepository.searchByUserIdAndTerm(userId, searchTerm, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Campaign> findByUserIdAndStatus(Long userId, Campaign.CampaignStatus status, Pageable pageable) {
        return campaignRepository.findByUserIdAndStatus(userId, status, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Campaign> findScheduledCampaigns(LocalDateTime beforeTime) {
        return campaignRepository.findScheduledCampaignsBefore(beforeTime);
    }

    @Override
    public void scheduleCampaign(Long campaignId, LocalDateTime scheduledAt) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            campaign.schedule(scheduledAt);
            campaignRepository.save(campaign);
            
            // Send delayed campaign job to queue
            CampaignJob campaignJob = new CampaignJob(campaignId, campaign.getUserId(), CampaignJob.JobType.START_CAMPAIGN);
            campaignJob.setCampaignName(campaign.getName());
            queueService.sendDelayedCampaignJob(campaignJob, scheduledAt);
        });
    }

    @Override
    public void startCampaign(Long campaignId) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            if (canStart(campaignId)) {
                campaign.start();
                campaignRepository.save(campaign);
                
                // Send campaign job to queue for batch processing
                CampaignJob campaignJob = new CampaignJob(campaignId, campaign.getUserId(), CampaignJob.JobType.PROCESS_BATCH);
                campaignJob.setCampaignName(campaign.getName());
                campaignJob.setBatchSize(100); // Default batch size
                campaignJob.setDelayBetweenBatches(1000); // 1 second delay
                queueService.sendCampaignJob(campaignJob);
            }
        });
    }

    @Override
    public void pauseCampaign(Long campaignId) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            if (canPause(campaignId)) {
                campaign.pause();
                campaignRepository.save(campaign);
            }
        });
    }

    @Override
    public void resumeCampaign(Long campaignId) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            if (campaign.getStatus() == Campaign.CampaignStatus.PAUSED) {
                campaign.start();
                campaignRepository.save(campaign);
            }
        });
    }

    @Override
    public void cancelCampaign(Long campaignId) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            if (canCancel(campaignId)) {
                campaign.cancel();
                campaignRepository.save(campaign);
            }
        });
    }

    @Override
    public void completeCampaign(Long campaignId) {
        campaignRepository.findById(campaignId).ifPresent(campaign -> {
            campaign.complete();
            campaignRepository.save(campaign);
        });
    }

    @Override
    public void addTargetList(Long campaignId, CampaignTargetList.TargetType targetType, Long targetId) {
        if (!targetListRepository.existsByCampaignIdAndTargetTypeAndTargetId(campaignId, targetType, targetId)) {
            campaignRepository.findById(campaignId).ifPresent(campaign -> {
                CampaignTargetList targetList = new CampaignTargetList(campaign, targetType, targetId);
                targetListRepository.save(targetList);
            });
        }
    }

    @Override
    public void removeTargetList(Long campaignId, Long targetListId) {
        targetListRepository.deleteById(targetListId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampaignTargetList> getTargetLists(Long campaignId) {
        return targetListRepository.findByCampaignId(campaignId);
    }

    @Override
    public Campaign duplicateCampaign(Long campaignId, String newName) {
        return campaignRepository.findById(campaignId).map(original -> {
            Campaign duplicate = new Campaign();
            duplicate.setName(newName);
            duplicate.setSubject(original.getSubject());
            duplicate.setDescription(original.getDescription());
            duplicate.setTemplateId(original.getTemplateId());
            duplicate.setUserId(original.getUserId());
            duplicate.setStatus(Campaign.CampaignStatus.DRAFT);
            
            Campaign saved = campaignRepository.save(duplicate);
            
            // Copiar listas objetivo
            List<CampaignTargetList> originalTargets = targetListRepository.findByCampaignId(campaignId);
            for (CampaignTargetList target : originalTargets) {
                CampaignTargetList newTarget = new CampaignTargetList(saved, target.getTargetType(), target.getTargetId());
                targetListRepository.save(newTarget);
            }
            
            return saved;
        }).orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        return campaignRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserIdAndStatus(Long userId, Campaign.CampaignStatus status) {
        return campaignRepository.countByUserIdAndStatus(userId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canStart(Long campaignId) {
        return campaignRepository.findById(campaignId)
            .map(campaign -> campaign.getStatus() == Campaign.CampaignStatus.DRAFT || 
                           campaign.getStatus() == Campaign.CampaignStatus.SCHEDULED ||
                           campaign.getStatus() == Campaign.CampaignStatus.PAUSED)
            .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canPause(Long campaignId) {
        return campaignRepository.findById(campaignId)
            .map(campaign -> campaign.getStatus() == Campaign.CampaignStatus.SENDING)
            .orElse(false);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canCancel(Long campaignId) {
        return campaignRepository.findById(campaignId)
            .map(campaign -> campaign.getStatus() != Campaign.CampaignStatus.SENT &&
                           campaign.getStatus() != Campaign.CampaignStatus.CANCELLED)
            .orElse(false);
    }
}