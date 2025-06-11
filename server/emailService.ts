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
    
    // Add upcoming clinics and recent news for newsletter templates
    if (template.name.toLowerCase().includes('newsletter')) {
      const upcomingClinics = await this.getUpcomingClinicsForEmail();
      variables.upcomingClinicsHtml = upcomingClinics.html;
      variables.upcomingClinicsText = upcomingClinics.text;

      const recentNews = await this.getRecentNewsForEmail();
      variables.recentNewsHtml = recentNews.html;
      variables.recentNewsText = recentNews.text;
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

  private async getUpcomingClinicsForEmail(): Promise<{ html: string; text: string }> {
    try {
      const allClinics = await storage.getAllClinics();
      const upcomingClinics = allClinics
        .filter(clinic => {
          const clinicDate = new Date(clinic.date);
          return clinicDate > new Date();
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 2);

      if (upcomingClinics.length === 0) {
        return {
          html: '<p style="text-align: center; color: #666;">No upcoming clinics scheduled. Check back soon!</p>',
          text: 'No upcoming clinics scheduled. Check back soon!'
        };
      }

      const htmlClinics = upcomingClinics.map(clinic => {
        const clinicDate = new Date(clinic.date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        return `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: white;">
            ${clinic.image ? `<img src="${clinic.image}" alt="${clinic.title}" style="width: 100%; max-width: 400px; height: 200px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;" />` : ''}
            <h3 style="color: #1e3a8a; margin: 0 0 10px 0; font-size: 20px;">${clinic.title}</h3>
            <p style="color: #f97316; font-weight: 600; margin: 0 0 10px 0;">📅 ${clinicDate}</p>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.5;">${clinic.description}</p>
            <div style="text-align: center;">
              <a href="https://danbizzarromethod.com/#clinics" style="background: #f97316; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Book Your Spot Now</a>
            </div>
          </div>`;
      }).join('');

      const textClinics = upcomingClinics.map(clinic => {
        const clinicDate = new Date(clinic.date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        return `${clinic.title}\nDate: ${clinicDate}\n${clinic.description}\nBook now: https://danbizzarromethod.com/#clinics\n`;
      }).join('\n');

      return {
        html: `
          <div style="margin: 30px 0;">
            <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 25px;">🏇 Upcoming Clinics</h2>
            ${htmlClinics}
          </div>`,
        text: `\n\nUPCOMING CLINICS:\n\n${textClinics}`
      };
    } catch (error) {
      console.error("Error fetching upcoming clinics for email:", error);
      return {
        html: '<p style="text-align: center; color: #666;">Clinic information currently unavailable.</p>',
        text: 'Clinic information currently unavailable.'
      };
    }
  }

  private async getRecentNewsForEmail(): Promise<{ html: string; text: string }> {
    try {
      const allNews = await storage.getAllNews();
      const recentNews = allNews
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 2);

      if (recentNews.length === 0) {
        return {
          html: '<p style="text-align: center; color: #666;">No recent blog posts available.</p>',
          text: 'No recent blog posts available.'
        };
      }

      const htmlNews = recentNews.map(article => {
        const publishDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        // Create a brief summary from the excerpt or first part of content
        const summary = article.excerpt || 
          (article.content.length > 150 ? 
            article.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : 
            article.content.replace(/<[^>]*>/g, ''));

        return `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; background: white;">
            ${article.image ? `<img src="${article.image}" alt="${article.title}" style="width: 100%; max-width: 400px; height: 150px; object-fit: cover; border-radius: 6px; margin-bottom: 15px;" />` : ''}
            <h3 style="color: #1e3a8a; margin: 0 0 10px 0; font-size: 18px;">${article.title}</h3>
            <p style="color: #f97316; font-size: 14px; margin: 0 0 10px 0;">📅 ${publishDate}</p>
            <p style="color: #374151; margin: 0 0 15px 0; line-height: 1.5; font-size: 14px;">${summary}</p>
            <div style="text-align: center;">
              <a href="https://danbizzarromethod.com/news/${article.id}" style="background: #1e3a8a; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 14px;">Read Full Article</a>
            </div>
          </div>`;
      }).join('');

      const textNews = recentNews.map(article => {
        const publishDate = new Date(article.publishedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const summary = article.excerpt || 
          (article.content.length > 150 ? 
            article.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : 
            article.content.replace(/<[^>]*>/g, ''));
        
        return `${article.title}\nPublished: ${publishDate}\n${summary}\nRead more: https://danbizzarromethod.com/news/${article.id}\n`;
      }).join('\n');

      return {
        html: `
          <div style="margin: 30px 0;">
            <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 25px;">📰 Latest News & Insights</h2>
            ${htmlNews}
          </div>`,
        text: `\n\nLATEST NEWS & INSIGHTS:\n\n${textNews}`
      };
    } catch (error) {
      console.error("Error fetching recent news for email:", error);
      return {
        html: '<p style="text-align: center; color: #666;">News articles currently unavailable.</p>',
        text: 'News articles currently unavailable.'
      };
    }
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