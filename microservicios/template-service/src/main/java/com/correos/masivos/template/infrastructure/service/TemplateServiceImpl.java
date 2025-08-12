package com.correos.masivos.template.infrastructure.service;

import com.correos.masivos.template.domain.model.Template;
import com.correos.masivos.template.domain.model.TemplateVariable;
import com.correos.masivos.template.domain.service.TemplateService;
import com.correos.masivos.template.infrastructure.repository.TemplateRepository;
import com.correos.masivos.template.infrastructure.repository.TemplateVariableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class TemplateServiceImpl implements TemplateService {

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private TemplateVariableRepository templateVariableRepository;

    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\{\\{([^}]+)\\}\\}");

    @Override
    public Template createTemplate(Template template) {
        // Validate unique name per user
        if (templateRepository.existsByUserIdAndName(template.getUserId(), template.getName())) {
            throw new IllegalArgumentException("Ya existe una plantilla con ese nombre");
        }
        
        Template saved = templateRepository.save(template);
        
        // Extract and save variables
        extractAndSaveVariables(saved);
        
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Template> findById(Long id) {
        return templateRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Template> findByUserId(Long userId, Pageable pageable) {
        return templateRepository.findByUserId(userId, pageable);
    }

    @Override
    public Template updateTemplate(Template template) {
        // Validate unique name per user (excluding current template)
        if (templateRepository.existsByUserIdAndNameAndIdNot(
                template.getUserId(), template.getName(), template.getId())) {
            throw new IllegalArgumentException("Ya existe una plantilla con ese nombre");
        }
        
        Template updated = templateRepository.save(template);
        
        // Update variables
        templateVariableRepository.deleteByTemplateId(template.getId());
        extractAndSaveVariables(updated);
        
        return updated;
    }

    @Override
    public void deleteTemplate(Long id) {
        templateVariableRepository.deleteByTemplateId(id);
        templateRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Template> searchTemplates(Long userId, String searchTerm, Pageable pageable) {
        return templateRepository.searchByUserIdAndTerm(userId, searchTerm, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Template> findByUserIdAndStatus(Long userId, Template.TemplateStatus status, Pageable pageable) {
        return templateRepository.findByUserIdAndStatus(userId, status, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Template> findByUserIdAndType(Long userId, Template.TemplateType type, Pageable pageable) {
        return templateRepository.findByUserIdAndType(userId, type, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Template> findActiveTemplatesByUserId(Long userId) {
        return templateRepository.findActiveTemplatesByUserId(userId);
    }

    @Override
    public void activateTemplate(Long templateId) {
        templateRepository.findById(templateId).ifPresent(template -> {
            template.activate();
            templateRepository.save(template);
        });
    }

    @Override
    public void archiveTemplate(Long templateId) {
        templateRepository.findById(templateId).ifPresent(template -> {
            template.archive();
            templateRepository.save(template);
        });
    }

    @Override
    public void deactivateTemplate(Long templateId) {
        templateRepository.findById(templateId).ifPresent(template -> {
            template.deactivate();
            templateRepository.save(template);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public String renderTemplate(Long templateId, Map<String, Object> data) {
        return templateRepository.findById(templateId)
                .map(template -> template.renderHtmlContent(data))
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public String renderSubject(Long templateId, Map<String, Object> data) {
        return templateRepository.findById(templateId)
                .map(template -> template.renderSubject(data))
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public String renderHtmlContent(Long templateId, Map<String, Object> data) {
        return templateRepository.findById(templateId)
                .map(template -> template.renderHtmlContent(data))
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public String renderTextContent(Long templateId, Map<String, Object> data) {
        return templateRepository.findById(templateId)
                .map(template -> template.renderTextContent(data))
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> previewTemplate(Long templateId, Map<String, Object> sampleData) {
        return templateRepository.findById(templateId)
                .map(template -> {
                    Map<String, String> preview = new HashMap<>();
                    preview.put("subject", template.renderSubject(sampleData));
                    preview.put("htmlContent", template.renderHtmlContent(sampleData));
                    preview.put("textContent", template.renderTextContent(sampleData));
                    return preview;
                })
                .orElse(new HashMap<>());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TemplateVariable> getTemplateVariables(Long templateId) {
        return templateVariableRepository.findByTemplateId(templateId);
    }

    @Override
    public TemplateVariable addVariable(Long templateId, TemplateVariable variable) {
        if (templateVariableRepository.existsByTemplateIdAndName(templateId, variable.getName())) {
            throw new IllegalArgumentException("Ya existe una variable con ese nombre");
        }
        
        return templateRepository.findById(templateId)
                .map(template -> {
                    variable.setTemplate(template);
                    return templateVariableRepository.save(variable);
                })
                .orElseThrow(() -> new IllegalArgumentException("Plantilla no encontrada"));
    }

    @Override
    public void removeVariable(Long templateId, Long variableId) {
        templateVariableRepository.deleteById(variableId);
    }

    @Override
    public Template duplicateTemplate(Long templateId, String newName) {
        return templateRepository.findById(templateId)
                .map(original -> {
                    Template duplicate = new Template();
                    duplicate.setName(newName);
                    duplicate.setDescription(original.getDescription());
                    duplicate.setSubject(original.getSubject());
                    duplicate.setHtmlContent(original.getHtmlContent());
                    duplicate.setTextContent(original.getTextContent());
                    duplicate.setUserId(original.getUserId());
                    duplicate.setType(original.getType());
                    duplicate.setStatus(Template.TemplateStatus.DRAFT);

                    
                    Template saved = templateRepository.save(duplicate);
                    
                    // Copy variables
                    List<TemplateVariable> originalVariables = templateVariableRepository.findByTemplateId(templateId);
                    for (TemplateVariable originalVar : originalVariables) {
                        TemplateVariable newVar = new TemplateVariable();
                        newVar.setTemplate(saved);
                        newVar.setName(originalVar.getName());
                        newVar.setVariableType(originalVar.getVariableType());
                        newVar.setDefaultValue(originalVar.getDefaultValue());
                        newVar.setDescription(originalVar.getDescription());
                        newVar.setIsRequired(originalVar.getIsRequired());
                        templateVariableRepository.save(newVar);
                    }
                    
                    return saved;
                })
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> validateTemplate(Long templateId) {
        List<String> errors = new ArrayList<>();
        
        templateRepository.findById(templateId).ifPresent(template -> {
            // Validate required fields
            if (template.getName() == null || template.getName().trim().isEmpty()) {
                errors.add("Nombre de plantilla es requerido");
            }
            if (template.getSubject() == null || template.getSubject().trim().isEmpty()) {
                errors.add("Asunto es requerido");
            }
            if (template.getHtmlContent() == null || template.getHtmlContent().trim().isEmpty()) {
                errors.add("Contenido HTML es requerido");
            }
            
            // Validate variables exist
            Set<String> usedVariables = extractVariableNames(template);
            List<TemplateVariable> definedVariables = templateVariableRepository.findByTemplateId(templateId);
            Set<String> definedVariableNames = new HashSet<>();
            
            for (TemplateVariable var : definedVariables) {
                definedVariableNames.add(var.getName());
            }
            
            for (String usedVar : usedVariables) {
                if (!definedVariableNames.contains(usedVar)) {
                    errors.add("Variable no definida: " + usedVar);
                }
            }
        });
        
        return errors;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTemplateValid(Long templateId) {
        return validateTemplate(templateId).isEmpty();
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        return templateRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserIdAndStatus(Long userId, Template.TemplateStatus status) {
        return templateRepository.countByUserIdAndStatus(userId, status);
    }

    private void extractAndSaveVariables(Template template) {
        Set<String> variableNames = extractVariableNames(template);
        
        for (String varName : variableNames) {
            if (!templateVariableRepository.existsByTemplateIdAndName(template.getId(), varName)) {
                TemplateVariable variable = new TemplateVariable();
                variable.setTemplate(template);
                variable.setName(varName);
                variable.setVariableType(TemplateVariable.VariableType.TEXT);
                templateVariableRepository.save(variable);
            }
        }
    }

    private Set<String> extractVariableNames(Template template) {
        Set<String> variables = new HashSet<>();
        
        extractVariablesFromText(template.getSubject(), variables);
        extractVariablesFromText(template.getHtmlContent(), variables);
        extractVariablesFromText(template.getTextContent(), variables);
        
        return variables;
    }

    private void extractVariablesFromText(String text, Set<String> variables) {
        if (text == null) return;
        
        Matcher matcher = VARIABLE_PATTERN.matcher(text);
        while (matcher.find()) {
            variables.add(matcher.group(1).trim());
        }
    }
}