package com.correos.masivos.template.infrastructure.repository;

import com.correos.masivos.template.domain.model.Template;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Long> {
    
    // Búsqueda básica
    Page<Template> findByUserId(Long userId, Pageable pageable);
    Page<Template> findByUserIdAndStatus(Long userId, Template.TemplateStatus status, Pageable pageable);
    Page<Template> findByUserIdAndType(Long userId, Template.TemplateType type, Pageable pageable);
    
    // Plantillas activas optimizada
    @Query("SELECT t FROM Template t WHERE t.userId = :userId AND t.status = 'ACTIVE' ORDER BY t.updatedAt DESC")
    List<Template> findActiveTemplatesByUserId(@Param("userId") Long userId);
    
    // Búsqueda con texto
    @Query("SELECT t FROM Template t WHERE t.userId = :userId AND " +
           "(LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Template> searchByUserIdAndTerm(@Param("userId") Long userId, 
                                        @Param("searchTerm") String searchTerm, 
                                        Pageable pageable);
    
    // Contadores
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, Template.TemplateStatus status);
    
    // Verificar nombre único por usuario
    boolean existsByUserIdAndNameAndIdNot(Long userId, String name, Long id);
    boolean existsByUserIdAndName(Long userId, String name);
}