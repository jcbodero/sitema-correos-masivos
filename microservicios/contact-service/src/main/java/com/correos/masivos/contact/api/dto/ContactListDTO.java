package com.correos.masivos.contact.api.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;

public class ContactListDTO {
    
    private Long id;
    
    @NotBlank(message = "Nombre de lista es requerido")
    @Size(max = 255, message = "Nombre no puede exceder 255 caracteres")
    private String name;
    
    @Size(max = 1000, message = "Descripción no puede exceder 1000 caracteres")
    private String description;
    
    private Long userId;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long contactCount;

    // Constructors
    public ContactListDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getContactCount() { return contactCount; }
    public void setContactCount(Long contactCount) { this.contactCount = contactCount; }
}