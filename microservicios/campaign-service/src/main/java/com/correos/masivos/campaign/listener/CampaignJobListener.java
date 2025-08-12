package com.correos.masivos.campaign.listener;

import com.correos.masivos.campaign.domain.model.Campaign;
import com.correos.masivos.campaign.domain.model.CampaignTargetList;
import com.correos.masivos.campaign.domain.service.CampaignService;
import com.correos.masivos.queue.config.RabbitConfig;
import com.correos.masivos.queue.model.CampaignJob;
import com.correos.masivos.queue.model.EmailJob;
import com.correos.masivos.queue.service.QueueService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Component
public class CampaignJobListener {

    private static final Logger logger = LoggerFactory.getLogger(CampaignJobListener.class);

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private QueueService queueService;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${AUTH0_SERVICE_TOKEN:}")
    private String serviceToken;

    @RabbitListener(queues = RabbitConfig.CAMPAIGN_QUEUE)
    public void processCampaignJob(CampaignJob campaignJob) {
        logger.info("=== RECIBIDO TRABAJO DE CAMPAÑA ===\ncampaignId={}, jobType={}, userId={}", 
                   campaignJob.getCampaignId(), campaignJob.getJobType(), campaignJob.getUserId());

        try {
            switch (campaignJob.getJobType()) {
                case START_CAMPAIGN:
                    logger.info("Procesando START_CAMPAIGN para campaña: {}", campaignJob.getCampaignId());
                    handleStartCampaign(campaignJob);
                    break;
                case PROCESS_BATCH:
                    logger.info("Procesando PROCESS_BATCH para campaña: {}", campaignJob.getCampaignId());
                    handleProcessBatch(campaignJob);
                    break;
                case PAUSE_CAMPAIGN:
                    logger.info("Procesando PAUSE_CAMPAIGN para campaña: {}", campaignJob.getCampaignId());
                    handlePauseCampaign(campaignJob);
                    break;
                case RESUME_CAMPAIGN:
                    logger.info("Procesando RESUME_CAMPAIGN para campaña: {}", campaignJob.getCampaignId());
                    handleResumeCampaign(campaignJob);
                    break;
                case CANCEL_CAMPAIGN:
                    logger.info("Procesando CANCEL_CAMPAIGN para campaña: {}", campaignJob.getCampaignId());
                    handleCancelCampaign(campaignJob);
                    break;
                default:
                    logger.warn("Tipo de trabajo de campaña no reconocido: {}", campaignJob.getJobType());
            }

            logger.info("=== TRABAJO DE CAMPAÑA COMPLETADO ===\ncampaignId={}, jobType={}", 
                       campaignJob.getCampaignId(), campaignJob.getJobType());

        } catch (Exception e) {
            logger.error("=== ERROR EN TRABAJO DE CAMPAÑA ===\ncampaignId={}, error: {}", 
                        campaignJob.getCampaignId(), e.getMessage(), e);
            throw e;
        }
    }

    private void handleStartCampaign(CampaignJob campaignJob) {
        logger.info("Iniciando campaña: {}", campaignJob.getCampaignId());
        
        // This should not be called anymore since we send PROCESS_BATCH directly
        // But keeping for backward compatibility
        createBatchJobs(campaignJob);
    }

    private void handleProcessBatch(CampaignJob campaignJob) {
        logger.info("=== INICIANDO PROCESAMIENTO DE LOTE ===\ncampaignId: {}", campaignJob.getCampaignId());
        
        try {
            // 1. Obtener información de la campaña
            logger.info("Paso 1: Obteniendo información de la campaña: {}", campaignJob.getCampaignId());
            Campaign campaign = campaignService.findById(campaignJob.getCampaignId()).orElse(null);
            if (campaign == null) {
                logger.error("ERROR: Campaña no encontrada: {}", campaignJob.getCampaignId());
                return;
            }
            logger.info("Campaña encontrada: {} - Estado: {} - TemplateId: {}", 
                       campaign.getName(), campaign.getStatus(), campaign.getTemplateId());

            // 2. Obtener listas objetivo de la campaña
            logger.info("Paso 2: Obteniendo listas objetivo para campaña: {}", campaignJob.getCampaignId());
            List<CampaignTargetList> targetLists = campaignService.getTargetLists(campaignJob.getCampaignId());
            if (targetLists.isEmpty()) {
                logger.warn("ADVERTENCIA: No hay listas objetivo para la campaña: {}", campaignJob.getCampaignId());
                // Marcar campaña como completada si no hay destinatarios
                campaignService.completeCampaign(campaignJob.getCampaignId());
                return;
            }
            logger.info("Encontradas {} listas objetivo", targetLists.size());

            // 3. Obtener plantilla HTML
            logger.info("Paso 3: Obteniendo plantilla HTML: {}", campaign.getTemplateId());
            String templateContent = getTemplateContent(campaign.getTemplateId());
            if (templateContent == null) {
                logger.error("ERROR: No se pudo obtener la plantilla: {}", campaign.getTemplateId());
                return;
            }
            logger.info("Plantilla obtenida exitosamente, longitud: {} caracteres", templateContent.length());

            // 4. Procesar cada lista objetivo
            logger.info("Paso 4: Procesando listas objetivo");
            int totalEmailsSent = 0;
            for (CampaignTargetList targetList : targetLists) {
                logger.info("Procesando lista objetivo: tipo={}, id={}", 
                           targetList.getTargetType(), targetList.getTargetId());
                
                List<Map<String, Object>> recipients = getRecipients(targetList);
                logger.info("Encontrados {} destinatarios en la lista", recipients.size());
                
                for (Map<String, Object> recipient : recipients) {
                    try {
                        EmailJob emailJob = createEmailJob(campaign, recipient, templateContent);
                        queueService.sendEmailJob(emailJob);
                        totalEmailsSent++;
                        
                        if (totalEmailsSent % 10 == 0) {
                            logger.info("Enviados {} emails hasta ahora...", totalEmailsSent);
                        }
                    } catch (Exception e) {
                        logger.error("Error enviando email a: {}", recipient.get("email"), e);
                    }
                }
            }

            logger.info("=== LOTE PROCESADO EXITOSAMENTE ===\ncampaignId: {}, emails enviados: {}", 
                       campaignJob.getCampaignId(), totalEmailsSent);
            
            // Marcar campaña como completada
            if (totalEmailsSent > 0) {
                campaignService.completeCampaign(campaignJob.getCampaignId());
                logger.info("Campaña marcada como completada: {}", campaignJob.getCampaignId());
            }

        } catch (Exception e) {
            logger.error("=== ERROR PROCESANDO LOTE ===\ncampaignId: {}, error: {}", 
                        campaignJob.getCampaignId(), e.getMessage(), e);
            throw e;
        }
    }

