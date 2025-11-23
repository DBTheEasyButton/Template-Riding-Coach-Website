import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  competition: text("competition").notNull(),
  year: integer("year").notNull(),
  position: text("position").notNull(),
  location: text("location").notNull(),
  horse: text("horse"),
  category: text("category").notNull(), // olympic, world, european, other
  description: text("description"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // upcoming, completed
  horse: text("horse"),
  level: text("level"), // CCI5*, CCI4*, etc
  result: text("result"), // for completed events
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  slug: text("slug").notNull().unique(),
}, (table) => ({
  slugIdx: index("news_slug_idx").on(table.slug),
}));

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  inquiryType: text("inquiry_type"),
  preferredContact: text("preferred_contact").default("email"),
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  googleMapsLink: text("google_maps_link"), // Google Maps link for clinic location
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").notNull().default(0),
  price: integer("price").notNull(), // in euros
  level: text("level").notNull(), // beginner, intermediate, advanced
  type: text("type").notNull(), // dressage, jumping, cross-country, full-day
  image: text("image").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  entryOpenDate: timestamp("entry_open_date"), // Date when registrations open (if blank, open straight away)
  entryClosingDate: timestamp("entry_closing_date"), // Date when registrations close
  startTime: text("start_time"), // Clinic start time (e.g., "09:00")
  endTime: text("end_time"), // Clinic end time (e.g., "17:00")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Enhanced fields for multi-session support
  hasMultipleSessions: boolean("has_multiple_sessions").notNull().default(false),
  clinicType: text("clinic_type").notNull().default("single"), // single, multi-session, combo
  // Deprecated: use maxParticipants for total clinic cap and session-level maxParticipants instead
  crossCountryMaxParticipants: integer("cross_country_max_participants"),
  showJumpingMaxParticipants: integer("show_jumping_max_participants")
}, (table) => ({
  isActiveIdx: index("clinics_is_active_idx").on(table.isActive),
  dateIdx: index("clinics_date_idx").on(table.date),
  isActiveDateIdx: index("clinics_is_active_date_idx").on(table.isActive, table.date),
}));

export const clinicSessions = pgTable("clinic_sessions", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull().references(() => clinics.id, { onDelete: 'cascade' }),
  sessionName: text("session_name").notNull(), // "Show Jumping", "Cross Country", "Morning Session", etc.
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "12:00"
  discipline: text("discipline").notNull(), // jumping, cross-country, dressage, polework, gridwork
  skillLevel: text("skill_level").notNull(), // 70cm/80cm, 90cm, 1m, 1.10m, beginner, intermediate, experienced
  price: integer("price").notNull(), // in euros
  maxParticipants: integer("max_participants"), // Optional - not mandatory
  currentParticipants: integer("current_participants").notNull().default(0),
  requirements: text("requirements"), // "Own horse required", "Suitable for green horses", etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  clinicIdIdx: index("clinic_sessions_clinic_id_idx").on(table.clinicId),
}));

export const clinicGroups = pgTable("clinic_groups", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => clinicSessions.id, { onDelete: 'cascade' }),
  groupName: text("group_name").notNull(), // "Group 1", "Beginner Group", "Advanced Group"
  skillLevel: text("skill_level"), // Optional: 70cm, 90cm, 1m, etc. for filtering
  maxParticipants: integer("max_participants"), // Optional: limit per group
  startTime: text("start_time"), // Group start time (e.g., "15:00")
  endTime: text("end_time"), // Group end time (e.g., "16:00")
  displayOrder: integer("display_order").notNull().default(0), // For sorting groups
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  sessionIdIdx: index("clinic_groups_session_id_idx").on(table.sessionId),
}));

