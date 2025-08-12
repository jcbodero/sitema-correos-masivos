package com.correos.masivos.contact.infrastructure.repository;

import com.correos.masivos.contact.domain.model.ContactListMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactListMembershipRepository extends JpaRepository<ContactListMembership, Long> {
    
    // Búsqueda de membresías
    Optional<ContactListMembership> findByContactIdAndContactListId(Long contactId, Long contactListId);
    List<ContactListMembership> findByContactId(Long contactId);
    List<ContactListMembership> findByContactListId(Long contactListId);
    
    // Validaciones
    boolean existsByContactIdAndContactListId(Long contactId, Long contactListId);
    
    // Contadores
    long countByContactListId(Long contactListId);
    long countByContactId(Long contactId);
    
    // Eliminación
    void deleteByContactIdAndContactListId(Long contactId, Long contactListId);
    void deleteByContactListId(Long contactListId);
    void deleteByContactId(Long contactId);
}