    private void handlePauseCampaign(CampaignJob campaignJob) {
        logger.info("Pausando campaña: {}", campaignJob.getCampaignId());
        
        if (campaignService.canPause(campaignJob.getCampaignId())) {
            campaignService.pauseCampaign(campaignJob.getCampaignId());
        }
    }

    private void handleResumeCampaign(CampaignJob campaignJob) {
        logger.info("Reanudando campaña: {}", campaignJob.getCampaignId());
        campaignService.resumeCampaign(campaignJob.getCampaignId());
    }

    private void handleCancelCampaign(CampaignJob campaignJob) {
        logger.info("Cancelando campaña: {}", campaignJob.getCampaignId());
        
        if (campaignService.canCancel(campaignJob.getCampaignId())) {
            campaignService.cancelCampaign(campaignJob.getCampaignId());
        }
    }

    private void createBatchJobs(CampaignJob campaignJob) {
        // This would create multiple PROCESS_BATCH jobs based on campaign configuration
        // For now, create a single batch job as example
        
        CampaignJob batchJob = new CampaignJob(
            campaignJob.getCampaignId(), 
            campaignJob.getUserId(), 
            CampaignJob.JobType.PROCESS_BATCH
        );
        
        batchJob.setBatchSize(campaignJob.getBatchSize());
        batchJob.setDelayBetweenBatches(campaignJob.getDelayBetweenBatches());
        
        queueService.sendCampaignJob(batchJob);
        
        logger.info("Trabajo de lote creado para campaña: {}", campaignJob.getCampaignId());
    }

    private String getTemplateContent(Long templateId) {
        try {
            String url = "http://correos-template-service:8085/templates/" + templateId;
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(serviceToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, new ParameterizedTypeReference<Map<String, Object>>() {});
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("htmlContent");
            }
        } catch (Exception e) {
            logger.error("Error obteniendo plantilla: {}", templateId, e);
        }
        return null;
    }

    private List<Map<String, Object>> getRecipients(CampaignTargetList targetList) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(serviceToken);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            String url;
            if (targetList.getTargetType() == CampaignTargetList.TargetType.LIST) {
                url = "http://correos-contact-service:8082/contacts/list/" + targetList.getTargetId() + "/contacts";
                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, new ParameterizedTypeReference<Map<String, Object>>() {});
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    Map<String, Object> pageResponse = response.getBody();
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> content = (List<Map<String, Object>>) pageResponse.get("content");
                    return content != null ? content : List.of();
                }
            } else {
                // Para contacto individual
                url = "http://correos-contact-service:8082/contacts/" + targetList.getTargetId();
                ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, new ParameterizedTypeReference<Map<String, Object>>() {});
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    return List.of(response.getBody());
                }
            }
        } catch (Exception e) {
            logger.error("Error obteniendo destinatarios: targetType={}, targetId={}", 
                        targetList.getTargetType(), targetList.getTargetId(), e);
        }
        return List.of();
    }

    private EmailJob createEmailJob(Campaign campaign, Map<String, Object> recipient, String templateContent) {
        String recipientEmail = (String) recipient.get("email");
        String recipientName = (String) recipient.get("name");
        Long recipientId = ((Number) recipient.get("id")).longValue();
        
        // Personalizar contenido con datos del destinatario
        String personalizedContent = personalizeContent(templateContent, recipient);
        
        EmailJob emailJob = new EmailJob(
            campaign.getId(),
            recipientId,
            recipientEmail,
            campaign.getSubject(),
            personalizedContent,
            "noreply@correos-masivos.com"
        );
        
        emailJob.setFromName("Sistema de Correos Masivos");
        emailJob.setPersonalizationData(new HashMap<>(recipient));
        
        return emailJob;
    }
    
    private String personalizeContent(String content, Map<String, Object> recipient) {
        String personalizedContent = content;
        
        // Reemplazar variables comunes
        if (recipient.get("name") != null) {
            personalizedContent = personalizedContent.replace("{{name}}", (String) recipient.get("name"));
            personalizedContent = personalizedContent.replace("{{nombre}}", (String) recipient.get("name"));
        }
        
        if (recipient.get("email") != null) {
            personalizedContent = personalizedContent.replace("{{email}}", (String) recipient.get("email"));
        }
        
        if (recipient.get("company") != null) {
            personalizedContent = personalizedContent.replace("{{company}}", (String) recipient.get("company"));
            personalizedContent = personalizedContent.replace("{{empresa}}", (String) recipient.get("company"));
        }
        
        return personalizedContent;
    }
}