package com.correos.masivos.template.domain.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "templates")
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nombre de plantilla es requerido")
    @Size(max = 255, message = "Nombre no puede exceder 255 caracteres")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String description;

    @NotBlank(message = "Asunto es requerido")
    @Size(max = 500, message = "Asunto no puede exceder 500 caracteres")
    @Column(nullable = false)
    private String subject;

    @NotBlank(message = "Contenido HTML es requerido")
    @Column(name = "html_content", nullable = false, columnDefinition = "TEXT")
    private String htmlContent;

    @Column(name = "text_content", columnDefinition = "TEXT")
    private String textContent;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    private TemplateType type = TemplateType.EMAIL;

    @Enumerated(EnumType.STRING)
    private TemplateStatus status = TemplateStatus.DRAFT;

    @Column(name = "is_active")
    private Boolean isActive = true;



    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "template", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TemplateVariable> templateVariables = new ArrayList<>();

    public enum TemplateType {
        EMAIL, SMS, PUSH_NOTIFICATION
    }

    public enum TemplateStatus {
        DRAFT, ACTIVE, ARCHIVED
    }

    public Template() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Template(String name, String subject, String htmlContent, Long userId) {
        this();
        this.name = name;
        this.subject = subject;
        this.htmlContent = htmlContent;
        this.userId = userId;
    }

    // Business methods
    public void activate() {
        this.status = TemplateStatus.ACTIVE;
        this.isActive = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void archive() {
        this.status = TemplateStatus.ARCHIVED;
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void deactivate() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public String renderSubject(Map<String, Object> data) {
        return renderTemplate(this.subject, data);
    }

    public String renderHtmlContent(Map<String, Object> data) {
        return renderTemplate(this.htmlContent, data);
    }

    public String renderTextContent(Map<String, Object> data) {
        if (this.textContent == null) return null;
        return renderTemplate(this.textContent, data);
    }

    private String renderTemplate(String template, Map<String, Object> data) {
        if (template == null || data == null) return template;
        
        String result = template;
        for (Map.Entry<String, Object> entry : data.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            result = result.replace(placeholder, value);
        }
        return result;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

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

    public TemplateType getType() { return type; }
    public void setType(TemplateType type) { this.type = type; }

    public TemplateStatus getStatus() { return status; }
    public void setStatus(TemplateStatus status) { this.status = status; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }



    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<TemplateVariable> getTemplateVariables() { return templateVariables; }
    public void setTemplateVariables(List<TemplateVariable> templateVariables) { this.templateVariables = templateVariables; }
}