import { storage } from "./storage";
import type { EmailTemplate, EmailSubscriber, EmailCampaign, InsertEmailLog } from "@shared/schema";

// Simple email service interface - in production, integrate with SendGrid, Mailgun, or similar
export class EmailService {
  private readonly fromEmail = "dan@danbizzarromethod.com";
  private readonly fromName = "Dan Bizzarro";
  
  async sendEmail(to: string, subject: string, htmlContent: string, textContent: string, campaignId?: number): Promise<boolean> {
    try {
      console.log(`Sending email from: ${this.fromName} <${this.fromEmail}>`);
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      
      // Only send real emails to danibizza@yahoo.it for testing
      if (to === "danibizza@yahoo.it") {
        console.log(`TEXT CONTENT FOR TESTING: ${textContent}`);
        console.log("*** REAL EMAIL WOULD BE SENT TO danibizza@yahoo.it ***");
        // Here you would integrate with a real email service like SendGrid, Mailgun, etc.
        // For now, we'll log the full text content for testing
      } else {
        console.log("*** SIMULATED EMAIL (not actually sent) ***");
      }
      
      await this.simulateEmailSending();
      
      // Log the email
      const subscriber = await storage.getEmailSubscriberByEmail(to);
      if (subscriber) {
        await storage.createEmailLog({
          campaignId,
          subscriberId: subscriber.id,
          subject,
          status: "sent",
          metadata: { htmlLength: htmlContent.length, textLength: textContent.length }
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      
      // Log failed email
      const subscriber = await storage.getEmailSubscriberByEmail(to);
      if (subscriber) {
        await storage.createEmailLog({
          campaignId,
          subscriberId: subscriber.id,
          subject,
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          metadata: {}
        });
      }
      
      return false;
    }
  }
  
  async sendTemplateEmail(templateId: number, to: string, variables: Record<string, string> = {}, campaignId?: number): Promise<boolean> {
    const template = await storage.getEmailTemplate(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Replace variables in template
    let htmlContent = template.htmlContent;
    let textContent = template.textContent;
    let subject = template.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replaceAll(placeholder, value);
      textContent = textContent.replaceAll(placeholder, value);
      subject = subject.replaceAll(placeholder, value);
    });
    
    // Ensure HTML content is properly formatted for email clients
    htmlContent = this.formatHtmlForEmail(htmlContent);
    
    return await this.sendEmail(to, subject, htmlContent, textContent, campaignId);
  }

  private formatHtmlForEmail(htmlContent: string): string {
    // Ensure all links have proper attributes for email clients
    htmlContent = htmlContent.replace(
      /<a\s+href="([^"]+)"([^>]*)>/gi,
      '<a href="$1" target="_blank" style="color: #0079F2; text-decoration: underline;"$2>'
    );
    
    // Add proper email HTML structure if not present
    if (!htmlContent.includes('<html>')) {
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dan Bizzarro Method</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${htmlContent}
</body>
</html>`;
    }
    
    return htmlContent;
  }
  
  async sendCampaign(campaignId: number): Promise<{ sent: number; failed: number }> {
    const campaign = await storage.getEmailCampaign(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    const template = await storage.getEmailTemplate(campaign.templateId);
    if (!template) {
      throw new Error(`Template with ID ${campaign.templateId} not found`);
    }
    
    // Get active subscribers
    const subscribers = await storage.getAllEmailSubscribers();
    const activeSubscribers = subscribers.filter(sub => sub.isActive);
    
    let sentCount = 0;
    let failedCount = 0;
    
    // Update campaign status
    await storage.updateEmailCampaign(campaignId, { 
      status: "sending"
    });
    
    // Send emails to all active subscribers
    for (const subscriber of activeSubscribers) {
      const variables = {
        firstName: subscriber.firstName || "Friend",
        lastName: subscriber.lastName || "",
        email: subscriber.email
      };
      
      const success = await this.sendTemplateEmail(
        campaign.templateId, 
        subscriber.email, 
        variables, 
        campaignId
      );
      
      if (success) {
        sentCount++;
      } else {
        failedCount++;
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Update campaign with final status
    await storage.updateEmailCampaign(campaignId, { 
      status: "sent"
    });
    
    return { sent: sentCount, failed: failedCount };
  }
  
  async sendWelcomeEmail(subscriberEmail: string): Promise<boolean> {
    // Find welcome email automation
    const automations = await storage.getAllEmailAutomations();
    const welcomeAutomation = automations.find(auto => 
      auto.trigger === "new_subscriber" && auto.isActive
    );
    
    if (!welcomeAutomation) {
      console.log("No welcome email automation found");
      return false;
    }
    
    const subscriber = await storage.getEmailSubscriberByEmail(subscriberEmail);
    if (!subscriber) {
      console.log("Subscriber not found");
      return false;
    }
    
    const variables = {
      firstName: subscriber.firstName || "Friend",
      lastName: subscriber.lastName || "",
      email: subscriber.email
    };
    
    return await this.sendTemplateEmail(welcomeAutomation.templateId, subscriberEmail, variables);
  }
  
  async sendClinicReminderEmail(subscriberEmail: string, clinicName: string, clinicDate: string): Promise<boolean> {
    const automations = await storage.getAllEmailAutomations();
    const reminderAutomation = automations.find(auto => 
      auto.trigger === "clinic_reminder" && auto.isActive
    );
    
    if (!reminderAutomation) {
      console.log("No clinic reminder automation found");
      return false;
    }
    
    const subscriber = await storage.getEmailSubscriberByEmail(subscriberEmail);
    if (!subscriber) {
      console.log("Subscriber not found");
      return false;
    }
    
    const variables = {
      firstName: subscriber.firstName || "Friend",
      lastName: subscriber.lastName || "",
      email: subscriber.email,
      clinicName,
      clinicDate
    };
    
    return await this.sendTemplateEmail(reminderAutomation.templateId, subscriberEmail, variables);
  }
  
  private async simulateEmailSending(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate 95% success rate
    if (Math.random() < 0.05) {
      throw new Error("Simulated email sending failure");
    }
  }
  
  // Newsletter subscription management
  async sendLoyaltyDiscountEmail(subscriberEmail: string, discountCode: string): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Congratulations! You've Earned a Loyalty Discount</h2>
        <p>Dear valued client,</p>
        <p>Thank you for your continued support and participation in our clinics!</p>
        <div style="background-color: #8b4513; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0;">You've earned a 15% discount!</h3>
          <p style="font-size: 18px; margin: 10px 0;"><strong>Your discount code: ${discountCode}</strong></p>
          <p style="font-size: 14px; margin-bottom: 0;">Use this code on your next clinic registration</p>
        </div>
        <p>This discount is valid for 6 months and can be used once on any of our upcoming clinics.</p>
        <p>Thank you for being a loyal member of the Dan Bizzarro Method community!</p>
        <p>Best regards,<br>Dan Bizzarro and the Team</p>
      </div>
    `;

    const textContent = `
      Congratulations! You've Earned a Loyalty Discount
      
      Dear valued client,
      
      Thank you for your continued support and participation in our clinics!
      
      You've earned a 15% discount!
      Your discount code: ${discountCode}
      
      This discount is valid for 6 months and can be used once on any of our upcoming clinics.
      
      Thank you for being a loyal member of the Dan Bizzarro Method community!
      
      Best regards,
      Dan Bizzarro and the Team
    `;

    return this.sendEmail(subscriberEmail, "🎉 You've Earned a Loyalty Discount!", htmlContent, textContent);
  }

  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string, source: string = "newsletter"): Promise<boolean> {
    try {
      // Check if already subscribed
      const existing = await storage.getEmailSubscriberByEmail(email);
      if (existing && existing.isActive) {
        return true; // Already subscribed
      }
      
      if (existing && !existing.isActive) {
        // Reactivate subscription
        await storage.updateEmailSubscriber(existing.id, { 
          isActive: true,
          subscriptionSource: source
        });
      } else {
        // Create new subscription
        await storage.createEmailSubscriber({
          email,
          firstName,
          lastName,
          subscriptionSource: source,
          interests: ["news", "clinics"]
        });
      }
      
      // Send welcome email
      await this.sendWelcomeEmail(email);
      
      return true;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();