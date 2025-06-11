import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { 
  insertContactSchema, 
  insertClinicRegistrationSchema, 
  insertClinicSchema,
  insertEmailSubscriberSchema,
  insertEmailTemplateSchema,
  insertEmailCampaignSchema,
  insertEmailAutomationSchema
} from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get all events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get all news
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Submit contact form
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  // Get all clinics
  app.get("/api/clinics", async (req, res) => {
    try {
      const clinics = await storage.getAllClinics();
      res.json(clinics);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      res.status(500).json({ message: "Failed to fetch clinics" });
    }
  });

  // Get specific clinic
  app.get("/api/clinics/:id", async (req, res) => {
    try {
      const clinic = await storage.getClinic(parseInt(req.params.id));
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      res.json(clinic);
    } catch (error) {
      console.error("Error fetching clinic:", error);
      res.status(500).json({ message: "Failed to fetch clinic" });
    }
  });

  // Create payment intent for clinic registration
  app.post("/api/clinics/:id/create-payment-intent", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const { sessionIds } = req.body;
      
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      let amount: number;
      
      if (clinic.hasMultipleSessions && sessionIds?.length > 0) {
        // Calculate total for selected sessions
        const allSessions = await storage.getAllClinics();
        const clinicWithSessions = allSessions.find(c => c.id === clinicId);
        if (!clinicWithSessions?.sessions) {
          return res.status(400).json({ message: "Sessions not found" });
        }
        
        const selectedSessions = clinicWithSessions.sessions.filter(s => sessionIds.includes(s.id));
        amount = selectedSessions.reduce((total, session) => total + session.price, 0);
      } else {
        // Single session clinic
        amount = clinic.price;
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount is already in cents
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          clinicId: clinicId.toString(),
          sessionIds: sessionIds ? JSON.stringify(sessionIds) : null,
        },
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Register for clinic (after payment confirmation)
  app.post("/api/clinics/:id/register", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const { paymentIntentId, ...registrationData } = req.body;
      
      // Verify payment was successful
      if (paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ message: "Payment not completed" });
        }
      }
      
      const validatedData = insertClinicRegistrationSchema.parse({
        ...registrationData,
        clinicId,
        status: 'confirmed' // Set to confirmed since payment succeeded
      });
      
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      if (clinic.currentParticipants >= clinic.maxParticipants) {
        return res.status(400).json({ message: "Clinic is full" });
      }
      
      const registration = await storage.createClinicRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating clinic registration:", error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  // Admin clinic management routes
  app.get("/api/admin/clinics", async (req, res) => {
    try {
      const clinics = await storage.getAllClinics();
      res.json(clinics);
    } catch (error) {
      console.error("Error fetching admin clinics:", error);
      res.status(500).json({ message: "Failed to fetch clinics" });
    }
  });

  app.get("/api/admin/clinics/:id", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const clinics = await storage.getAllClinics();
      const clinic = clinics.find(c => c.id === clinicId);
      
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      res.json(clinic);
    } catch (error) {
      console.error("Error fetching clinic:", error);
      res.status(500).json({ message: "Failed to fetch clinic" });
    }
  });

  app.post("/api/admin/clinics", async (req, res) => {
    try {
      // Convert date strings to Date objects before validation
      const rawData = req.body;
      const { sessions, ...clinicData } = rawData;
      
      // Convert price to cents if it exists
      const processedPrice = clinicData.price ? Math.round(parseFloat(clinicData.price.toString()) * 100) : 0;
      
      const processedClinicData = {
        ...clinicData,
        date: new Date(clinicData.date),
        endDate: new Date(clinicData.endDate),
        price: processedPrice
      };
      
      // Validate the clinic data
      const validatedData = insertClinicSchema.parse(processedClinicData);
      const clinic = await storage.createClinic(validatedData);
      
      // If there are sessions, create them
      if (sessions && Array.isArray(sessions) && sessions.length > 0) {
        for (const session of sessions) {
          await storage.createClinicSession({
            clinicId: clinic.id,
            sessionName: session.sessionName,
            startTime: "09:00", // Default time since not needed in UI
            endTime: "17:00", // Default time since not needed in UI
            discipline: session.discipline,
            skillLevel: session.skillLevel,
            price: session.price ? Math.round(session.price * 100) : 8000,
            maxParticipants: 8, // Default value, actual limits controlled by clinic-level settings
            currentParticipants: 0,
            requirements: session.requirements || null
          });
        }
      }
      
      res.status(201).json(clinic);
    } catch (error) {
      console.error("Error creating clinic:", error);
      res.status(400).json({ message: "Invalid clinic data" });
    }
  });

  app.put("/api/admin/clinics/:id", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const updateData = { ...req.body };
      
      // Process all allowed fields - allow empty strings to clear old data
      const allowedFields = [
        'title', 'description', 'date', 'endDate', 'location', 'price', 
        'maxParticipants', 'level', 'type', 'image', 'isActive',
        'hasMultipleSessions', 'clinicType', 'crossCountryMaxParticipants', 
        'showJumpingMaxParticipants'
      ];
      
      const cleanedData: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          // Allow empty strings and null values to clear old data
          cleanedData[field] = updateData[field];
        }
      }
      
      // Convert date strings to proper Date objects only if they're valid
      if (cleanedData.date && typeof cleanedData.date === 'string' && cleanedData.date.trim() !== '') {
        try {
          const dateStr = cleanedData.date.includes('T') ? cleanedData.date : `${cleanedData.date}T09:00:00.000Z`;
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            cleanedData.date = parsedDate;
          } else {
            delete cleanedData.date; // Remove invalid date
          }
        } catch (e) {
          delete cleanedData.date; // Remove invalid date
        }
      } else if (cleanedData.date === '' || cleanedData.date === null) {
        cleanedData.date = null; // Allow clearing the date field
      }
      
      if (cleanedData.endDate && typeof cleanedData.endDate === 'string' && cleanedData.endDate.trim() !== '') {
        try {
          const dateStr = cleanedData.endDate.includes('T') ? cleanedData.endDate : `${cleanedData.endDate}T17:00:00.000Z`;
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            cleanedData.endDate = parsedDate;
          } else {
            delete cleanedData.endDate; // Remove invalid date
          }
        } catch (e) {
          delete cleanedData.endDate; // Remove invalid date
        }
      } else if (cleanedData.endDate === '' || cleanedData.endDate === null) {
        delete cleanedData.endDate; // Don't update with empty values
      }
      
      // Convert price to number and then to cents
      if (cleanedData.price !== undefined) {
        const priceInPounds = parseFloat(cleanedData.price.toString());
        cleanedData.price = Math.round(priceInPounds * 100);
      }
      
      // Convert participant counts to numbers
      if (cleanedData.maxParticipants !== undefined) {
        cleanedData.maxParticipants = parseInt(cleanedData.maxParticipants.toString());
      }
      if (cleanedData.crossCountryMaxParticipants !== undefined) {
        cleanedData.crossCountryMaxParticipants = parseInt(cleanedData.crossCountryMaxParticipants.toString());
      }
      if (cleanedData.showJumpingMaxParticipants !== undefined) {
        cleanedData.showJumpingMaxParticipants = parseInt(cleanedData.showJumpingMaxParticipants.toString());
      }
      // Extract sessions from the update data
      const { sessions, ...clinicUpdateData } = updateData;
      
      const updatedClinic = await storage.updateClinic(clinicId, cleanedData);
      if (!updatedClinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      // Recreate sessions if provided (old sessions already deleted in updateClinic)
      if (sessions && Array.isArray(sessions)) {
        for (const session of sessions) {
          await storage.createClinicSession({
            clinicId: updatedClinic.id,
            sessionName: session.sessionName || "",
            startTime: "09:00",
            endTime: "17:00", 
            discipline: session.discipline || "jumping",
            skillLevel: session.skillLevel || "90cm",
            price: session.price ? Math.round(session.price * 100) : 8000,
            maxParticipants: 12,
            currentParticipants: 0,
            requirements: session.requirements || null
          });
        }
      }
      
      res.json(updatedClinic);
    } catch (error) {
      console.error("Error updating clinic:", error);
      res.status(400).json({ message: "Invalid clinic data" });
    }
  });

  app.delete("/api/admin/clinics/:id", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      await storage.deleteClinic(clinicId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting clinic:", error);
      res.status(500).json({ message: "Failed to delete clinic" });
    }
  });

  // Admin contact management
  app.get('/api/admin/contacts', async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Get all training videos
  app.get("/api/training-videos", async (req, res) => {
    try {
      const { category } = req.query;
      let videos;
      
      if (category && typeof category === 'string') {
        videos = await storage.getTrainingVideosByCategory(category);
      } else {
        videos = await storage.getAllTrainingVideos();
      }
      
      res.json(videos);
    } catch (error) {
      console.error("Error fetching training videos:", error);
      res.status(500).json({ message: "Failed to fetch training videos" });
    }
  });

  // Update video view count
  app.post("/api/training-videos/:id/view", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      await storage.updateVideoViewCount(videoId);
      res.status(200).json({ message: "View count updated" });
    } catch (error) {
      console.error("Error updating view count:", error);
      res.status(500).json({ message: "Failed to update view count" });
    }
  });

  // Testimonials endpoints
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching featured testimonials:", error);
      res.status(500).json({ message: "Failed to fetch featured testimonials" });
    }
  });

  // Admin Registration Management Routes

  // Get all registrations for admin
  app.get("/api/admin/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllClinicRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching all registrations:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  // Check refund eligibility for a registration
  app.get("/api/admin/registrations/:id/refund-check", async (req, res) => {
    try {
      const registrationId = parseInt(req.params.id);
      const refundCheck = await storage.canProcessRefund(registrationId);
      res.json(refundCheck);
    } catch (error) {
      console.error("Error checking refund eligibility:", error);
      res.status(500).json({ message: "Failed to check refund eligibility" });
    }
  });

  // Process cancellation and refund (admin only)
  app.post("/api/admin/registrations/:id/cancel", async (req, res) => {
    try {
      const registrationId = parseInt(req.params.id);
      const { reason } = req.body;

      // Check refund eligibility first
      const refundCheck = await storage.canProcessRefund(registrationId);
      
      if (refundCheck.eligible) {
        // Get the registration details for waitlist promotion
        const registrations = await storage.getAllClinicRegistrations();
        const cancelledReg = registrations.find(r => r.id === registrationId);
        
        // Process automatic refund with admin fee
        const updatedRegistration = await storage.updateRegistrationStatus(
          registrationId, 
          "cancelled_by_admin", 
          refundCheck.amount,
          reason || `Automatic refund processed - £5 admin fee deducted`
        );

        let promotedParticipant = null;
        
        // If there's a waitlist, automatically promote the first person
        if (refundCheck.reason.includes("waiting list") && cancelledReg) {
          promotedParticipant = await storage.promoteFromWaitlist(cancelledReg.clinicId);
          if (promotedParticipant) {
            // Create a confirmed registration for the promoted participant
            await storage.createClinicRegistration({
              clinicId: cancelledReg.clinicId,
              sessionId: cancelledReg.sessionId || undefined,
              firstName: promotedParticipant.firstName,
              lastName: promotedParticipant.lastName,
              email: promotedParticipant.email,
              phone: promotedParticipant.phone,
              experienceLevel: promotedParticipant.experienceLevel,
              horseName: promotedParticipant.horseName || undefined,
              specialRequests: promotedParticipant.specialRequests || undefined,
              emergencyContact: "To be provided", // Waitlist entries don't have emergency contact info
              emergencyPhone: "To be provided",
              medicalConditions: undefined,
              paymentMethod: "bank_transfer",
              agreeToTerms: true,
              status: "confirmed"
            });
            console.log(`Automatically promoted waitlist participant: ${promotedParticipant.email}`);
          }
        }

        const adminFeeText = refundCheck.adminFee ? ` (£${(refundCheck.adminFee / 100).toFixed(2)} admin fee deducted)` : '';
        const promotionText = promotedParticipant ? ` - ${promotedParticipant.firstName} ${promotedParticipant.lastName} has been automatically accepted from the waiting list` : '';

        res.json({
          success: true,
          message: `Refund processed: £${(refundCheck.amount! / 100).toFixed(2)}${adminFeeText}${promotionText}`,
          registration: updatedRegistration,
          refundAmount: refundCheck.amount,
          adminFee: refundCheck.adminFee,
          promotedParticipant: promotedParticipant
        });
      } else {
        // Cancel without refund
        const updatedRegistration = await storage.updateRegistrationStatus(
          registrationId, 
          "cancelled_by_admin", 
          0,
          reason || refundCheck.reason
        );

        res.json({
          success: true,
          message: `Registration cancelled - no refund (${refundCheck.reason})`,
          registration: updatedRegistration,
          refundAmount: 0
        });
      }
    } catch (error) {
      console.error("Error processing cancellation:", error);
      res.status(500).json({ message: "Failed to process cancellation" });
    }
  });

  // Excel export for registrations
  app.get("/api/admin/registrations/excel-export", async (req, res) => {
    try {
      const XLSX = require('xlsx');
      
      // Get all registrations with clinic details
      const registrations = await storage.getAllClinicRegistrations();
      const clinics = await storage.getAllClinics();
      
      // Create clinic lookup
      const clinicLookup = clinics.reduce((acc, clinic) => {
        acc[clinic.id] = clinic;
        return acc;
      }, {} as Record<number, any>);

      // Group registrations by clinic and organize by sessions/disciplines
      const clinicGroups = registrations.reduce((acc, reg) => {
        if (reg.status !== 'confirmed') return acc;
        
        const clinic = clinicLookup[reg.clinicId];
        if (!clinic) return acc;

        if (!acc[clinic.title]) {
          acc[clinic.title] = {
            showJumping: [],
            crossCountry: [],
            general: []
          };
        }

        // Determine discipline based on session or default to general
        let discipline = 'general';
        if (clinic.hasMultipleSessions && reg.sessionId) {
          // Would need session lookup for specific discipline
          discipline = 'general';
        } else if (clinic.title.toLowerCase().includes('show jumping')) {
          discipline = 'showJumping';
        } else if (clinic.title.toLowerCase().includes('cross country')) {
          discipline = 'crossCountry';
        }

        acc[clinic.title][discipline].push({
          'Rider Name': `${reg.firstName} ${reg.lastName}`,
          'Horse Name': reg.horseName || 'N/A',
          'Experience Level': reg.experienceLevel,
          'Special Requests': reg.specialRequests || 'None',
          'Email': reg.email,
          'Phone': reg.phone,
          'Emergency Contact': reg.emergencyContact,
          'Emergency Phone': reg.emergencyPhone,
          'Registration Date': new Date(reg.registeredAt).toLocaleDateString('en-GB')
        });

        return acc;
      }, {} as Record<string, any>);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add sheets for each clinic and discipline
      Object.entries(clinicGroups).forEach(([clinicName, disciplines]) => {
        Object.entries(disciplines).forEach(([discipline, participants]) => {
          if (participants.length === 0) return;

          const sheetName = `${clinicName.substring(0, 20)} - ${discipline}`.substring(0, 31);
          const worksheet = XLSX.utils.json_to_sheet(participants);
          
          // Auto-size columns
          const cols = [
            { wch: 20 }, // Rider Name
            { wch: 20 }, // Horse Name
            { wch: 15 }, // Experience Level
            { wch: 30 }, // Special Requests
            { wch: 25 }, // Email
            { wch: 15 }, // Phone
            { wch: 20 }, // Emergency Contact
            { wch: 15 }, // Emergency Phone
            { wch: 15 }  // Registration Date
          ];
          worksheet['!cols'] = cols;

          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });
      });

      // If no sheets were added, create a summary sheet
      if (workbook.SheetNames.length === 0) {
        const summaryData = [{
          'Message': 'No confirmed registrations found',
          'Export Date': new Date().toLocaleDateString('en-GB')
        }];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      }

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // Set headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="clinic-registrations-${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      res.send(buffer);
    } catch (error) {
      console.error("Error generating Excel export:", error);
      res.status(500).json({ message: "Failed to generate Excel export" });
    }
  });

  // Email Marketing System Routes

  // Newsletter subscription
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const success = await emailService.subscribeToNewsletter(email, firstName, lastName, "newsletter");
      
      if (success) {
        res.json({ message: "Successfully subscribed to newsletter" });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Bulk email import for admin
  app.post("/api/admin/email-subscribers/bulk-import", async (req, res) => {
    try {
      const { emails, source = "bulk_import" } = req.body;
      
      if (!emails || !Array.isArray(emails)) {
        return res.status(400).json({ message: "Emails array is required" });
      }

      const results: { imported: number; skipped: number; errors: string[] } = { imported: 0, skipped: 0, errors: [] };

      for (const emailData of emails) {
        try {
          const email = typeof emailData === 'string' ? emailData : emailData.email;
          const firstName = typeof emailData === 'object' ? emailData.firstName : undefined;
          const lastName = typeof emailData === 'object' ? emailData.lastName : undefined;

          if (!email || !email.includes('@')) {
            results.errors.push(`Invalid email: ${email}`);
            continue;
          }

          // Check if already exists
          const existing = await storage.getEmailSubscriberByEmail(email);
          if (existing) {
            results.skipped++;
            continue;
          }

          await storage.createEmailSubscriber({
            email,
            firstName,
            lastName,
            subscriptionSource: source,
            interests: ["news", "clinics"]
          });

          results.imported++;
        } catch (error) {
          results.errors.push(`Failed to import ${emailData}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      res.json({
        message: `Import completed: ${results.imported} imported, ${results.skipped} skipped`,
        results
      });
    } catch (error) {
      console.error("Error bulk importing emails:", error);
      res.status(500).json({ message: "Failed to bulk import emails" });
    }
  });

  // Unsubscribe from newsletter
  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      await storage.unsubscribeEmail(email);
      res.json({ message: "Successfully unsubscribed from newsletter" });
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  // Email subscribers management (admin routes)
  app.get("/api/admin/email-subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllEmailSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching email subscribers:", error);
      res.status(500).json({ message: "Failed to fetch email subscribers" });
    }
  });

  // Email templates management
  app.get("/api/admin/email-templates", async (req, res) => {
    try {
      const templates = await storage.getAllEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });

  app.post("/api/admin/email-templates", async (req, res) => {
    try {
      const templateData = insertEmailTemplateSchema.parse(req.body);
      const template = await storage.createEmailTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating email template:", error);
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.put("/api/admin/email-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertEmailTemplateSchema.partial().parse(req.body);
      const template = await storage.updateEmailTemplate(id, updates);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error updating email template:", error);
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.delete("/api/admin/email-templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmailTemplate(id);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting email template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Email campaigns management
  app.get("/api/admin/email-campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getAllEmailCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching email campaigns:", error);
      res.status(500).json({ message: "Failed to fetch email campaigns" });
    }
  });

  app.post("/api/admin/email-campaigns", async (req, res) => {
    try {
      const campaignData = insertEmailCampaignSchema.parse(req.body);
      const campaign = await storage.createEmailCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating email campaign:", error);
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  app.post("/api/admin/email-campaigns/:id/send", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await emailService.sendCampaign(id);
      res.json({ 
        message: "Campaign sent successfully", 
        sent: result.sent, 
        failed: result.failed 
      });
    } catch (error) {
      console.error("Error sending email campaign:", error);
      res.status(500).json({ message: "Failed to send campaign" });
    }
  });

  // Email automations management
  app.get("/api/admin/email-automations", async (req, res) => {
    try {
      const automations = await storage.getAllEmailAutomations();
      res.json(automations);
    } catch (error) {
      console.error("Error fetching email automations:", error);
      res.status(500).json({ message: "Failed to fetch email automations" });
    }
  });

  app.post("/api/admin/email-automations", async (req, res) => {
    try {
      const automationData = insertEmailAutomationSchema.parse(req.body);
      const automation = await storage.createEmailAutomation(automationData);
      res.status(201).json(automation);
    } catch (error) {
      console.error("Error creating email automation:", error);
      res.status(400).json({ message: "Invalid automation data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
