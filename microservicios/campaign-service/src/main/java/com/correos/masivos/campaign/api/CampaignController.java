package com.correos.masivos.campaign.api;

import com.correos.masivos.campaign.api.dto.CampaignDTO;
import com.correos.masivos.campaign.api.dto.CampaignTargetListDTO;
import com.correos.masivos.campaign.domain.model.Campaign;
import com.correos.masivos.campaign.domain.model.CampaignTargetList;
import com.correos.masivos.campaign.domain.service.CampaignService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/campaigns")
public class CampaignController {

    @Autowired
    private CampaignService campaignService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "campaign-service",
            "status", "UP",
            "port", "8083"
        ));
    }

    // === CAMPAÑAS ===
    @PostMapping
    public ResponseEntity<CampaignDTO> createCampaign(@Valid @RequestBody CampaignDTO campaignDTO) {
        Campaign campaign = mapToEntity(campaignDTO);
        Campaign savedCampaign = campaignService.createCampaign(campaign);
        return ResponseEntity.ok(mapToDTO(savedCampaign));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignDTO> getCampaign(@PathVariable Long id) {
        Optional<Campaign> campaign = campaignService.findById(id);
        return campaign.map(c -> ResponseEntity.ok(mapToDTO(c)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<CampaignDTO>> getCampaigns(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Campaign> campaigns;
        if (search != null && !search.trim().isEmpty()) {
            campaigns = campaignService.searchCampaigns(userId, search, pageable);
        } else if (status != null) {
            Campaign.CampaignStatus campaignStatus = Campaign.CampaignStatus.valueOf(status.toUpperCase());
            campaigns = campaignService.findByUserIdAndStatus(userId, campaignStatus, pageable);
        } else {
            campaigns = campaignService.findByUserId(userId, pageable);
        }
        
        return ResponseEntity.ok(campaigns.map(this::mapToDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignDTO> updateCampaign(@PathVariable Long id, @Valid @RequestBody CampaignDTO campaignDTO) {
        Optional<Campaign> existingCampaign = campaignService.findById(id);
        if (existingCampaign.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Campaign campaign = mapToEntity(campaignDTO);
        campaign.setId(id);
        Campaign updatedCampaign = campaignService.updateCampaign(campaign);
        return ResponseEntity.ok(mapToDTO(updatedCampaign));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    // === GESTIÓN DE ESTADO ===
    @PostMapping("/{id}/schedule")
    public ResponseEntity<Void> scheduleCampaign(@PathVariable Long id, @RequestBody Map<String, String> request) {
        LocalDateTime scheduledAt = LocalDateTime.parse(request.get("scheduledAt"));
        campaignService.scheduleCampaign(id, scheduledAt);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<Void> startCampaign(@PathVariable Long id) {
        if (campaignService.canStart(id)) {
            campaignService.startCampaign(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<Void> pauseCampaign(@PathVariable Long id) {
        if (campaignService.canPause(id)) {
            campaignService.pauseCampaign(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<Void> resumeCampaign(@PathVariable Long id) {
        campaignService.resumeCampaign(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelCampaign(@PathVariable Long id) {
        if (campaignService.canCancel(id)) {
            campaignService.cancelCampaign(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    // === GESTIÓN DE DESTINATARIOS ===
    @PostMapping("/{id}/targets")
    public ResponseEntity<Void> addTargetList(@PathVariable Long id, @RequestBody CampaignTargetListDTO targetDTO) {
        campaignService.addTargetList(id, targetDTO.getTargetType(), targetDTO.getTargetId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/targets/{targetId}")
    public ResponseEntity<Void> removeTargetList(@PathVariable Long id, @PathVariable Long targetId) {
        campaignService.removeTargetList(id, targetId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/targets")
    public ResponseEntity<List<CampaignTargetListDTO>> getTargetLists(@PathVariable Long id) {
        List<CampaignTargetList> targetLists = campaignService.getTargetLists(id);
        List<CampaignTargetListDTO> targetDTOs = targetLists.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(targetDTOs);
    }

    // === DUPLICACIÓN ===
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<CampaignDTO> duplicateCampaign(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newName = request.get("name");
        Campaign duplicated = campaignService.duplicateCampaign(id, newName);
        if (duplicated != null) {
            return ResponseEntity.ok(mapToDTO(duplicated));
        }
        return ResponseEntity.notFound().build();
    }

    // === ESTADÍSTICAS ===
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCampaignStats(@RequestParam Long userId) {
        return ResponseEntity.ok(Map.of(
            "totalCampaigns", campaignService.countByUserId(userId),
            "draftCampaigns", campaignService.countByUserIdAndStatus(userId, Campaign.CampaignStatus.DRAFT),
            "scheduledCampaigns", campaignService.countByUserIdAndStatus(userId, Campaign.CampaignStatus.SCHEDULED),
            "sentCampaigns", campaignService.countByUserIdAndStatus(userId, Campaign.CampaignStatus.SENT)
        ));
    }

    // === MAPPERS ===
    private CampaignDTO mapToDTO(Campaign campaign) {
        CampaignDTO dto = new CampaignDTO();
        dto.setId(campaign.getId());
        dto.setName(campaign.getName());
        dto.setSubject(campaign.getSubject());
        dto.setDescription(campaign.getDescription());
        dto.setTemplateId(campaign.getTemplateId());
        dto.setUserId(campaign.getUserId());
        dto.setStatus(campaign.getStatus());
        dto.setSendType(campaign.getSendType());
        dto.setScheduledAt(campaign.getScheduledAt());
        dto.setStartedAt(campaign.getStartedAt());
        dto.setCompletedAt(campaign.getCompletedAt());
        dto.setTotalRecipients(campaign.getTotalRecipients());
        dto.setSentCount(campaign.getSentCount());
        dto.setDeliveredCount(campaign.getDeliveredCount());
        dto.setOpenedCount(campaign.getOpenedCount());
        dto.setClickedCount(campaign.getClickedCount());
        dto.setBouncedCount(campaign.getBouncedCount());
        dto.setUnsubscribedCount(campaign.getUnsubscribedCount());
        dto.setCreatedAt(campaign.getCreatedAt());
        dto.setUpdatedAt(campaign.getUpdatedAt());
        
        // Calcular métricas
        dto.setOpenRate(campaign.getOpenRate());
        dto.setClickRate(campaign.getClickRate());
        dto.setDeliveryRate(campaign.getDeliveryRate());
        
        return dto;
    }

    private Campaign mapToEntity(CampaignDTO dto) {
        Campaign campaign = new Campaign();
        campaign.setId(dto.getId());
        campaign.setName(dto.getName());
        campaign.setSubject(dto.getSubject());
        campaign.setDescription(dto.getDescription());
        campaign.setTemplateId(dto.getTemplateId());
        campaign.setUserId(dto.getUserId());
        campaign.setStatus(dto.getStatus() != null ? dto.getStatus() : Campaign.CampaignStatus.DRAFT);
        campaign.setSendType(dto.getSendType() != null ? dto.getSendType() : Campaign.SendType.IMMEDIATE);
        campaign.setScheduledAt(dto.getScheduledAt());
        return campaign;
    }

    private CampaignTargetListDTO mapToDTO(CampaignTargetList targetList) {
        CampaignTargetListDTO dto = new CampaignTargetListDTO();
        dto.setId(targetList.getId());
        dto.setCampaignId(targetList.getCampaign().getId());
        dto.setTargetType(targetList.getTargetType());
        dto.setTargetId(targetList.getTargetId());
        dto.setAddedAt(targetList.getAddedAt());
        return dto;
    }
}