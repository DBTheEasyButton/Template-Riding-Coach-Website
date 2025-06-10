import { storage } from "./storage";
import type { EmailTemplate, EmailSubscriber, EmailCampaign, InsertEmailLog } from "@shared/schema";

// Simple email service interface - in production, integrate with SendGrid, Mailgun, or similar
export class EmailService {
  
  async sendEmail(to: string, subject: string, htmlContent: string, textContent: string, campaignId?: number): Promise<boolean> {
    try {
      // In production, replace this with actual email service
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`HTML Content: ${htmlContent.substring(0, 100)}...`);
      
      // For now, we'll simulate successful email sending
      // In production, integrate with your preferred email service provider
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
    
    return await this.sendEmail(to, subject, htmlContent, textContent, campaignId);
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