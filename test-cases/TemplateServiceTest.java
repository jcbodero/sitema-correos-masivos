package com.correos.masivos.template;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
class TemplateServiceTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void healthCheck_ShouldReturnOK() throws Exception {
        setup();
        mockMvc.perform(get("/templates/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.service").value("template-service"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.port").value("8085"));
    }

    @Test
    void createTemplate_WithValidData_ShouldReturnCreated() throws Exception {
        setup();
        Map<String, Object> template = new HashMap<>();
        template.put("name", "Test Template");
        template.put("subject", "Test Subject");
        template.put("htmlContent", "<h1>Hello {{firstName}}</h1>");
        template.put("textContent", "Hello {{firstName}}");
        template.put("userId", 1L);

        mockMvc.perform(post("/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(template)))
                .andExpect(status().isOk());
    }

    @Test
    void createTemplate_WithEmptyName_ShouldReturnBadRequest() throws Exception {
        setup();
        Map<String, Object> template = new HashMap<>();
        template.put("name", "");
        template.put("subject", "Test Subject");
        template.put("htmlContent", "<h1>Test</h1>");
        template.put("userId", 1L);

        mockMvc.perform(post("/templates")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(template)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getTemplates_WithValidUserId_ShouldReturnTemplates() throws Exception {
        setup();
        mockMvc.perform(get("/templates")
                .param("userId", "1")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void renderTemplate_WithValidData_ShouldReturnRendered() throws Exception {
        setup();
        Map<String, Object> request = new HashMap<>();
        request.put("templateId", 1L);
        Map<String, String> variables = new HashMap<>();
        variables.put("firstName", "John");
        variables.put("lastName", "Doe");
        request.put("variables", variables);

        mockMvc.perform(post("/templates/render")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.renderedHtml").exists())
                .andExpect(jsonPath("$.renderedText").exists());
    }

    @Test
    void previewTemplate_WithValidData_ShouldReturnPreview() throws Exception {
        setup();
        Map<String, Object> request = new HashMap<>();
        request.put("htmlContent", "<h1>Hello {{firstName}} {{lastName}}</h1>");
        request.put("textContent", "Hello {{firstName}} {{lastName}}");
        Map<String, String> variables = new HashMap<>();
        variables.put("firstName", "John");
        variables.put("lastName", "Doe");
        request.put("variables", variables);

        mockMvc.perform(post("/templates/preview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.renderedHtml").exists())
                .andExpect(jsonPath("$.renderedText").exists());
    }

    @Test
    void validateTemplate_WithValidTemplate_ShouldReturnValid() throws Exception {
        setup();
        Map<String, Object> request = new HashMap<>();
        request.put("htmlContent", "<h1>Hello {{firstName}}</h1>");
        request.put("textContent", "Hello {{firstName}}");

        mockMvc.perform(post("/templates/validate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isValid").value(true))
                .andExpect(jsonPath("$.variables").exists());
    }

    @Test
    void getTemplateStats_WithValidUserId_ShouldReturnStats() throws Exception {
        setup();
        mockMvc.perform(get("/templates/stats")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTemplates").exists())
                .andExpect(jsonPath("$.activeTemplates").exists());
    }

    @Test
    void duplicateTemplate_WithValidData_ShouldReturnDuplicated() throws Exception {
        setup();
        Map<String, String> request = new HashMap<>();
        request.put("name", "Duplicated Template");

        mockMvc.perform(post("/templates/1/duplicate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}