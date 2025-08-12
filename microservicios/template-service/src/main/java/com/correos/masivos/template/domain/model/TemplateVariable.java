package com.correos.masivos.template.domain.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Entity
@Table(name = "template_variables")
public class TemplateVariable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @NotBlank(message = "Nombre de variable es requerido")
    @Column(name = "variable_name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "variable_type")
    private VariableType variableType = VariableType.TEXT;

    @Column(name = "default_value")
    private String defaultValue;

    private String description;

    @Column(name = "is_required")
    private Boolean isRequired = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum VariableType {
        TEXT, NUMBER, DATE, EMAIL, URL, BOOLEAN
    }

    public TemplateVariable() {
        this.createdAt = LocalDateTime.now();
    }

    public TemplateVariable(Template template, String name, VariableType variableType) {
        this();
        this.template = template;
        this.name = name;
        this.variableType = variableType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Template getTemplate() { return template; }
    public void setTemplate(Template template) { this.template = template; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public VariableType getVariableType() { return variableType; }
    public void setVariableType(VariableType variableType) { this.variableType = variableType; }

    public String getDefaultValue() { return defaultValue; }
    public void setDefaultValue(String defaultValue) { this.defaultValue = defaultValue; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean isRequired) { this.isRequired = isRequired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}