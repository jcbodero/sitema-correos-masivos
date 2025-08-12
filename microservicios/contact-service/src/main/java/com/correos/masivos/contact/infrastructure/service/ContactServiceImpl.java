package com.correos.masivos.contact.infrastructure.service;

import com.correos.masivos.contact.domain.model.Contact;
import com.correos.masivos.contact.domain.model.ContactListMembership;
import com.correos.masivos.contact.domain.service.ContactService;
import com.correos.masivos.contact.infrastructure.repository.ContactRepository;
import com.correos.masivos.contact.infrastructure.repository.ContactListRepository;
import com.correos.masivos.contact.infrastructure.repository.ContactListMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactListRepository contactListRepository;

    @Autowired
    private ContactListMembershipRepository membershipRepository;

    @Override
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Contact> findById(Long id) {
        return contactRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Contact> findByEmailAndUserId(String email, Long userId) {
        return contactRepository.findByEmailAndUserId(email, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> findByUserId(Long userId, Pageable pageable) {
        return contactRepository.findByUserId(userId, pageable);
    }

    @Override
    public Contact updateContact(Contact contact) {
        return contactRepository.save(contact);
    }

    @Override
    public void deleteContact(Long id) {
        // Eliminar membresías primero
        membershipRepository.deleteByContactId(id);
        // Luego eliminar el contacto
        contactRepository.deleteById(id);
    }

    @Override
    public void unsubscribeContact(Long id) {
        contactRepository.findById(id).ifPresent(contact -> {
            contact.unsubscribe();
            contactRepository.save(contact);
        });
    }

    @Override
    public void resubscribeContact(Long id) {
        contactRepository.findById(id).ifPresent(contact -> {
            contact.resubscribe();
            contactRepository.save(contact);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> searchContacts(Long userId, String searchTerm, Pageable pageable) {
        return contactRepository.searchByUserIdAndTerm(userId, searchTerm, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> findActiveContacts(Long userId, Pageable pageable) {
        return contactRepository.findByUserIdAndIsActive(userId, true, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> findSubscribedContacts(Long userId, Pageable pageable) {
        return contactRepository.findByUserIdAndIsSubscribed(userId, true, pageable);
    }

    @Override
    public void addContactToList(Long contactId, Long listId) {
        if (!membershipRepository.existsByContactIdAndContactListId(contactId, listId)) {
            var contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
            var contactList = contactListRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Contact list not found"));
            
            var membership = new ContactListMembership(contact, contactList, null);
            membershipRepository.save(membership);
        }
    }

    @Override
    public void removeContactFromList(Long contactId, Long listId) {
        membershipRepository.deleteByContactIdAndContactListId(contactId, listId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contact> findContactsByListId(Long listId) {
        return contactRepository.findByContactListId(listId);
    }

    @Override
    public List<Contact> createContactsBatch(List<Contact> contacts) {
        return contactRepository.saveAll(contacts);
    }

    @Override
    public void deleteContactsBatch(List<Long> contactIds) {
        // Eliminar membresías primero
        contactIds.forEach(membershipRepository::deleteByContactId);
        // Luego eliminar contactos
        contactRepository.deleteByIdIn(contactIds);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmailAndUserId(String email, Long userId) {
        return contactRepository.existsByEmailAndUserId(email, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        return contactRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countActiveByUserId(Long userId) {
        return contactRepository.countByUserIdAndIsActive(userId, true);
    }

    @Override
    @Transactional(readOnly = true)
    public long countSubscribedByUserId(Long userId) {
        return contactRepository.countByUserIdAndIsSubscribed(userId, true);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnsubscribedByUserId(Long userId) {
        return contactRepository.countByUserIdAndIsSubscribed(userId, false);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Contact> findContactsInList(Long listId, Pageable pageable) {
        return contactRepository.findByContactListId(listId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public long countContactsInList(Long listId) {
        return contactRepository.countByContactListId(listId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countActiveContactsInList(Long listId) {
        return contactRepository.countByContactListIdAndIsActive(listId, true);
    }

    @Override
    @Transactional(readOnly = true)
    public long countSubscribedContactsInList(Long listId) {
        return contactRepository.countByContactListIdAndIsSubscribed(listId, true);
    }
}