export const clinicRegistrations = pgTable("clinic_registrations", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull().references(() => clinics.id),
  sessionId: integer("session_id").references(() => clinicSessions.id), // Optional for backward compatibility
  groupId: integer("group_id").references(() => clinicGroups.id, { onDelete: 'set null' }), // Group assignment
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  horseName: text("horse_name").notNull(), // Made mandatory
  skillLevel: text("skill_level"), // Skill level assigned when participant joins a group
  specialRequests: text("special_requests"),
  emergencyContact: text("emergency_contact").notNull(),
  emergencyPhone: text("emergency_phone").notNull(),
  medicalConditions: text("medical_conditions"),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"),
  agreeToTerms: boolean("agree_to_terms").notNull().default(false),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled_by_admin, waitlist
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  refundAmount: integer("refund_amount"), // amount refunded in pence
  refundProcessedAt: timestamp("refund_processed_at"),
  cancellationReason: text("cancellation_reason"),
  paymentIntentId: text("payment_intent_id"),
}, (table) => ({
  clinicIdIdx: index("clinic_registrations_clinic_id_idx").on(table.clinicId),
  statusIdx: index("clinic_registrations_status_idx").on(table.status),
  sessionIdIdx: index("clinic_registrations_session_id_idx").on(table.sessionId),
  clinicIdStatusIdx: index("clinic_registrations_clinic_id_status_idx").on(table.clinicId, table.status),
}));

export const clinicWaitlist = pgTable("clinic_waitlist", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull().references(() => clinics.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  horseName: text("horse_name"),
  specialRequests: text("special_requests"),
  position: integer("position").notNull(), // position in waitlist
  notified: boolean("notified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trainingVideos = pgTable("training_videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  category: text("category").notNull(), // dressage, jumping, cross-country, general
  level: text("level").notNull(), // beginner, intermediate, advanced
  isPremium: boolean("is_premium").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email Marketing System Tables
export const emailSubscribers = pgTable("email_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  subscriptionSource: text("subscription_source").notNull(), // newsletter, clinic_registration, contact_form
  isActive: boolean("is_active").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  interests: jsonb("interests").default('[]'), // array of interests like ["clinics", "training_videos", "news"]
  metadata: jsonb("metadata").default('{}'), // additional subscriber data
});

export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content").notNull(),
  templateType: text("template_type").notNull(), // welcome, newsletter, clinic_reminder, event_update
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  templateId: integer("template_id").notNull().references(() => emailTemplates.id),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("draft"), // draft, scheduled, sending, sent, cancelled
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  targetAudience: jsonb("target_audience").default('{}'), // filtering criteria
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => emailCampaigns.id),
  subscriberId: integer("subscriber_id").notNull().references(() => emailSubscribers.id),
  subject: text("subject").notNull(),
  status: text("status").notNull(), // sent, delivered, opened, clicked, bounced, failed
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  openedAt: timestamp("opened_at"),
  clickedAt: timestamp("clicked_at"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").default('{}'),
});

