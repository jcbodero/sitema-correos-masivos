package com.correos.masivos.contact.domain.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_list_memberships")
public class ContactListMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_list_id", nullable = false)
    private ContactList contactList;

    @Column(name = "added_at")
    private LocalDateTime addedAt;

    @Column(name = "added_by")
    private Long addedBy;

    public ContactListMembership() {
        this.addedAt = LocalDateTime.now();
    }

    public ContactListMembership(Contact contact, ContactList contactList, Long addedBy) {
        this();
        this.contact = contact;
        this.contactList = contactList;
        this.addedBy = addedBy;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }

    public ContactList getContactList() { return contactList; }
    public void setContactList(ContactList contactList) { this.contactList = contactList; }

    public LocalDateTime getAddedAt() { return addedAt; }
    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    public Long getAddedBy() { return addedBy; }
    public void setAddedBy(Long addedBy) { this.addedBy = addedBy; }
}