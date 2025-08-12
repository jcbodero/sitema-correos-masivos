package com.correos.masivos.email.domain.service;

import com.correos.masivos.email.domain.model.EmailMessage;
import com.correos.masivos.email.domain.model.EmailProvider;

public interface EmailProviderService {
    boolean sendEmail(EmailMessage message);
    EmailProvider getProvider();
    boolean isAvailable();
    int getPriority();
    boolean hasReachedDailyLimit();
    boolean hasReachedHourlyLimit();
}