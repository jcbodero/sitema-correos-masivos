package com.correos.masivos.contact.api.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.time.LocalDateTime;

public class ContactDTO {
    
    private Long id;
    
    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe tener formato válido")
    private String email;
    
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;
    
    @Size(max = 100, message = "Apellido no puede exceder 100 caracteres")
    private String lastName;
    
    @Size(max = 20, message = "Teléfono no puede exceder 20 caracteres")
    private String phone;
    
    @Size(max = 255, message = "Empresa no puede exceder 255 caracteres")
    private String company;
    
    @Size(max = 255, message = "Posición no puede exceder 255 caracteres")
    private String position;
    
    @Size(max = 100, message = "País no puede exceder 100 caracteres")
    private String country;
    
    @Size(max = 100, message = "Ciudad no puede exceder 100 caracteres")
    private String city;
    
    private String customFields;
    private Boolean isActive;
    private Boolean isSubscribed;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime unsubscribedAt;

    // Constructors
    public ContactDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCustomFields() { return customFields; }
    public void setCustomFields(String customFields) { this.customFields = customFields; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsSubscribed() { return isSubscribed; }
    public void setIsSubscribed(Boolean isSubscribed) { this.isSubscribed = isSubscribed; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getUnsubscribedAt() { return unsubscribedAt; }
    public void setUnsubscribedAt(LocalDateTime unsubscribedAt) { this.unsubscribedAt = unsubscribedAt; }
}