export const emailAutomations = pgTable("email_automations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  trigger: text("trigger").notNull(), // new_subscriber, clinic_registration, event_reminder
  templateId: integer("template_id").notNull().references(() => emailTemplates.id),
  delayHours: integer("delay_hours").default(0), // delay before sending
  isActive: boolean("is_active").notNull().default(true),
  conditions: jsonb("conditions").default('{}'), // additional conditions for triggering
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // competition, training, clinic, personal
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertClinicSchema = createInsertSchema(clinics).omit({
  id: true,
  currentParticipants: true,
  createdAt: true,
}).extend({
  googleMapsLink: z.string().min(1, "Google Maps Link is required"),
});

export const insertClinicRegistrationSchema = createInsertSchema(clinicRegistrations).omit({
  id: true,
  registeredAt: true,
}).extend({
  sessionId: z.number().optional(), // Make sessionId optional for backward compatibility
});

export const insertClinicSessionSchema = createInsertSchema(clinicSessions).omit({
  id: true,
  createdAt: true,
}).extend({
  currentParticipants: z.number().default(0),
});

export const insertClinicGroupSchema = createInsertSchema(clinicGroups).omit({
  id: true,
  createdAt: true,
});

export const insertClinicWaitlistSchema = createInsertSchema(clinicWaitlist).omit({
  id: true,
  position: true,
  notified: true,
  createdAt: true,
});

export const insertTrainingVideoSchema = createInsertSchema(trainingVideos).omit({
  id: true,
  viewCount: true,
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

// Email Marketing System Insert Schemas
export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers).omit({
  id: true,
  subscribedAt: true,
  unsubscribedAt: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({
  id: true,
  sentAt: true,
  recipientCount: true,
  openCount: true,
  clickCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailLogSchema = createInsertSchema(emailLogs).omit({
  id: true,
  sentAt: true,
  openedAt: true,
  clickedAt: true,
});

export const insertEmailAutomationSchema = createInsertSchema(emailAutomations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Clinic = typeof clinics.$inferSelect;
export type InsertClinic = z.infer<typeof insertClinicSchema>;
export type ClinicRegistration = typeof clinicRegistrations.$inferSelect;
export type InsertClinicRegistration = z.infer<typeof insertClinicRegistrationSchema>;
export type ClinicWaitlist = typeof clinicWaitlist.$inferSelect;
export type InsertClinicWaitlist = z.infer<typeof insertClinicWaitlistSchema>;
export type ClinicSession = typeof clinicSessions.$inferSelect;
export type InsertClinicSession = z.infer<typeof insertClinicSessionSchema>;
export type ClinicGroup = typeof clinicGroups.$inferSelect;
export type InsertClinicGroup = z.infer<typeof insertClinicGroupSchema>;
export type TrainingVideo = typeof trainingVideos.$inferSelect;
export type InsertTrainingVideo = z.infer<typeof insertTrainingVideoSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

// Email Marketing System Types
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type InsertEmailSubscriber = z.infer<typeof insertEmailSubscriberSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = z.infer<typeof insertEmailLogSchema>;
export type EmailAutomation = typeof emailAutomations.$inferSelect;
export type InsertEmailAutomation = z.infer<typeof insertEmailAutomationSchema>;

// Gallery System Types
export type GalleryImage = typeof gallery.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGallerySchema>;

// Loyalty Program Tables
export const loyaltyProgram = pgTable("loyalty_program", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  clinicEntries: integer("clinic_entries").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0), // in pence
  discountsUsed: integer("discounts_used").notNull().default(0),
  lastClinicDate: timestamp("last_clinic_date"),
  loyaltyTier: text("loyalty_tier").notNull().default("bronze"), // bronze, silver, gold
  isActive: boolean("is_active").notNull().default(true),
  // Points & Referral System
  points: integer("points").notNull().default(0),
  referralCode: text("referral_code").unique(),
  usedReferralCode: text("used_referral_code"),
  lastResetDate: timestamp("last_reset_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const loyaltyDiscounts = pgTable("loyalty_discounts", {
  id: serial("id").primaryKey(),
  loyaltyId: integer("loyalty_id").notNull().references(() => loyaltyProgram.id),
  discountCode: text("discount_code").notNull().unique(),
  discountType: text("discount_type").notNull(), // percentage, fixed_amount
  discountValue: integer("discount_value").notNull(), // percentage (0-100) or amount in pence
  minimumEntries: integer("minimum_entries").notNull().default(5),
  pointsRequired: integer("points_required"), // 50, 100, 150, etc.
  isUsed: boolean("is_used").notNull().default(false),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at").notNull(),
  clinicRegistrationId: integer("clinic_registration_id").references(() => clinicRegistrations.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => loyaltyProgram.id),
  refereeEmail: text("referee_email").notNull(),
  bonusPoints: integer("bonus_points").notNull().default(20),
  isNewClient: boolean("is_new_client").notNull().default(false),
  clinicRegistrationId: integer("clinic_registration_id").references(() => clinicRegistrations.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const loyaltyProgramArchive = pgTable("loyalty_program_archive", {
  id: serial("id").primaryKey(),
  loyaltyId: integer("loyalty_id").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  points: integer("points").notNull(),
  rank: integer("rank").notNull(),
  resetPeriod: text("reset_period").notNull(), // "2025-H1" (Jan-Jun), "2025-H2" (Jul-Dec)
  archivedAt: timestamp("archived_at").notNull().defaultNow(),
});

export const insertLoyaltyProgramSchema = createInsertSchema(loyaltyProgram).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLoyaltyDiscountSchema = createInsertSchema(loyaltyDiscounts).omit({
  id: true,
  isUsed: true,
  usedAt: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertLoyaltyProgramArchiveSchema = createInsertSchema(loyaltyProgramArchive).omit({
  id: true,
  archivedAt: true,
});

export type LoyaltyProgram = typeof loyaltyProgram.$inferSelect;
export type InsertLoyaltyProgram = z.infer<typeof insertLoyaltyProgramSchema>;
export type LoyaltyDiscount = typeof loyaltyDiscounts.$inferSelect;
export type InsertLoyaltyDiscount = z.infer<typeof insertLoyaltyDiscountSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type LoyaltyProgramArchive = typeof loyaltyProgramArchive.$inferSelect;
export type InsertLoyaltyProgramArchive = z.infer<typeof insertLoyaltyProgramArchiveSchema>;

// Extended type for clinics with sessions
export type ClinicWithSessions = Clinic & {
  sessions: ClinicSession[];
};

// Combined type for loyalty program with available discounts
export interface LoyaltyProgramWithDiscounts extends LoyaltyProgram {
  availableDiscounts?: LoyaltyDiscount[];
}

export const competitionChecklists = pgTable("competition_checklists", {
  id: serial("id").primaryKey(),
  discipline: text("discipline").notNull(), // dressage, showjumping, eventing
  competitionType: text("competition_type").notNull(), // My first ever competition, Novice, etc
  competitionName: text("competition_name"),
  competitionDate: timestamp("competition_date"),
  location: text("location"),
  horseName: text("horse_name"),
  checklist: jsonb("checklist").notNull(), // Array of checklist items with categories
  isCompleted: boolean("is_completed").default(false),
  completionNotes: text("completion_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo").notNull(),
  website: text("website").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  rotationDuration: integer("rotation_duration").notNull().default(10), // seconds
  clickCount: integer("click_count").notNull().default(0),
  impressionCount: integer("impression_count").notNull().default(0),
  lastDisplayed: timestamp("last_displayed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCompetitionChecklistSchema = createInsertSchema(competitionChecklists).omit({
  id: true,
  isCompleted: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSponsorSchema = createInsertSchema(sponsors).omit({
  id: true,
  clickCount: true,
  impressionCount: true,
  lastDisplayed: true,
  createdAt: true,
  updatedAt: true,
});

export type CompetitionChecklist = typeof competitionChecklists.$inferSelect;
export type InsertCompetitionChecklist = z.infer<typeof insertCompetitionChecklistSchema>;
export type Sponsor = typeof sponsors.$inferSelect;
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;

// Go High Level Contacts
export const ghlContacts = pgTable("ghl_contacts", {
  id: serial("id").primaryKey(),
  ghlId: text("ghl_id").notNull().unique(), // Go High Level contact ID
  locationId: text("location_id").notNull(), // GHL Location/Sub-account ID
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  timezone: text("timezone"),
  country: text("country"),
  source: text("source"), // Form or entry source
  dateAdded: timestamp("date_added"), // When contact was added to GHL
  tags: text("tags").array(), // GHL tags
  customFields: jsonb("custom_fields"), // GHL custom fields as JSON
  attributions: jsonb("attributions"), // GHL attribution data
  businessId: text("business_id"),
  lastSyncedAt: timestamp("last_synced_at").notNull().defaultNow(), // When we last synced from GHL
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGhlContactSchema = createInsertSchema(ghlContacts).omit({
  id: true,
  createdAt: true,
});

export type GhlContact = typeof ghlContacts.$inferSelect;
export type InsertGhlContact = z.infer<typeof insertGhlContactSchema>;
