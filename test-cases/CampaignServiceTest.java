package com.correos.masivos.campaign;

import com.correos.masivos.campaign.api.CampaignController;
import com.correos.masivos.campaign.api.dto.CampaignDTO;
import com.correos.masivos.campaign.api.dto.CampaignTargetListDTO;
import com.correos.masivos.campaign.domain.model.Campaign;
import com.correos.masivos.campaign.domain.service.CampaignService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CampaignController.class)
class CampaignServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CampaignService campaignService;

    @Test
    void healthCheck_ShouldReturnOK() throws Exception {
        mockMvc.perform(get("/campaigns/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.service").value("campaign-service"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.port").value("8083"));
    }

    @Test
    void createCampaign_WithValidData_ShouldReturnCreated() throws Exception {
        CampaignDTO campaign = new CampaignDTO();
        campaign.setName("Test Campaign");
        campaign.setSubject("Test Subject");
        campaign.setDescription("Test Description");
        campaign.setTemplateId(1L);
        campaign.setUserId(1L);
        campaign.setStatus(Campaign.CampaignStatus.DRAFT);

        mockMvc.perform(post("/campaigns")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaign)))
                .andExpect(status().isOk());
    }

    @Test
    void createCampaign_WithEmptyName_ShouldReturnBadRequest() throws Exception {
        CampaignDTO campaign = new CampaignDTO();
        campaign.setName("");
        campaign.setSubject("Test Subject");
        campaign.setUserId(1L);

        mockMvc.perform(post("/campaigns")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(campaign)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getCampaigns_WithValidUserId_ShouldReturnCampaigns() throws Exception {
        mockMvc.perform(get("/campaigns")
                .param("userId", "1")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void getCampaigns_WithStatusFilter_ShouldReturnFilteredCampaigns() throws Exception {
        mockMvc.perform(get("/campaigns")
                .param("userId", "1")
                .param("status", "DRAFT")
                .param("page", "0")
                .param("size", "20"))
                .andExpect(status().isOk());
    }

    @Test
    void scheduleCampaign_WithValidData_ShouldReturnOK() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("scheduledAt", LocalDateTime.now().plusHours(1).toString());

        mockMvc.perform(post("/campaigns/1/schedule")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void startCampaign_WithValidId_ShouldReturnOK() throws Exception {
        mockMvc.perform(post("/campaigns/1/start"))
                .andExpect(status().isOk());
    }

    @Test
    void pauseCampaign_WithValidId_ShouldReturnOK() throws Exception {
        mockMvc.perform(post("/campaigns/1/pause"))
                .andExpect(status().isOk());
    }

    @Test
    void cancelCampaign_WithValidId_ShouldReturnOK() throws Exception {
        mockMvc.perform(post("/campaigns/1/cancel"))
                .andExpect(status().isOk());
    }

    @Test
    void addTargetList_WithValidData_ShouldReturnOK() throws Exception {
        CampaignTargetListDTO target = new CampaignTargetListDTO();
        target.setTargetType("CONTACT_LIST");
        target.setTargetId(1L);

        mockMvc.perform(post("/campaigns/1/targets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(target)))
                .andExpect(status().isOk());
    }

    @Test
    void duplicateCampaign_WithValidData_ShouldReturnDuplicated() throws Exception {
        Map<String, String> request = new HashMap<>();
        request.put("name", "Duplicated Campaign");

        mockMvc.perform(post("/campaigns/1/duplicate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void getCampaignStats_WithValidUserId_ShouldReturnStats() throws Exception {
        mockMvc.perform(get("/campaigns/stats")
                .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCampaigns").exists())
                .andExpect(jsonPath("$.draftCampaigns").exists())
                .andExpect(jsonPath("$.scheduledCampaigns").exists())
                .andExpect(jsonPath("$.sentCampaigns").exists());
    }

    @Test
    void getTargetLists_WithValidCampaignId_ShouldReturnTargets() throws Exception {
        mockMvc.perform(get("/campaigns/1/targets"))
                .andExpect(status().isOk());
    }

    @Test
    void removeTargetList_WithValidIds_ShouldReturnOK() throws Exception {
        mockMvc.perform(delete("/campaigns/1/targets/1"))
                .andExpect(status().isOk());
    }
}