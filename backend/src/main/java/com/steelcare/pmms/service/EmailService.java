package com.steelcare.pmms.service;

import com.steelcare.pmms.entity.Employee;
import com.steelcare.pmms.entity.Maintenance;
import com.steelcare.pmms.entity.Role;
import com.steelcare.pmms.repository.EmployeeRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmployeeRepository employeeRepository;
    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:no-reply@steelcare.com}")
    private String mailSenderAddress;

    public EmailService(JavaMailSender mailSender, EmployeeRepository employeeRepository) {
        this.mailSender = mailSender;
        this.employeeRepository = employeeRepository;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        // Output simulated HTML email to console logs for easy debugging/viva display
        System.out.println("\n==========================================================================");
        System.out.println("[EMAIL SIMULATION ENGINE - HTML MESSAGE]");
        System.out.println("To: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("HTML Source Output:\n" + htmlContent);
        System.out.println("==========================================================================\n");

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            // Set the custom display name Md. Shahnawaz Alam alongside the authenticated email
            helper.setFrom(mailSenderAddress, "Md. Shahnawaz Alam");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // Set true for HTML format
            
            mailSender.send(mimeMessage);
            logger.info("HTML Email sent successfully to: " + to);
        } catch (Exception e) {
            logger.warning("Failed to send real SMTP HTML email to " + to + ". Reason: " + e.getMessage());
            logger.info("HTML Email simulated successfully in server console instead.");
        }
    }

    // Helper to generate the common HTML wrapping template (using strictly inline styles)
    private String getHtmlTemplate(String title, String contentHtml) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "  <meta charset='UTF-8'>" +
                "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "</head>" +
                "<body style='background-color: #0b0f19; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; margin: 0; padding: 32px 12px;'>" +
                "  <div style='max-width: 500px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);'>" +
                "    <div style='height: 4px; background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%); background-color: #6366f1;'></div>" +
                "    <div style='padding: 32px 24px; text-align: center; border-bottom: 1px solid #1f2937;'>" +
                "      <div style='font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 6px;'>Steel<span style='color: #6366f1;'>Care</span></div>" +
                "      <div style='font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;'>PMMS Operational Dispatch</div>" +
                "    </div>" +
                "    <div style='padding: 32px 24px 24px 24px;'>" +
                "      <div style='font-size: 22px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 8px; letter-spacing: -0.5px;'>" + title + "</div>" +
                contentHtml +
                "    </div>" +
                "    <div style='background-color: #0b0f19; padding: 24px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1f2937;'>" +
                "      This is an automated operational dispatch. Please do not reply directly to this mail.<br>" +
                "      &bull; <a href='https://steelcare-pmms.netlify.app' style='color: #6366f1; text-decoration: none; font-weight: 600;'>Launch Operations Portal</a> &bull;" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }

    private String getAdminEmail() {
        return employeeRepository.findByRole(Role.ADMIN).stream()
                .findFirst()
                .map(Employee::getEmail)
                .orElse("admin@steelcare.com");
    }

    public void sendTaskScheduledEmails(Maintenance task, String creatorName) {
        Employee engineer = task.getEngineer();

        // 1. Email to the assigned engineer (HTML format)
        String engineerSubject = "New Task Assignment: " + task.getMaintenanceType();
        String engineerContent = String.format(
                "<div style='font-size: 14px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;'>Hello <strong>%s</strong>, you have been assigned a new preventive maintenance schedule by <strong>%s</strong>. Details of your assignment are compiled below:</div>" +
                
                "<table style='width: 100%%; border-collapse: collapse; margin-bottom: 24px;'>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; width: 40%%;'>Service Allocation</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Target Equipment</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s (%s)</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Laboratory</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Specific Location</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Scheduled Date</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Initial Status</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'><span style='display: inline-block; padding: 4px 10px; font-size: 9px; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px; background-color: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.2);'>Pending</span></td></tr>" +
                "</table>" +
                
                "<div style='background-color: #1e293b; border-left: 4px solid #6366f1; border-radius: 0 12px 12px 0; padding: 16px; margin: 24px 0;'>" +
                "  <div style='font-size: 10px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;'>Action & Instructions</div>" +
                "  <div style='font-size: 13px; color: #cbd5e1; font-style: italic; line-height: 1.5;'>\"%s\"</div>" +
                "</div>" +
                
                "<div style='text-align: center; margin-top: 36px; margin-bottom: 12px;'>" +
                "  <a href='https://steelcare-pmms.netlify.app/maintenance' style='display: inline-block; padding: 12px 32px; background-color: #6366f1; color: #ffffff !important; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);'>Update Task Status</a>" +
                "</div>",
                engineer.getName(),
                creatorName,
                task.getMaintenanceType(),
                task.getMachine().getMachineName(),
                task.getMachine().getMachineCode(),
                task.getMachine().getDepartment(),
                task.getMachine().getLocation(),
                task.getScheduledDate(),
                task.getDescription()
        );
        sendHtmlEmail(engineer.getEmail(), engineerSubject, getHtmlTemplate("Task Assignment Notice", engineerContent));

        // 2. Email to the administrator (HTML format)
        String adminSubject = "Maintenance Task Scheduled: " + task.getMaintenanceType();
        String adminContent = String.format(
                "<div style='font-size: 14px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;'>Dear Administrator, a new preventive maintenance task has been successfully scheduled by user <strong>%s</strong>:</div>" +
                
                "<table style='width: 100%%; border-collapse: collapse; margin-bottom: 24px;'>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; width: 40%%;'>Assigned Engineer</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s (%s)</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Target Equipment</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s (%s)</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Scheduled Date</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Service Allocation</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Task Status</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'><span style='display: inline-block; padding: 4px 10px; font-size: 9px; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px; background-color: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.2);'>Pending</span></td></tr>" +
                "</table>" +
                
                "<div style='text-align: center; margin-top: 36px; margin-bottom: 12px;'>" +
                "  <a href='https://steelcare-pmms.netlify.app/' style='display: inline-block; padding: 12px 32px; background-color: #6366f1; color: #ffffff !important; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);'>Go to Admin Dashboard</a>" +
                "</div>",
                creatorName,
                engineer.getName(),
                engineer.getEmail(),
                task.getMachine().getMachineName(),
                task.getMachine().getMachineCode(),
                task.getScheduledDate(),
                task.getMaintenanceType()
        );
        sendHtmlEmail(getAdminEmail(), adminSubject, getHtmlTemplate("Maintenance Scheduled", adminContent));
    }

    public void sendTaskCompletedEmail(Maintenance task) {
        Employee engineer = task.getEngineer();

        // Email to the administrator on completion (HTML format)
        String adminSubject = "Maintenance Task Completed: " + task.getMaintenanceType();
        String adminContent = String.format(
                "<div style='font-size: 14px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;'>Dear Administrator, a scheduled preventive maintenance task has been completed and resolved by the technician:</div>" +
                
                "<table style='width: 100%%; border-collapse: collapse; margin-bottom: 24px;'>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; width: 40%%;'>Target Equipment</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s (%s)</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Completed By</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s (%s)</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Date of Completion</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr style='border-bottom: 1px solid #1f2937;'><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Service Allocation</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'>%s</td></tr>" +
                "  <tr><td style='padding: 14px 0; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px;'>Resolution Status</td><td style='padding: 14px 0; font-size: 13px; font-weight: 600; color: #f1f5f9; text-align: right;'><span style='display: inline-block; padding: 4px 10px; font-size: 9px; font-weight: 700; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px; background-color: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2);'>Completed</span></td></tr>" +
                "</table>" +
                
                "<div style='background-color: #1e293b; border-left: 4px solid #6366f1; border-radius: 0 12px 12px 0; padding: 16px; margin: 24px 0;'>" +
                "  <div style='font-size: 10px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;'>Technician Log & Remarks</div>" +
                "  <div style='font-size: 13px; color: #cbd5e1; font-style: italic; line-height: 1.5;'>\"%s\"</div>" +
                "</div>" +
                
                "<div style='text-align: center; margin-top: 36px; margin-bottom: 12px;'>" +
                "  <a href='https://steelcare-pmms.netlify.app/' style='display: inline-block; padding: 12px 32px; background-color: #6366f1; color: #ffffff !important; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);'>View History Audit</a>" +
                "</div>",
                task.getMachine().getMachineName(),
                task.getMachine().getMachineCode(),
                engineer.getName(),
                engineer.getEmail(),
                task.getCompletedDate(),
                task.getMaintenanceType(),
                task.getRemarks()
        );
        sendHtmlEmail(getAdminEmail(), adminSubject, getHtmlTemplate("Maintenance Completed", adminContent));
    }
}
