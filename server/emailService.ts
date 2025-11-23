import { storage } from "./storage";
import type { EmailTemplate, EmailSubscriber, EmailCampaign, InsertEmailLog } from "@shared/schema";

export class EmailService {
  private readonly fromEmail = "dan@danbizzarromethod.com";
  private readonly fromName = "Dan Bizzarro";
  
  async sendEmail(to: string, subject: string, htmlContent: string, textContent: string, campaignId?: number): Promise<boolean> {
    try {
      console.log(`Sending email from: ${this.fromName} <${this.fromEmail}>`);
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      
      const sent = await this.sendWithGHL(to, subject, htmlContent, textContent);
      
      if (!sent) {
        console.log("*** SIMULATED EMAIL (GHL not configured) ***");
        await this.simulateEmailSending();
      }
      
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
  
  private async sendWithGHL(to: string, subject: string, htmlContent: string, textContent: string): Promise<boolean> {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.log('GHL API key or location ID not configured, simulating email send');
      return false;
    }

    try {
      const contactResponse = await storage.createOrUpdateGhlContactInApi(
        to,
        to.split('@')[0],
        undefined,
        undefined,
        ['clinic-email']
      );

      if (!contactResponse.success || !contactResponse.contactId) {
        console.error('Failed to create/update GHL contact:', contactResponse.message);
        return false;
      }

      const response = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'Email',
          contactId: contactResponse.contactId,
          locationId: locationId,
          subject: subject,
          emailFrom: this.fromEmail,
          html: htmlContent,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully via Go High Level');
        return true;
      } else {
        const error = await response.text();
        console.error('GHL email error:', error);
        return false;
      }
    } catch (error) {
      console.error('GHL send error:', error);
      return false;
    }
  }

  async sendTemplateEmail(templateId: number, to: string, variables: Record<string, string> = {}, campaignId?: number): Promise<boolean> {
    const template = await storage.getEmailTemplate(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    if (template.name.toLowerCase().includes('newsletter')) {
      const upcomingClinics = await this.getUpcomingClinicsForEmail();
      variables.upcomingClinicsHtml = upcomingClinics.html;
      variables.upcomingClinicsText = upcomingClinics.text;

      const recentNews = await this.getRecentNewsForEmail();
      variables.recentNewsHtml = recentNews.html;
      variables.recentNewsText = recentNews.text;
    }
    
    let htmlContent = template.htmlContent;
    let textContent = template.textContent;
    let subject = template.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replaceAll(placeholder, value);
      textContent = textContent.replaceAll(placeholder, value);
      subject = subject.replaceAll(placeholder, value);
    });
    
    htmlContent = this.formatHtmlForEmail(htmlContent);
    
