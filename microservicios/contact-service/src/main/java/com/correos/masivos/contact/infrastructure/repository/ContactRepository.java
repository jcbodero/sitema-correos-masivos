package com.correos.masivos.contact.infrastructure.repository;

import com.correos.masivos.contact.domain.model.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    // Búsqueda básica
    Optional<Contact> findByEmailAndUserId(String email, Long userId);
    Page<Contact> findByUserId(Long userId, Pageable pageable);
    Page<Contact> findByUserIdAndIsActive(Long userId, Boolean isActive, Pageable pageable);
    Page<Contact> findByUserIdAndIsSubscribed(Long userId, Boolean isSubscribed, Pageable pageable);
    
    // Búsqueda con texto
    @Query("SELECT c FROM Contact c WHERE c.userId = :userId AND " +
           "(LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.company) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Contact> searchByUserIdAndTerm(@Param("userId") Long userId, 
                                       @Param("searchTerm") String searchTerm, 
                                       Pageable pageable);
    
    // Contactos por lista
    @Query("SELECT c FROM Contact c JOIN ContactListMembership clm ON c.id = clm.contact.id " +
           "WHERE clm.contactList.id = :listId")
    List<Contact> findByContactListId(@Param("listId") Long listId);
    
    @Query("SELECT c FROM Contact c JOIN ContactListMembership clm ON c.id = clm.contact.id " +
           "WHERE clm.contactList.id = :listId")
    Page<Contact> findByContactListId(@Param("listId") Long listId, Pageable pageable);
    
    // Validaciones
    boolean existsByEmailAndUserId(String email, Long userId);
    
    // Contadores
    long countByUserId(Long userId);
    long countByUserIdAndIsActive(Long userId, Boolean isActive);
    long countByUserIdAndIsSubscribed(Long userId, Boolean isSubscribed);
    
    // Contadores por lista
    @Query("SELECT COUNT(c) FROM Contact c JOIN ContactListMembership clm ON c.id = clm.contact.id " +
           "WHERE clm.contactList.id = :listId")
    long countByContactListId(@Param("listId") Long listId);
    
    @Query("SELECT COUNT(c) FROM Contact c JOIN ContactListMembership clm ON c.id = clm.contact.id " +
           "WHERE clm.contactList.id = :listId AND c.isActive = :isActive")
    long countByContactListIdAndIsActive(@Param("listId") Long listId, @Param("isActive") Boolean isActive);
    
    @Query("SELECT COUNT(c) FROM Contact c JOIN ContactListMembership clm ON c.id = clm.contact.id " +
           "WHERE clm.contactList.id = :listId AND c.isSubscribed = :isSubscribed")
    long countByContactListIdAndIsSubscribed(@Param("listId") Long listId, @Param("isSubscribed") Boolean isSubscribed);
    
    // Operaciones masivas
    @Query("SELECT c FROM Contact c WHERE c.id IN :ids")
    List<Contact> findByIdIn(@Param("ids") List<Long> ids);
    
    void deleteByIdIn(List<Long> ids);
}