import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
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
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").notNull().default(0),
  price: integer("price").notNull(), // in euros
  level: text("level").notNull(), // beginner, intermediate, advanced
  type: text("type").notNull(), // dressage, jumping, cross-country, full-day
  image: text("image").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Enhanced fields for multi-session support
  hasMultipleSessions: boolean("has_multiple_sessions").notNull().default(false),
  clinicType: text("clinic_type").notNull().default("single"), // single, multi-session, combo
  crossCountryMaxParticipants: integer("cross_country_max_participants").default(12),
  showJumpingMaxParticipants: integer("show_jumping_max_participants").default(12)
});

export const clinicSessions = pgTable("clinic_sessions", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull().references(() => clinics.id, { onDelete: 'cascade' }),
  sessionName: text("session_name").notNull(), // "Show Jumping", "Cross Country", "Morning Session", etc.
  startTime: text("start_time").notNull(), // "09:00"
  endTime: text("end_time").notNull(), // "12:00"
  discipline: text("discipline").notNull(), // jumping, cross-country, dressage, polework, gridwork
  skillLevel: text("skill_level").notNull(), // 70cm/80cm, 90cm, 1m, 1.10m, beginner, intermediate, experienced
  price: integer("price").notNull(), // in euros
  maxParticipants: integer("max_participants").notNull(),
  currentParticipants: integer("current_participants").notNull().default(0),
  requirements: text("requirements"), // "Own horse required", "Suitable for green horses", etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const clinicRegistrations = pgTable("clinic_registrations", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull().references(() => clinics.id),
  sessionId: integer("session_id").references(() => clinicSessions.id), // Optional for backward compatibility
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  experienceLevel: text("experience_level").notNull(),
  horseName: text("horse_name"),
  specialRequests: text("special_requests"),
  emergencyContact: text("emergency_contact").notNull(),
  emergencyPhone: text("emergency_phone").notNull(),
  medicalConditions: text("medical_conditions"),
  paymentMethod: text("payment_method").notNull().default("bank_transfer"),
  agreeToTerms: boolean("agree_to_terms").notNull().default(false),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, waitlist
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
});

export const clinicWaitlist = pgTable("clinic_waitlist", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull().references(() => clinics.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  experienceLevel: text("experience_level").notNull(),
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
  currentParticipants: true,
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
export type TrainingVideo = typeof trainingVideos.$inferSelect;
export type InsertTrainingVideo = z.infer<typeof insertTrainingVideoSchema>;
