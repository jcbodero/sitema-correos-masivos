package com.correos.masivos.template.api.dto;

import com.correos.masivos.template.domain.model.Template;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public class TemplateDTO {
    
    private Long id;
    
    @NotBlank(message = "Nombre de plantilla es requerido")
    @Size(max = 255, message = "Nombre no puede exceder 255 caracteres")
    private String name;
    
    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String description;
    
    @NotBlank(message = "Asunto es requerido")
    @Size(max = 500, message = "Asunto no puede exceder 500 caracteres")
    private String subject;
    
    @NotBlank(message = "Contenido HTML es requerido")
    private String htmlContent;
    
    private String textContent;
    private Long userId;
    private Template.TemplateType type;
    private Template.TemplateStatus status;
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Variables de la plantilla
    private List<TemplateVariableDTO> templateVariables;

    // Constructors
    public TemplateDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Template.TemplateType getType() { return type; }
    public void setType(Template.TemplateType type) { this.type = type; }

    public Template.TemplateStatus getStatus() { return status; }
    public void setStatus(Template.TemplateStatus status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }



    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<TemplateVariableDTO> getTemplateVariables() { return templateVariables; }
    public void setTemplateVariables(List<TemplateVariableDTO> templateVariables) { this.templateVariables = templateVariables; }
}