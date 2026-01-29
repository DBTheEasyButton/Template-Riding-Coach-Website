import { storage } from "./storage";
import { emailService } from "./emailService";

class WaitlistService {
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes

  start() {
    if (this.intervalId) {
      console.log("Waitlist service already running");
      return;
    }

    console.log("Starting waitlist expiration check service (every 5 minutes)");
    
    // Run immediately on start
    this.checkExpiredNotifications();
    
    // Then run periodically
    this.intervalId = setInterval(() => {
      this.checkExpiredNotifications();
    }, this.CHECK_INTERVAL_MS);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Waitlist service stopped");
    }
  }

  private async checkExpiredNotifications() {
    try {
      const expiredEntries = await storage.getExpiredWaitlistNotifications();
      
      if (expiredEntries.length === 0) {
        return;
      }

      console.log(`Found ${expiredEntries.length} expired waitlist notifications`);

      for (const expired of expiredEntries) {
        try {
          // Remove the expired entry
          await storage.expireWaitlistEntry(expired.id);
          console.log(`Removed expired waitlist entry for ${expired.email} (clinic ${expired.clinicId})`);

          // Get the next person in the waitlist for this clinic/session
          const nextInWaitlist = await storage.getNextInWaitlist(expired.clinicId, expired.sessionId || undefined);
          
          if (nextInWaitlist) {
            // Notify the next person
            const notifiedEntry = await storage.notifyWaitlistEntry(nextInWaitlist.id);
            
            if (notifiedEntry) {
              // Get clinic details for the email
              const clinic = await storage.getClinic(expired.clinicId);
              
              if (clinic) {
                const clinicDate = new Date(clinic.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });

                // Get session price if applicable
                let price = clinic.price;
                if (notifiedEntry.sessionId) {
                  const allSessions = await storage.getAllClinicSessions();
                  const session = allSessions.find((s) => s.id === notifiedEntry.sessionId);
                  if (session?.price) {
                    price = session.price;
                  }
                }

                // Send notification email
                await emailService.sendWaitlistSpotAvailable(
                  notifiedEntry.email,
                  notifiedEntry.firstName,
                  clinic.title,
                  clinicDate,
                  clinic.location,
                  price,
                  clinic.id,
                  notifiedEntry.sessionId || undefined
                );
                
                console.log(`Waitlist spot available email sent to next person: ${notifiedEntry.email} (2 hour window started)`);
              }
            }
          } else {
            console.log(`No more people in waitlist for clinic ${expired.clinicId}`);
          }
        } catch (entryError) {
          console.error(`Error processing expired waitlist entry ${expired.id}:`, entryError);
        }
      }
    } catch (error) {
      console.error("Error checking expired waitlist notifications:", error);
    }
  }
}

export const waitlistService = new WaitlistService();
