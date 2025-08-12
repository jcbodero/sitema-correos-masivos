package com.correos.masivos.template.api.dto;

import com.correos.masivos.template.domain.model.TemplateVariable;
import javax.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class TemplateVariableDTO {
    
    private Long id;
    private Long templateId;
    
    @NotBlank(message = "Nombre de variable es requerido")
    private String name;
    
    private TemplateVariable.VariableType variableType;
    private String defaultValue;
    private String description;
    private Boolean isRequired;
    private LocalDateTime createdAt;

    // Constructors
    public TemplateVariableDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public TemplateVariable.VariableType getVariableType() { return variableType; }
    public void setVariableType(TemplateVariable.VariableType variableType) { this.variableType = variableType; }

    public String getDefaultValue() { return defaultValue; }
    public void setDefaultValue(String defaultValue) { this.defaultValue = defaultValue; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean isRequired) { this.isRequired = isRequired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}