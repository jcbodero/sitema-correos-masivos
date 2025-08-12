package com.correos.masivos.contact;

import com.correos.masivos.contact.api.ContactController;
import com.correos.masivos.contact.api.dto.ContactDTO;
import com.correos.masivos.contact.api.dto.ContactListDTO;
import com.correos.masivos.contact.domain.service.ContactService;
import com.correos.masivos.contact.domain.service.ContactListService;
import com.correos.masivos.contact.domain.service.ContactImportService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
class ContactServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ContactService contactService;

    @MockBean
    private ContactListService contactListService;

    @MockBean
    private ContactImportService contactImportService;

    @Test
    void healthCheck_ShouldReturnOK() throws Exception {
        mockMvc.perform(get("/contacts/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.service").value("contact-service"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.port").value("8082"));
    }

    @Test
    void createContact_WithValidData_ShouldReturnCreated() throws Exception {
        ContactDTO contact = new ContactDTO();
        contact.setEmail("test@example.com");
        contact.setFirstName("John");
        contact.setLastName("Doe");
        contact.setUserId(1L);

        mockMvc.perform(post("/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contact)))
                .andExpect(status().isOk());
    }

    @Test
    void createContact_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        ContactDTO contact = new ContactDTO();
        contact.setEmail("invalid-email");
        contact.setFirstName("John");
        contact.setUserId(1L);

        mockMvc.perform(post("/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contact)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getContacts_WithValidUserId_ShouldReturnContacts() throws Exception {
        mockMvc.perform(get("/contacts")
                .param("userId", "1")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void createContactList_WithValidData_ShouldReturnCreated() throws Exception {
        ContactListDTO list = new ContactListDTO();
        list.setName("Test List");
        list.setDescription("Test Description");
        list.setUserId(1L);

        mockMvc.perform(post("/contacts/lists")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(list)))
                .andExpect(status().isOk());
    }

    @Test
    void importCSV_WithValidFile_ShouldReturnSuccess() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", 
                "contacts.csv", 
                "text/csv", 
                "email,firstName,lastName\ntest@example.com,John,Doe".getBytes()
        );

        mockMvc.perform(multipart("/contacts/import/csv")
                .file(file)
                .param("userId", "1")
                .param("fieldMapping", "email=email,firstName=firstName,lastName=lastName"))
                .andExpect(status().isOk());
    }

    @Test
    void getContactStats_WithValidUserId_ShouldReturnStats() throws Exception {
        mockMvc.perform(get("/contacts/stats")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalContacts").exists())
                .andExpect(jsonPath("$.activeContacts").exists())
                .andExpect(jsonPath("$.subscribedContacts").exists());
    }

    @Test
    void unsubscribeContact_WithValidId_ShouldReturnOK() throws Exception {
        mockMvc.perform(post("/contacts/1/unsubscribe"))
                .andExpect(status().isOk());
    }

    @Test
    void addContactToList_WithValidIds_ShouldReturnOK() throws Exception {
        mockMvc.perform(post("/contacts/1/lists/1"))
                .andExpect(status().isOk());
    }
}