package com.correos.masivos.email.infrastructure.smtp;

import org.junit.jupiter.api.Test;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

class ResendStandaloneTest {

    @Test
    void testResendSmtpDirect() {
        // CAMBIAR POR TU API KEY REAL
        final String apiKey = "re_Ucza1Jpd_M6V1DxYzV8CZG5sC7nVjWLba";
        final String from = "onboarding@resend.dev";
        final String to = "julio.home96@gmail.com";

        System.out.println("=== TESTING RESEND SMTP DIRECT ===");
        System.out.println("API Key: " + apiKey.substring(0, 8) + "...");
        System.out.println("From: " + from);
        System.out.println("To: " + to);

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.resend.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.debug", "true");
        props.put("mail.smtp.user", "resend");
        props.put("mail.smtp.password", apiKey); // Force password
        System.out.println("Auth - Username: resend, Password: " +apiKey);
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                //System.out.println("Auth - Username: resend, Password: " + apiKey.substring(0, 8) + "...");
                return new PasswordAuthentication("resend", apiKey);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject("Test SMTP Resend Direct");
            message.setText("Test message from direct SMTP test");

            System.out.println("Sending message...");
            Transport.send(message);
            System.out.println("SUCCESS: Email sent via Resend SMTP");

        } catch (MessagingException e) {
            System.out.println("ERROR: " + e.getMessage());
            System.out.println(e);
            e.printStackTrace();
        }
    }
}