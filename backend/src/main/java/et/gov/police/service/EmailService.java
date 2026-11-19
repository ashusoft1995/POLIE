package et.gov.police.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOtpEmail(String toEmail, String officerName, String otp) {
        try {
            var message = mailSender.createMimeMessage();
            var helper  = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("hossannapolice@gmail.com", "Hossana City Police Station");
            helper.setTo(toEmail);
            helper.setSubject("Password Reset OTP — Hossana Police Station");
            helper.setText(buildOtpHtml(officerName, otp), true);

            mailSender.send(message);
            log.info("OTP email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
        }
    }

    private String buildOtpHtml(String name, String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#F4F7FB;">
              <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(16,42,67,.15);">
                <div style="background:#102A43;padding:28px 32px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:20px;">🛡️ HOSSANA CITY POLICE</h1>
                  <p style="color:#93C5FD;margin:6px 0 0;font-size:13px;">Password Reset Request</p>
                </div>
                <div style="padding:36px 32px;">
                  <p style="color:#243B53;font-size:16px;margin:0 0 12px;">Dear <strong>%s</strong>,</p>
                  <p style="color:#64748B;font-size:14px;line-height:1.6;margin:0 0 28px;">
                    Your OTP expires in <strong>15 minutes</strong>.
                  </p>
                  <div style="background:#F4F7FB;border:2px dashed #2563EB;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px;">
                    <p style="color:#64748B;font-size:12px;margin:0 0 8px;">One-Time Password</p>
                    <div style="font-size:40px;font-weight:900;letter-spacing:12px;color:#102A43;">%s</div>
                  </div>
                  <p style="color:#94A3B8;font-size:13px;border-top:1px solid #E2E8F0;padding-top:20px;margin:0;">
                    If you did not request this, please ignore this email.
                  </p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, otp);
    }
}
