package com.correos.masivos.contact.domain.service;

import com.correos.masivos.contact.domain.model.ContactList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ContactListService {
    
    // CRUD básico
    ContactList createContactList(ContactList contactList);
    Optional<ContactList> findById(Long id);
    Page<ContactList> findByUserId(Long userId, Pageable pageable);
    ContactList updateContactList(ContactList contactList);
    void deleteContactList(Long id);
    
    // Búsqueda
    Page<ContactList> searchContactLists(Long userId, String searchTerm, Pageable pageable);
    List<ContactList> findActiveListsByUserId(Long userId);
    
    // Validaciones
    boolean existsByNameAndUserId(String name, Long userId);
    long countByUserId(Long userId);
    
    // Operaciones de activación
    void activateContactList(Long id);
    void deactivateContactList(Long id);
}