    return await this.sendEmail(to, subject, htmlContent, textContent, campaignId);
  }

  async sendFirstTimeClinicConfirmation(
    email: string,
    firstName: string,
    clinicName: string,
    clinicDate: string,
    referralCode: string,
    clinicLocation?: string,
    googleMapsLink?: string
  ): Promise<boolean> {
    const locationHtml = clinicLocation ? `<p style="margin: 5px 0; font-size: 16px;"><strong>Location:</strong> ${googleMapsLink ? `<a href="${googleMapsLink}" style="color: white; text-decoration: underline;" target="_blank">${clinicLocation}</a>` : clinicLocation}</p>` : '';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1e3a8a; margin-top: 0; font-size: 28px;">Welcome to Dan Bizzarro Method!</h1>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear ${firstName},</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We're thrilled to have you join us for your first clinic! Your registration has been confirmed.
          </p>

          <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="margin-top: 0; font-size: 22px;">Clinic Details</h2>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Clinic:</strong> ${clinicName}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${clinicDate}</p>
            ${locationHtml}
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 15px;">
              <strong>📅 Important:</strong> Your session times and groups will be sent to you a couple of days before the clinic.
            </p>
          </div>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0; font-size: 20px;">🎁 Your Unique Referral Code</h3>
            <p style="color: #374151; margin-bottom: 15px; font-size: 15px;">
              Share the Dan Bizzarro Method with friends and earn rewards!
            </p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; text-align: center; border: 2px dashed #1e3a8a;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your Referral Code:</p>
              <p style="color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${referralCode}</p>
            </div>
            <p style="color: #374151; margin-top: 15px; font-size: 14px; line-height: 1.6;">
              When a friend uses your code during registration, you'll earn <strong>20 bonus points</strong>! 
              Plus, you're already earning <strong>10 points</strong> for this clinic.
            </p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0; font-size: 18px;">Points & Rewards Programme</h3>
            <ul style="color: #374151; line-height: 1.8; font-size: 15px;">
              <li><strong>10 points</strong> per clinic registration</li>
              <li><strong>20 bonus points</strong> for each new friend you refer</li>
              <li><strong>20% discount code</strong> automatically at every 50-point milestone</li>
              <li>Check the live leaderboard on our website</li>
              <li>Top 5 riders win prizes twice per year</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://danbizzarromethod.com" 
               style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
              Visit Our Website
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We're looking forward to seeing you at the clinic! If you have any questions, please don't hesitate to get in touch.
          </p>

          <p style="color: #374151; font-size: 16px; margin-top: 30px;">
            Best regards,<br>
            <strong>Dan Bizzarro</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Dan Bizzarro Method</span>
          </p>

          <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 5px 0;">
              <a href="https://danbizzarromethod.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> from these emails
            </p>
          </div>
        </div>
      </div>
    `;

    const locationText = clinicLocation ? `Location: ${clinicLocation}${googleMapsLink ? ` (${googleMapsLink})` : ''}\n` : '';
    
    const textContent = `
Welcome to Dan Bizzarro Method!

Dear ${firstName},

We're thrilled to have you join us for your first clinic! Your registration has been confirmed.

CLINIC DETAILS:
Clinic: ${clinicName}
Date: ${clinicDate}
${locationText}
IMPORTANT: Your session times and groups will be sent to you a couple of days before the clinic.

YOUR UNIQUE REFERRAL CODE: ${referralCode}

Share this code with friends and earn rewards!
- When a friend uses your code during registration, you'll earn 20 bonus points
- You're already earning 10 points for this clinic

POINTS & REWARDS PROGRAMME:
- 10 points per clinic registration
- 20 bonus points for each new friend you refer
- 20% discount code automatically at every 50-point milestone
- Check the live leaderboard on our website
- Top 5 riders win prizes twice per year

We're looking forward to seeing you at the clinic! If you have any questions, please don't hesitate to get in touch.

Best regards,
Dan Bizzarro
Dan Bizzarro Method

📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom

Unsubscribe: https://danbizzarromethod.com/unsubscribe
    `;

    return this.sendEmail(email, `🎉 Welcome! Your Clinic Registration is Confirmed - ${clinicName}`, htmlContent, textContent);
  }

  async sendReturningClinicConfirmation(
    email: string,
    firstName: string,
    clinicName: string,
    clinicDate: string,
    referralCode: string,
    currentPoints: number,
    clinicLocation?: string,
    googleMapsLink?: string
  ): Promise<boolean> {
    const locationHtml = clinicLocation ? `<p style="margin: 5px 0; font-size: 16px;"><strong>Location:</strong> ${googleMapsLink ? `<a href="${googleMapsLink}" style="color: white; text-decoration: underline;" target="_blank">${clinicLocation}</a>` : clinicLocation}</p>` : '';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1e3a8a; margin-top: 0; font-size: 28px;">Registration Confirmed!</h1>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear ${firstName},</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Great to have you back! Your clinic registration has been confirmed.
          </p>

          <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h2 style="margin-top: 0; font-size: 22px;">Clinic Details</h2>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Clinic:</strong> ${clinicName}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Date:</strong> ${clinicDate}</p>
            ${locationHtml}
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 15px;">
              <strong>📅 Important:</strong> Your session times and groups will be sent to you a couple of days before the clinic.
            </p>
          </div>

          <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #16a34a;">
            <h3 style="color: #15803d; margin-top: 0; font-size: 20px;">🎯 You've Earned Points!</h3>
            <p style="color: #374151; margin-bottom: 10px; font-size: 16px;">
              This registration earned you <strong>10 points</strong>
            </p>
            <p style="color: #374151; font-size: 20px; font-weight: bold; margin: 10px 0;">
              Your current total: ${currentPoints} points
            </p>
            <p style="color: #374151; margin-top: 15px; font-size: 14px;">
              Every 50 points = automatic 20% discount code!
            </p>
          </div>

          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0; font-size: 20px;">💰 Earn Bonus Points!</h3>
            <p style="color: #374151; margin-bottom: 15px; font-size: 15px;">
              Refer a friend and earn <strong>20 bonus points</strong> when they register for their first clinic!
            </p>
            <div style="background-color: white; padding: 15px; border-radius: 6px; text-align: center; border: 2px dashed #1e3a8a;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your Referral Code:</p>
              <p style="color: #1e3a8a; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">${referralCode}</p>
            </div>
            <p style="color: #374151; margin-top: 15px; font-size: 14px; text-align: center;">
              Share this code with friends who've never attended a clinic before
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://danbizzarromethod.com/#leaderboard" 
               style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
              View Live Leaderboard
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Looking forward to seeing you at the clinic! If you have any questions, please get in touch.
          </p>

          <p style="color: #374151; font-size: 16px; margin-top: 30px;">
            Best regards,<br>
            <strong>Dan Bizzarro</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Dan Bizzarro Method</span>
          </p>

          <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 5px 0;">
              <a href="https://danbizzarromethod.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> from these emails
            </p>
          </div>
        </div>
      </div>
    `;

    const locationText = clinicLocation ? `Location: ${clinicLocation}${googleMapsLink ? ` (${googleMapsLink})` : ''}\n` : '';
    
    const textContent = `
Registration Confirmed!

Dear ${firstName},

Great to have you back! Your clinic registration has been confirmed.

CLINIC DETAILS:
Clinic: ${clinicName}
Date: ${clinicDate}
${locationText}
IMPORTANT: Your session times and groups will be sent to you a couple of days before the clinic.

YOU'VE EARNED POINTS!
This registration earned you 10 points
Your current total: ${currentPoints} points

Every 50 points = automatic 20% discount code!

EARN BONUS POINTS!
Refer a friend and earn 20 bonus points when they register for their first clinic!

YOUR REFERRAL CODE: ${referralCode}

Share this code with friends who've never attended a clinic before.

Check out the live leaderboard on our website to see your ranking!

Looking forward to seeing you at the clinic! If you have any questions, please get in touch.

Best regards,
Dan Bizzarro
Dan Bizzarro Method

📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom

Unsubscribe: https://danbizzarromethod.com/unsubscribe
    `;

    return this.sendEmail(email, `✅ Clinic Registration Confirmed - ${clinicName}`, htmlContent, textContent);
  }

  async sendReferralBonusNotification(
    email: string,
    firstName: string,
    referredPersonName: string,
    bonusPoints: number,
    newTotalPoints: number
  ): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #1e3a8a; margin-top: 0; font-size: 28px;">🎉 Referral Bonus Earned!</h1>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear ${firstName},</p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Fantastic news! <strong>${referredPersonName}</strong> just registered for their first clinic using your referral code.
          </p>

          <div style="background-color: #dcfce7; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center; border: 3px solid #16a34a;">
            <h2 style="color: #15803d; margin-top: 0; font-size: 24px;">You've Earned Bonus Points!</h2>
            <p style="color: #15803d; font-size: 48px; font-weight: bold; margin: 15px 0;">+${bonusPoints}</p>
            <p style="color: #374151; font-size: 16px; margin: 10px 0;">
              Your new total: <strong style="color: #15803d; font-size: 24px;">${newTotalPoints} points</strong>
            </p>
          </div>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 15px;">
              <strong>💡 Remember:</strong> Every 50 points earns you an automatic 20% discount code for your next clinic!
            </p>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0; font-size: 18px;">Keep Earning Points</h3>
            <ul style="color: #374151; line-height: 1.8; font-size: 15px;">
              <li><strong>10 points</strong> for each clinic you attend</li>
              <li><strong>20 bonus points</strong> for each friend you refer</li>
              <li><strong>20% discount</strong> at every 50-point milestone</li>
              <li>Top 5 on the leaderboard win prizes twice per year!</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://danbizzarromethod.com/#leaderboard" 
               style="background-color: #f97316; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
              Check Live Leaderboard
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for spreading the word about Dan Bizzarro Method! Your support means the world to us.
          </p>

          <p style="color: #374151; font-size: 16px; margin-top: 30px;">
            Best regards,<br>
            <strong>Dan Bizzarro</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Dan Bizzarro Method</span>
          </p>

          <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 5px 0;">
              <a href="https://danbizzarromethod.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> from these emails
            </p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
