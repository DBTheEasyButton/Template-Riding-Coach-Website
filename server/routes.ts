import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
import { storage } from "./storage";
import { emailService } from "./emailService";
import { facebookService } from "./facebookService";
import { replaceCsvEmails } from "./csvImport";
import { ImageOptimizer } from "./imageOptimizer";
import { 
  insertContactSchema, 
  insertClinicRegistrationSchema, 
  insertClinicSchema,
  insertEmailSubscriberSchema,
  insertEmailTemplateSchema,
  insertEmailCampaignSchema,
  insertEmailAutomationSchema,
  insertGallerySchema,
  insertCompetitionChecklistSchema,
  insertSponsorSchema
} from "@shared/schema";
import { prerenderService } from "./prerenderService";
import { generateWarmupSystemPDF } from "./generateWarmupPDF";
import { generateStrongHorsePDF } from "./generateStrongHorsePDF";
import crypto from "crypto";

// SMS Verification Code Storage (in-memory with auto-cleanup)
interface VerificationCode {
  code: string;
  phone: string;
  expiresAt: Date;
  lastSentAt: Date;
  attempts: number;
}
const verificationCodes = new Map<string, VerificationCode>();

// Cleanup expired codes every 5 minutes
setInterval(() => {
  const now = new Date();
  const entries = Array.from(verificationCodes.entries());
  for (const [key, value] of entries) {
    if (value.expiresAt < now) {
      verificationCodes.delete(key);
    }
  }
}, 5 * 60 * 1000);

function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function normalizePhoneForKey(phone: string): string {
  return phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
}

// In production, always use the live key. Only use testing key in development if explicitly set.
const isProduction = process.env.NODE_ENV === 'production';
const stripeKey = isProduction 
  ? process.env.STRIPE_SECRET_KEY 
  : (process.env.TESTING_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY);

if (!stripeKey) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

if (isProduction && process.env.TESTING_STRIPE_SECRET_KEY) {
  console.log('Note: TESTING_STRIPE_SECRET_KEY is set but ignored in production - using STRIPE_SECRET_KEY');
}

if (stripeKey.startsWith('pk_')) {
  console.warn('WARNING: STRIPE_SECRET_KEY appears to be a publishable key (pk_). This should be a secret key (sk_).');
  console.warn('Payment processing may not work correctly. Please update STRIPE_SECRET_KEY to a secret key.');
}

if (!stripeKey.startsWith('sk_') && !stripeKey.startsWith('pk_')) {
  console.warn('WARNING: STRIPE_SECRET_KEY has unexpected format. Key prefix:', stripeKey.substring(0, 7));
}

console.log('Stripe initialized with key type:', stripeKey.substring(0, 7));
const stripe = new Stripe(stripeKey);

