package com.correos.masivos.contact.infrastructure.repository;

import com.correos.masivos.contact.domain.model.ContactList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactListRepository extends JpaRepository<ContactList, Long> {
    
    // Búsqueda básica
    Page<ContactList> findByUserId(Long userId, Pageable pageable);
    List<ContactList> findByUserIdAndIsActive(Long userId, Boolean isActive);
    
    // Búsqueda con texto
    @Query("SELECT cl FROM ContactList cl WHERE cl.userId = :userId AND " +
           "(LOWER(cl.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(cl.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<ContactList> searchByUserIdAndTerm(@Param("userId") Long userId, 
                                           @Param("searchTerm") String searchTerm, 
                                           Pageable pageable);
    
    // Validaciones
    boolean existsByNameAndUserId(String name, Long userId);
    
    // Contadores
    long countByUserId(Long userId);
    long countByUserIdAndIsActive(Long userId, Boolean isActive);
}