package com.correos.masivos.contact.domain.service;

import com.correos.masivos.contact.domain.model.Contact;
import com.correos.masivos.contact.domain.model.ContactList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ContactService {
    
    // CRUD básico
    Contact createContact(Contact contact);
    Optional<Contact> findById(Long id);
    Optional<Contact> findByEmailAndUserId(String email, Long userId);
    Page<Contact> findByUserId(Long userId, Pageable pageable);
    Contact updateContact(Contact contact);
    void deleteContact(Long id);
    
    // Operaciones de suscripción
    void unsubscribeContact(Long id);
    void resubscribeContact(Long id);
    
    // Búsqueda y filtrado
    Page<Contact> searchContacts(Long userId, String searchTerm, Pageable pageable);
    Page<Contact> findActiveContacts(Long userId, Pageable pageable);
    Page<Contact> findSubscribedContacts(Long userId, Pageable pageable);
    
    // Gestión de listas
    void addContactToList(Long contactId, Long listId);
    void removeContactFromList(Long contactId, Long listId);
    List<Contact> findContactsByListId(Long listId);
    
    // Operaciones masivas
    List<Contact> createContactsBatch(List<Contact> contacts);
    void deleteContactsBatch(List<Long> contactIds);
    
    // Validaciones
    boolean existsByEmailAndUserId(String email, Long userId);
    long countByUserId(Long userId);
    long countActiveByUserId(Long userId);
    long countSubscribedByUserId(Long userId);
    long countUnsubscribedByUserId(Long userId);
    
    // Estadísticas por lista
    Page<Contact> findContactsInList(Long listId, Pageable pageable);
    long countContactsInList(Long listId);
    long countActiveContactsInList(Long listId);
    long countSubscribedContactsInList(Long listId);
}