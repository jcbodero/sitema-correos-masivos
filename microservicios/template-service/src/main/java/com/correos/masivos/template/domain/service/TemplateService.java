package com.correos.masivos.template.domain.service;

import com.correos.masivos.template.domain.model.Template;
import com.correos.masivos.template.domain.model.TemplateVariable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface TemplateService {
    
    // CRUD básico
    Template createTemplate(Template template);
    Optional<Template> findById(Long id);
    Page<Template> findByUserId(Long userId, Pageable pageable);
    Template updateTemplate(Template template);
    void deleteTemplate(Long id);
    
    // Búsqueda y filtrado
    Page<Template> searchTemplates(Long userId, String searchTerm, Pageable pageable);
    Page<Template> findByUserIdAndStatus(Long userId, Template.TemplateStatus status, Pageable pageable);
    Page<Template> findByUserIdAndType(Long userId, Template.TemplateType type, Pageable pageable);
    List<Template> findActiveTemplatesByUserId(Long userId);
    
    // Gestión de estado
    void activateTemplate(Long templateId);
    void archiveTemplate(Long templateId);
    void deactivateTemplate(Long templateId);
    
    // Renderizado
    String renderTemplate(Long templateId, Map<String, Object> data);
    String renderSubject(Long templateId, Map<String, Object> data);
    String renderHtmlContent(Long templateId, Map<String, Object> data);
    String renderTextContent(Long templateId, Map<String, Object> data);
    
    // Vista previa
    Map<String, String> previewTemplate(Long templateId, Map<String, Object> sampleData);
    
    // Variables
    List<TemplateVariable> getTemplateVariables(Long templateId);
    TemplateVariable addVariable(Long templateId, TemplateVariable variable);
    void removeVariable(Long templateId, Long variableId);
    
    // Duplicación
    Template duplicateTemplate(Long templateId, String newName);
    
    // Validación
    List<String> validateTemplate(Long templateId);
    boolean isTemplateValid(Long templateId);
    
    // Estadísticas
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, Template.TemplateStatus status);
}