// Get Stripe publishable key for frontend (runtime loading)
const stripePublishableKey = process.env.VITE_STRIPE_PUBLIC_KEY || '';
if (!stripePublishableKey) {
  console.warn('WARNING: VITE_STRIPE_PUBLIC_KEY not set - Stripe payments will not work on frontend');
}

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'client', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `news-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB - allow large files since we'll compress them
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Runtime Stripe publishable key endpoint - allows frontend to get key without rebuild
  app.get("/api/config/stripe-key", (req, res) => {
    if (!stripePublishableKey) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }
    res.json({ publishableKey: stripePublishableKey });
  });

  // SMS Verification Endpoints
  app.post("/api/sms/send-code", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Validate UK phone number format
      const cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
      const isValidUK = /^(07\d{9}|(\+44|44)7\d{9})$/.test(cleanPhone);
      
      if (!isValidUK) {
        return res.status(400).json({ 
          error: 'Please enter a valid UK mobile number (e.g., 07xxx xxxxxx)' 
        });
      }

      const phoneKey = normalizePhoneForKey(phone);
      const now = new Date();
      
      // Rate limiting - check if we recently sent a code (60 second cooldown)
      const existing = verificationCodes.get(phoneKey);
      if (existing) {
        const timeSinceLastSent = now.getTime() - existing.lastSentAt.getTime();
        const cooldownMs = 60 * 1000; // 60 seconds
        
        if (timeSinceLastSent < cooldownMs) {
          const retryAfter = Math.ceil((cooldownMs - timeSinceLastSent) / 1000);
          return res.status(429).json({ 
            error: `Please wait ${retryAfter} seconds before requesting another code`,
            retryAfter
          });
        }
      }

      // Generate and store verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes
      
      verificationCodes.set(phoneKey, {
        code,
        phone: cleanPhone,
        expiresAt,
        lastSentAt: now,
        attempts: 0
      });

      // Send SMS via GHL
      const message = `Your Dan Bizzarro Method verification code is: ${code}. This code expires in 10 minutes.`;
      const result = await storage.sendSmsViaGhl(cleanPhone, message);

      if (!result.success) {
        console.error('Failed to send SMS:', result.message);
        return res.status(500).json({ 
          error: 'Failed to send verification code. Please check your phone number and try again.' 
        });
      }

      console.log(`Verification code sent to ${cleanPhone}`);
      res.json({ success: true, message: 'Verification code sent' });
      
    } catch (error) {
      console.error('Error sending verification code:', error);
      res.status(500).json({ error: 'Failed to send verification code' });
    }
  });

  app.post("/api/sms/verify-code", async (req, res) => {
    try {
      const { phone, code } = req.body;
      
      if (!phone || !code) {
        return res.status(400).json({ error: 'Phone and code are required' });
      }

      const phoneKey = normalizePhoneForKey(phone);
      const stored = verificationCodes.get(phoneKey);

      if (!stored) {
        return res.status(400).json({ error: 'No verification code found. Please request a new code.' });
      }

      if (stored.expiresAt < new Date()) {
        verificationCodes.delete(phoneKey);
        return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
      }

      // Increment attempts
      stored.attempts += 1;

      // Max 5 attempts
      if (stored.attempts > 5) {
        verificationCodes.delete(phoneKey);
        return res.status(400).json({ error: 'Too many incorrect attempts. Please request a new code.' });
      }

      if (stored.code !== code.trim()) {
        return res.status(400).json({ 
          error: 'Incorrect code. Please try again.',
          attemptsRemaining: 5 - stored.attempts
        });
      }

      // Success - delete the code
      verificationCodes.delete(phoneKey);
      
      console.log(`Phone verified: ${stored.phone}`);
      
      // Remove sms-verification-pending tag and add newsletter tag
      try {
        await storage.removeGhlTagsByPhone(stored.phone, ['sms-verification-pending']);
        await storage.addGhlTagsByPhone(stored.phone, ['newsletter']);
      } catch (tagError) {
        console.error('Error updating tags after verification:', tagError);
        // Don't fail the verification if tag update fails
      }
      
      // Mark phone as verified on visitor profile
      try {
        await storage.updateVisitorProfilePhoneVerified(stored.phone);
      } catch (profileError) {
        console.error('Error updating visitor profile phone verified:', profileError);
      }
      
      res.json({ success: true, verified: true });
      
    } catch (error) {
      console.error('Error verifying code:', error);
      res.status(500).json({ error: 'Failed to verify code' });
    }
  });

  // Stripe webhook endpoint - raw body parsing is handled in server/index.ts
  // This endpoint receives webhook events from Stripe for payment status updates
  app.post("/api/stripe-webhook", async (req, res) => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      const sig = req.headers['stripe-signature'];
      
      // PRODUCTION SECURITY: Require webhook secret in production
      if (process.env.NODE_ENV === 'production') {
        if (!webhookSecret) {
          console.error('STRIPE_WEBHOOK_SECRET not configured in production - refusing webhook');
          return res.status(500).json({ error: 'Webhook secret not configured' });
        }
        if (!sig) {
          console.error('Missing stripe-signature header - potential forged webhook');
          return res.status(400).json({ error: 'Missing signature' });
        }
      }
      
      // DEVELOPMENT WARNING: In development, webhook secret is optional for testing
      if (!webhookSecret) {
        console.warn('⚠️  STRIPE_WEBHOOK_SECRET not configured - webhook signature verification skipped');
        console.warn('⚠️  This is ONLY acceptable for local development testing');
        console.warn('⚠️  NEVER deploy to production without STRIPE_WEBHOOK_SECRET');
      }
      
      let event: Stripe.Event;

      try {
        // Verify webhook signature if secret and signature are both present
        if (webhookSecret && sig) {
          event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
          console.log(`✓ Webhook signature verified for event type: ${event.type}`);
        } else if (process.env.NODE_ENV === 'development' && !webhookSecret) {
          // DEVELOPMENT ONLY: Parse unsigned webhooks for local testing
          event = JSON.parse(req.body.toString());
          console.warn('⚠️  Processing UNSIGNED webhook in development mode');
        } else {
          // This should never happen due to checks above, but fail safe
          console.error('Webhook verification prerequisites not met');
          return res.status(400).json({ error: 'Invalid webhook request' });
        }
      } catch (err) {
        console.error('Webhook signature verification failed:', {
          error: err instanceof Error ? err.message : String(err),
          hasSignature: !!sig,
          hasSecret: !!webhookSecret
        });
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }

      // Handle the event
      try {
        switch (event.type) {
          case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment succeeded:', paymentIntent.id);
            
            // Extract metadata
            const discountCode = paymentIntent.metadata?.discountCode;
            const clinicId = paymentIntent.metadata?.clinicId;
            
            // Find registration by payment intent ID
            const allRegistrations = await storage.getAllClinicRegistrations();
            const registration = allRegistrations.find(r => r.paymentIntentId === paymentIntent.id);
            
            if (registration) {
              // Ensure registration status is confirmed
              if (registration.status !== 'confirmed') {
                await storage.updateRegistrationStatus(registration.id, 'confirmed');
                console.log(`Updated registration ${registration.id} to confirmed via webhook`);
              }
              
              // Mark discount code as used (backup in case registration endpoint failed)
              if (discountCode) {
                try {
                  // Check if discount is already marked as used
                  const discount = await storage.getDiscountByCode(discountCode);
                  if (discount && !discount.isUsed) {
                    await storage.useLoyaltyDiscount(discountCode, registration.id);
                    console.log(`Marked discount ${discountCode} as used via webhook for registration ${registration.id}`);
                  }
                } catch (error) {
                  console.error('Failed to mark discount as used in webhook:', error);
                }
              }
            } else {
              console.warn(`No registration found for payment intent ${paymentIntent.id}`);
            }
            break;
          }

          case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment failed:', paymentIntent.id);
            
            // Find registration and mark as cancelled if it exists
            const allRegistrations = await storage.getAllClinicRegistrations();
            const registration = allRegistrations.find(r => r.paymentIntentId === paymentIntent.id);
            
            if (registration && registration.status === 'pending') {
              await storage.updateRegistrationStatus(registration.id, 'cancelled', undefined, 'Payment failed');
              console.log(`Marked registration ${registration.id} as cancelled due to payment failure`);
            }
            break;
          }

          case 'charge.refunded': {
            const charge = event.data.object as Stripe.Charge;
            console.log('Charge refunded:', charge.id, 'Payment Intent:', charge.payment_intent);
            
            // Find registration by payment intent ID
            const allRegs = await storage.getAllClinicRegistrations();
            const reg = allRegs.find(r => r.paymentIntentId === charge.payment_intent);
            
            if (reg) {
              // Calculate refund amount
              const refundedAmount = charge.amount_refunded / 100; // Convert from cents to pounds
              const isFullRefund = charge.refunded; // true if fully refunded
              
              const refundNote = isFullRefund 
                ? `Full refund of £${refundedAmount.toFixed(2)} processed via Stripe`
                : `Partial refund of £${refundedAmount.toFixed(2)} processed via Stripe`;
              
              // Update registration status if not already cancelled
              if (reg.status !== 'cancelled' && reg.status !== 'cancelled_by_admin' && reg.status !== 'refunded') {
                await storage.updateRegistrationStatus(
                  reg.id, 
                  'refunded', 
                  Math.round(refundedAmount * 100), // Store in pence
                  refundNote
                );
                console.log(`Updated registration ${reg.id} to refunded: ${refundNote}`);
                
                // Deduct loyalty points for refunded registration
                try {
                  await storage.deductPoints(reg.email, 10, `Refund processed via Stripe`);
                  console.log(`Deducted 10 points from ${reg.email} due to Stripe refund`);
                } catch (pointsError) {
                  console.error('Failed to deduct points for Stripe refund:', pointsError);
                }
              } else {
                console.log(`Registration ${reg.id} already ${reg.status}, skipping status update and point deduction`);
              }
            } else {
              console.warn(`No registration found for refunded charge with payment intent ${charge.payment_intent}`);
            }
            break;
          }

          case 'charge.dispute.created': {
            const dispute = event.data.object as Stripe.Dispute;
            console.error('⚠️  CHARGEBACK ALERT: Dispute created!', {
              disputeId: dispute.id,
              chargeId: dispute.charge,
              amount: dispute.amount / 100,
              currency: dispute.currency,
              reason: dispute.reason,
              status: dispute.status
            });
            
            // Find the associated registration
            if (typeof dispute.charge === 'string') {
              try {
                const chargeDetails = await stripe.charges.retrieve(dispute.charge);
                const allRegsForDispute = await storage.getAllClinicRegistrations();
                const disputedReg = allRegsForDispute.find(r => r.paymentIntentId === chargeDetails.payment_intent);
                
                if (disputedReg) {
                  console.error(`⚠️  Disputed registration: ID ${disputedReg.id}, Email: ${disputedReg.email}, Clinic: ${disputedReg.clinicId}`);
                  // Update registration with dispute note
                  await storage.updateRegistrationStatus(
                    disputedReg.id,
                    'disputed',
                    undefined,
                    `Chargeback dispute opened: ${dispute.reason} - Dispute ID: ${dispute.id}`
                  );
                }
              } catch (chargeError) {
                console.error('Failed to retrieve charge details for dispute:', chargeError);
              }
            }
            break;
          }

          default:
            console.log(`Unhandled webhook event type: ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.json({ received: true });
      } catch (error) {
        console.error('Error processing webhook event:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
      }
    }
  );

  // Enhanced image upload endpoint with advanced optimization
  app.post("/api/upload-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }
      
      const originalPath = req.file.path;
      const originalSize = req.file.size;
      const originalBuffer = await fs.promises.readFile(originalPath);
      
      // Generate unique base name
      const baseName = req.file.filename.replace(/\.[^.]+$/, '');
      
      // Create multiple optimized versions using ImageOptimizer
      const responsiveVersions = await ImageOptimizer.createResponsiveVersions(originalBuffer, baseName);
      
      // Save all versions to disk
      const savedVersions: Record<string, { url: string; size: number }> = {};
      for (const [key, version] of Object.entries(responsiveVersions)) {
        const filePath = path.join(uploadsDir, version.filename);
        await fs.promises.writeFile(filePath, version.buffer);
        savedVersions[key] = {
          url: `/uploads/${version.filename}`,
          size: version.buffer.length
        };
      }
      
      // Also create an optimized main version for backwards compatibility
      const mainOptimized = await ImageOptimizer.optimizeImage(originalBuffer, {
        width: 1200,
        quality: 85,
        format: 'jpeg'
      });
      
      const mainFilename = `${baseName}-optimized.jpg`;
      const mainPath = path.join(uploadsDir, mainFilename);
      await fs.promises.writeFile(mainPath, mainOptimized.buffer);
      
      // Remove original file
      fs.unlinkSync(originalPath);
      
      // Return comprehensive response with all versions
      res.json({
        url: `/uploads/${mainFilename}`, // Main optimized version
        originalSize: originalSize,
        optimizedSize: mainOptimized.optimizedSize,
        compressionRatio: ImageOptimizer.calculateCompressionRatio(originalSize, mainOptimized.optimizedSize),
        dimensions: {
          width: mainOptimized.info.width,
          height: mainOptimized.info.height
        },
        responsiveVersions: savedVersions
      });
      
    } catch (error) {
      console.error('Image processing error:', error);
      
      // Fallback: if processing fails, return original file
      try {
        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
          return;
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ url: imageUrl });
      } catch (fallbackError) {
        res.status(500).json({ error: 'Failed to upload image' });
      }
    }
  });

  // Optimize existing images endpoint
  app.post("/api/optimize-images", async (req, res) => {
    try {
      console.log('Starting image optimization process...');
      await ImageOptimizer.optimizeExistingImages(uploadsDir);
      res.json({ success: true, message: 'Images optimized successfully' });
    } catch (error) {
      console.error('Image optimization failed:', error);
      res.status(500).json({ error: 'Failed to optimize images' });
    }
  });

  // Download PDF: The Eventer's Warm-Up System
  app.get("/api/downloads/warmup-system-pdf", async (req, res) => {
    try {
      const pdfBuffer = generateWarmupSystemPDF();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="The-Eventers-Warmup-System-Dan-Bizzarro.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating warm-up PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // Lead capture for Warm-Up PDF - creates/updates GHL contact with WarmUpPDF tag
  app.post("/api/lead-capture/warmup-pdf", async (req, res) => {
    try {
      const { firstName, lastName, email, mobile } = req.body;

      if (!firstName || !lastName || !email || !mobile) {
        return res.status(400).json({ error: 'First name, surname, email and mobile are required' });
      }

      let ghlContactId: string | undefined;

      // Create or update contact in GHL with WarmUpPDF tag
      try {
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email,
          firstName,
          lastName,
          mobile, // phone number
          ['WarmUpPDF', 'newsletter'], // tag for tracking this lead source
          { lead_source: 'Warm-Up PDF Download' }
        );
        
        if (ghlResult.success) {
          console.log(`GHL contact created/updated for ${email} with WarmUpPDF tag`);
          ghlContactId = ghlResult.contactId;
        } else {
          console.warn(`GHL contact creation warning for ${email}:`, ghlResult.message);
        }
      } catch (ghlError) {
        // Log error but don't fail the request - still provide the PDF
        console.error('GHL contact creation error (non-fatal):', ghlError);
      }

      // Create or update visitor profile for returning visitor recognition
      try {
        const { token } = await storage.createOrUpdateVisitorProfile(
          firstName,
          lastName,
          email,
          mobile,
          'WarmUpPDF',
          ghlContactId
        );
        
        // Set secure cookie for 90 days
        res.cookie('visitor_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
        });
      } catch (profileError) {
        console.error('Visitor profile creation error (non-fatal):', profileError);
      }

      // Generate and send the PDF
      const pdfBuffer = generateWarmupSystemPDF();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="The-Eventers-Warmup-System-Dan-Bizzarro.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error in lead capture endpoint:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Download PDF: The Strong Horse Solution
  app.get("/api/downloads/strong-horse-pdf", async (req, res) => {
    try {
      const pdfBuffer = generateStrongHorsePDF();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="The-Strong-Horse-Solution-Dan-Bizzarro.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating strong horse PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // Lead capture for Strong Horse PDF - creates/updates GHL contact with StrongHorsePDF tag
  app.post("/api/lead-capture/strong-horse-pdf", async (req, res) => {
    try {
      const { firstName, lastName, email, mobile, horseName, phoneVerified } = req.body;

      if (!firstName || !lastName || !email || !mobile || !horseName) {
        return res.status(400).json({ error: 'First name, surname, email, mobile and horse name are required' });
      }

      let ghlContactId: string | undefined;

      // Create or update contact in GHL with StrongHorse tag
      try {
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email,
          firstName,
          lastName,
          mobile, // phone number
          ['StrongHorse', 'newsletter'], // tag for tracking this lead source
          { lead_source: 'Strong Horse PDF Download', horse_name: horseName }
        );
        
        if (ghlResult.success) {
          console.log(`GHL contact created/updated for ${email} with StrongHorsePDF tag`);
          ghlContactId = ghlResult.contactId;
        } else {
          console.warn(`GHL contact creation warning for ${email}:`, ghlResult.message);
        }
      } catch (ghlError) {
        // Log error but don't fail the request - still provide the PDF
        console.error('GHL contact creation error (non-fatal):', ghlError);
      }

      // Create or update visitor profile for returning visitor recognition
      try {
        const { token } = await storage.createOrUpdateVisitorProfile(
          firstName,
          lastName,
          email,
          mobile,
          'StrongHorsePDF',
          ghlContactId,
          horseName,
          phoneVerified === true ? new Date() : undefined
        );
        
        // Set secure cookie for 90 days
        res.cookie('visitor_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
        });
      } catch (profileError) {
        console.error('Visitor profile creation error (non-fatal):', profileError);
      }

      // Generate and send the PDF
      const pdfBuffer = generateStrongHorsePDF();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="The-Strong-Horse-Solution-Dan-Bizzarro.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error in lead capture endpoint:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Lead capture for Strong Horse Audio Course - creates/updates GHL contact with StrongHorseAudio tag
  app.post("/api/lead-capture/strong-horse-audio", async (req, res) => {
    try {
      const { firstName, lastName, email, mobile, horseName, phoneVerified } = req.body;

      if (!firstName || !lastName || !email || !mobile || !horseName) {
        return res.status(400).json({ error: 'First name, surname, email, mobile and horse name are required' });
      }

      let ghlContactId: string | undefined;

      // Create or update contact in GHL with StrongHorseAudio tag
      try {
        const customFields: Record<string, string> = { lead_source: 'Strong Horse Trial Lesson' };
        if (horseName) {
          customFields.horse_name = horseName;
        }
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email,
          firstName,
          lastName,
          mobile,
          ['stl-trial', 'newsletter'],
          customFields
        );
        
        if (ghlResult.success) {
          console.log(`GHL contact created/updated for ${email} with stl-trial tag`);
          ghlContactId = ghlResult.contactId;
        } else {
          console.warn(`GHL contact creation warning for ${email}:`, ghlResult.message);
        }
      } catch (ghlError) {
        console.error('GHL contact creation error (non-fatal):', ghlError);
      }

      // Create or update visitor profile for returning visitor recognition
      try {
        const { token } = await storage.createOrUpdateVisitorProfile(
          firstName,
          lastName,
          email,
          mobile,
          'StrongHorseAudio',
          ghlContactId,
          horseName,
          phoneVerified === true ? new Date() : undefined
        );
        
        // Set secure cookie for 90 days
        res.cookie('visitor_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
        });
      } catch (profileError) {
        console.error('Visitor profile creation error (non-fatal):', profileError);
      }

      res.json({ success: true, message: 'Lead captured successfully' });
    } catch (error) {
      console.error('Error in audio lead capture endpoint:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // ============================================
  // VISITOR RECOGNITION SYSTEM
  // ============================================

  // Get current visitor profile (if recognized)
  app.get("/api/visitor/me", async (req, res) => {
    // Disable caching and ETag to ensure fresh phoneVerifiedAt status
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('ETag', '');
    
    try {
      const token = req.cookies?.visitor_token;
      
      if (!token) {
        return res.json({ recognized: false });
      }

      const profile = await storage.getVisitorProfileByToken(token);
      
      if (!profile) {
        // Token exists but profile not found - clear invalid cookie
        res.clearCookie('visitor_token');
        return res.json({ recognized: false });
      }

      // Update last seen timestamp
      await storage.updateVisitorProfileLastSeen(token);

      res.json({
        recognized: true,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        mobile: profile.mobile,
        horseName: profile.horseName,
        sources: profile.sources,
        phoneVerifiedAt: profile.phoneVerifiedAt?.toISOString() || null
      });
    } catch (error) {
      console.error('Error getting visitor profile:', error);
      res.json({ recognized: false });
    }
  });

  // Forget visitor (clear profile and cookie)
  app.post("/api/visitor/forget", async (req, res) => {
    try {
      const token = req.cookies?.visitor_token;
      
      if (token) {
        await storage.deleteVisitorProfile(token);
        res.clearCookie('visitor_token');
      }

      res.json({ success: true, message: 'Your details have been forgotten' });
    } catch (error) {
      console.error('Error forgetting visitor:', error);
      res.status(500).json({ error: 'Failed to forget visitor' });
    }
  });

  // Update visitor horse name and sync to GHL
  app.post("/api/visitor/update-horse-name", async (req, res) => {
    try {
      const token = req.cookies?.visitor_token;
      const { horseName } = req.body;

      if (!token) {
        return res.status(401).json({ error: 'No visitor token found' });
      }

      if (!horseName || !horseName.trim()) {
        return res.status(400).json({ error: 'Horse name is required' });
      }

      // Update visitor profile with horse name
      const updatedProfile = await storage.updateVisitorProfileHorseName(token, horseName.trim());

      if (!updatedProfile) {
        return res.status(404).json({ error: 'Visitor profile not found' });
      }

      // Also update horse name in GHL if we have a contact ID
      if (updatedProfile.ghlContactId || updatedProfile.email) {
        try {
          await storage.createOrUpdateGhlContactInApi(
            updatedProfile.email,
            updatedProfile.firstName,
            updatedProfile.lastName,
            updatedProfile.mobile,
            [], // No new tags
            { horse_name: horseName.trim() }
          );
          console.log(`Updated horse name in GHL for ${updatedProfile.email}: ${horseName.trim()}`);
        } catch (ghlError) {
          console.error('GHL update error (non-fatal):', ghlError);
        }
      }

      res.json({ 
        success: true, 
        message: 'Horse name updated successfully',
        horseName: horseName.trim()
      });
    } catch (error) {
      console.error('Error updating horse name:', error);
      res.status(500).json({ error: 'Failed to update horse name' });
    }
  });

  // Audio Course payment intent - creates Stripe payment for £97 audio course (or £72 with DAN25 discount)
  app.post("/api/audio-course/create-payment-intent", async (req, res) => {
    try {
      const { firstName, lastName, email, mobile, horseName, discountCode } = req.body;

      if (!firstName || !lastName || !email || !mobile || !horseName) {
        return res.status(400).json({ error: 'First name, surname, email, mobile and horse name are required' });
      }

      let amount = 9700; // £97 in pence
      let discountApplied = false;
      
      // Apply DAN25 discount code for 25% off (£72)
      if (discountCode && discountCode.toUpperCase() === 'DAN25') {
        amount = 7200; // £72 in pence
        discountApplied = true;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          productType: 'audio-course',
          productName: 'Strong to Soft & Light - Audio Course',
          customerEmail: email,
          customerFirstName: firstName,
          customerLastName: lastName,
          customerMobile: mobile,
          customerHorseName: horseName || '',
          discountCode: discountApplied ? 'DAN25' : '',
          discountApplied: discountApplied ? 'yes' : 'no',
        },
        receipt_email: email,
      });

      console.log(`Audio course payment intent created: ${paymentIntent.id} for ${email}${discountApplied ? ' (DAN25 discount applied)' : ''}`);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        discountApplied: discountApplied
      });
    } catch (error) {
      console.error("Error creating audio course payment intent:", error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  // Audio Course purchase completion - called after successful payment
  app.post("/api/audio-course/complete-purchase", async (req, res) => {
    try {
      const { paymentIntentId, firstName, lastName, email, mobile, horseName } = req.body;

      if (!paymentIntentId || !firstName || !lastName || !email || !mobile || !horseName) {
        return res.status(400).json({ error: 'Payment intent ID, customer details and horse name are required' });
      }

      // Verify the payment was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Get discount info from payment metadata
      const discountApplied = paymentIntent.metadata?.discountApplied === 'yes';
      const purchaseAmount = discountApplied ? '£72' : '£97';

      // Create or update contact in GHL with stl-fullcourse tag
      try {
        const customFields: Record<string, string> = { 
          lead_source: 'Strong to Soft & Light - Audio Course Purchase',
          purchase_date: new Date().toISOString(),
          purchase_amount: purchaseAmount
        };
        if (horseName) {
          customFields.horse_name = horseName;
        }
        if (discountApplied) {
          customFields.discount_used = 'DAN25';
        }
        
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email,
          firstName,
          lastName,
          mobile,
          ['stl-fullcourse', 'newsletter'],
          customFields
        );
        
        if (ghlResult.success) {
          console.log(`GHL contact created/updated for ${email} with stl-fullcourse tag after audio course purchase`);
        } else {
          console.warn(`GHL contact creation warning for ${email}:`, ghlResult.message);
        }
      } catch (ghlError) {
        console.error('GHL contact creation error (non-fatal):', ghlError);
      }

      console.log(`Audio course purchase completed for ${email}, payment: ${paymentIntentId}`);

      res.json({ 
        success: true, 
        message: 'Purchase completed successfully. You will receive an email with access to the course.' 
      });
    } catch (error) {
      console.error("Error completing audio course purchase:", error);
      res.status(500).json({ error: 'Failed to complete purchase' });
    }
  });

  // 28 Days Challenge payment intent - creates Stripe payment for £147
  app.post("/api/challenge/create-payment-intent", async (req, res) => {
    try {
      const { firstName, lastName, email, mobile, horseName } = req.body;

      if (!firstName || !lastName || !email || !mobile || !horseName) {
        return res.status(400).json({ error: 'First name, surname, email, mobile and horse name are required' });
      }

      const amount = 14700; // £147 in pence

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          productType: '28-day-challenge',
          productName: 'Strong to Soft & Light - 28 Days Challenge',
          customerEmail: email,
          customerFirstName: firstName,
          customerLastName: lastName,
          customerMobile: mobile,
          customerHorseName: horseName || '',
        },
        receipt_email: email,
      });

      console.log(`28 Days Challenge payment intent created: ${paymentIntent.id} for ${email}`);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount
      });
    } catch (error) {
      console.error("Error creating challenge payment intent:", error);
      res.status(500).json({ error: 'Failed to create payment' });
    }
  });

  // 28 Days Challenge purchase completion - called after successful payment
  app.post("/api/challenge/complete-purchase", async (req, res) => {
    try {
      const { paymentIntentId, firstName, lastName, email, mobile, horseName } = req.body;

      if (!paymentIntentId || !firstName || !lastName || !email || !mobile || !horseName) {
        return res.status(400).json({ error: 'Payment intent ID, customer details and horse name are required' });
      }

      // Verify the payment was successful
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Payment not completed' });
      }

      // Create or update contact in GHL with stl-challenge tag
      try {
        const customFields: Record<string, string> = { 
          lead_source: 'Strong to Soft & Light - 28 Days Challenge Purchase',
          purchase_date: new Date().toISOString(),
          purchase_amount: '£147',
          horse_name: horseName || ''
        };
        
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email,
          firstName,
          lastName,
          mobile,
          ['stl-challenge', 'newsletter'],
          customFields
        );
        
        if (ghlResult.success) {
          console.log(`GHL contact created/updated for ${email} with stl-challenge tag after challenge purchase`);
        } else {
          console.warn(`GHL contact creation warning for ${email}:`, ghlResult.message);
        }
      } catch (ghlError) {
        console.error('GHL contact creation error (non-fatal):', ghlError);
      }

      console.log(`28 Days Challenge purchase completed for ${email}, payment: ${paymentIntentId}`);

      res.json({ 
        success: true, 
        message: 'Purchase completed successfully. You will receive an email with details about the challenge.' 
      });
    } catch (error) {
      console.error("Error completing challenge purchase:", error);
      res.status(500).json({ error: 'Failed to complete purchase' });
    }
  });

  // Course interest/registration - creates/updates GHL contact with specific course tags
  app.post("/api/course-interest", async (req, res) => {
    try {
      const { firstName, lastName, email, mobile, courseType, courseName, price } = req.body;

      if (!firstName || !lastName || !email || !mobile || !courseType) {
        return res.status(400).json({ error: 'First name, surname, email, mobile and course type are required' });
      }

      // Determine the appropriate tag based on course type
      let tag = '';
      let leadSource = '';
      
      switch (courseType) {
        case 'guided-group':
          tag = 'stl-challenge';
          leadSource = 'Strong to Soft & Light - 28-Day Challenge Registration';
          break;
        case 'private-mentorship':
          tag = 'stl-mentorship';
          leadSource = 'Strong to Soft & Light - Private Mentorship Application';
          break;
        default:
          tag = 'stl-fullcourse';
          leadSource = 'Strong to Soft & Light - Course Interest';
      }

      // Create or update contact in GHL with the appropriate tag
      try {
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email,
          firstName,
          lastName,
          mobile,
          [tag, 'newsletter'],
          { 
            lead_source: leadSource,
            course_interest: courseName || courseType,
            course_price: price || ''
          }
        );
        
        if (ghlResult.success) {
          console.log(`GHL contact created/updated for ${email} with ${tag} tag`);
        } else {
          console.warn(`GHL contact creation warning for ${email}:`, ghlResult.message);
        }
      } catch (ghlError) {
        console.error('GHL contact creation error (non-fatal):', ghlError);
      }

      res.json({ success: true, message: 'Registration received successfully' });
    } catch (error) {
      console.error('Error in course interest endpoint:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

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

  // Get all news (with optional limit)
  app.get("/api/news", async (req, res) => {
    try {
      let news;
      
      // Support limit parameter for performance optimization
      if (req.query.limit) {
        const limit = parseInt(req.query.limit as string);
        if (!isNaN(limit) && limit > 0) {
          news = await storage.getLatestNews(limit);
        } else {
          news = await storage.getAllNews();
        }
      } else {
        news = await storage.getAllNews();
      }
      
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

  // Get all clinics (with optional filtering)
  app.get("/api/clinics", async (req, res) => {
    try {
      let clinics;
      
      // Use optimized upcoming clinics query if requested
      if (req.query.upcoming === 'true') {
        let limit: number | undefined = undefined;
        
        // Validate and parse limit parameter
        if (req.query.limit) {
          const parsedLimit = parseInt(req.query.limit as string);
          if (!isNaN(parsedLimit) && parsedLimit > 0) {
            limit = parsedLimit;
          }
        }
        
        clinics = await storage.getUpcomingClinics(limit);
      } else {
        clinics = await storage.getAllClinics();
      }
      
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

  // Lookup previous registration data by email for auto-fill
  app.get("/api/clinics/lookup-by-email/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email).toLowerCase().trim();
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      
      const allRegistrations = await storage.getAllClinicRegistrations();
      // Find the most recent registration for this email
      const userRegistrations = allRegistrations
        .filter(reg => reg.email.toLowerCase().trim() === email)
        .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
      
      if (userRegistrations.length === 0) {
        return res.status(404).json({ message: "No previous registration found" });
      }
      
      const latestReg = userRegistrations[0];
      
      // Return only the fields that should be auto-filled (no sensitive data)
      const autoFillData = {
        firstName: latestReg.firstName,
        lastName: latestReg.lastName,
        email: latestReg.email,
        phone: latestReg.phone,
        horseName: latestReg.horseName,
        emergencyContact: latestReg.emergencyContact,
        emergencyPhone: latestReg.emergencyPhone,
        medicalConditions: latestReg.medicalConditions || ''
      };
      
      res.json(autoFillData);
    } catch (error) {
      console.error("Error looking up registration:", error);
      res.status(500).json({ message: "Failed to lookup registration" });
    }
  });

  // Create payment intent for clinic registration
  app.post("/api/clinics/:id/create-payment-intent", async (req, res) => {
    const clinicId = parseInt(req.params.id);
    const { sessionIds, discountCode } = req.body;
    let amount: number = 0;
    
    try {
      
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      if (clinic.hasMultipleSessions && sessionIds?.length > 0) {
        // Calculate total for selected sessions
        const allSessions = await storage.getAllClinics();
        const clinicWithSessions = allSessions.find(c => c.id === clinicId);
        if (!clinicWithSessions?.sessions) {
          return res.status(400).json({ message: "Sessions not found" });
        }
        
        // SECURITY FIX: Validate that all selected session IDs belong to this clinic
        const clinicSessionIds = clinicWithSessions.sessions.map(s => s.id);
        const invalidSessions = sessionIds.filter((id: number) => !clinicSessionIds.includes(id));
        if (invalidSessions.length > 0) {
          console.error(`Invalid session IDs provided: ${invalidSessions.join(', ')} for clinic ${clinicId}`);
          return res.status(400).json({ message: "Invalid session selection" });
        }
        
        const selectedSessions = clinicWithSessions.sessions.filter(s => sessionIds.includes(s.id));
        
        // Ensure at least one session was selected
        if (selectedSessions.length === 0) {
          return res.status(400).json({ message: "No valid sessions selected" });
        }
        
        amount = selectedSessions.reduce((total, session) => total + session.price, 0);
      } else {
        // Single session clinic
        amount = clinic.price;
      }

      // Validate minimum amount before applying discount
      if (amount <= 0) {
        console.error(`Invalid clinic price: ${amount} for clinic ${clinicId}`);
        return res.status(400).json({ message: "Invalid clinic pricing" });
      }

      // NEW: Apply discount code if provided
      let discountApplied = false;
      let discountAmount = 0;
      if (discountCode) {
        try {
          const discount = await storage.getDiscountByCode(discountCode);
          
          if (discount) {
            // Validate discount
            const isExpired = new Date(discount.expiresAt) < new Date();
            
            if (discount.isUsed) {
              return res.status(400).json({ message: "This discount code has already been used" });
            }
            
            if (isExpired) {
              return res.status(400).json({ message: "This discount code has expired" });
            }

            // Apply discount based on type
            if (discount.discountType === 'percentage') {
              discountAmount = Math.round(amount * (discount.discountValue / 100));
            } else if (discount.discountType === 'fixed') {
              discountAmount = discount.discountValue;
            }

            // SECURITY FIX: Ensure discount doesn't exceed total amount
            if (discountAmount >= amount) {
              console.error(`Discount amount (${discountAmount}) exceeds payment amount (${amount}) for code ${discountCode}`);
              return res.status(400).json({ message: "Invalid discount for this purchase" });
            }

            amount = amount - discountAmount;
            discountApplied = true;
            console.log(`Applied ${discount.discountValue}${discount.discountType === 'percentage' ? '%' : '£'} discount (${discountCode}): £${discountAmount/100} off, final: £${amount/100}`);
          } else {
            return res.status(400).json({ message: "Invalid discount code" });
          }
        } catch (error) {
          console.error('Error applying discount:', error);
          return res.status(400).json({ message: "Error validating discount code" });
        }
      }

      // Final validation: Ensure amount is positive
      if (amount <= 0) {
        console.error(`Final payment amount is invalid: ${amount}`);
        return res.status(400).json({ message: "Invalid payment amount" });
      }

      // TODO: PRODUCTION IMPROVEMENT - Add idempotency keys
      // Idempotency keys prevent duplicate charges when users click submit multiple times
      // However, the key MUST include user-specific entropy to prevent cross-user collisions
      // Implementation options:
      //   1. Client generates UUID on payment form load and sends as requestId in request body
      //   2. Server generates UUID per request (but this doesn't help with network retries)
      // For now, we rely on Stripe's built-in duplicate detection and the registration endpoint's
      // payment verification to prevent double-charging
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount is already in cents
        currency: "gbp",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          clinicId: clinicId.toString(),
          sessionIds: sessionIds ? JSON.stringify(sessionIds) : null,
          discountCode: discountCode || null,
          discountApplied: discountApplied.toString(),
          discountAmount: discountAmount.toString(),
        },
      });
      
      console.log(`Payment intent created successfully: ${paymentIntent.id} for clinic ${clinicId}, amount: £${amount/100}${discountApplied ? ` (discount applied: -£${discountAmount/100})` : ''}`);
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        discountApplied,
        discountAmount,
        finalAmount: amount
      });
    } catch (error) {
      // Enhanced error handling with Stripe-specific error details
      console.error("Error creating payment intent:", {
        clinicId,
        amount,
        discountCode,
        error: error instanceof Error ? error.message : String(error),
        type: (error as any)?.type,
        code: (error as any)?.code,
        stack: error instanceof Error ? error.stack : undefined
      });

      // Return user-friendly error messages for common Stripe errors
      if ((error as any)?.type === 'StripeCardError') {
        return res.status(400).json({ message: "Your card was declined. Please try another payment method." });
      } else if ((error as any)?.type === 'StripeInvalidRequestError') {
        return res.status(400).json({ message: "Invalid payment request. Please try again." });
      } else if ((error as any)?.type === 'StripeAPIError') {
        return res.status(503).json({ message: "Payment service temporarily unavailable. Please try again in a moment." });
      }
      
      res.status(500).json({ message: "Failed to create payment intent. Please try again." });
    }
  });

  // Register for clinic (after payment confirmation)
  app.post("/api/clinics/:id/register", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const { paymentIntentId, ...registrationData } = req.body;
      
      let discountCodeUsed: string | null = null;
      
      // Verify payment was successful
      if (paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ message: "Payment not completed" });
        }

        // Extract discount code from payment intent metadata if it was applied
        if (paymentIntent.metadata?.discountCode && paymentIntent.metadata?.discountApplied === 'true') {
          discountCodeUsed = paymentIntent.metadata.discountCode;
        }
      }
      
      const validatedData = insertClinicRegistrationSchema.parse({
        ...registrationData,
        clinicId,
        status: 'confirmed', // Set to confirmed since payment succeeded
        paymentIntentId: paymentIntentId || null // Save the payment intent ID
      });
      
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      // Check if registration is still open
      if (clinic.entryClosingDate) {
        const now = new Date();
        const closingDate = new Date(clinic.entryClosingDate);
        if (now > closingDate) {
          return res.status(400).json({ message: "Registration for this clinic has closed" });
        }
      }
      
      // Create registration (capacity checks are handled atomically in the storage layer)
      const registration = await storage.createClinicRegistration(validatedData);

      // CRITICAL FIX: Mark discount code as used after successful registration
      if (discountCodeUsed) {
        try {
          await storage.useLoyaltyDiscount(discountCodeUsed, registration.id);
          console.log(`Marked discount code ${discountCodeUsed} as used for registration ${registration.id}`);
        } catch (error) {
          console.error(`Failed to mark discount code ${discountCodeUsed} as used:`, error);
          // Log the error but don't fail the registration since payment already succeeded
        }
      }
      
      // Calculate clinic price for loyalty tracking
      let clinicPrice = clinic.price;
      if (validatedData.sessionId && clinic.hasMultipleSessions) {
        // Find session price if this is a multi-session clinic
        const clinics = await storage.getAllClinics();
        const clinicWithSessions = clinics.find(c => c.id === clinicId);
        const session = clinicWithSessions?.sessions?.find(s => s.id === validatedData.sessionId);
        clinicPrice = session?.price || clinic.price;
      }

      // Track clinic entry in loyalty program (old system - will be phased out)
      try {
        await storage.incrementClinicEntries(registration.email, clinicPrice, registration.firstName, registration.lastName);
      } catch (error) {
        console.error('Failed to update old loyalty program:', error);
      }

      // NEW: Award 10 points for clinic entry (with firstName for memorable referral code)
      try {
        await storage.awardPoints(registration.email, 10, `Clinic registration: ${clinic.title}`, registration.firstName);
        console.log(`Awarded 10 points to ${registration.email} for clinic entry`);
      } catch (error) {
        console.error('Failed to award clinic entry points:', error);
      }

      // NEW: Handle referral code if provided
      if (registrationData.referralCode) {
        try {
          const referralValidation = await storage.validateReferralCode(registrationData.referralCode);
          
          if (referralValidation.valid && referralValidation.referrerId && referralValidation.referrerEmail) {
            // Check if this is a new client
            const isNew = await storage.isNewClient(registration.email);
            
            // Track the referral in the database
            await storage.trackReferral(
              referralValidation.referrerId,
              registration.email,
              isNew,
              registration.id
            );

            // Only award bonus points if the referee is a new client
            if (isNew) {
              await storage.awardPoints(
                referralValidation.referrerEmail,
                20,
                `Referral bonus: ${registration.firstName} ${registration.lastName}`
              );
              console.log(`Awarded 20 referral bonus points to ${referralValidation.referrerEmail} for new client ${registration.email}`);
            } else {
              console.log(`No referral bonus awarded - ${registration.email} is an existing client`);
            }

            // Store the used referral code in the loyalty program for audit
            await storage.updateLoyaltyProgram(registration.email, {
              usedReferralCode: registrationData.referralCode
            });
          } else {
            console.log(`Invalid referral code provided: ${registrationData.referralCode}`);
          }
        } catch (error) {
          console.error('Failed to process referral code:', error);
          // Don't fail the registration if referral processing fails
        }
      }
      
      // Automatically subscribe participant to email list if not already subscribed
      try {
        const existingSubscriber = await storage.getEmailSubscriberByEmail(registration.email);
        if (!existingSubscriber) {
          await emailService.subscribeToNewsletter(
            registration.email, 
            registration.firstName, 
            registration.lastName, 
            "clinic_registration"
          );
          console.log(`Added clinic participant to email list: ${registration.email}`);
        } else {
          console.log(`Participant already in email list: ${registration.email}`);
        }
      } catch (error) {
        console.error("Failed to add participant to email list:", error);
        // Don't fail the registration if email subscription fails
      }
      
      // Create or update contact in Go High Level with horse name custom field
      try {
        await storage.createOrUpdateGhlContactInApi(
          registration.email,
          registration.firstName,
          registration.lastName || undefined,
          registration.phone || undefined,
          ['Clinic Registration', 'newsletter'],
          { horse_name: registration.horseName }
        );
        console.log(`Created/updated GHL contact for clinic registration: ${registration.email}`);
      } catch (error) {
        console.error("Failed to create/update GHL contact:", error);
        // Don't fail the registration if GHL sync fails
      }

      // Send confirmation email based on whether this is first-time or returning client
      try {
        // Check if this is their first clinic (before the current registration)
        const allRegistrations = await storage.getAllClinicRegistrations();
        const userRegistrations = allRegistrations.filter(r => r.email === registration.email);
        const isFirstClinic = userRegistrations.length === 1; // Only the current registration

        // Get loyalty program data (referral code and points)
        const loyaltyProgram = await storage.getLoyaltyProgram(registration.email);
        
        if (loyaltyProgram) {
          const clinicDate = new Date(clinic.date).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          const referralCode = loyaltyProgram.referralCode || 'PENDING';

          if (isFirstClinic) {
            // Send first-time clinic confirmation
            await emailService.sendFirstTimeClinicConfirmation(
              registration.email,
              registration.firstName,
              clinic.title,
              clinicDate,
              referralCode,
              clinic.location,
              clinic.googleMapsLink || undefined
            );
            console.log(`Sent first-time clinic confirmation email to ${registration.email}`);
          } else {
            // Send returning client confirmation
            await emailService.sendReturningClinicConfirmation(
              registration.email,
              registration.firstName,
              clinic.title,
              clinicDate,
              referralCode,
              loyaltyProgram.points,
              clinic.location,
              clinic.googleMapsLink || undefined
            );
            console.log(`Sent returning clinic confirmation email to ${registration.email}`);
          }
        }
      } catch (error) {
        console.error("Failed to send clinic confirmation email:", error);
        // Don't fail the registration if email sending fails
      }

      // Send referral bonus notification if bonus was awarded
      if (registrationData.referralCode) {
        try {
          const referralValidation = await storage.validateReferralCode(registrationData.referralCode);
          const isNew = await storage.isNewClient(registration.email);
          
          if (referralValidation.valid && isNew && referralValidation.referrerEmail) {
            // Get the referrer's updated loyalty info
            const referrerLoyalty = await storage.getLoyaltyProgram(referralValidation.referrerEmail);
            
            if (referrerLoyalty) {
              await emailService.sendReferralBonusNotification(
                referralValidation.referrerEmail,
                referrerLoyalty.firstName,
                `${registration.firstName} ${registration.lastName || ''}`.trim(),
                20,
                referrerLoyalty.points
              );
              console.log(`Sent referral bonus notification to ${referralValidation.referrerEmail}`);
            }
          }
        } catch (error) {
          console.error("Failed to send referral bonus notification:", error);
          // Don't fail the registration if email sending fails
        }
      }
      
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating clinic registration:", error);
      
      // Handle specific capacity errors from storage layer
      if (error instanceof Error) {
        if (error.message === "Clinic is full") {
          return res.status(400).json({ message: "Clinic is full" });
        }
        if (error.message === "Session is full") {
          return res.status(400).json({ message: "The selected session is full. Please choose a different session or join the waitlist." });
        }
        if (error.message === "Clinic not found" || error.message === "Session not found") {
          return res.status(404).json({ message: error.message });
        }
      }
      
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
      const { sessions, autoPostToFacebook, excludeTagsFromEmail, ...clinicData } = rawData;
      
      // Log incoming data for debugging
      console.log('\n📋 [CLINIC CREATION] Received request:');
      console.log('  - Title:', clinicData.title);
      console.log('  - autoPostToFacebook:', autoPostToFacebook, '(type:', typeof autoPostToFacebook, ')');
      console.log('  - Image:', clinicData.image ? 'Yes' : 'No');
      
      // Convert price to cents if it exists
      const processedPrice = clinicData.price ? Math.round(parseFloat(clinicData.price.toString()) * 100) : 0;
      
      const processedClinicData = {
        ...clinicData,
        date: new Date(clinicData.date),
        endDate: new Date(clinicData.endDate),
        entryOpenDate: clinicData.entryOpenDate ? new Date(clinicData.entryOpenDate) : null,
        entryClosingDate: clinicData.entryClosingDate ? new Date(clinicData.entryClosingDate) : null,
        price: processedPrice,
        autoPostToFacebook: autoPostToFacebook || false,
        excludeTagsFromEmail: excludeTagsFromEmail || ""
      };
      
      // Validate the clinic data
      const validatedData = insertClinicSchema.parse(processedClinicData);
      const clinic = await storage.createClinic(validatedData);
      
      console.log('  - Clinic created with ID:', clinic.id);
      
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
            maxParticipants: session.maxParticipants || 12,
            currentParticipants: 0,
            requirements: session.requirements || null
          });
        }
      }

      // Post to Facebook if enabled
      console.log('  - Checking Facebook post conditions:');
      console.log('    * autoPostToFacebook:', autoPostToFacebook);
      console.log('    * clinic.image exists:', !!clinic.image);
      
      if (autoPostToFacebook && clinic.image) {
        console.log('  - ✅ Attempting Facebook post...');
        try {
          const facebookResult = await facebookService.postClinic({
            title: clinic.title,
            description: clinic.description,
            date: clinic.date,
            location: clinic.location,
            googleMapsLink: clinic.googleMapsLink || undefined,
            imageUrl: clinic.image,
            price: clinic.price,
            maxParticipants: clinic.maxParticipants,
            currentParticipants: clinic.currentParticipants
          });
          console.log('  - Facebook post result:', facebookResult);
        } catch (fbError) {
          console.error('  - ❌ Error posting to Facebook:', fbError);
          // Don't fail the clinic creation if Facebook post fails
        }
      } else {
        console.log('  - ⏭️ Skipping Facebook post (conditions not met)');
      }

      // Send GHL emails to all contacts (tag-filtered)
      try {
        const excludeTags: string[] = excludeTagsFromEmail ? excludeTagsFromEmail.split(',').map((t: string) => t.trim()) : [];
        await emailService.sendClinicAnnouncementToContacts(clinic, excludeTags);
      } catch (emailError) {
        console.error('Error sending clinic announcement emails:', emailError);
        // Don't fail the clinic creation if emails fail
      }

      // Trigger SEO pre-rendering in background (5 second delay to allow for any follow-up changes)
      prerenderService.triggerPrerender(5000);
      
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
        'title', 'description', 'date', 'endDate', 'entryOpenDate', 'entryClosingDate', 'location', 'googleMapsLink', 'price', 
        'maxParticipants', 'level', 'type', 'image', 'isActive', 'startTime', 'endTime',
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
      
      // Convert entryOpenDate to proper Date object
      if (cleanedData.entryOpenDate && typeof cleanedData.entryOpenDate === 'string' && cleanedData.entryOpenDate.trim() !== '') {
        try {
          const dateStr = cleanedData.entryOpenDate.includes('T') ? cleanedData.entryOpenDate : `${cleanedData.entryOpenDate}T00:00:00.000Z`;
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            cleanedData.entryOpenDate = parsedDate;
          } else {
            delete cleanedData.entryOpenDate; // Remove invalid date
          }
        } catch (e) {
          delete cleanedData.entryOpenDate; // Remove invalid date
        }
      } else if (cleanedData.entryOpenDate === '' || cleanedData.entryOpenDate === null) {
        cleanedData.entryOpenDate = null; // Allow clearing the date field
      }
      
      // Convert entryClosingDate to proper Date object
      if (cleanedData.entryClosingDate && typeof cleanedData.entryClosingDate === 'string' && cleanedData.entryClosingDate.trim() !== '') {
        try {
          const dateStr = cleanedData.entryClosingDate.includes('T') ? cleanedData.entryClosingDate : `${cleanedData.entryClosingDate}T23:59:59.000Z`;
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            cleanedData.entryClosingDate = parsedDate;
          } else {
            delete cleanedData.entryClosingDate; // Remove invalid date
          }
        } catch (e) {
          delete cleanedData.entryClosingDate; // Remove invalid date
        }
      } else if (cleanedData.entryClosingDate === '' || cleanedData.entryClosingDate === null) {
        cleanedData.entryClosingDate = null; // Allow clearing the date field
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
      
      // Validate required fields
      if (cleanedData.googleMapsLink !== undefined && (!cleanedData.googleMapsLink || !cleanedData.googleMapsLink.trim())) {
        return res.status(400).json({ message: "Google Maps Link is required" });
      }
      
      // Extract sessions from the update data
      const { sessions, ...clinicUpdateData } = updateData;
      
      const updatedClinic = await storage.updateClinic(clinicId, cleanedData);
      if (!updatedClinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      // Handle session updates - only update sessions WITHOUT existing registrations
      console.log('=== SESSION UPDATE DEBUG ===');
      console.log('Sessions received:', JSON.stringify(sessions, null, 2));
      const skippedSessions: string[] = [];
      if (sessions && Array.isArray(sessions)) {
        for (const session of sessions) {
          if (session.id) {
            // Check if this session has any registrations
            const hasRegistrations = await storage.hasSessionRegistrations(session.id);
            
            if (!hasRegistrations) {
              // Safe to update - no registrations exist
              const sessionUpdates: any = {};
              
              if (session.sessionName !== undefined) sessionUpdates.sessionName = session.sessionName;
              if (session.discipline !== undefined) sessionUpdates.discipline = session.discipline;
              if (session.skillLevel !== undefined) sessionUpdates.skillLevel = session.skillLevel;
              if (session.requirements !== undefined) sessionUpdates.requirements = session.requirements;
              
              // Handle price conversion
              // Frontend sends prices in pounds (£), we convert to pence for storage
              // Example: User enters £80 → we store 8000 pence
              if (session.price !== undefined) {
                const priceInPounds = parseFloat(session.price.toString());
                if (Number.isFinite(priceInPounds) && priceInPounds >= 0) {
                  sessionUpdates.price = Math.round(priceInPounds * 100);
                }
              }
              
              // Handle maxParticipants with validation
              if (session.maxParticipants !== undefined) {
                // Allow empty string or null to clear the value
                if (session.maxParticipants === "" || session.maxParticipants === null) {
                  sessionUpdates.maxParticipants = null;
                } else {
                  const maxParts = parseInt(session.maxParticipants.toString());
                  if (Number.isFinite(maxParts) && maxParts > 0) {
                    sessionUpdates.maxParticipants = maxParts;
                  }
                }
              }
              
              await storage.updateClinicSession(session.id, sessionUpdates);
            } else {
              // Track sessions that couldn't be updated due to existing registrations
              skippedSessions.push(session.sessionName || `Session ${session.id}`);
            }
          }
        }
      }
      
      // Include feedback about skipped sessions if any
      const response: any = { ...updatedClinic };
      if (skippedSessions.length > 0) {
        response.warning = `The following sessions could not be updated because they have existing registrations: ${skippedSessions.join(', ')}`;
      }

      // Trigger SEO pre-rendering in background
      prerenderService.triggerPrerender(5000);
      
      res.json(response);
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

  // Group Management Endpoints
  app.get("/api/admin/sessions/:sessionId/groups", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const groups = await storage.getSessionGroups(sessionId);
      
      // Get only confirmed registrations for this session
      const confirmedRegistrations = await storage.getSessionRegistrations(sessionId, true);
      
      // Get participants for each group
      const groupsWithParticipants = await Promise.all(
        groups.map(async (group) => {
          const participants = confirmedRegistrations.filter(
            (r) => r.groupId === group.id
          );
          return { ...group, participants };
        })
      );
      
      // Get unassigned confirmed participants
      const unassigned = confirmedRegistrations.filter((r) => !r.groupId);
      
      res.json({
        groups: groupsWithParticipants,
        unassigned
      });
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.post("/api/admin/sessions/:sessionId/groups", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { groupName, skillLevel, maxParticipants, displayOrder } = req.body;
      
      const newGroup = await storage.createClinicGroup({
        sessionId,
        groupName,
        skillLevel: skillLevel || null,
        maxParticipants: maxParticipants || null,
        displayOrder: displayOrder || 0
      });
      
      res.status(201).json(newGroup);
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  app.put("/api/admin/groups/:groupId", async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      const updates = req.body;
      
      const updatedGroup = await storage.updateClinicGroup(groupId, updates);
      if (!updatedGroup) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json(updatedGroup);
    } catch (error) {
      console.error("Error updating group:", error);
      res.status(500).json({ message: "Failed to update group" });
    }
  });

  app.delete("/api/admin/groups/:groupId", async (req, res) => {
    try {
      const groupId = parseInt(req.params.groupId);
      await storage.deleteClinicGroup(groupId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting group:", error);
      res.status(500).json({ message: "Failed to delete group" });
    }
  });

  app.post("/api/admin/registrations/:registrationId/move", async (req, res) => {
    try {
      const registrationId = parseInt(req.params.registrationId);
      const { groupId } = req.body;
      
      await storage.moveParticipantToGroup(registrationId, groupId);
      res.json({ message: "Participant moved successfully" });
    } catch (error) {
      console.error("Error moving participant:", error);
      res.status(500).json({ message: "Failed to move participant" });
    }
  });

  app.post("/api/admin/sessions/:sessionId/auto-organize", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const groups = await storage.autoOrganizeGroups(sessionId);
      
      // Get participants for each group
      const groupsWithParticipants = await Promise.all(
        groups.map(async (group) => {
          const participants = await storage.getGroupParticipants(group.id);
          return { ...group, participants };
        })
      );
      
      res.json(groupsWithParticipants);
    } catch (error) {
      console.error("Error auto-organizing groups:", error);
      res.status(500).json({ message: "Failed to auto-organize groups" });
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

  // Get all gallery images (public route for website display)
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      // Only return active images for public display
      const activeImages = images.filter(image => image.isActive);
      res.json(activeImages);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  // Admin Registration Management Routes

  // Get all registrations for admin (with session names)
  app.get("/api/admin/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllClinicRegistrations();
      const allSessions = await storage.getAllClinicSessions();
      
      // Create session lookup by ID
      const sessionLookup = allSessions.reduce((acc, session) => {
        acc[session.id] = session;
        return acc;
      }, {} as Record<number, any>);
      
      // Enrich registrations with session name
      const enrichedRegistrations = registrations.map(reg => ({
        ...reg,
        sessionName: reg.sessionId ? sessionLookup[reg.sessionId]?.sessionName : null
      }));
      
      res.json(enrichedRegistrations);
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

      // Get registration details first (needed for point deduction)
      const registrations = await storage.getAllClinicRegistrations();
      const cancelledReg = registrations.find(r => r.id === registrationId);
      
      if (!cancelledReg) {
        return res.status(404).json({ message: "Registration not found" });
      }

      // Check refund eligibility first
      const refundCheck = await storage.canProcessRefund(registrationId);
      
      if (refundCheck.eligible) {
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
            const newRegistration = await storage.createClinicRegistration({
              clinicId: cancelledReg.clinicId,
              sessionId: cancelledReg.sessionId || undefined,
              firstName: promotedParticipant.firstName,
              lastName: promotedParticipant.lastName,
              email: promotedParticipant.email,
              phone: promotedParticipant.phone,
              horseName: promotedParticipant.horseName || "To be provided",
              specialRequests: promotedParticipant.specialRequests || undefined,
              emergencyContact: "To be provided", // Waitlist entries don't have emergency contact info
              emergencyPhone: "To be provided",
              medicalConditions: undefined,
              paymentMethod: "bank_transfer",
              agreeToTerms: true,
              status: "confirmed"
            });
            
            // Ensure promoted participant is in email list
            try {
              const existingSubscriber = await storage.getEmailSubscriberByEmail(promotedParticipant.email);
              if (!existingSubscriber) {
                await emailService.subscribeToNewsletter(
                  promotedParticipant.email, 
                  promotedParticipant.firstName, 
                  promotedParticipant.lastName, 
                  "waitlist_promotion"
                );
              }
            } catch (error) {
              console.error("Failed to add promoted participant to email list:", error);
            }
            
            console.log(`Automatically promoted waitlist participant: ${promotedParticipant.email}`);
          }
        }

        // Deduct loyalty points for refunded registration
        try {
          await storage.deductPoints(cancelledReg.email, 10, `Refund for cancelled registration`);
          console.log(`Deducted 10 points from ${cancelledReg.email} due to cancellation/refund`);
        } catch (error) {
          console.error('Failed to deduct points for cancellation:', error);
        }

        // Send refund confirmation email
        try {
          const clinic = await storage.getClinic(cancelledReg.clinicId);
          if (clinic) {
            const clinicDate = new Date(clinic.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
            await emailService.sendRefundConfirmation(
              cancelledReg.email,
              cancelledReg.firstName,
              clinic.title,
              clinicDate,
              refundCheck.amount || 0,
              refundCheck.adminFee || 0,
              reason
            );
            console.log(`Refund confirmation email sent to ${cancelledReg.email}`);
          }
        } catch (emailError) {
          console.error('Failed to send refund confirmation email:', emailError);
        }

        const adminFeeText = refundCheck.adminFee ? ` (£${(refundCheck.adminFee / 100).toFixed(2)} admin fee deducted)` : '';
        const promotionText = promotedParticipant ? ` - ${promotedParticipant.firstName} ${promotedParticipant.lastName} has been automatically accepted from the waiting list` : '';

        res.json({
          success: true,
          message: `Refund processed: £${(refundCheck.amount! / 100).toFixed(2)}${adminFeeText}${promotionText}. 10 loyalty points deducted.`,
          registration: updatedRegistration,
          refundAmount: refundCheck.amount,
          adminFee: refundCheck.adminFee,
          promotedParticipant: promotedParticipant
        });
      } else {
        // Cancel without refund - still deduct points
        const updatedRegistration = await storage.updateRegistrationStatus(
          registrationId, 
          "cancelled_by_admin", 
          0,
          reason || refundCheck.reason
        );

        // Deduct loyalty points even for non-refunded cancellations
        try {
          await storage.deductPoints(cancelledReg.email, 10, `Cancelled registration (no refund)`);
          console.log(`Deducted 10 points from ${cancelledReg.email} due to cancellation`);
        } catch (error) {
          console.error('Failed to deduct points for cancellation:', error);
        }

        res.json({
          success: true,
          message: `Registration cancelled - no refund (${refundCheck.reason}). 10 loyalty points deducted.`,
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
      // Get all registrations with clinic and session details
      const registrations = await storage.getAllClinicRegistrations();
      const clinics = await storage.getAllClinics();
      const allSessions = await storage.getAllClinicSessions();
      
      // Create lookups
      const clinicLookup = clinics.reduce((acc, clinic) => {
        acc[clinic.id] = clinic;
        return acc;
      }, {} as Record<number, any>);
      
      const sessionLookup = allSessions.reduce((acc, session) => {
        acc[session.id] = session;
        return acc;
      }, {} as Record<number, any>);

      // Group registrations by clinic
      const clinicGroups = registrations.reduce((acc, reg) => {
        if (reg.status !== 'confirmed') return acc;
        
        const clinic = clinicLookup[reg.clinicId];
        if (!clinic) return acc;

        if (!acc[clinic.title]) {
          acc[clinic.title] = [];
        }

        // Get session name if available
        const sessionName = reg.sessionId ? sessionLookup[reg.sessionId]?.sessionName : null;

        acc[clinic.title].push({
          'Rider Name': `${reg.firstName} ${reg.lastName}`,
          'Horse Name': reg.horseName || 'N/A',
          'Class': sessionName || '—',
          'Special Requests': reg.specialRequests || 'None',
          'Email': reg.email,
          'Phone': reg.phone,
          'Emergency Contact': reg.emergencyContact,
          'Emergency Phone': reg.emergencyPhone,
          'Registration Date': new Date(reg.registeredAt).toLocaleDateString('en-GB')
        });

        return acc;
      }, {} as Record<string, any[]>);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add sheets for each clinic
      Object.entries(clinicGroups).forEach(([clinicName, participants]) => {
        if (participants.length === 0) return;

        // Main entries sheet
        const sheetName = clinicName.substring(0, 31);
        const worksheet = XLSX.utils.json_to_sheet(participants);
        
        // Auto-size columns
        const cols = [
          { wch: 20 }, // Rider Name
          { wch: 20 }, // Horse Name
          { wch: 20 }, // Class
          { wch: 30 }, // Special Requests
          { wch: 25 }, // Email
          { wch: 15 }, // Phone
          { wch: 20 }, // Emergency Contact
          { wch: 15 }, // Emergency Phone
          { wch: 15 }  // Registration Date
        ];
        worksheet['!cols'] = cols;

        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        // Create "Groups by Class" sheet for this clinic
        const groupsByClass: Record<string, any[]> = {};
        participants.forEach((p: any) => {
          const className = p['Class'] || 'Unassigned';
          if (!groupsByClass[className]) {
            groupsByClass[className] = [];
          }
          groupsByClass[className].push({
            rider: p['Rider Name'],
            horse: p['Horse Name'],
            specialRequests: p['Special Requests']
          });
        });
        
        // Build grouped data for the sheet
        const groupedData: any[][] = [];
        Object.entries(groupsByClass).forEach(([className, riders]) => {
          // Add class header row
          groupedData.push([`CLASS: ${className}`, '', '']);
          groupedData.push(['Rider Name', 'Horse Name', 'Special Requests']);
          
          // Add riders in this class
          riders.forEach((rider: any) => {
            groupedData.push([rider.rider, rider.horse, rider.specialRequests]);
          });
          
          // Add empty row between classes
          groupedData.push(['', '', '']);
        });
        
        // Create the groups sheet
        const groupsSheetName = `${clinicName.substring(0, 22)} Groups`;
        const groupsWorksheet = XLSX.utils.aoa_to_sheet(groupedData);
        groupsWorksheet['!cols'] = [
          { wch: 25 }, // Rider Name
          { wch: 20 }, // Horse Name
          { wch: 40 }  // Special Requests
        ];
        
        XLSX.utils.book_append_sheet(workbook, groupsWorksheet, groupsSheetName);
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

      if (!firstName) {
        return res.status(400).json({ message: "First name is required" });
      }

      // Subscribe to email list
      const success = await emailService.subscribeToNewsletter(email, firstName, lastName, "newsletter");
      
      if (!success) {
        return res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }

      // Create or update contact in Go High Level with Newsletter tag
      try {
        const ghlResult = await storage.createOrUpdateGhlContactInApi(email, firstName, lastName || undefined, undefined, ["newsletter"]);
        
        if (!ghlResult.success) {
          console.warn("GHL contact creation failed:", ghlResult.message);
          // Continue even if GHL fails - newsletter subscription still succeeded
        }
      } catch (ghlError) {
        console.error("Error creating GHL contact:", ghlError);
        // Continue even if GHL fails - newsletter subscription still succeeded
      }

      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Newsletter unsubscribe
  app.get("/api/unsubscribe", async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }

      await storage.unsubscribeEmail(email);
      res.json({ message: "Successfully unsubscribed from all emails" });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
    }
  });

  app.post("/api/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      await storage.unsubscribeEmail(email);
      res.json({ message: "Successfully unsubscribed from all emails" });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
    }
  });

  // Audio course trial signup
  app.post("/api/audio-trial/signup", async (req, res) => {
    try {
      const { email, firstName, lastName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!firstName) {
        return res.status(400).json({ message: "First name is required" });
      }

      if (!lastName) {
        return res.status(400).json({ message: "Surname is required" });
      }

      // Create or update contact in Go High Level with "try audio" tag
      try {
        const ghlResult = await storage.createOrUpdateGhlContactInApi(
          email, 
          firstName, 
          lastName, 
          undefined, 
          ["try audio", "newsletter"]
        );
        
        if (!ghlResult.success) {
          console.warn("GHL contact creation failed:", ghlResult.message);
          return res.status(500).json({ message: "Failed to register for free trial" });
        }
      } catch (ghlError) {
        console.error("Error creating GHL contact:", ghlError);
        return res.status(500).json({ message: "Failed to register for free trial" });
      }

      res.json({ message: "Successfully registered for free audio lesson" });
    } catch (error) {
      console.error("Error registering for audio trial:", error);
      res.status(500).json({ message: "Failed to register for free trial" });
    }
  });

  // Admin contact management routes
  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.put("/api/admin/contacts/:id/resolve", async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      await storage.markContactResolved(contactId);
      res.json({ message: "Contact marked as resolved" });
    } catch (error) {
      console.error("Error resolving contact:", error);
      res.status(500).json({ message: "Failed to resolve contact" });
    }
  });

  app.get("/api/admin/contacts/export", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Prepare contact data for export
      const contactData = contacts.map(contact => ({
        'First Name': contact.firstName,
        'Last Name': contact.lastName,
        'Email': contact.email,
        'Phone': contact.phone || '',
        'Subject': contact.subject,
        'Inquiry Type': contact.inquiryType || '',
        'Preferred Contact': contact.preferredContact || '',
        'Message': contact.message,
        'Status': contact.resolved ? 'Resolved' : 'Pending',
        'Created At': contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(contactData);
      
      // Auto-size columns
      const cols = [
        { wch: 15 }, // First Name
        { wch: 15 }, // Last Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 30 }, // Subject
        { wch: 15 }, // Inquiry Type
        { wch: 15 }, // Preferred Contact
        { wch: 50 }, // Message
        { wch: 10 }, // Status
        { wch: 12 }  // Created At
      ];
      worksheet['!cols'] = cols;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      res.status(500).json({ message: 'Failed to export contacts' });
    }
  });

  app.get("/api/admin/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllEmailSubscribers();
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });

  app.get("/api/admin/subscribers/export", async (req, res) => {
    try {
      const subscribers = await storage.getAllEmailSubscribers();
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Prepare subscriber data for export
      const subscriberData = subscribers.map(subscriber => ({
        'Email': subscriber.email,
        'First Name': subscriber.firstName || '',
        'Last Name': subscriber.lastName || '',
        'Status': subscriber.isActive ? 'Active' : 'Unsubscribed',
        'Source': subscriber.subscriptionSource,
        'Interests': Array.isArray(subscriber.interests) ? (subscriber.interests as string[]).join(', ') : '',
        'Subscribed At': new Date(subscriber.subscribedAt).toLocaleDateString(),
        'Unsubscribed At': subscriber.unsubscribedAt ? new Date(subscriber.unsubscribedAt).toLocaleDateString() : ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(subscriberData);
      
      // Auto-size columns
      const cols = [
        { wch: 25 }, // Email
        { wch: 15 }, // First Name
        { wch: 15 }, // Last Name
        { wch: 12 }, // Status
        { wch: 20 }, // Source
        { wch: 30 }, // Interests
        { wch: 15 }, // Subscribed At
        { wch: 15 }  // Unsubscribed At
      ];
      worksheet['!cols'] = cols;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscribers');

      // Generate buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="subscribers-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
      res.status(500).json({ message: 'Failed to export subscribers' });
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

  // Replace all email subscribers with CSV data
  app.post("/api/admin/email-subscribers/replace-csv", async (req, res) => {
    try {
      const result = await replaceCsvEmails();
      res.json({
        message: "Email list replaced successfully",
        imported: result.successCount,
        failed: result.errorCount
      });
    } catch (error) {
      console.error("Error replacing email list:", error);
      res.status(500).json({ message: "Failed to replace email list" });
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

  // Send pole clinic invitation email to contacts with "pole clinic" tag
  app.post("/api/admin/email/pole-clinic-blast", async (req, res) => {
    try {
      const { tag = "pole clinic" } = req.body;
      console.log(`Starting pole clinic email blast for tag: "${tag}"`);
      
      const results = await emailService.sendPoleClinicInvitationToTaggedContacts(tag);
      
      res.json({
        success: true,
        message: `Pole clinic email blast complete`,
        sent: results.sent,
        skipped: results.skipped,
        errors: results.errors
      });
    } catch (error) {
      console.error("Error sending pole clinic email blast:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to send pole clinic email blast",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Loyalty Program routes
  
  // NEW: Leaderboard endpoint (MUST be before /:email route to avoid being caught by it)
  app.get("/api/loyalty/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/loyalty/:email", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      const loyaltyProgram = await storage.getLoyaltyProgram(email);
      
      if (!loyaltyProgram) {
        return res.status(404).json({ message: "Loyalty program not found" });
      }
      
      res.json(loyaltyProgram);
    } catch (error) {
      console.error("Error fetching loyalty program:", error);
      res.status(500).json({ message: "Failed to fetch loyalty program" });
    }
  });

  app.get("/api/loyalty/:email/discount", async (req, res) => {
    try {
      const email = decodeURIComponent(req.params.email);
      const discount = await storage.getAvailableDiscount(email);
      
      if (!discount) {
        return res.status(404).json({ message: "No available discount" });
      }
      
      res.json(discount);
    } catch (error) {
      console.error("Error fetching available discount:", error);
      res.status(500).json({ message: "Failed to fetch discount" });
    }
  });

  app.post("/api/loyalty/discount/validate", async (req, res) => {
    try {
      const { email, discountCode } = req.body;
      
      if (!email || !discountCode) {
        return res.status(400).json({ message: "Email and discount code required" });
      }
      
      // Only allow "Dan15" discount code
      if (discountCode !== 'Dan15') {
        return res.status(400).json({ message: "Invalid discount code" });
      }
      
      const availableDiscount = await storage.getAvailableDiscount(email);
      
      if (!availableDiscount) {
        return res.status(404).json({ message: "No available Dan15 discount for this user" });
      }
      
      res.json({ 
        valid: true, 
        discountValue: availableDiscount.discountValue,
        message: `${availableDiscount.discountValue}% discount available`
      });
    } catch (error) {
      console.error("Error validating discount:", error);
      res.status(500).json({ message: "Failed to validate discount" });
    }
  });

  app.post("/api/loyalty/discount/use", async (req, res) => {
    try {
      const { discountCode, registrationId } = req.body;
      
      if (!discountCode || !registrationId) {
        return res.status(400).json({ message: "Discount code and registration ID required" });
      }
      
      const usedDiscount = await storage.useLoyaltyDiscount(discountCode, registrationId);
      
      if (!usedDiscount) {
        return res.status(404).json({ message: "Invalid or expired discount code" });
      }
      
      res.json(usedDiscount);
    } catch (error) {
      console.error("Error using loyalty discount:", error);
      res.status(500).json({ message: "Failed to use discount" });
    }
  });

  // NEW: Validate referral code
  app.post("/api/loyalty/referral/validate", async (req, res) => {
    try {
      const { referralCode } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Referral code required" });
      }
      
      const validation = await storage.validateReferralCode(referralCode);
      res.json(validation);
    } catch (error) {
      console.error("Error validating referral code:", error);
      res.status(500).json({ message: "Failed to validate referral code" });
    }
  });

  // Admin gallery management routes
  app.get("/api/admin/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.post("/api/admin/gallery", async (req, res) => {
    try {
      const galleryData = insertGallerySchema.parse(req.body);
      const image = await storage.createGalleryImage(galleryData);
      res.status(201).json(image);
    } catch (error) {
      console.error("Error adding to gallery:", error);
      res.status(400).json({ message: "Invalid gallery data" });
    }
  });

  app.put("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const galleryData = insertGallerySchema.partial().parse(req.body);
      const image = await storage.updateGalleryImage(id, galleryData);
      
      if (!image) {
        return res.status(404).json({ message: "Gallery image not found" });
      }
      
      res.json(image);
    } catch (error) {
      console.error("Error updating gallery image:", error);
      res.status(400).json({ message: "Invalid gallery data" });
    }
  });

  app.delete("/api/admin/gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryImage(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting gallery image:", error);
      res.status(500).json({ message: "Failed to delete gallery image" });
    }
  });

  // Admin news management routes  
  app.post("/api/admin/news", async (req, res) => {
    try {
      console.log("Request body:", req.body);
      
      // Generate slug from title
      const generateSlug = (title: string): string => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim()
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      };

      // Generate unique slug
      const baseSlug = generateSlug(req.body.title);
      let slug = baseSlug;
      let counter = 1;
      
      // Check if slug exists and make it unique
      while (true) {
        try {
          const existingNews = await storage.getNewsBySlug(slug);
          if (!existingNews) break;
          slug = `${baseSlug}-${counter}`;
          counter++;
        } catch (error) {
          // If getNewsBySlug doesn't exist yet, break
          break;
        }
      }

      const imageUrl = req.body.imageUrl || req.body.image;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newsData = {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        image: imageUrl,
        slug,
        publishedAt: new Date()
      };
      
      console.log("News data to insert:", newsData);
      const news = await storage.createNews(newsData);

      // Trigger SEO pre-rendering in background
      prerenderService.triggerPrerender(5000);

      res.status(201).json(news);
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.put("/api/admin/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const news = await storage.updateNews(id, req.body);
      
      if (!news) {
        return res.status(404).json({ message: "News article not found" });
      }

      // Trigger SEO pre-rendering in background
      prerenderService.triggerPrerender(5000);
      
      res.json(news);
    } catch (error) {
      console.error("Error updating news:", error);
      res.status(400).json({ message: "Invalid news data" });
    }
  });

  app.delete("/api/admin/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      // Check if article exists before attempting deletion
      const existingNews = await storage.getNewsById(id);
      if (!existingNews) {
        return res.status(404).json({ message: "News article not found" });
      }
      
      await storage.deleteNews(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Failed to delete news article" });
    }
  });

  // Competition Checklist routes
  app.get("/api/competition-checklists", async (req, res) => {
    try {
      const checklists = await storage.getAllCompetitionChecklists();
      res.json(checklists);
    } catch (error) {
      console.error("Error fetching competition checklists:", error);
      res.status(500).json({ message: "Failed to fetch competition checklists" });
    }
  });

  app.get("/api/competition-checklists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const checklist = await storage.getCompetitionChecklist(id);
      
      if (!checklist) {
        return res.status(404).json({ message: "Competition checklist not found" });
      }
      
      res.json(checklist);
    } catch (error) {
      console.error("Error fetching competition checklist:", error);
      res.status(500).json({ message: "Failed to fetch competition checklist" });
    }
  });

  app.post("/api/competition-checklists/generate", async (req, res) => {
    try {
      const { discipline, competitionType, competitionName, competitionDate, location, horseName } = req.body;
      
      if (!discipline || !competitionType) {
        return res.status(400).json({ message: "Discipline and competition level are required" });
      }

      const checklist = await storage.generateChecklistForCompetition(
        discipline,
        competitionType,
        competitionName || "Training Competition",
        competitionDate ? new Date(competitionDate) : new Date(),
        location || "Local Venue",
        horseName
      );
      
      res.status(201).json(checklist);
    } catch (error) {
      console.error("Error generating competition checklist:", error);
      res.status(500).json({ message: "Failed to generate competition checklist" });
    }
  });

  app.post("/api/competition-checklists", async (req, res) => {
    try {
      const checklistData = insertCompetitionChecklistSchema.parse(req.body);
      const checklist = await storage.createCompetitionChecklist(checklistData);
      res.status(201).json(checklist);
    } catch (error) {
      console.error("Error creating competition checklist:", error);
      res.status(400).json({ message: "Invalid checklist data" });
    }
  });

  app.put("/api/competition-checklists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCompetitionChecklistSchema.partial().parse(req.body);
      const checklist = await storage.updateCompetitionChecklist(id, updates);
      
      if (!checklist) {
        return res.status(404).json({ message: "Competition checklist not found" });
      }
      
      res.json(checklist);
    } catch (error) {
      console.error("Error updating competition checklist:", error);
      res.status(400).json({ message: "Invalid checklist data" });
    }
  });

  app.delete("/api/competition-checklists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCompetitionChecklist(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting competition checklist:", error);
      res.status(500).json({ message: "Failed to delete competition checklist" });
    }
  });

  // Sponsor routes
  app.get("/api/sponsors", async (req, res) => {
    try {
      const sponsors = await storage.getAllSponsors();
      res.json(sponsors);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
      res.status(500).json({ message: "Failed to fetch sponsors" });
    }
  });

  app.get("/api/sponsors/active", async (req, res) => {
    try {
      const sponsor = await storage.getActiveSponsor();
      res.json(sponsor || null);
    } catch (error) {
      console.error("Error fetching active sponsor:", error);
      res.status(500).json({ message: "Failed to fetch active sponsor" });
    }
  });

  app.get("/api/sponsors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sponsor = await storage.getSponsor(id);
      
      if (!sponsor) {
        return res.status(404).json({ message: "Sponsor not found" });
      }
      
      res.json(sponsor);
    } catch (error) {
      console.error("Error fetching sponsor:", error);
      res.status(500).json({ message: "Failed to fetch sponsor" });
    }
  });

  app.post("/api/sponsors", upload.single('logo'), async (req, res) => {
    try {
      const sponsorData = insertSponsorSchema.parse(req.body);
      
      // Handle logo upload if provided
      if (req.file) {
        const fileBuffer = req.file.buffer || fs.readFileSync(req.file.path);
        const optimizedResult = await ImageOptimizer.optimizeImage(fileBuffer, {
          width: 200,
          height: 200,
          quality: 90
        });
        
        const filename = `sponsor-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, optimizedResult.buffer);
        
        sponsorData.logo = `/uploads/${filename}`;
        
        // Clean up original file if it exists
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      
      const sponsor = await storage.createSponsor(sponsorData);
      res.status(201).json(sponsor);
    } catch (error) {
      console.error("Error creating sponsor:", error);
      res.status(400).json({ message: "Invalid sponsor data" });
    }
  });

  app.put("/api/sponsors/:id", upload.single('logo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertSponsorSchema.partial().parse(req.body);
      
      // Handle logo upload if provided
      if (req.file) {
        const fileBuffer = req.file.buffer || fs.readFileSync(req.file.path);
        const optimizedResult = await ImageOptimizer.optimizeImage(fileBuffer, {
          width: 200,
          height: 200,
          quality: 90
        });
        
        const filename = `sponsor-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, optimizedResult.buffer);
        
        updates.logo = `/uploads/${filename}`;
        
        // Clean up original file if it exists
        if (req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      
      const sponsor = await storage.updateSponsor(id, updates);
      
      if (!sponsor) {
        return res.status(404).json({ message: "Sponsor not found" });
      }
      
      res.json(sponsor);
    } catch (error) {
      console.error("Error updating sponsor:", error);
      res.status(400).json({ message: "Invalid sponsor data" });
    }
  });

  app.delete("/api/sponsors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSponsor(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting sponsor:", error);
      res.status(500).json({ message: "Failed to delete sponsor" });
    }
  });

  app.post("/api/sponsors/:id/click", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.trackSponsorClick(id);
      res.status(200).json({ message: "Click tracked" });
    } catch (error) {
      console.error("Error tracking sponsor click:", error);
      res.status(500).json({ message: "Failed to track click" });
    }
  });

  app.post("/api/sponsors/:id/impression", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.trackSponsorImpression(id);
      res.status(200).json({ message: "Impression tracked" });
    } catch (error) {
      console.error("Error tracking sponsor impression:", error);
      res.status(500).json({ message: "Failed to track impression" });
    }
  });

  // Go High Level Integration routes
  app.get("/api/ghl/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllGhlContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching GHL contacts:", error);
      res.status(500).json({ message: "Failed to fetch GHL contacts" });
    }
  });

  app.post("/api/ghl/sync", async (req, res) => {
    try {
      const locationId = req.body.locationId || process.env.GHL_LOCATION_ID;
      
      if (!locationId) {
        return res.status(400).json({ message: "Location ID is required (provide in body or set GHL_LOCATION_ID env var)" });
      }

      const syncedCount = await storage.syncGhlContacts(locationId);
      res.json({ 
        message: `Successfully synced ${syncedCount} contacts from Go High Level`,
        count: syncedCount 
      });
    } catch (error) {
      console.error("Error syncing GHL contacts:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to sync GHL contacts" 
      });
    }
  });

  app.delete("/api/ghl/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGhlContact(id);
      res.status(200).json({ message: "GHL contact deleted successfully" });
    } catch (error) {
      console.error("Error deleting GHL contact:", error);
      res.status(500).json({ message: "Failed to delete GHL contact" });
    }
  });

  // Migrate stronghorseaudio tags to stl-trial - searches GHL directly
  app.post("/api/admin/migrate-stl-tags", async (req, res) => {
    try {
      const apiKey = process.env.GHL_API_KEY;
      const locationId = process.env.GHL_LOCATION_ID;
      if (!apiKey || !locationId) {
        return res.status(400).json({ message: "GHL_API_KEY or GHL_LOCATION_ID not configured" });
      }

      // Search GHL directly for contacts with stronghorseaudio tag
      const contactsToUpdate: { id: string; email: string; tags: string[] }[] = [];
      let startAfterId: string | undefined;

      // Use GHL search endpoint to find contacts with stronghorseaudio tag
      const searchUrl = new URL('https://services.leadconnectorhq.com/contacts/search');
      
      const searchResponse = await fetch(searchUrl.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locationId,
          filters: [{
            field: 'tags',
            operator: 'contains',
            value: 'stronghorseaudio'
          }],
          pageLimit: 100
        })
      });

      if (!searchResponse.ok) {
        const searchError = await searchResponse.json();
        console.log('Search API response:', searchError);
        throw new Error(`Failed to search GHL contacts: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const contacts = searchData.contacts || [];
      
      // Filter for those without stl-trial tag
      for (const contact of contacts) {
        const tags = contact.tags || [];
        if (!tags.includes('stl-trial')) {
          contactsToUpdate.push({
            id: contact.id,
            email: contact.email,
            tags
          });
        }
      }

      console.log(`Found ${contactsToUpdate.length} contacts in GHL to migrate from stronghorseaudio to stl-trial`);

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      const updated: string[] = [];

      for (const contact of contactsToUpdate) {
        try {
          // Add the stl-trial tag to the contact
          const tagsResponse = await fetch(
            `https://services.leadconnectorhq.com/contacts/${contact.id}/tags`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ tags: ['stl-trial'] })
            }
          );

          if (tagsResponse.ok) {
            console.log(`Added stl-trial tag to ${contact.email}`);
            updated.push(contact.email);
            successCount++;
          } else {
            const tagError = await tagsResponse.json();
            errors.push(`Tag add failed for ${contact.email}: ${JSON.stringify(tagError)}`);
            errorCount++;
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
          errors.push(`Error processing ${contact.email}: ${err}`);
          errorCount++;
        }
      }

      res.json({
        message: `Migration complete: ${successCount} contacts updated, ${errorCount} errors`,
        totalFound: contactsToUpdate.length,
        successCount,
        errorCount,
        updated,
        errors: errors.slice(0, 10)
      });
    } catch (error) {
      console.error("Error migrating stl tags:", error);
      res.status(500).json({ message: "Failed to migrate tags" });
    }
  });

  // Analytics routes
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const [
        subscribers,
        clinics,
        registrations,
        contacts,
        loyaltyPrograms
      ] = await Promise.all([
        storage.getAllEmailSubscribers(),
        storage.getAllClinics(),
        storage.getAllClinicRegistrations(),
        storage.getAllContacts(),
        storage.getAllLoyaltyPrograms()
      ]);

      // Calculate monthly registration trends
      const now = new Date();
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const monthRegistrations = registrations.filter(reg => {
          const regDate = new Date(reg.registeredAt);
          return regDate.getMonth() === month.getMonth() && regDate.getFullYear() === month.getFullYear();
        });
        
        const revenue = monthRegistrations.reduce((sum, reg) => {
          const clinic = clinics.find(c => c.id === reg.clinicId);
          return sum + (clinic?.price || 0);
        }, 0);

        monthlyData.push({
          month: monthStr,
          count: monthRegistrations.length,
          revenue
        });
      }

      // Subscriber growth data
      const subscriberGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        const monthSubscribers = subscribers.filter(sub => {
          const subDate = new Date(sub.subscribedAt);
          return subDate <= new Date(month.getFullYear(), month.getMonth() + 1, 0);
        }).length;

        subscriberGrowth.push({
          month: monthStr,
          subscribers: monthSubscribers
        });
      }

      // Clinic level distribution
      const levelCounts: Record<string, number> = {};
      clinics.forEach(clinic => {
        levelCounts[clinic.level] = (levelCounts[clinic.level] || 0) + 1;
      });

      const clinicsByLevel = Object.entries(levelCounts).map(([level, count]) => ({
        level: level.charAt(0).toUpperCase() + level.slice(1),
        count
      }));

      // Contact type distribution
      const contactCounts: Record<string, number> = {};
      contacts.forEach(contact => {
        const type = contact.inquiryType || 'general';
        contactCounts[type] = (contactCounts[type] || 0) + 1;
      });

      const contactsByType = Object.entries(contactCounts).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count
      }));

      // Loyalty tier distribution
      const tierCounts = { Bronze: 0, Silver: 0, Gold: 0 };
      loyaltyPrograms.forEach(program => {
        if (program.clinicEntries >= 10) tierCounts.Gold++;
        else if (program.clinicEntries >= 5) tierCounts.Silver++;
        else if (program.clinicEntries >= 1) tierCounts.Bronze++;
      });

      const loyaltyTiers = Object.entries(tierCounts).map(([tier, count]) => ({
        tier,
        count
      }));

      const totalRevenue = registrations.reduce((sum, reg) => {
        const clinic = clinics.find(c => c.id === reg.clinicId);
        return sum + (clinic?.price || 0);
      }, 0);

      res.json({
        totalSubscribers: subscribers.length,
        totalClinics: clinics.filter(c => c.isActive).length,
        totalRegistrations: registrations.length,
        totalRevenue,
        monthlyRegistrations: monthlyData,
        subscriberGrowth,
        clinicsByLevel,
        contactsByType,
        loyaltyTiers
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Recent activity for analytics
  app.get("/api/admin/recent-activity", async (req, res) => {
    try {
      const [registrations, contacts, subscribers] = await Promise.all([
        storage.getAllClinicRegistrations(),
        storage.getAllContacts(),
        storage.getAllEmailSubscribers()
      ]);

      const activities = [
        ...registrations.slice(-10).map(reg => ({
          type: 'registration',
          description: `${reg.firstName} ${reg.lastName} registered for a clinic`,
          timestamp: new Date(reg.registeredAt).toLocaleDateString()
        })),
        ...contacts.slice(-10).map(contact => ({
          type: 'contact',
          description: `${contact.firstName} ${contact.lastName} sent a message: ${contact.subject}`,
          timestamp: new Date(contact.createdAt).toLocaleDateString()
        })),
        ...subscribers.slice(-10).map(sub => ({
          type: 'subscription',
          description: `${sub.email} subscribed to newsletter`,
          timestamp: new Date(sub.subscribedAt).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);

      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Settings management
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = {
        siteName: "Dan Bizzarro Method",
        tagline: "Professional Horse Training & Eventing",
        contactEmail: "dan@danbizzarromethod.com",
        socialMedia: {
          facebook: "https://facebook.com/danbizzarromethod",
          instagram: "https://instagram.com/danbizzarromethod",
          youtube: "https://youtube.com/@danbizzarromethod"
        },
        features: {
          enableRegistrations: true,
          enableNewsletter: true,
          enableLoyaltyProgram: true,
          maintenanceMode: false
        },
        notifications: {
          emailNewRegistrations: true,
          emailNewContacts: true,
          emailNewsletterSignups: true
        }
      };
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      res.json({ message: "Settings updated successfully" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Email unsubscribe endpoint
  app.post("/api/email/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Update local database
      const subscriber = await storage.getEmailSubscriberByEmail(email);
      if (subscriber) {
        await storage.updateEmailSubscriber(subscriber.id, { 
          isActive: false 
        });
      }

      // Update Go High Level
      if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) {
        try {
          const ghlResponse = await fetch(
            `https://services.leadconnectorhq.com/contacts/`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
              },
              body: JSON.stringify({
                email,
                locationId: process.env.GHL_LOCATION_ID,
                tags: ['unsubscribed'],
                customFields: [
                  { key: 'email_preferences', field_value: 'unsubscribed' }
                ]
              })
            }
          );

          if (!ghlResponse.ok) {
            // If contact exists, try updating instead
            if (ghlResponse.status === 400) {
              // Find contact by email
              const searchResponse = await fetch(
                `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${process.env.GHL_LOCATION_ID}&email=${encodeURIComponent(email)}`,
                {
                  headers: {
                    'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                    'Version': '2021-07-28'
                  }
                }
              );

              if (searchResponse.ok) {
                const searchData = await searchResponse.json();
                if (searchData.contact) {
                  // Update existing contact
                  await fetch(
                    `https://services.leadconnectorhq.com/contacts/${searchData.contact.id}`,
                    {
                      method: 'PUT',
                      headers: {
                        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                        'Content-Type': 'application/json',
                        'Version': '2021-07-28'
                      },
                      body: JSON.stringify({
                        tags: ['unsubscribed'],
                        customFields: [
                          { key: 'email_preferences', field_value: 'unsubscribed' }
                        ]
                      })
                    }
                  );
                }
              }
            }
          }

          console.log(`Updated GHL contact for unsubscribe: ${email}`);
        } catch (ghlError) {
          console.error('GHL unsubscribe update failed:', ghlError);
          // Don't fail the request if GHL update fails
        }
      }

      res.json({ 
        message: "Successfully unsubscribed from marketing emails",
        success: true 
      });
    } catch (error) {
      console.error("Error processing unsubscribe:", error);
      res.status(500).json({ message: "Failed to process unsubscribe request" });
    }
  });

  // Database backup
  app.post("/api/admin/backup", async (req, res) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupData = {
        timestamp,
        version: "1.0",
        data: {
          clinics: await storage.getAllClinics(),
          registrations: await storage.getAllClinicRegistrations(),
          contacts: await storage.getAllContacts(),
          subscribers: await storage.getAllEmailSubscribers(),
          news: await storage.getAllNews(),
          gallery: await storage.getAllGalleryImages(),
          achievements: await storage.getAllAchievements(),
          events: await storage.getAllEvents(),
          testimonials: await storage.getAllTestimonials(),
          sponsors: await storage.getAllSponsors()
        }
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="danbizzarro-backup-${timestamp}.json"`);
      res.json(backupData);
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  // XML Sitemap for Blog Posts
  app.get("/sitemap-blog.xml", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      const baseUrl = "https://danbizzarromethod.com";
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;
      
      // Add blog index page
      xml += `  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
      
      // Add individual blog posts
      for (const article of news) {
        const slug = article.slug || article.id;
        const lastMod = new Date(article.publishedAt).toISOString().split('T')[0];
        
        xml += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
      
      xml += `</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating blog sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // XML Sitemap for Clinics
  app.get("/sitemap-clinics.xml", async (req, res) => {
    try {
      const clinics = await storage.getUpcomingClinics();
      const baseUrl = "https://danbizzarromethod.com";
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      
      // Add clinics index page
      xml += `  <url>
    <loc>${baseUrl}/coaching/clinics</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
      
      // Add home page clinics section
      xml += `  <url>
    <loc>${baseUrl}/#clinics</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
      
      xml += `</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating clinics sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // XML Sitemap for Static Pages
  app.get("/sitemap-pages.xml", async (req, res) => {
    try {
      const baseUrl = "https://danbizzarromethod.com";
      
      const staticPages = [
        { loc: '/', priority: '1.0', changefreq: 'daily' },
        { loc: '/about', priority: '0.8', changefreq: 'monthly' },
        { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
        { loc: '/coaching', priority: '0.9', changefreq: 'weekly' },
        { loc: '/coaching/private-lessons', priority: '0.8', changefreq: 'monthly' },
        { loc: '/coaching/clinics', priority: '0.9', changefreq: 'daily' },
        { loc: '/coaching/remote-coaching', priority: '0.8', changefreq: 'monthly' },
        { loc: '/coaching/dressage', priority: '0.7', changefreq: 'monthly' },
        { loc: '/coaching/show-jumping', priority: '0.7', changefreq: 'monthly' },
        { loc: '/coaching/cross-country', priority: '0.7', changefreq: 'monthly' },
        { loc: '/coaching/polework', priority: '0.7', changefreq: 'monthly' },
        { loc: '/tools/stride-calculator', priority: '0.7', changefreq: 'monthly' },
        { loc: '/tools/readiness-quiz', priority: '0.7', changefreq: 'monthly' },
        { loc: '/tools/packing-list', priority: '0.7', changefreq: 'monthly' },
        { loc: '/gallery', priority: '0.6', changefreq: 'weekly' },
        { loc: '/podcast', priority: '0.7', changefreq: 'weekly' },
        { loc: '/blog', priority: '0.8', changefreq: 'daily' },
        { loc: '/loyalty', priority: '0.6', changefreq: 'monthly' },
      ];
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      
      for (const page of staticPages) {
        xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }
      
      xml += `</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating pages sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Main Sitemap Index
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://danbizzarromethod.com";
      const today = new Date().toISOString().split('T')[0];
      
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-clinics.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap index:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
