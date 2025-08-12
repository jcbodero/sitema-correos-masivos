package com.correos.masivos.template.api;

import com.correos.masivos.template.api.dto.TemplateDTO;
import com.correos.masivos.template.api.dto.TemplateVariableDTO;
import com.correos.masivos.template.domain.model.Template;
import com.correos.masivos.template.domain.model.TemplateVariable;
import com.correos.masivos.template.domain.service.TemplateService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/templates")
public class TemplateController {

    @Autowired
    private TemplateService templateService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "service", "template-service",
            "status", "UP",
            "port", "8085"
        ));
    }

    // === PLANTILLAS ===
    @PostMapping
    public ResponseEntity<TemplateDTO> createTemplate(@Valid @RequestBody TemplateDTO templateDTO) {
        Template template = mapToEntity(templateDTO);
        Template savedTemplate = templateService.createTemplate(template);
        return ResponseEntity.ok(mapToDTO(savedTemplate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateDTO> getTemplate(@PathVariable Long id) {
        Optional<Template> template = templateService.findById(id);
        return template.map(t -> ResponseEntity.ok(mapToDTO(t)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<TemplateDTO>> getTemplates(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Template> templates;
        if (search != null && !search.trim().isEmpty()) {
            templates = templateService.searchTemplates(userId, search, pageable);
        } else if (status != null) {
            Template.TemplateStatus templateStatus = Template.TemplateStatus.valueOf(status.toUpperCase());
            templates = templateService.findByUserIdAndStatus(userId, templateStatus, pageable);
        } else if (type != null) {
            Template.TemplateType templateType = Template.TemplateType.valueOf(type.toUpperCase());
            templates = templateService.findByUserIdAndType(userId, templateType, pageable);
        } else {
            templates = templateService.findByUserId(userId, pageable);
        }
        
        return ResponseEntity.ok(templates.map(this::mapToDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TemplateDTO> updateTemplate(@PathVariable Long id, @Valid @RequestBody TemplateDTO templateDTO) {
        Optional<Template> existingTemplate = templateService.findById(id);
        if (existingTemplate.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Template template = mapToEntity(templateDTO);
        template.setId(id);
        Template updatedTemplate = templateService.updateTemplate(template);
        return ResponseEntity.ok(mapToDTO(updatedTemplate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // === GESTIÓN DE ESTADO ===
    @PostMapping("/{id}/activate")
    public ResponseEntity<Void> activateTemplate(@PathVariable Long id) {
        templateService.activateTemplate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<Void> archiveTemplate(@PathVariable Long id) {
        templateService.archiveTemplate(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateTemplate(@PathVariable Long id) {
        templateService.deactivateTemplate(id);
        return ResponseEntity.ok().build();
    }

    // === RENDERIZADO ===
    @PostMapping("/{id}/render")
    public ResponseEntity<String> renderTemplate(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        String rendered = templateService.renderTemplate(id, data);
        return rendered != null ? ResponseEntity.ok(rendered) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/render/subject")
    public ResponseEntity<String> renderSubject(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        String rendered = templateService.renderSubject(id, data);
        return rendered != null ? ResponseEntity.ok(rendered) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/render/html")
    public ResponseEntity<String> renderHtmlContent(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        String rendered = templateService.renderHtmlContent(id, data);
        return rendered != null ? ResponseEntity.ok(rendered) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/render/text")
    public ResponseEntity<String> renderTextContent(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        String rendered = templateService.renderTextContent(id, data);
        return rendered != null ? ResponseEntity.ok(rendered) : ResponseEntity.notFound().build();
    }

    // === VISTA PREVIA ===
    @PostMapping("/{id}/preview")
    public ResponseEntity<Map<String, String>> previewTemplate(@PathVariable Long id, @RequestBody Map<String, Object> sampleData) {
        Map<String, String> preview = templateService.previewTemplate(id, sampleData);
        return ResponseEntity.ok(preview);
    }

    // === VARIABLES ===
    @GetMapping("/{id}/variables")
    public ResponseEntity<List<TemplateVariableDTO>> getTemplateVariables(@PathVariable Long id) {
        List<TemplateVariable> variables = templateService.getTemplateVariables(id);
        List<TemplateVariableDTO> variableDTOs = variables.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(variableDTOs);
    }

    @PostMapping("/{id}/variables")
    public ResponseEntity<TemplateVariableDTO> addVariable(@PathVariable Long id, @Valid @RequestBody TemplateVariableDTO variableDTO) {
        TemplateVariable variable = mapToEntity(variableDTO);
        TemplateVariable savedVariable = templateService.addVariable(id, variable);
        return ResponseEntity.ok(mapToDTO(savedVariable));
    }

    @DeleteMapping("/{id}/variables/{variableId}")
    public ResponseEntity<Void> removeVariable(@PathVariable Long id, @PathVariable Long variableId) {
        templateService.removeVariable(id, variableId);
        return ResponseEntity.ok().build();
    }

    // === DUPLICACIÓN ===
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<TemplateDTO> duplicateTemplate(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newName = request.get("name");
        Template duplicated = templateService.duplicateTemplate(id, newName);
        if (duplicated != null) {
            return ResponseEntity.ok(mapToDTO(duplicated));
        }
        return ResponseEntity.notFound().build();
    }

    // === VALIDACIÓN ===
    @GetMapping("/{id}/validate")
    public ResponseEntity<Map<String, Object>> validateTemplate(@PathVariable Long id) {
        List<String> errors = templateService.validateTemplate(id);
        boolean isValid = errors.isEmpty();
        
        return ResponseEntity.ok(Map.of(
            "isValid", isValid,
            "errors", errors
        ));
    }

    // === PLANTILLAS ACTIVAS ===
    @GetMapping("/active")
    public ResponseEntity<List<TemplateDTO>> getActiveTemplates(@RequestParam Long userId) {
        List<Template> activeTemplates = templateService.findActiveTemplatesByUserId(userId);
        List<TemplateDTO> templateDTOs = activeTemplates.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(templateDTOs);
    }

    // === ESTADÍSTICAS ===
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTemplateStats(@RequestParam Long userId) {
        return ResponseEntity.ok(Map.of(
            "totalTemplates", templateService.countByUserId(userId),
            "draftTemplates", templateService.countByUserIdAndStatus(userId, Template.TemplateStatus.DRAFT),
            "activeTemplates", templateService.countByUserIdAndStatus(userId, Template.TemplateStatus.ACTIVE),
            "archivedTemplates", templateService.countByUserIdAndStatus(userId, Template.TemplateStatus.ARCHIVED)
        ));
    }

    // === MAPPERS ===
    private TemplateDTO mapToDTO(Template template) {
        TemplateDTO dto = new TemplateDTO();
        dto.setId(template.getId());
        dto.setName(template.getName());
        dto.setDescription(template.getDescription());
        dto.setSubject(template.getSubject());
        dto.setHtmlContent(template.getHtmlContent());
        dto.setTextContent(template.getTextContent());
        dto.setUserId(template.getUserId());
        dto.setType(template.getType());
        dto.setStatus(template.getStatus());
        dto.setIsActive(template.getIsActive());

        dto.setCreatedAt(template.getCreatedAt());
        dto.setUpdatedAt(template.getUpdatedAt());
        return dto;
    }

    private Template mapToEntity(TemplateDTO dto) {
        Template template = new Template();
        template.setId(dto.getId());
        template.setName(dto.getName());
        template.setDescription(dto.getDescription());
        template.setSubject(dto.getSubject());
        template.setHtmlContent(dto.getHtmlContent());
        template.setTextContent(dto.getTextContent());
        template.setUserId(dto.getUserId());
        template.setType(dto.getType() != null ? dto.getType() : Template.TemplateType.EMAIL);
        template.setStatus(dto.getStatus() != null ? dto.getStatus() : Template.TemplateStatus.DRAFT);
        template.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        return template;
    }

    private TemplateVariableDTO mapToDTO(TemplateVariable variable) {
        TemplateVariableDTO dto = new TemplateVariableDTO();
        dto.setId(variable.getId());
        dto.setTemplateId(variable.getTemplate().getId());
        dto.setName(variable.getName());
        dto.setVariableType(variable.getVariableType());
        dto.setDefaultValue(variable.getDefaultValue());
        dto.setDescription(variable.getDescription());
        dto.setIsRequired(variable.getIsRequired());
        dto.setCreatedAt(variable.getCreatedAt());
        return dto;
    }

    private TemplateVariable mapToEntity(TemplateVariableDTO dto) {
        TemplateVariable variable = new TemplateVariable();
        variable.setId(dto.getId());
        variable.setName(dto.getName());
        variable.setVariableType(dto.getVariableType() != null ? dto.getVariableType() : TemplateVariable.VariableType.TEXT);
        variable.setDefaultValue(dto.getDefaultValue());
        variable.setDescription(dto.getDescription());
        variable.setIsRequired(dto.getIsRequired() != null ? dto.getIsRequired() : false);
        return variable;
    }
}