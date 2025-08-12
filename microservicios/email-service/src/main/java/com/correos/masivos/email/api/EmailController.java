package com.correos.masivos.email.api;

import com.correos.masivos.email.api.dto.BulkEmailRequest;
import com.correos.masivos.email.api.dto.BulkEmailResponse;
import com.correos.masivos.email.api.dto.EmailLogDTO;
import com.correos.masivos.email.api.dto.EmailResponse;
import com.correos.masivos.email.api.dto.SendEmailRequest;
import com.correos.masivos.email.domain.model.EmailLog;
import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.service.EmailService;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/emails")
public class EmailController {

    private static final Logger logger = LoggerFactory.getLogger(EmailController.class);

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private com.correos.masivos.email.infrastructure.repository.EmailLogRepository emailLogRepository;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "email-service",
            "status", "UP",
            "port", "8084"
        ));
    }

    @PostMapping("/send")
    public ResponseEntity<EmailResponse> sendEmail(@Valid @RequestBody SendEmailRequest request) {
        EmailMessage message = new EmailMessage(
            request.getTo(),
            request.getFrom() != null ? request.getFrom() : "noreply@correos-masivos.com",
            request.getFromName() != null ? request.getFromName() : "Correos Masivos",
            request.getSubject(),
            request.getHtmlContent(),
            request.getTextContent(),
            request.getPersonalizations()
        );
        message.setCampaignId(request.getCampaignId());
        message.setRecipientId(request.getRecipientId());

        EmailLog emailLog = emailService.sendEmail(message);
        
        return ResponseEntity.ok(new EmailResponse(
            emailLog.getStatus().name().equals("SENT"),
            emailLog.getStatus().name().equals("SENT") ? "Email enviado exitosamente" : "Error al enviar el email",
            emailLog.getId()
        ));
    }

    @PostMapping("/send/bulk")
    public ResponseEntity<BulkEmailResponse> sendBulkEmails(@Valid @RequestBody BulkEmailRequest request) {
        List<EmailMessage> messages = new ArrayList<>();
        
        for (BulkEmailRequest.EmailRecipient recipient : request.getRecipients()) {
            // Merge global and individual personalizations
            Map<String, String> personalizations = new HashMap<>();
            if (request.getGlobalPersonalizations() != null) {
                personalizations.putAll(request.getGlobalPersonalizations());
            }
            if (recipient.getPersonalizations() != null) {
                personalizations.putAll(recipient.getPersonalizations());
            }
            
            EmailMessage message = new EmailMessage(
                recipient.getEmail(),
                request.getFrom() != null ? request.getFrom() : "noreply@correos-masivos.com",
                request.getFromName() != null ? request.getFromName() : "Correos Masivos",
                request.getSubject(),
                request.getHtmlContent(),
                request.getTextContent(),
                personalizations
            );
            message.setCampaignId(request.getCampaignId());
            message.setRecipientId(recipient.getRecipientId());
            message.setTrackOpens(request.getTrackOpens());
            message.setTrackClicks(request.getTrackClicks());
            
            messages.add(message);
        }
        
        List<EmailLog> results = emailService.sendEmailBatch(messages);
        
        // Process results
        List<BulkEmailResponse.EmailResult> emailResults = new ArrayList<>();
        int successfulEmails = 0;
        int failedEmails = 0;
        
        for (int i = 0; i < results.size(); i++) {
            EmailLog emailLog = results.get(i);
            BulkEmailRequest.EmailRecipient recipient = request.getRecipients().get(i);
            
            boolean success = emailLog.getStatus() == EmailLog.EmailStatus.SENT;
            if (success) {
                successfulEmails++;
            } else {
                failedEmails++;
            }
            
            emailResults.add(new BulkEmailResponse.EmailResult(
                recipient.getEmail(),
                emailLog.getId(),
                success,
                success ? null : emailLog.getErrorMessage()
            ));
        }
        
        BulkEmailResponse response = new BulkEmailResponse(
            results.size(),
            successfulEmails,
            failedEmails,
            emailResults
        );
        
        // Log bulk email statistics
        logger.info("Bulk email completed: {} total, {} successful, {} failed", 
                   results.size(), successfulEmails, failedEmails);
        
        return ResponseEntity.ok(response);
    }

    // === GESTIÓN DE LOGS ===
    @GetMapping("/{id}")
    public ResponseEntity<EmailLogDTO> getEmailLog(@PathVariable Long id) {
        Optional<EmailLog> emailLog = emailService.findById(id);
        return emailLog.map(log -> ResponseEntity.ok(mapToDTO(log)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<EmailLogDTO>> getEmailLogs(
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<EmailLog> emailLogs;
        if (campaignId != null && status != null) {
            EmailLog.EmailStatus emailStatus = EmailLog.EmailStatus.valueOf(status.toUpperCase());
            emailLogs = emailService.findByCampaignId(campaignId, pageable);
        } else if (campaignId != null) {
            emailLogs = emailService.findByCampaignId(campaignId, pageable);
        } else if (status != null) {
            EmailLog.EmailStatus emailStatus = EmailLog.EmailStatus.valueOf(status.toUpperCase());
            emailLogs = emailService.findByStatus(emailStatus, pageable);
        } else {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(emailLogs.map(this::mapToDTO));
    }

    // === REINTENTOS ===
    @PostMapping("/campaigns/{campaignId}/retry")
    public ResponseEntity<Void> retryFailedEmails(@PathVariable Long campaignId) {
        emailService.retryFailedEmails(campaignId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/campaigns/{campaignId}/failed")
    public ResponseEntity<List<EmailLogDTO>> getFailedEmails(@PathVariable Long campaignId) {
        List<EmailLog> failedEmails = emailService.getFailedEmails(campaignId);
        List<EmailLogDTO> failedDTOs = failedEmails.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(failedDTOs);
    }

    // === WEBHOOKS ===
    @PostMapping("/webhooks/delivery")
    public ResponseEntity<Void> handleDeliveryWebhook(@RequestBody Map<String, Object> payload) {
        String externalId = (String) payload.get("externalId");
        String event = (String) payload.get("event");
        LocalDateTime timestamp = LocalDateTime.now();
        
        emailService.handleDeliveryEvent(externalId, event, timestamp);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/webhooks/open")
    public ResponseEntity<Void> handleOpenWebhook(@RequestBody Map<String, Object> payload) {
        String externalId = (String) payload.get("externalId");
        LocalDateTime timestamp = LocalDateTime.now();
        
        emailService.handleOpenEvent(externalId, timestamp);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/webhooks/click")
    public ResponseEntity<Void> handleClickWebhook(@RequestBody Map<String, Object> payload) {
        String externalId = (String) payload.get("externalId");
        LocalDateTime timestamp = LocalDateTime.now();
        
        emailService.handleClickEvent(externalId, timestamp);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/webhooks/bounce")
    public ResponseEntity<Void> handleBounceWebhook(@RequestBody Map<String, Object> payload) {
        String externalId = (String) payload.get("externalId");
        String reason = (String) payload.get("reason");
        LocalDateTime timestamp = LocalDateTime.now();
        
        emailService.handleBounceEvent(externalId, reason, timestamp);
        return ResponseEntity.ok().build();
    }

    // === HISTORIAL DE ENVÍOS ===
    @GetMapping("/history")
    public ResponseEntity<Page<EmailLogDTO>> getEmailHistory(
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type, // 'single' or 'bulk'
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<EmailLog> emailLogs;
        
        if (campaignId != null && status != null) {
            EmailLog.EmailStatus emailStatus = EmailLog.EmailStatus.valueOf(status.toUpperCase());
            emailLogs = emailService.findByCampaignId(campaignId, pageable);
        } else if (campaignId != null) {
            emailLogs = emailService.findByCampaignId(campaignId, pageable);
        } else if (status != null) {
            EmailLog.EmailStatus emailStatus = EmailLog.EmailStatus.valueOf(status.toUpperCase());
            emailLogs = emailService.findByStatus(emailStatus, pageable);
        } else {
            // Get all emails
            emailLogs = emailLogRepository.findAll(pageable);
        }
        
        return ResponseEntity.ok(emailLogs.map(this::mapToDTO));
    }

    // === ESTADÍSTICAS ===
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getEmailStats(
            @RequestParam(required = false) Long campaignId) {
        
        if (campaignId != null) {
            return ResponseEntity.ok(Map.of(
                "totalEmails", emailService.countByCampaignIdAndStatus(campaignId, null),
                "sentEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.SENT),
                "deliveredEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.DELIVERED),
                "openedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.OPENED),
                "clickedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.CLICKED),
                "bouncedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.BOUNCED),
                "failedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.FAILED)
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "totalEmails", emailService.countByStatus(null),
                "sentEmails", emailService.countByStatus(EmailLog.EmailStatus.SENT),
                "deliveredEmails", emailService.countByStatus(EmailLog.EmailStatus.DELIVERED),
                "openedEmails", emailService.countByStatus(EmailLog.EmailStatus.OPENED),
                "clickedEmails", emailService.countByStatus(EmailLog.EmailStatus.CLICKED),
                "bouncedEmails", emailService.countByStatus(EmailLog.EmailStatus.BOUNCED),
                "failedEmails", emailService.countByStatus(EmailLog.EmailStatus.FAILED)
            ));
        }
    }
    
    @GetMapping("/stats/detailed")
    public ResponseEntity<com.correos.masivos.email.api.dto.EmailStatsDTO> getDetailedEmailStats(
            @RequestParam(required = false) Long campaignId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        
        LocalDateTime from = null;
        LocalDateTime to = null;
        
        try {
            if (fromDate != null && !fromDate.isEmpty()) {
                from = LocalDateTime.parse(fromDate + "T00:00:00");
            }
            if (toDate != null && !toDate.isEmpty()) {
                to = LocalDateTime.parse(toDate + "T23:59:59");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        
        com.correos.masivos.email.api.dto.EmailStatsDTO stats = emailService.getDetailedStats(campaignId, from, to);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/stats/realtime")
    public ResponseEntity<Map<String, Object>> getRealtimeStats(
            @RequestParam(required = false) Long campaignId) {
        
        Map<String, Object> realtimeStats = new HashMap<>();
        
        if (campaignId != null) {
            // Campaign-specific real-time stats
            realtimeStats.put("campaignId", campaignId);
            realtimeStats.put("totalEmails", emailService.countByCampaignIdAndStatus(campaignId, null));
            realtimeStats.put("sentEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.SENT));
            realtimeStats.put("deliveredEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.DELIVERED));
            realtimeStats.put("openedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.OPENED));
            realtimeStats.put("clickedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.CLICKED));
            realtimeStats.put("bouncedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.BOUNCED));
            realtimeStats.put("failedEmails", emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.FAILED));
            
            // Calculate rates
            long sent = emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.SENT);
            long delivered = emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.DELIVERED);
            long opened = emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.OPENED);
            long clicked = emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.CLICKED);
            long bounced = emailService.countByCampaignIdAndStatus(campaignId, EmailLog.EmailStatus.BOUNCED);
            
            realtimeStats.put("deliveryRate", sent > 0 ? (delivered * 100.0 / sent) : 0.0);
            realtimeStats.put("openRate", delivered > 0 ? (opened * 100.0 / delivered) : 0.0);
            realtimeStats.put("clickRate", opened > 0 ? (clicked * 100.0 / opened) : 0.0);
            realtimeStats.put("bounceRate", sent > 0 ? (bounced * 100.0 / sent) : 0.0);
        } else {
            // Global real-time stats
            realtimeStats.put("totalEmails", emailService.countByStatus(null));
            realtimeStats.put("sentEmails", emailService.countByStatus(EmailLog.EmailStatus.SENT));
            realtimeStats.put("deliveredEmails", emailService.countByStatus(EmailLog.EmailStatus.DELIVERED));
            realtimeStats.put("openedEmails", emailService.countByStatus(EmailLog.EmailStatus.OPENED));
            realtimeStats.put("clickedEmails", emailService.countByStatus(EmailLog.EmailStatus.CLICKED));
            realtimeStats.put("bouncedEmails", emailService.countByStatus(EmailLog.EmailStatus.BOUNCED));
            realtimeStats.put("failedEmails", emailService.countByStatus(EmailLog.EmailStatus.FAILED));
            
            // Calculate global rates
            long sent = emailService.countByStatus(EmailLog.EmailStatus.SENT);
            long delivered = emailService.countByStatus(EmailLog.EmailStatus.DELIVERED);
            long opened = emailService.countByStatus(EmailLog.EmailStatus.OPENED);
            long clicked = emailService.countByStatus(EmailLog.EmailStatus.CLICKED);
            long bounced = emailService.countByStatus(EmailLog.EmailStatus.BOUNCED);
            
            realtimeStats.put("deliveryRate", sent > 0 ? (delivered * 100.0 / sent) : 0.0);
            realtimeStats.put("openRate", delivered > 0 ? (opened * 100.0 / delivered) : 0.0);
            realtimeStats.put("clickRate", opened > 0 ? (clicked * 100.0 / opened) : 0.0);
            realtimeStats.put("bounceRate", sent > 0 ? (bounced * 100.0 / sent) : 0.0);
        }
        
        realtimeStats.put("timestamp", LocalDateTime.now());
        realtimeStats.put("type", "realtime");
        
        return ResponseEntity.ok(realtimeStats);
    }

    // === MAPPERS ===
    private EmailLogDTO mapToDTO(EmailLog emailLog) {
        EmailLogDTO dto = new EmailLogDTO();
        dto.setId(emailLog.getId());
        dto.setCampaignId(emailLog.getCampaignId());
        dto.setRecipientId(emailLog.getRecipientId());
        dto.setToEmail(emailLog.getToEmail());
        dto.setSubject(emailLog.getSubject());
        dto.setFromEmail(emailLog.getFromEmail());
        dto.setFromName(emailLog.getFromName());
        dto.setStatus(emailLog.getStatus());
        dto.setSmtpProvider(emailLog.getSmtpProvider());
        dto.setExternalId(emailLog.getExternalId());
        dto.setSentAt(emailLog.getSentAt());
        dto.setDeliveredAt(emailLog.getDeliveredAt());
        dto.setOpenedAt(emailLog.getOpenedAt());
        dto.setClickedAt(emailLog.getClickedAt());
        dto.setBouncedAt(emailLog.getBouncedAt());
        dto.setErrorMessage(emailLog.getErrorMessage());
        dto.setRetryCount(emailLog.getRetryCount());
        dto.setCreatedAt(emailLog.getCreatedAt());
        dto.setUpdatedAt(emailLog.getUpdatedAt());
        return dto;
    }
}