🎉 Referral Bonus Earned!

Dear ${firstName},

Fantastic news! ${referredPersonName} just registered for their first clinic using your referral code.

YOU'VE EARNED BONUS POINTS!
+${bonusPoints} points

Your new total: ${newTotalPoints} points

REMEMBER: Every 50 points earns you an automatic 20% discount code for your next clinic!

KEEP EARNING POINTS:
- 10 points for each clinic you attend
- 20 bonus points for each friend you refer
- 20% discount at every 50-point milestone
- Top 5 on the leaderboard win prizes twice per year!

Check the live leaderboard on our website to see your ranking!

Thank you for spreading the word about Dan Bizzarro Method! Your support means the world to us.

Best regards,
Dan Bizzarro
Dan Bizzarro Method

📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom

Unsubscribe: https://danbizzarromethod.com/unsubscribe
    `;

    return this.sendEmail(email, `🎉 You Earned ${bonusPoints} Bonus Points! - ${referredPersonName} Joined`, htmlContent, textContent);
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
    htmlContent = htmlContent.replace(
      /<a\s+href="([^"]+)"([^>]*)>/gi,
      '<a href="$1" target="_blank" style="color: #0079F2; text-decoration: underline;"$2>'
    );
    
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
    
    const subscribers = await storage.getAllEmailSubscribers();
    const activeSubscribers = subscribers.filter(sub => sub.isActive);
    
    let sentCount = 0;
    let failedCount = 0;
    
    await storage.updateEmailCampaign(campaignId, { 
      status: "sending"
    });
    
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
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    await storage.updateEmailCampaign(campaignId, { 
      status: "sent"
    });
    
    return { sent: sentCount, failed: failedCount };
  }
  
  async sendWelcomeEmail(subscriberEmail: string): Promise<boolean> {
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
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (Math.random() < 0.05) {
      throw new Error("Simulated email sending failure");
    }
  }
  
  async sendLoyaltyDiscountEmail(subscriberEmail: string, discountCode: string): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1e3a8a; margin-top: 0;">Congratulations! You've Earned a Loyalty Discount</h2>
          <p style="color: #374151; font-size: 16px;">Dear valued client,</p>
          <p style="color: #374151; font-size: 16px;">Thank you for your continued support and participation in our clinics!</p>
          <div style="background-color: #1e3a8a; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0;">You've earned a 20% discount!</h3>
            <p style="font-size: 18px; margin: 10px 0;"><strong>Your discount code: ${discountCode}</strong></p>
            <p style="font-size: 14px; margin-bottom: 0;">Use this code on your next clinic registration</p>
          </div>
          <p style="color: #374151; font-size: 16px;">This discount is valid for 12 months and can be used once on any of our upcoming clinics.</p>
          <p style="color: #374151; font-size: 16px;">Thank you for being a loyal member of the Dan Bizzarro Method community!</p>
          <p style="color: #374151; font-size: 16px; margin-top: 30px;">
            Best regards,<br>
            <strong>Dan Bizzarro</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Dan Bizzarro Method</span>
          </p>
          
          <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
            </p>
            <p style="color: #6b7280; font-size: 13px; margin: 5px 0;">
              Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom
            </p>
            <p style="color: #9ca3af; font-size: 11px; margin: 15px 0 5px 0;">
              <a href="https://danbizzarromethod.com/unsubscribe" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> from these emails
            </p>
          </div>
        </div>
      </div>
    `;

    const textContent = `
Congratulations! You've Earned a Loyalty Discount

Dear valued client,

Thank you for your continued support and participation in our clinics!

You've earned a 20% discount!
Your discount code: ${discountCode}

This discount is valid for 12 months and can be used once on any of our upcoming clinics.

Thank you for being a loyal member of the Dan Bizzarro Method community!

Best regards,
Dan Bizzarro
Dan Bizzarro Method

📧 dan@danbizzarromethod.com | 📞 +44 7767 291713
Crown Farm, Ascott-Under-Wychwood, Oxfordshire OX7, United Kingdom

Unsubscribe: https://danbizzarromethod.com/unsubscribe
    `;

    return this.sendEmail(subscriberEmail, "🎉 You've Earned a Loyalty Discount!", htmlContent, textContent);
  }

  async subscribeToNewsletter(email: string, firstName?: string, lastName?: string, source: string = "newsletter"): Promise<boolean> {
    try {
      const existing = await storage.getEmailSubscriberByEmail(email);
      if (existing && existing.isActive) {
        return true;
      }
      
      if (existing && !existing.isActive) {
        await storage.updateEmailSubscriber(existing.id, { 
          isActive: true,
          subscriptionSource: source
        });
      } else {
        await storage.createEmailSubscriber({
          email,
          firstName,
          lastName,
          subscriptionSource: source,
          interests: ["news", "clinics"]
        });
      }
      
      await this.sendWelcomeEmail(email);
      
      return true;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
