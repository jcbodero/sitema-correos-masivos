package com.correos.masivos.contact.infrastructure.repository;

import com.correos.masivos.contact.domain.model.ContactImport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactImportRepository extends JpaRepository<ContactImport, Long> {
    
    // Búsqueda básica
    Page<ContactImport> findByUserId(Long userId, Pageable pageable);
    Page<ContactImport> findByUserIdAndStatus(Long userId, ContactImport.ImportStatus status, Pageable pageable);
    
    // Importaciones recientes
    @Query("SELECT ci FROM ContactImport ci WHERE ci.userId = :userId ORDER BY ci.createdAt DESC")
    List<ContactImport> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);
    
    // Contadores
    long countByUserIdAndStatus(Long userId, ContactImport.ImportStatus status);
    long countByUserId(Long userId);
    
    // Búsqueda por estado
    List<ContactImport> findByStatus(ContactImport.ImportStatus status);
}