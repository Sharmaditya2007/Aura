package com.expensetracker.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:noreply@aurafinance.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String body) {
        if (!mailEnabled) {
            log.info("[DEV EMAIL MODE] To: {} | Subject: {} | Content:\n{}", to, subject, body);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Email successfully dispatched to {}", to);
        } catch (Exception e) {
            log.warn("Could not dispatch email to {}: {}. Logged notification instead.", to, e.getMessage());
        }
    }

    public void sendBudgetWarningEmail(String to, String userName, String category, String spent, String limit, double percent) {
        String subject = "AURA Alert: Budget Threshold Reached for " + category;
        String body = String.format(
                "Hello %s,\n\n" +
                "This is an automated notification from AURA Finance.\n" +
                "You have consumed %.1f%% of your monthly budget for '%s'.\n\n" +
                "Spent: $%s\n" +
                "Monthly Limit: $%s\n\n" +
                "You can review your spending in your AURA dashboard.\n\n" +
                "— The AURA Finance Team",
                userName, percent, category, spent, limit
        );
        sendEmail(to, subject, body);
    }

    public void sendBudgetExceededEmail(String to, String userName, String category, String spent, String limit) {
        String subject = "AURA Alert: Budget Exceeded for " + category;
        String body = String.format(
                "Hello %s,\n\n" +
                "Urgent Budget Alert: Your spending for '%s' has exceeded your monthly allocation.\n\n" +
                "Current Spent: $%s\n" +
                "Allocated Limit: $%s\n\n" +
                "Please review your recent transactions in the AURA dashboard.\n\n" +
                "— The AURA Finance Team",
                userName, category, spent, limit
        );
        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String userName, String resetLink) {
        String subject = "AURA Finance: Password Reset Request";
        String body = String.format(
                "Hello %s,\n\n" +
                "We received a request to reset your AURA Finance account password.\n" +
                "Click the link below to set a new password:\n\n" +
                "%s\n\n" +
                "This link will expire in 1 hour. If you did not make this request, you can safely ignore this email.\n\n" +
                "— The AURA Finance Team",
                userName, resetLink
        );
        sendEmail(to, subject, body);
    }

    public void sendRegistrationOtpEmail(String to, String userName, String otpCode) {
        String subject = "AURA Finance — Verification Code: " + otpCode;
        String body = String.format(
                "Hello %s,\n\n" +
                "Welcome to AURA Finance.\n\n" +
                "Your 6-digit email verification code is:\n\n" +
                "    %s\n\n" +
                "This security code will expire in 10 minutes.\n" +
                "Enter this code in the verification screen to activate your private financial ledger.\n\n" +
                "If you did not initiate this registration, please disregard this email.\n\n" +
                "— The AURA Finance Team",
                userName, otpCode
        );
        sendEmail(to, subject, body);
    }
}
