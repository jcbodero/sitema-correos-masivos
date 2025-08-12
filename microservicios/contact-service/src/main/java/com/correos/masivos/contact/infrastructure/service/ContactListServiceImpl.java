package com.correos.masivos.contact.infrastructure.service;

import com.correos.masivos.contact.domain.model.ContactList;
import com.correos.masivos.contact.domain.service.ContactListService;
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
public class ContactListServiceImpl implements ContactListService {

    @Autowired
    private ContactListRepository contactListRepository;

    @Autowired
    private ContactListMembershipRepository membershipRepository;

    @Override
    public ContactList createContactList(ContactList contactList) {
        return contactListRepository.save(contactList);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ContactList> findById(Long id) {
        return contactListRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactList> findByUserId(Long userId, Pageable pageable) {
        return contactListRepository.findByUserId(userId, pageable);
    }

    @Override
    public ContactList updateContactList(ContactList contactList) {
        return contactListRepository.save(contactList);
    }

    @Override
    public void deleteContactList(Long id) {
        // Eliminar membresías primero
        membershipRepository.deleteByContactListId(id);
        // Luego eliminar la lista
        contactListRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ContactList> searchContactLists(Long userId, String searchTerm, Pageable pageable) {
        return contactListRepository.searchByUserIdAndTerm(userId, searchTerm, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactList> findActiveListsByUserId(Long userId) {
        return contactListRepository.findByUserIdAndIsActive(userId, true);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameAndUserId(String name, Long userId) {
        return contactListRepository.existsByNameAndUserId(name, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(Long userId) {
        return contactListRepository.countByUserId(userId);
    }

    @Override
    public void activateContactList(Long id) {
        contactListRepository.findById(id).ifPresent(list -> {
            list.activate();
            contactListRepository.save(list);
        });
    }

    @Override
    public void deactivateContactList(Long id) {
        contactListRepository.findById(id).ifPresent(list -> {
            list.deactivate();
            contactListRepository.save(list);
        });
    }
}