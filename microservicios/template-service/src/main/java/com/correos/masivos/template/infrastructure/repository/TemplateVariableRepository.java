package com.correos.masivos.template.infrastructure.repository;

import com.correos.masivos.template.domain.model.TemplateVariable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateVariableRepository extends JpaRepository<TemplateVariable, Long> {
    
    List<TemplateVariable> findByTemplateId(Long templateId);
    void deleteByTemplateId(Long templateId);
    boolean existsByTemplateIdAndName(Long templateId, String name);
}