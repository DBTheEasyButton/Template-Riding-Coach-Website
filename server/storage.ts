import { 
  users, 
  achievements, 
  events, 
  news, 
  contacts,
  clinics,
  clinicSessions,
  clinicGroups,
  clinicRegistrations,
  clinicWaitlist,
  trainingVideos,
  testimonials,
  emailSubscribers,
  emailTemplates,
  emailCampaigns,
  emailLogs,
  emailAutomations,
  gallery,
  loyaltyProgram,
  loyaltyDiscounts,
  referrals,
  loyaltyProgramArchive,
  competitionChecklists,
  sponsors,
  ghlContacts,
  type User, 
  type InsertUser,
  type Achievement,
  type InsertAchievement,
  type Event,
  type InsertEvent,
  type News,
  type InsertNews,
  type Contact,
  type InsertContact,
  type Clinic,
  type InsertClinic,
  type ClinicWithSessions,
  type ClinicSession,
  type InsertClinicSession,
  type ClinicGroup,
  type InsertClinicGroup,
  type ClinicRegistration,
  type InsertClinicRegistration,
  type ClinicWaitlist,
  type InsertClinicWaitlist,
  type TrainingVideo,
  type InsertTrainingVideo,
  type Testimonial,
  type InsertTestimonial,
  type EmailSubscriber,
  type InsertEmailSubscriber,
  type EmailTemplate,
  type InsertEmailTemplate,
  type EmailCampaign,
  type InsertEmailCampaign,
  type Sponsor,
  type InsertSponsor,
  type EmailLog,
  type InsertEmailLog,
  type EmailAutomation,
  type InsertEmailAutomation,
  type GalleryImage,
  type InsertGalleryImage,
  type LoyaltyProgram,
  type InsertLoyaltyProgram,
  type LoyaltyDiscount,
  type InsertLoyaltyDiscount,
  type Referral,
  type InsertReferral,
  type LoyaltyProgramArchive,
  type InsertLoyaltyProgramArchive,
  type LoyaltyProgramWithDiscounts,
  type CompetitionChecklist,
  type InsertCompetitionChecklist,
  type GhlContact,
  type InsertGhlContact,
  visitorProfiles,
  type VisitorProfile,
  type InsertVisitorProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, inArray, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  getAllNews(): Promise<News[]>;
  getLatestNews(limit: number): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, updates: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<void>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  markContactResolved(id: number): Promise<void>;
  
  getAllClinics(): Promise<ClinicWithSessions[]>;
  getUpcomingClinics(limit?: number): Promise<ClinicWithSessions[]>;
  getClinic(id: number): Promise<Clinic | undefined>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  updateClinic(id: number, clinic: Partial<InsertClinic>): Promise<Clinic | undefined>;
  deleteClinic(id: number): Promise<void>;
  createClinicSession(session: InsertClinicSession): Promise<ClinicSession>;
  updateClinicSession(sessionId: number, updates: Partial<InsertClinicSession>): Promise<ClinicSession | undefined>;
  hasSessionRegistrations(sessionId: number): Promise<boolean>;
  getAllClinicSessions(): Promise<ClinicSession[]>;
  
  // Group Management
  createClinicGroup(group: InsertClinicGroup): Promise<ClinicGroup>;
  getSessionGroups(sessionId: number): Promise<ClinicGroup[]>;
  updateClinicGroup(groupId: number, updates: Partial<InsertClinicGroup>): Promise<ClinicGroup | undefined>;
  deleteClinicGroup(groupId: number): Promise<void>;
  moveParticipantToGroup(registrationId: number, groupId: number | null): Promise<void>;
  getGroupParticipants(groupId: number): Promise<ClinicRegistration[]>;
  getSessionRegistrations(sessionId: number, confirmedOnly?: boolean): Promise<ClinicRegistration[]>;
  autoOrganizeGroups(sessionId: number): Promise<ClinicGroup[]>;
  
  createClinicRegistration(registration: InsertClinicRegistration): Promise<ClinicRegistration>;
  getClinicRegistrations(clinicId: number): Promise<ClinicRegistration[]>;
  getAllClinicRegistrations(): Promise<ClinicRegistration[]>;
  updateRegistrationStatus(id: number, status: string, refundAmount?: number, reason?: string): Promise<ClinicRegistration | undefined>;
  canProcessRefund(registrationId: number): Promise<{ eligible: boolean; reason: string; amount?: number }>;
  
  addToWaitlist(waitlistEntry: InsertClinicWaitlist): Promise<ClinicWaitlist>;
  getWaitlist(clinicId: number): Promise<ClinicWaitlist[]>;
  removeFromWaitlist(id: number): Promise<void>;
  promoteFromWaitlist(clinicId: number): Promise<ClinicWaitlist | null>;
  
  getAllTrainingVideos(): Promise<TrainingVideo[]>;
  getTrainingVideosByCategory(category: string): Promise<TrainingVideo[]>;
  createTrainingVideo(video: InsertTrainingVideo): Promise<TrainingVideo>;
  updateVideoViewCount(id: number): Promise<void>;
  
  getAllTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Email Marketing System
  getAllEmailSubscribers(): Promise<EmailSubscriber[]>;
  getEmailSubscriber(id: number): Promise<EmailSubscriber | undefined>;
  getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined>;
  createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber>;
  updateEmailSubscriber(id: number, updates: Partial<InsertEmailSubscriber>): Promise<EmailSubscriber | undefined>;
  unsubscribeEmail(email: string): Promise<void>;
  clearAllEmailSubscribers(): Promise<void>;
  
  getAllEmailTemplates(): Promise<EmailTemplate[]>;
  getEmailTemplate(id: number): Promise<EmailTemplate | undefined>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  updateEmailTemplate(id: number, updates: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: number): Promise<void>;
  
  getAllEmailCampaigns(): Promise<EmailCampaign[]>;
  getEmailCampaign(id: number): Promise<EmailCampaign | undefined>;
  createEmailCampaign(campaign: InsertEmailCampaign): Promise<EmailCampaign>;
  updateEmailCampaign(id: number, updates: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined>;
  
  createEmailLog(log: InsertEmailLog): Promise<EmailLog>;
  getEmailLogsByCampaign(campaignId: number): Promise<EmailLog[]>;
  getEmailLogsBySubscriber(subscriberId: number): Promise<EmailLog[]>;
  
  getAllEmailAutomations(): Promise<EmailAutomation[]>;
  getEmailAutomation(id: number): Promise<EmailAutomation | undefined>;
  createEmailAutomation(automation: InsertEmailAutomation): Promise<EmailAutomation>;
  updateEmailAutomation(id: number, updates: Partial<InsertEmailAutomation>): Promise<EmailAutomation | undefined>;
  deleteEmailAutomation(id: number): Promise<void>;

  // Gallery System
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImage(id: number): Promise<GalleryImage | undefined>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined>;
  deleteGalleryImage(id: number): Promise<void>;

  // Loyalty Program System
  getAllLoyaltyPrograms(): Promise<LoyaltyProgram[]>;
  getLoyaltyProgram(email: string): Promise<LoyaltyProgramWithDiscounts | undefined>;
  createLoyaltyProgram(program: InsertLoyaltyProgram): Promise<LoyaltyProgram>;
  updateLoyaltyProgram(email: string, updates: Partial<InsertLoyaltyProgram>): Promise<LoyaltyProgram | undefined>;
  incrementClinicEntries(email: string, amount: number): Promise<LoyaltyProgram | undefined>;
  createLoyaltyDiscount(discount: InsertLoyaltyDiscount): Promise<LoyaltyDiscount>;
  getLoyaltyDiscounts(loyaltyId: number): Promise<LoyaltyDiscount[]>;
  getAvailableDiscount(email: string): Promise<LoyaltyDiscount | undefined>;
  useLoyaltyDiscount(discountCode: string, registrationId: number): Promise<LoyaltyDiscount | undefined>;
  
  // Points & Referral System
  generateUniqueReferralCode(firstName?: string): Promise<string>;
  validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: number; referrerEmail?: string }>;
  isNewClient(email: string): Promise<boolean>;
  awardPoints(email: string, points: number, reason: string, firstName?: string): Promise<LoyaltyProgram | undefined>;
  trackReferral(referrerId: number, refereeEmail: string, isNewClient: boolean, registrationId: number): Promise<void>;
  checkPointsMilestone(loyaltyId: number, points: number): Promise<void>;
  generateDiscount20Percent(loyaltyId: number, pointsRequired: number): Promise<LoyaltyDiscount>;
  getLeaderboard(limit?: number): Promise<Array<{ rank: number; firstName: string; lastInitial: string; points: number }>>;
  archiveTopWinners(resetPeriod: string): Promise<void>;
  resetAllPoints(): Promise<void>;
  getDiscountByCode(code: string): Promise<LoyaltyDiscount | undefined>;

  // Competition Checklist System
  getAllCompetitionChecklists(): Promise<CompetitionChecklist[]>;
  getCompetitionChecklist(id: number): Promise<CompetitionChecklist | undefined>;
  createCompetitionChecklist(checklist: InsertCompetitionChecklist): Promise<CompetitionChecklist>;
  updateCompetitionChecklist(id: number, updates: Partial<InsertCompetitionChecklist>): Promise<CompetitionChecklist | undefined>;
  deleteCompetitionChecklist(id: number): Promise<void>;
  generateChecklistForCompetition(discipline: string, competitionType: string, competitionName: string, competitionDate: Date, location: string, horseName?: string): Promise<CompetitionChecklist>;

  // Sponsor System
  getAllSponsors(): Promise<Sponsor[]>;
  getActiveSponsor(): Promise<Sponsor | undefined>;
  getSponsor(id: number): Promise<Sponsor | undefined>;
  createSponsor(sponsor: InsertSponsor): Promise<Sponsor>;
  updateSponsor(id: number, updates: Partial<Sponsor>): Promise<Sponsor | undefined>;
  deleteSponsor(id: number): Promise<void>;
  trackSponsorClick(id: number): Promise<void>;
  trackSponsorImpression(id: number): Promise<void>;

  // Go High Level Integration
  getAllGhlContacts(): Promise<GhlContact[]>;
  getGhlContact(id: number): Promise<GhlContact | undefined>;
  getGhlContactByGhlId(ghlId: string): Promise<GhlContact | undefined>;
  createGhlContact(contact: InsertGhlContact): Promise<GhlContact>;
  updateGhlContact(id: number, updates: Partial<InsertGhlContact>): Promise<GhlContact | undefined>;
  deleteGhlContact(id: number): Promise<void>;
  syncGhlContacts(locationId: string): Promise<number>; // Returns count of synced contacts
  createOrUpdateGhlContactInApi(
    email: string,
    firstName: string,
    lastName?: string,
    phone?: string,
    tags?: string[],
    customFields?: Record<string, any>
  ): Promise<{ success: boolean; contactId?: string; message?: string }>;

  // Visitor Profile System (for recognizing returning visitors)
  getVisitorProfileByToken(token: string): Promise<VisitorProfile | undefined>;
  getVisitorProfileByEmail(email: string): Promise<VisitorProfile | undefined>;
  createOrUpdateVisitorProfile(
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    source: string,
    ghlContactId?: string
  ): Promise<{ profile: VisitorProfile; token: string; isNew: boolean }>;
  updateVisitorProfileLastSeen(token: string): Promise<void>;
  deleteVisitorProfile(token: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Seed initial data if tables are empty
      const existingAchievements = await db.select().from(achievements).limit(1);
      if (existingAchievements.length === 0) {
        await this.seedData();
      }
    } catch (error) {
      console.log("Database initialization skipped - tables may not exist yet");
    }
  }

  private async seedData() {
    // Seed achievements data
    const sampleAchievements = [
      {
        title: "Tokyo Olympics",
        competition: "Olympic Games",
        year: 2021,
        position: "Team Bronze",
        location: "Tokyo, Japan",
        horse: "Castello Primo",
        category: "olympic",
        description: "Outstanding performance in the team eventing competition"
      },
      {
        title: "European Championships", 
        competition: "European Eventing Championships",
        year: 2021,
        position: "Team Gold",
        location: "Avenches, Switzerland",
        horse: "Venetian Dream",
        category: "european",
        description: "Dominant team performance securing gold medal"
      },
      {
        title: "World Equestrian Games",
        competition: "FEI World Equestrian Games", 
        year: 2018,
        position: "Team Silver",
        location: "Tryon, USA",
        horse: "Milano Express",
        category: "world",
        description: "Strong team effort for silver medal finish"
      }
    ];

    await db.insert(achievements).values(sampleAchievements);

    // Seed events data
    const sampleEvents = [
      {
        title: "Cotswold Cup",
        location: "Waverton House", 
        date: new Date('2024-06-22'),
        type: "upcoming",
        horse: "Peggy",
        level: "90",
        result: null
      },
      {
        title: "BYEH",
        location: "Aston Le Walls",
        date: new Date('2024-07-02'),
        type: "upcoming", 
        horse: "Peggy",
        level: "5yo class",
        result: null
      },
      {
        title: "Open Intermediate",
        location: "Upton House",
        date: new Date('2024-07-08'),
        type: "upcoming",
        horse: "Riot", 
        level: "Intermediate",
        result: null
      },
      {
        title: "BYEH",
        location: "Cirencester Park",
        date: new Date('2024-07-10'),
        type: "upcoming",
        horse: "TBC", 
        level: "Intermediate",
        result: null
      },
      {
        title: "Cotswold Cup",
        location: "Cirencester Park",
        date: new Date('2024-07-13'),
        type: "upcoming",
        horse: "TBC", 
        level: "Intermediate",
        result: null
      },
      {
        title: "CIC4*",
        location: "Burgham",
        date: new Date('2024-07-24'),
        type: "upcoming",
        horse: "TBC", 
        level: "CIC4*",
        result: null
      },
      {
        title: "Open Intermediate",
        location: "Wellington",
        date: new Date('2024-08-22'),
        type: "upcoming",
        horse: "TBC", 
        level: "Intermediate",
        result: null
      },
      {
        title: "Cotswold Cup",
        location: "Great Tew",
        date: new Date('2024-08-24'),
        type: "upcoming",
        horse: "TBC", 
        level: "Intermediate",
        result: null
      },
      {
        title: "European Championship",
        location: "Blenheim Palace",
        date: new Date('2024-09-17'),
        type: "upcoming",
        horse: "TBC", 
        level: "Championship",
        result: null
      }
    ];

    await db.insert(events).values(sampleEvents);

    // Seed news data
    const sampleNews = [
      {
        title: "Badminton Preparation Underway",
        excerpt: "Dan and Castello Primo are putting the finishing touches on their preparation for this year's Badminton Horse Trials, with final training sessions showing promising form...",
        content: "Full article content here...",
        image: "https://images.unsplash.com/photo-1553284966-19b8815c7817?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        publishedAt: new Date('2024-03-25'),
        slug: "badminton-preparation-underway"
      },
      {
        title: "New Training Facility Opens", 
        excerpt: "The new state-of-the-art training facility in Tuscany officially opened this week, featuring world-class amenities for both horse and rider development...",
        content: "Full article content here...",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        publishedAt: new Date('2024-03-20'),
        slug: "new-training-facility-opens"
      }
    ];

    await db.insert(news).values(sampleNews);

    // Seed clinic data
    const sampleClinics = [
      {
        title: "Advanced Dressage Clinic",
        description: "Master the art of dressage with Olympic-level training techniques. Focus on precision, rhythm, and partnership with your horse.",
        date: new Date('2024-05-15'),
        endDate: new Date('2024-05-17'),
        location: "Tuscany Training Center, Italy",
        maxParticipants: 12,
        price: 75000, // $750.00
        level: "advanced",
        type: "dressage",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        title: "Cross-Country Masterclass",
        description: "Navigate challenging cross-country courses with confidence. Learn course walking, pace management, and tactical approaches.",
        date: new Date('2024-06-20'),
        endDate: new Date('2024-06-22'),
        location: "Kentucky Horse Park, USA",
        maxParticipants: 16,
        price: 85000, // $850.00
        level: "intermediate",
        type: "cross-country",
        image: "https://images.unsplash.com/photo-1553284966-19b8815c7817?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      },
      {
        title: "Show Jumping Excellence",
        description: "Perfect your show jumping technique with focus on accuracy, timing, and horse-rider communication over fences.",
        date: new Date('2024-07-10'),
        endDate: new Date('2024-07-12'),
        location: "Aachen Training Facility, Germany",
        maxParticipants: 14,
        price: 80000, // $800.00
        level: "intermediate",
        type: "jumping",
        image: "https://images.unsplash.com/photo-1573068629844-e4c3f8df9b1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
      }
    ];

    await db.insert(clinics).values(sampleClinics);

    // Seed training video data
    const sampleVideos = [
      {
        title: "Dressage Basics: Building a Foundation",
        description: "Learn the fundamental principles of dressage training, from basic position to advanced movements.",
        videoUrl: "https://www.dbeventing.co.uk/videos/dressage-foundation-training",
        thumbnailUrl: "https://www.dbeventing.co.uk/wp-content/uploads/2023/01/dressage-training-thumbnail.jpg",
        duration: 1800, // 30 minutes
        category: "dressage",
        level: "beginner",
        isPremium: false
      },
      {
        title: "Cross-Country: Reading the Terrain",
        description: "Master the art of course analysis and tactical riding across challenging cross-country courses.",
        videoUrl: "https://www.dbeventing.co.uk/videos/cross-country-terrain-analysis",
        thumbnailUrl: "https://www.dbeventing.co.uk/wp-content/uploads/2023/02/cross-country-analysis-thumbnail.jpg",
        duration: 2100, // 35 minutes
        category: "cross-country",
        level: "intermediate",
        isPremium: true
      },
      {
        title: "Show Jumping: Advanced Techniques",
        description: "Elevate your show jumping with Olympic-level strategies for complex courses and combinations.",
        videoUrl: "https://www.dbeventing.co.uk/videos/advanced-show-jumping-techniques", 
        thumbnailUrl: "https://www.dbeventing.co.uk/wp-content/uploads/2023/03/show-jumping-advanced-thumbnail.jpg",
        duration: 2400, // 40 minutes
        category: "jumping",
        level: "advanced",
        isPremium: true
      },
      {
        title: "Mental Preparation for Competition",
        description: "Develop the mental strength and focus required for high-level equestrian competition.",
        videoUrl: "https://www.dbeventing.co.uk/videos/mental-preparation-competition",
        thumbnailUrl: "https://www.dbeventing.co.uk/wp-content/uploads/2023/04/mental-preparation-thumbnail.jpg",
        duration: 1500, // 25 minutes
        category: "general",
        level: "intermediate",
        isPremium: false
      }
    ];

    await db.insert(trainingVideos).values(sampleVideos);

    // Seed testimonials data
    const sampleTestimonials = [
      {
        name: "Sarah Mitchell",
        location: "Gloucestershire, UK",
        content: "Working with Dan has completely transformed my riding. His approach to building trust and communication with my horse has taken us from struggling at novice level to confidently competing at intermediate. The Dan Bizzarro Method truly works!",
        rating: 5,
        featured: true
      },
      {
        name: "James Richardson",
        location: "Yorkshire, UK", 
        content: "Dan's coaching style is exceptional. He has this unique ability to break down complex movements into simple, achievable steps. My dressage scores have improved dramatically since attending his clinics.",
        rating: 5,
        featured: true
      },
      {
        name: "Emma Thompson",
        location: "Devon, UK",
        content: "I was nervous about cross-country until I worked with Dan. His methodical approach to building confidence over fences has been life-changing. We recently completed our first CCI2*!",
        rating: 5,
        featured: false
      },
      {
        name: "Michael O'Brien",
        location: "Ireland",
        content: "The technical knowledge Dan shares is incredible. As a professional rider myself, I've learned so much from his biomechanics approach and how he develops both horse and rider together.",
        rating: 5,
        featured: true
      },
      {
        name: "Charlotte Williams",
        location: "Surrey, UK",
        content: "Dan's training videos and clinics have been invaluable for my young horse's development. His patience and systematic approach create willing, confident horses. Highly recommend!",
        rating: 5,
        featured: false
      },
      {
        name: "Alexander Schmidt",
        location: "Germany",
        content: "I traveled from Germany specifically for Dan's clinic and it was worth every mile. His understanding of the horse's psychology and biomechanics is world-class. My horse and I have never felt more connected.",
        rating: 5,
        featured: true
      }
    ];

    await db.insert(testimonials).values(sampleTestimonials);

    // Seed email templates for marketing automation
    const sampleEmailTemplates = [
      {
        name: "Welcome Email",
        subject: "Welcome to the Dan Bizzarro Method Community!",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome {{firstName}}!</h1>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #1e3a8a;">Thank you for joining our community</h2>
              <p>We're thrilled to have you as part of the Dan Bizzarro Method family. You'll now receive:</p>
              <ul>
                <li>Exclusive training tips and techniques</li>
                <li>Early access to clinic announcements</li>
                <li>Updates on Dan's competitive journey</li>
                <li>Special offers on training videos and courses</li>
              </ul>
              <p>Best regards,<br>The Dan Bizzarro Method Team</p>
            </div>
          </div>
        `,
        textContent: `Welcome {{firstName}}!

Thank you for joining the Dan Bizzarro Method community. You'll now receive exclusive training tips, clinic announcements, competition updates, and special offers.

Best regards,
The Dan Bizzarro Method Team`,
        templateType: "welcome",
        isActive: true
      },
      {
        name: "Monthly Newsletter",
        subject: "{{firstName}}, Your Monthly Training Update from Dan",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1e3a8a; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Training Update</h1>
              <p style="color: #94a3b8; margin: 5px 0;">Monthly insights from Dan Bizzarro</p>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #1e3a8a;">Hello {{firstName}},</h2>
              <p>This month's focus is on building stronger partnerships with our horses through systematic training approaches.</p>
              
              <h3 style="color: #f97316;">Latest Competition Results</h3>
              <p>Dan recently competed at Adelaide CCI4*-L with excellent results. The preparation techniques used are now available in our latest training video series.</p>
              
              <h3 style="color: #f97316;">Upcoming Clinics</h3>
              <p>Don't miss out on our upcoming clinics. Early bird pricing available for newsletter subscribers.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.danbizzarromethod.com/clinics" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">View Clinics</a>
              </div>
              
              <p>Happy riding,<br>Dan Bizzarro</p>
            </div>
          </div>
        `,
        textContent: `Hello {{firstName}},

This month's focus is on building stronger partnerships with our horses through systematic training approaches.

Latest Competition Results:
Dan recently competed at Adelaide CCI4*-L with excellent results. The preparation techniques used are now available in our latest training video series.

Upcoming Clinics:
Don't miss out on our upcoming clinics. Early bird pricing available for newsletter subscribers.

View Clinics: https://www.danbizzarromethod.com/clinics

Happy riding,
Dan Bizzarro`,
        templateType: "newsletter",
        isActive: true
      },
      {
        name: "Clinic Reminder",
        subject: "Reminder: {{clinicName}} starts {{clinicDate}}",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f97316; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Clinic Reminder</h1>
            </div>
            <div style="padding: 30px; background: white;">
              <h2 style="color: #1e3a8a;">Hi {{firstName}},</h2>
              <p>This is a friendly reminder that <strong>{{clinicName}}</strong> starts on <strong>{{clinicDate}}</strong>.</p>
              
              <h3 style="color: #f97316;">What to Bring:</h3>
              <ul>
                <li>Your horse (if participating in mounted sessions)</li>
                <li>Appropriate riding attire and safety equipment</li>
                <li>Notebook for taking notes</li>
                <li>Water bottle and snacks</li>
              </ul>
              
              <h3 style="color: #f97316;">Location Details:</h3>
              <p>Crown Farm, Ascott-Under-Wychwood, OX7 6AB</p>
              
              <p>We're looking forward to seeing you there!</p>
              <p>Best regards,<br>The Dan Bizzarro Method Team</p>
            </div>
          </div>
        `,
        textContent: `Hi {{firstName}},

This is a friendly reminder that {{clinicName}} starts on {{clinicDate}}.

What to Bring:
- Your horse (if participating in mounted sessions)
- Appropriate riding attire and safety equipment
- Notebook for taking notes
- Water bottle and snacks

Location: Crown Farm, Ascott-Under-Wychwood, OX7 6AB

We're looking forward to seeing you there!

Best regards,
The Dan Bizzarro Method Team`,
        templateType: "clinic_reminder",
        isActive: true
      }
    ];

    await db.insert(emailTemplates).values(sampleEmailTemplates);

    // Seed email automations
    const sampleAutomations = [
      {
        name: "Welcome Series",
        trigger: "new_subscriber",
        templateId: 1, // Welcome Email template
        delayHours: 0,
        isActive: true,
        conditions: {}
      },
      {
        name: "Clinic Reminder Automation",
        trigger: "clinic_reminder",
        templateId: 3, // Clinic Reminder template
        delayHours: 24, // Send 24 hours before clinic
        isActive: true,
        conditions: {}
      }
    ];

    await db.insert(emailAutomations).values(sampleAutomations);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(achievements.year);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db.insert(achievements).values(insertAchievement).returning();
    return achievement;
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.date);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async getAllNews(): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.publishedAt));
  }

  async getLatestNews(limit: number): Promise<News[]> {
    return await db.select().from(news).orderBy(desc(news.publishedAt)).limit(limit);
  }

  async getNewsById(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.slug, slug));
    return newsItem;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  async updateNews(id: number, updates: Partial<InsertNews>): Promise<News | undefined> {
    const [newsItem] = await db
      .update(news)
      .set(updates)
      .where(eq(news.id, id))
      .returning();
    return newsItem;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async markContactResolved(id: number): Promise<void> {
    await db.update(contacts).set({ resolved: true }).where(eq(contacts.id, id));
  }

  async getAllClinics(): Promise<ClinicWithSessions[]> {
    const clinicsData = await db.select().from(clinics).where(eq(clinics.isActive, true)).orderBy(clinics.date);
    
    // Fetch all sessions for all clinics in a single query (eliminates N+1)
    const clinicIds = clinicsData.map(c => c.id);
    const allSessions = clinicIds.length > 0
      ? await db.select().from(clinicSessions).where(inArray(clinicSessions.clinicId, clinicIds))
      : [];
    
    // Group sessions by clinicId
    const sessionsByClinicId = new Map<number, typeof allSessions>();
    for (const session of allSessions) {
      const existing = sessionsByClinicId.get(session.clinicId) || [];
      existing.push(session);
      sessionsByClinicId.set(session.clinicId, existing);
    }
    
    // Attach sessions to clinics
    const clinicsWithSessions: ClinicWithSessions[] = clinicsData.map(clinic => ({
      ...clinic,
      sessions: clinic.hasMultipleSessions ? (sessionsByClinicId.get(clinic.id) ?? []) : []
    }));
    
    return clinicsWithSessions;
  }

  async getUpcomingClinics(limit?: number): Promise<ClinicWithSessions[]> {
    const now = new Date();
    
    // Fetch upcoming active clinics, ordered by date (nearest first)
    const baseQuery = db.select().from(clinics)
      .where(and(
        eq(clinics.isActive, true),
        gte(clinics.date, now)
      ))
      .orderBy(clinics.date);
    
    // Apply limit at database level if specified
    const clinicsData = limit && limit > 0 
      ? await baseQuery.limit(limit)
      : await baseQuery;
    
    // Fetch all sessions for these clinics in a single query
    const clinicIds = clinicsData.map(c => c.id);
    const allSessions = clinicIds.length > 0
      ? await db.select().from(clinicSessions).where(inArray(clinicSessions.clinicId, clinicIds))
      : [];
    
    // Group sessions by clinicId
    const sessionsByClinicId = new Map<number, typeof allSessions>();
    for (const session of allSessions) {
      const existing = sessionsByClinicId.get(session.clinicId) || [];
      existing.push(session);
      sessionsByClinicId.set(session.clinicId, existing);
    }
    
    // Attach sessions to clinics
    const clinicsWithSessions: ClinicWithSessions[] = clinicsData.map(clinic => ({
      ...clinic,
      sessions: clinic.hasMultipleSessions ? (sessionsByClinicId.get(clinic.id) ?? []) : []
    }));
    
    return clinicsWithSessions;
  }

  async getClinic(id: number): Promise<Clinic | undefined> {
    const [clinic] = await db.select().from(clinics).where(eq(clinics.id, id));
    return clinic;
  }

  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const [clinic] = await db.insert(clinics).values(insertClinic).returning();
    return clinic;
  }

  async updateClinic(id: number, updateData: Partial<InsertClinic>): Promise<Clinic | undefined> {
    // Update the clinic data only - do NOT delete sessions
    // Sessions with registrations cannot be deleted due to foreign key constraints
    const [clinic] = await db.update(clinics)
      .set(updateData)
      .where(eq(clinics.id, id))
      .returning();
    return clinic;
  }

  async deleteClinic(id: number): Promise<void> {
    // Delete all dependent data first (cascade delete)
    
    // 1. Delete all registrations for this clinic
    await db.delete(clinicRegistrations).where(eq(clinicRegistrations.clinicId, id));
    
    // 2. Delete all waitlist entries for this clinic
    await db.delete(clinicWaitlist).where(eq(clinicWaitlist.clinicId, id));
    
    // 3. Delete all sessions for this clinic
    await db.delete(clinicSessions).where(eq(clinicSessions.clinicId, id));
    
    // 4. Finally delete the clinic itself
    await db.delete(clinics).where(eq(clinics.id, id));
  }

  async createClinicSession(insertSession: InsertClinicSession): Promise<ClinicSession> {
    const [session] = await db.insert(clinicSessions).values(insertSession).returning();
    return session;
  }

  async updateClinicSession(sessionId: number, updates: Partial<InsertClinicSession>): Promise<ClinicSession | undefined> {
    const [updatedSession] = await db
      .update(clinicSessions)
      .set(updates)
      .where(eq(clinicSessions.id, sessionId))
      .returning();
    return updatedSession;
  }

  async hasSessionRegistrations(sessionId: number): Promise<boolean> {
    const registrations = await db
      .select({ count: sql<number>`count(*)` })
      .from(clinicRegistrations)
      .where(eq(clinicRegistrations.sessionId, sessionId));
    
    return registrations[0].count > 0;
  }

  async getAllClinicSessions(): Promise<ClinicSession[]> {
    return await db.select().from(clinicSessions);
  }

  // Group Management Methods
  async createClinicGroup(group: InsertClinicGroup): Promise<ClinicGroup> {
    const [newGroup] = await db.insert(clinicGroups).values(group).returning();
    return newGroup;
  }

  async getSessionGroups(sessionId: number): Promise<ClinicGroup[]> {
    return await db
      .select()
      .from(clinicGroups)
      .where(eq(clinicGroups.sessionId, sessionId))
      .orderBy(clinicGroups.displayOrder);
  }

  async updateClinicGroup(groupId: number, updates: Partial<InsertClinicGroup>): Promise<ClinicGroup | undefined> {
    const [updatedGroup] = await db
      .update(clinicGroups)
      .set(updates)
      .where(eq(clinicGroups.id, groupId))
      .returning();
    return updatedGroup;
  }

  async deleteClinicGroup(groupId: number): Promise<void> {
    // First, remove group assignments from all participants
    await db
      .update(clinicRegistrations)
      .set({ groupId: null })
      .where(eq(clinicRegistrations.groupId, groupId));
    
    // Then delete the group
    await db.delete(clinicGroups).where(eq(clinicGroups.id, groupId));
  }

  async moveParticipantToGroup(registrationId: number, groupId: number | null): Promise<void> {
    // Update only the participant's group assignment
    // DO NOT change their skill level - it should remain as set during registration
    await db
      .update(clinicRegistrations)
      .set({ groupId })
      .where(eq(clinicRegistrations.id, registrationId));
  }

  async getGroupParticipants(groupId: number): Promise<ClinicRegistration[]> {
    return await db
      .select()
      .from(clinicRegistrations)
      .where(eq(clinicRegistrations.groupId, groupId));
  }

  async getSessionRegistrations(sessionId: number, confirmedOnly: boolean = false): Promise<ClinicRegistration[]> {
    if (confirmedOnly) {
      return await db
        .select()
        .from(clinicRegistrations)
        .where(
          and(
            eq(clinicRegistrations.sessionId, sessionId),
            eq(clinicRegistrations.status, 'confirmed')
          )
        );
    }
    
    return await db
      .select()
      .from(clinicRegistrations)
      .where(eq(clinicRegistrations.sessionId, sessionId));
  }

  async autoOrganizeGroups(sessionId: number): Promise<ClinicGroup[]> {
    // Get the session to check its skill level
    const [session] = await db
      .select()
      .from(clinicSessions)
      .where(eq(clinicSessions.id, sessionId));
    
    if (!session) {
      throw new Error('Session not found');
    }

    // Get only confirmed registrations for this session
    const registrations = await this.getSessionRegistrations(sessionId, true);

    // Delete existing groups for this session
    await db.delete(clinicGroups).where(eq(clinicGroups.sessionId, sessionId));

    // For now, create a simple single group
    // In future, this could be enhanced to split by skill level, max participants, etc.
    const [group] = await db
      .insert(clinicGroups)
      .values({
        sessionId: sessionId,
        groupName: `${session.sessionName} - Group 1`,
        skillLevel: session.skillLevel,
        maxParticipants: session.maxParticipants,
        displayOrder: 0
      })
      .returning();

    // Assign only confirmed participants to this group
    // DO NOT change their skill levels - they keep what they selected during registration
    if (group && registrations.length > 0) {
      const registrationIds = registrations.map(r => r.id);
      for (const id of registrationIds) {
        await db
          .update(clinicRegistrations)
          .set({ groupId: group.id })
          .where(eq(clinicRegistrations.id, id));
      }
    }

    return [group];
  }

  async createClinicRegistration(insertRegistration: InsertClinicRegistration): Promise<ClinicRegistration> {
    // Check clinic capacity
    const [clinic] = await db.select()
      .from(clinics)
      .where(eq(clinics.id, insertRegistration.clinicId));
    
    if (!clinic) {
      throw new Error("Clinic not found");
    }
    
    if (clinic.currentParticipants >= clinic.maxParticipants) {
      throw new Error("Clinic is full");
    }
    
    // Check session capacity if this is a multi-session clinic
    if (insertRegistration.sessionId) {
      const [session] = await db.select()
        .from(clinicSessions)
        .where(eq(clinicSessions.id, insertRegistration.sessionId));
      
      if (!session) {
        throw new Error("Session not found");
      }
      
      // Verify session belongs to the target clinic (prevent tampered requests)
      if (session.clinicId !== insertRegistration.clinicId) {
        throw new Error("Session does not belong to this clinic");
      }
      
      if (session.maxParticipants !== null && session.currentParticipants >= session.maxParticipants) {
        throw new Error("Session is full");
      }
      
      // Increment session participant count
      await db.update(clinicSessions)
        .set({ currentParticipants: sql`${clinicSessions.currentParticipants} + 1` })
        .where(eq(clinicSessions.id, insertRegistration.sessionId));
    }
    
    // Increment clinic participant count
    await db.update(clinics)
      .set({ currentParticipants: sql`${clinics.currentParticipants} + 1` })
      .where(eq(clinics.id, insertRegistration.clinicId));
    
    // Create the registration
    const [registration] = await db.insert(clinicRegistrations)
      .values(insertRegistration)
      .returning();
    
    return registration;
  }

  async getClinicRegistrations(clinicId: number): Promise<ClinicRegistration[]> {
    return await db.select().from(clinicRegistrations).where(eq(clinicRegistrations.clinicId, clinicId));
  }

  async getAllClinicRegistrations(): Promise<ClinicRegistration[]> {
    return await db.select().from(clinicRegistrations).orderBy(desc(clinicRegistrations.registeredAt));
  }

  async updateRegistrationStatus(id: number, status: string, refundAmount?: number, reason?: string): Promise<ClinicRegistration | undefined> {
    const updateData: any = { status };
    if (refundAmount !== undefined) {
      updateData.refundAmount = refundAmount;
      updateData.refundProcessedAt = new Date();
    }
    if (reason) {
      updateData.cancellationReason = reason;
    }
    
    const [registration] = await db.update(clinicRegistrations)
      .set(updateData)
      .where(eq(clinicRegistrations.id, id))
      .returning();
    return registration;
  }

  async canProcessRefund(registrationId: number): Promise<{ eligible: boolean; reason: string; amount?: number; adminFee?: number }> {
    // Get registration details
    const [registration] = await db.select().from(clinicRegistrations).where(eq(clinicRegistrations.id, registrationId));
    if (!registration) {
      return { eligible: false, reason: "Registration not found" };
    }

    // Get clinic details
    const [clinic] = await db.select().from(clinics).where(eq(clinics.id, registration.clinicId));
    if (!clinic) {
      return { eligible: false, reason: "Clinic not found" };
    }

    const clinicDate = new Date(clinic.date);
    const today = new Date();
    const daysUntilClinic = Math.ceil((clinicDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate payment amount - use session price if available, otherwise clinic price
    let paymentAmount = clinic.price;
    
    // If registration has a session, get the session price
    if (registration.sessionId) {
      const [session] = await db.select().from(clinicSessions).where(eq(clinicSessions.id, registration.sessionId));
      if (session && session.price) {
        paymentAmount = session.price;
      }
    }
    
    // If still 0, this might be a free clinic or bank transfer - no refund applicable
    if (paymentAmount === 0) {
      return { eligible: false, reason: "No payment recorded for this registration" };
    }

    const adminFee = 500; // £5.00 in pence
    const refundAmount = Math.max(0, paymentAmount - adminFee);

    // Check if more than 7 days before clinic
    if (daysUntilClinic > 7) {
      return { 
        eligible: true, 
        reason: `More than 7 days before clinic (${daysUntilClinic} days remaining) - automatic refund with £5 admin fee`,
        amount: refundAmount,
        adminFee: adminFee
      };
    }

    // Check if there's a waiting list
    const waitlist = await this.getWaitlist(registration.clinicId);
    if (waitlist.length > 0) {
      return { 
        eligible: true, 
        reason: `Waiting list available (${waitlist.length} people waiting) - automatic refund with £5 admin fee`,
        amount: refundAmount,
        adminFee: adminFee
      };
    }

    return { 
      eligible: false, 
      reason: `Less than 7 days before clinic (${daysUntilClinic} days) and no waiting list` 
    };
  }

  async addToWaitlist(insertWaitlistEntry: InsertClinicWaitlist): Promise<ClinicWaitlist> {
    // Get current waitlist position
    const waitlistCount = await db.select().from(clinicWaitlist).where(eq(clinicWaitlist.clinicId, insertWaitlistEntry.clinicId));
    const position = waitlistCount.length + 1;
    
    const [waitlistEntry] = await db.insert(clinicWaitlist).values({
      ...insertWaitlistEntry,
      position
    }).returning();

    // Automatically subscribe waitlist participant to email list if not already subscribed
    try {
      const existingSubscriber = await this.getEmailSubscriberByEmail(waitlistEntry.email);
      if (!existingSubscriber) {
        await this.createEmailSubscriber({
          email: waitlistEntry.email,
          firstName: waitlistEntry.firstName,
          lastName: waitlistEntry.lastName,
          subscriptionSource: "clinic_waitlist",
          interests: ["clinics", "news"]
        });
        console.log(`Added waitlist participant to email list: ${waitlistEntry.email}`);
      }
    } catch (error) {
      console.error("Failed to add waitlist participant to email list:", error);
      // Don't fail the waitlist addition if email subscription fails
    }
    
    return waitlistEntry;
  }

  async getWaitlist(clinicId: number): Promise<ClinicWaitlist[]> {
    return await db.select().from(clinicWaitlist)
      .where(eq(clinicWaitlist.clinicId, clinicId))
      .orderBy(clinicWaitlist.position);
  }

  async removeFromWaitlist(id: number): Promise<void> {
    await db.delete(clinicWaitlist).where(eq(clinicWaitlist.id, id));
  }

  async promoteFromWaitlist(clinicId: number): Promise<ClinicWaitlist | null> {
    const [nextInLine] = await db.select().from(clinicWaitlist)
      .where(eq(clinicWaitlist.clinicId, clinicId))
      .orderBy(clinicWaitlist.position)
      .limit(1);
    
    return nextInLine || null;
  }

  async getAllTrainingVideos(): Promise<TrainingVideo[]> {
    return await db.select().from(trainingVideos).where(eq(trainingVideos.isActive, true)).orderBy(trainingVideos.createdAt);
  }

  async getTrainingVideosByCategory(category: string): Promise<TrainingVideo[]> {
    return await db.select().from(trainingVideos)
      .where(eq(trainingVideos.category, category))
      .orderBy(trainingVideos.createdAt);
  }

  async createTrainingVideo(insertVideo: InsertTrainingVideo): Promise<TrainingVideo> {
    const [video] = await db.insert(trainingVideos).values(insertVideo).returning();
    return video;
  }

  async updateVideoViewCount(id: number): Promise<void> {
    const [video] = await db.select().from(trainingVideos).where(eq(trainingVideos.id, id));
    if (video) {
      await db.update(trainingVideos)
        .set({ viewCount: video.viewCount + 1 })
        .where(eq(trainingVideos.id, id));
    }
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.featured, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  // Email Marketing System Implementation
  async getAllEmailSubscribers(): Promise<EmailSubscriber[]> {
    return await db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.subscribedAt));
  }

  async getEmailSubscriber(id: number): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db.select().from(emailSubscribers).where(eq(emailSubscribers.id, id));
    return subscriber;
  }

  async getEmailSubscriberByEmail(email: string): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, email));
    return subscriber;
  }

  async createEmailSubscriber(insertSubscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [subscriber] = await db.insert(emailSubscribers).values(insertSubscriber).returning();
    return subscriber;
  }

  async updateEmailSubscriber(id: number, updates: Partial<InsertEmailSubscriber>): Promise<EmailSubscriber | undefined> {
    const [subscriber] = await db.update(emailSubscribers)
      .set(updates)
      .where(eq(emailSubscribers.id, id))
      .returning();
    return subscriber;
  }

  async unsubscribeEmail(email: string): Promise<void> {
    await db.update(emailSubscribers)
      .set({ 
        isActive: false, 
        unsubscribedAt: new Date() 
      })
      .where(eq(emailSubscribers.email, email));
  }

  async clearAllEmailSubscribers(): Promise<void> {
    // Clear email logs first to avoid foreign key constraint
    await db.delete(emailLogs);
    // Then clear subscribers
    await db.delete(emailSubscribers);
  }

  async getAllEmailTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(emailTemplates).orderBy(desc(emailTemplates.createdAt));
  }

  async getEmailTemplate(id: number): Promise<EmailTemplate | undefined> {
    const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id));
    return template;
  }

  async createEmailTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    const [template] = await db.insert(emailTemplates).values(insertTemplate).returning();
    return template;
  }

  async updateEmailTemplate(id: number, updates: Partial<InsertEmailTemplate>): Promise<EmailTemplate | undefined> {
    const [template] = await db.update(emailTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailTemplates.id, id))
      .returning();
    return template;
  }

  async deleteEmailTemplate(id: number): Promise<void> {
    await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
  }

  async getAllEmailCampaigns(): Promise<EmailCampaign[]> {
    return await db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt));
  }

  async getEmailCampaign(id: number): Promise<EmailCampaign | undefined> {
    const [campaign] = await db.select().from(emailCampaigns).where(eq(emailCampaigns.id, id));
    return campaign;
  }

  async createEmailCampaign(insertCampaign: InsertEmailCampaign): Promise<EmailCampaign> {
    const [campaign] = await db.insert(emailCampaigns).values(insertCampaign).returning();
    return campaign;
  }

  async updateEmailCampaign(id: number, updates: Partial<InsertEmailCampaign>): Promise<EmailCampaign | undefined> {
    const [campaign] = await db.update(emailCampaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailCampaigns.id, id))
      .returning();
    return campaign;
  }

  async createEmailLog(insertLog: InsertEmailLog): Promise<EmailLog> {
    const [log] = await db.insert(emailLogs).values(insertLog).returning();
    return log;
  }

  async getEmailLogsByCampaign(campaignId: number): Promise<EmailLog[]> {
    return await db.select().from(emailLogs)
      .where(eq(emailLogs.campaignId, campaignId))
      .orderBy(desc(emailLogs.sentAt));
  }

  async getEmailLogsBySubscriber(subscriberId: number): Promise<EmailLog[]> {
    return await db.select().from(emailLogs)
      .where(eq(emailLogs.subscriberId, subscriberId))
      .orderBy(desc(emailLogs.sentAt));
  }

  async getAllEmailAutomations(): Promise<EmailAutomation[]> {
    return await db.select().from(emailAutomations).orderBy(desc(emailAutomations.createdAt));
  }

  async getEmailAutomation(id: number): Promise<EmailAutomation | undefined> {
    const [automation] = await db.select().from(emailAutomations).where(eq(emailAutomations.id, id));
    return automation;
  }

  async createEmailAutomation(insertAutomation: InsertEmailAutomation): Promise<EmailAutomation> {
    const [automation] = await db.insert(emailAutomations).values(insertAutomation).returning();
    return automation;
  }

  async updateEmailAutomation(id: number, updates: Partial<InsertEmailAutomation>): Promise<EmailAutomation | undefined> {
    const [automation] = await db.update(emailAutomations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(emailAutomations.id, id))
      .returning();
    return automation;
  }

  async deleteEmailAutomation(id: number): Promise<void> {
    await db.delete(emailAutomations).where(eq(emailAutomations.id, id));
  }

  // Loyalty Program Methods
  async getAllLoyaltyPrograms(): Promise<LoyaltyProgram[]> {
    return await db.select().from(loyaltyProgram).orderBy(desc(loyaltyProgram.points));
  }

  async getLoyaltyProgram(email: string): Promise<LoyaltyProgramWithDiscounts | undefined> {
    const [program] = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.email, email));
    if (!program) return undefined;

    const discounts = await this.getLoyaltyDiscounts(program.id);
    return {
      ...program,
      availableDiscounts: discounts.filter(d => !d.isUsed && new Date(d.expiresAt) > new Date())
    };
  }

  async createLoyaltyProgram(insertProgram: InsertLoyaltyProgram): Promise<LoyaltyProgram> {
    const [program] = await db
      .insert(loyaltyProgram)
      .values(insertProgram)
      .returning();
    return program;
  }

  async updateLoyaltyProgram(email: string, updates: Partial<InsertLoyaltyProgram>): Promise<LoyaltyProgram | undefined> {
    const [program] = await db
      .update(loyaltyProgram)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loyaltyProgram.email, email))
      .returning();
    return program;
  }

  async incrementClinicEntries(email: string, amount: number, firstName?: string, lastName?: string): Promise<LoyaltyProgram | undefined> {
    // Get or create loyalty program
    let program = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.email, email)).then(rows => rows[0]);
    
    if (!program) {
      // Create new loyalty program entry with referral code
      const referralCode = await this.generateUniqueReferralCode(firstName);
      const [emailParts] = email.split('@');
      const [newProgram] = await db
        .insert(loyaltyProgram)
        .values({
          email,
          firstName: firstName || emailParts,
          lastName: lastName || '',
          referralCode,
          clinicEntries: 1,
          totalSpent: amount,
          lastClinicDate: new Date(),
        })
        .returning();
      program = newProgram;
    } else {
      // Update existing program
      const newEntries = program.clinicEntries + 1;
      const newSpent = program.totalSpent + amount;
      
      // Determine loyalty tier based on entries
      let tier = 'bronze';
      if (newEntries >= 10) tier = 'gold';
      else if (newEntries >= 5) tier = 'silver';

      [program] = await db
        .update(loyaltyProgram)
        .set({
          clinicEntries: newEntries,
          totalSpent: newSpent,
          loyaltyTier: tier,
          lastClinicDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(loyaltyProgram.email, email))
        .returning();
    }

    // Generate discount if eligible
    if (program.clinicEntries % 5 === 0 && program.clinicEntries >= 5) {
      await this.generateLoyaltyDiscount(program);
    }

    return program;
  }

  private async generateLoyaltyDiscount(program: LoyaltyProgram): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6); // 6 months expiry

    // Always use "Dan15" discount code for 15% discount every 5 entries
    await db.insert(loyaltyDiscounts).values({
      loyaltyId: program.id,
      discountCode: 'Dan15',
      discountType: 'percentage',
      discountValue: 15,
      minimumEntries: program.clinicEntries,
      expiresAt,
    });

    // Send email with discount code to the user
    const { emailService } = await import('./emailService');
    await emailService.sendLoyaltyDiscountEmail(program.email, 'Dan15');
  }

  async createLoyaltyDiscount(insertDiscount: InsertLoyaltyDiscount): Promise<LoyaltyDiscount> {
    const [discount] = await db
      .insert(loyaltyDiscounts)
      .values(insertDiscount)
      .returning();
    return discount;
  }

  async getLoyaltyDiscounts(loyaltyId: number): Promise<LoyaltyDiscount[]> {
    return await db.select().from(loyaltyDiscounts).where(eq(loyaltyDiscounts.loyaltyId, loyaltyId));
  }

  async getAvailableDiscount(email: string): Promise<LoyaltyDiscount | undefined> {
    const program = await this.getLoyaltyProgram(email);
    if (!program || !program.availableDiscounts) return undefined;

    // Return the most recent unused "Dan15" discount for their current milestone
    return program.availableDiscounts
      .filter(d => d.discountCode === 'Dan15' && !d.isUsed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  async useLoyaltyDiscount(discountCode: string, registrationId: number): Promise<LoyaltyDiscount | undefined> {
    const [discount] = await db
      .update(loyaltyDiscounts)
      .set({
        isUsed: true,
        usedAt: new Date(),
        clinicRegistrationId: registrationId,
      })
      .where(eq(loyaltyDiscounts.discountCode, discountCode))
      .returning();

    return discount;
  }

  // Points & Referral System Implementation
  async generateUniqueReferralCode(firstName?: string): Promise<string> {
    // If firstName is provided, create a memorable code like DBM-SARAH
    if (firstName && firstName.trim().length > 0) {
      const cleanName = firstName.trim().toUpperCase().replace(/[^A-Z]/g, '');
      
      if (cleanName.length > 0) {
        // Try the base code first (DBM-SARAH)
        let baseCode = `DBM-${cleanName}`;
        let code = baseCode;
        let counter = 1;
        
        while (true) {
          const existing = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.referralCode, code));
          if (existing.length === 0) {
            return code;
          }
          // If exists, try with number (DBM-SARAH2, DBM-SARAH3, etc.)
          counter++;
          code = `${baseCode}${counter}`;
        }
      }
    }
    
    // Fallback to random code if no firstName provided
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      code = 'DBM-';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.referralCode, code));
      isUnique = existing.length === 0;
    }

    return code!;
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; referrerId?: number; referrerEmail?: string }> {
    const [program] = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.referralCode, code));
    
    if (!program) {
      return { valid: false };
    }

    return {
      valid: true,
      referrerId: program.id,
      referrerEmail: program.email
    };
  }

  async isNewClient(email: string): Promise<boolean> {
    const registrations = await db.select().from(clinicRegistrations).where(eq(clinicRegistrations.email, email));
    return registrations.length === 0;
  }

  async awardPoints(email: string, points: number, reason: string, firstName?: string): Promise<LoyaltyProgram | undefined> {
    let program = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.email, email)).then(rows => rows[0]);
    
    if (!program) {
      // Create new loyalty program entry with referral code based on firstName
      const referralCode = await this.generateUniqueReferralCode(firstName);
      const [emailParts] = email.split('@');
      const [newProgram] = await db
        .insert(loyaltyProgram)
        .values({
          email,
          firstName: firstName || emailParts,
          lastName: '',
          clinicEntries: 0,
          totalSpent: 0,
          points,
          referralCode,
        })
        .returning();
      program = newProgram;
    } else {
      const newPoints = program.points + points;
      
      // Generate referral code if existing entry doesn't have one
      let referralCode = program.referralCode;
      if (!referralCode) {
        referralCode = await this.generateUniqueReferralCode(firstName || program.firstName);
      }
      
      [program] = await db
        .update(loyaltyProgram)
        .set({
          points: newPoints,
          referralCode,
          updatedAt: new Date(),
        })
        .where(eq(loyaltyProgram.email, email))
        .returning();

      // Check if user has reached a milestone for discount generation
      await this.checkPointsMilestone(program.id, newPoints);
    }

    console.log(`Awarded ${points} points to ${email} for: ${reason}. Total points: ${program.points}`);
    return program;
  }

  async deductPoints(email: string, points: number, reason: string): Promise<LoyaltyProgram | undefined> {
    const program = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.email, email)).then(rows => rows[0]);
    
    if (!program) {
      console.log(`No loyalty program found for ${email}, cannot deduct points`);
      return undefined;
    }
    
    // Don't let points go below 0
    const newPoints = Math.max(0, program.points - points);
    
    const [updatedProgram] = await db
      .update(loyaltyProgram)
      .set({
        points: newPoints,
        updatedAt: new Date(),
      })
      .where(eq(loyaltyProgram.email, email))
      .returning();

    console.log(`Deducted ${points} points from ${email} for: ${reason}. New total: ${updatedProgram.points}`);
    return updatedProgram;
  }

  async trackReferral(referrerId: number, refereeEmail: string, isNewClient: boolean, registrationId: number): Promise<void> {
    await db.insert(referrals).values({
      referrerId,
      refereeEmail,
      bonusPoints: 20,
      isNewClient,
      clinicRegistrationId: registrationId,
    });
  }

  async checkPointsMilestone(loyaltyId: number, points: number): Promise<void> {
    // Check if user has reached 50, 100, 150, etc. points
    const milestones = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    
    for (const milestone of milestones) {
      if (points >= milestone) {
        // Check if discount for this milestone already exists
        const existingDiscounts = await db
          .select()
          .from(loyaltyDiscounts)
          .where(eq(loyaltyDiscounts.loyaltyId, loyaltyId));

        const hasDiscountForMilestone = existingDiscounts.some(d => d.pointsRequired === milestone);
        
        if (!hasDiscountForMilestone) {
          // Generate new 20% discount for this milestone
          await this.generateDiscount20Percent(loyaltyId, milestone);
        }
      }
    }
  }

  async generateDiscount20Percent(loyaltyId: number, pointsRequired: number): Promise<LoyaltyDiscount> {
    const [program] = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.id, loyaltyId));
    
    if (!program) {
      throw new Error('Loyalty program not found');
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 12); // 12 months expiry

    // Generate unique discount code
    const discountCode = `DBM20-${program.firstName.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const [discount] = await db.insert(loyaltyDiscounts).values({
      loyaltyId: program.id,
      discountCode,
      discountType: 'percentage',
      discountValue: 20,
      minimumEntries: 0,
      pointsRequired,
      expiresAt,
    }).returning();

    // Send email with discount code to the user
    const { emailService } = await import('./emailService');
    await emailService.sendLoyaltyDiscountEmail(program.email, discountCode);

    console.log(`Generated 20% discount code ${discountCode} for ${program.email} at ${pointsRequired} points`);
    return discount;
  }

  async getLeaderboard(limit: number = 5): Promise<Array<{ rank: number; firstName: string; lastInitial: string; points: number }>> {
    const topUsers = await db
      .select()
      .from(loyaltyProgram)
      .where(eq(loyaltyProgram.isActive, true))
      .orderBy(desc(loyaltyProgram.points))
      .limit(limit);

    const capitalizeFirstLetter = (str: string): string => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return topUsers.map((user, index) => ({
      rank: index + 1,
      firstName: capitalizeFirstLetter(user.firstName),
      lastInitial: user.lastName.charAt(0).toUpperCase() || '',
      points: user.points,
    }));
  }

  async archiveTopWinners(resetPeriod: string): Promise<void> {
    const topUsers = await db
      .select()
      .from(loyaltyProgram)
      .where(eq(loyaltyProgram.isActive, true))
      .orderBy(desc(loyaltyProgram.points))
      .limit(5);

    for (let i = 0; i < topUsers.length; i++) {
      const user = topUsers[i];
      await db.insert(loyaltyProgramArchive).values({
        loyaltyId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        points: user.points,
        rank: i + 1,
        resetPeriod,
      });
    }

    console.log(`Archived top 5 winners for ${resetPeriod}`);
  }

  async resetAllPoints(): Promise<void> {
    await db
      .update(loyaltyProgram)
      .set({
        points: 0,
        lastResetDate: new Date(),
        updatedAt: new Date(),
      });

    console.log('Reset all loyalty points to 0');
  }

  async getDiscountByCode(code: string): Promise<LoyaltyDiscount | undefined> {
    const [discount] = await db
      .select()
      .from(loyaltyDiscounts)
      .where(eq(loyaltyDiscounts.discountCode, code));
    
    return discount;
  }

  // Gallery System Implementation
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(gallery).orderBy(desc(gallery.createdAt));
  }

  async getGalleryImage(id: number): Promise<GalleryImage | undefined> {
    const [image] = await db.select().from(gallery).where(eq(gallery.id, id));
    return image;
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db.insert(gallery).values(insertImage).returning();
    return image;
  }

  async updateGalleryImage(id: number, updates: Partial<InsertGalleryImage>): Promise<GalleryImage | undefined> {
    const [image] = await db
      .update(gallery)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(gallery.id, id))
      .returning();
    return image;
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(gallery).where(eq(gallery.id, id));
  }

  // Competition Checklist System Implementation
  async getAllCompetitionChecklists(): Promise<CompetitionChecklist[]> {
    return await db.select().from(competitionChecklists).orderBy(desc(competitionChecklists.createdAt));
  }

  async getCompetitionChecklist(id: number): Promise<CompetitionChecklist | undefined> {
    const [checklist] = await db.select().from(competitionChecklists).where(eq(competitionChecklists.id, id));
    return checklist;
  }

  async createCompetitionChecklist(insertChecklist: InsertCompetitionChecklist): Promise<CompetitionChecklist> {
    const [checklist] = await db.insert(competitionChecklists).values(insertChecklist).returning();
    return checklist;
  }

  async updateCompetitionChecklist(id: number, updates: Partial<InsertCompetitionChecklist>): Promise<CompetitionChecklist | undefined> {
    const [checklist] = await db
      .update(competitionChecklists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(competitionChecklists.id, id))
      .returning();
    return checklist;
  }

  async deleteCompetitionChecklist(id: number): Promise<void> {
    await db.delete(competitionChecklists).where(eq(competitionChecklists.id, id));
  }

  async generateChecklistForCompetition(
    discipline: string,
    competitionType: string, 
    competitionName: string, 
    competitionDate: Date, 
    location: string, 
    horseName?: string
  ): Promise<CompetitionChecklist> {
    const checklist = this.getBeginnerChecklistTemplate(discipline, competitionType, competitionDate);
    
    const insertData: InsertCompetitionChecklist = {
      discipline,
      competitionType,
      competitionName,
      competitionDate,
      location,
      horseName: horseName || 'TBC',
      checklist: JSON.stringify(checklist),
      completionNotes: ''
    };

    return await this.createCompetitionChecklist(insertData);
  }

  private getBeginnerChecklistTemplate(discipline: string, competitionType: string, competitionDate: Date) {
    const isFirstCompetition = competitionType.includes("My first ever");
    
    if (discipline === "dressage") {
      return this.getDressageChecklist(competitionType, isFirstCompetition);
    } else if (discipline === "showjumping") {
      return this.getShowJumpingChecklist(competitionType, isFirstCompetition);
    } else if (discipline === "eventing") {
      return this.getEventingChecklist(competitionType, isFirstCompetition);
    }
    
    return this.getGenericChecklist(isFirstCompetition);
  }

  private getDressageChecklist(level: string, isFirst: boolean) {
    const isIntroductory = level.includes("Introductory");
    const isPreliminary = level.includes("Preliminary");
    const isNovice = level.includes("Novice");
    const isElementary = level.includes("Elementary");

    let checklist = {
      "6-8 Weeks Before": [
        { id: "entry_submission", task: "Submit dressage entry with correct test specified", completed: false, priority: "high" },
        { id: "test_download", task: `Download and print ${level} test sheet from British Dressage website`, completed: false, priority: "high" },
        { id: "insurance_check", task: "Verify insurance covers affiliated dressage competitions", completed: false, priority: "high" },
        { id: "membership_check", task: "Ensure British Dressage membership is current", completed: false, priority: "high" },
        { id: "transport_booking", task: "Book professional horse transport or check your trailer MOT/insurance", completed: false, priority: "high" },
      ],
      "4-6 Weeks Before": [
        { id: "test_analysis", task: `Study ${level} test movements and scoring criteria in detail`, completed: false, priority: "high" },
        { id: "arena_practice", task: "Set up 20x40m arena at home with correct markers (A-M)", completed: false, priority: "high" },
        { id: "fitness_regime", task: "Begin structured flatwork sessions 4-5 times per week", completed: false, priority: "high" },
        { id: "tack_inspection", task: "Professional saddle check and bit evaluation for comfort", completed: false, priority: "medium" },
        { id: "shoeing_appointment", task: "Book farrier for competition shoes 5-7 days before event", completed: false, priority: "medium" },
        { id: "lesson_booking", task: "Schedule weekly lessons with qualified dressage instructor", completed: false, priority: "high" },
      ],
      "2-4 Weeks Before": [
        { id: "test_memorization", task: `Memorize ${level} test sequence without sheet - practice caller if needed`, completed: false, priority: "high" },
        { id: "movement_perfection", task: "Focus on specific weak movements identified in lessons", completed: false, priority: "high" },
        { id: "venue_research", task: "Study venue layout, warm-up areas, and parking arrangements", completed: false, priority: "medium" },
        { id: "competition_kit", task: "Prepare: white shirt, beige/white breeches, black boots, navy jacket, stock/tie", completed: false, priority: "high" },
        { id: "horse_turnout", task: "Practice competition braiding - book professional if needed", completed: false, priority: "medium" },
        { id: "test_ridethrough", task: "Complete full test run-through daily in correct arena", completed: false, priority: "high" },
      ],
      "1-2 Weeks Before": [
        { id: "final_lesson", task: "Final lesson focusing on test accuracy and presentation", completed: false, priority: "high" },
        { id: "equipment_preparation", task: "Clean and oil all tack, prepare grooming kit and studs box", completed: false, priority: "high" },
        { id: "route_planning", task: "Plan exact route, check traffic and allow extra travel time", completed: false, priority: "high" },
        { id: "declaration_check", task: "Confirm start times and collect number if not posted", completed: false, priority: "high" },
        { id: "backup_equipment", task: "Pack spare bridle, stirrup leathers, and emergency tack", completed: false, priority: "medium" },
      ],
      "3-7 Days Before": [
        { id: "final_shoeing", task: "Farrier visit - ensure shoes are secure with road studs if needed", completed: false, priority: "high" },
        { id: "horse_health", task: "Final vet check if any concerns, ensure vaccinations current", completed: false, priority: "high" },
        { id: "test_visualization", task: "Mental rehearsal of test sequence every evening", completed: false, priority: "medium" },
        { id: "kit_layout", task: "Lay out complete outfit and check appearance regulations", completed: false, priority: "high" },
        { id: "stable_prep", task: "Prepare stable with deep bed, water, hay nets for competition", completed: false, priority: "medium" },
        { id: "time_confirmation", task: "Final check of start time and warm-up schedule", completed: false, priority: "high" },
      ],
      "Competition Day": [
        { id: "early_start", task: "Arrive 2.5 hours before test time for settlement and preparation", completed: false, priority: "high" },
        { id: "horse_preparation", task: "Thorough grooming, quarter marking, and professional turnout", completed: false, priority: "high" },
        { id: "arena_inspection", task: "Walk competition arena noting going and any distractions", completed: false, priority: "high" },
        { id: "warm_up_plan", task: `Execute structured 45-min warm-up: walk, trot, canter, test movements`, completed: false, priority: "high" },
        { id: "test_rehearsal", task: "Practice difficult transitions and movements once in warm-up", completed: false, priority: "medium" },
        { id: "final_preparation", task: "Final tack check, adjustment, and rider preparation", completed: false, priority: "high" },
        { id: "ring_entry", task: "Enter arena confidently, halt square at X, and enjoy your test", completed: false, priority: "high" },
      ]
    };

    if (isFirst) {
      checklist["2-4 Weeks Before"].push(
        { id: "venue_visit", task: "Visit competition venue beforehand to walk arena and facilities", completed: false, priority: "medium" },
        { id: "experienced_help", task: "Arrange for experienced friend/trainer to accompany you", completed: false, priority: "high" },
        { id: "competition_rules", task: "Read British Dressage rule book sections on conduct and dress", completed: false, priority: "medium" }
      );
      checklist["Competition Day"].push(
        { id: "photo_memories", task: "Take photos with rosette and remember to enjoy the achievement!", completed: false, priority: "low" }
      );
    }

    if (isIntroductory || isPreliminary) {
      checklist["4-6 Weeks Before"].push(
        { id: "basic_movements", task: "Master 20m circles, accurate corners, and smooth transitions", completed: false, priority: "high" }
      );
    }

    if (isNovice || isElementary) {
      checklist["4-6 Weeks Before"].push(
        { id: "advanced_movements", task: "Perfect leg yield, shoulder-in, and precise 15m circles", completed: false, priority: "high" }
      );
      checklist["2-4 Weeks Before"].push(
        { id: "collection_practice", task: "Work on collection and medium paces required in test", completed: false, priority: "high" }
      );
    }

    return checklist;
  }

  private getShowJumpingChecklist(level: string, isFirst: boolean) {
    const height = level.includes("80cm") ? "80cm" : 
                   level.includes("90cm") ? "90cm" : 
                   level.includes("1m") ? "1m" : 
                   level.includes("1.10m") ? "1.10m" : "80cm";

    let checklist = {
      "6-8 Weeks Before": [
        { id: "entry_submission", task: `Submit show jumping entry for ${height} class with correct height specified`, completed: false, priority: "high" },
        { id: "insurance_verification", task: "Confirm insurance covers show jumping up to competition height", completed: false, priority: "high" },
        { id: "membership_check", task: "Ensure British Showjumping membership and horse registration current", completed: false, priority: "high" },
        { id: "transport_arrangement", task: "Book reliable transport with ramp suitable for post-competition loading", completed: false, priority: "high" },
        { id: "height_assessment", task: `Evaluate if horse comfortably jumps ${height} at home with room to spare`, completed: false, priority: "high" },
      ],
      "4-6 Weeks Before": [
        { id: "gridwork_program", task: "Begin systematic gridwork 3x weekly: bounce, one-stride, two-stride combinations", completed: false, priority: "high" },
        { id: "fitness_jumping", task: `Build to jumping ${height} courses of 8-10 fences twice weekly`, completed: false, priority: "high" },
        { id: "equipment_check", task: "Professional bridle, saddle check and jumping bit evaluation", completed: false, priority: "medium" },
        { id: "studs_preparation", task: "Obtain correct grass and all-weather studs for competition surface", completed: false, priority: "medium" },
        { id: "lesson_schedule", task: "Book weekly jumping lessons with BHSAI qualified instructor", completed: false, priority: "high" },
        { id: "fitness_base", task: "Establish strong canter work and hill training for power", completed: false, priority: "high" },
      ],
      "2-4 Weeks Before": [
        { id: "course_practice", task: `Jump full courses at ${height} focusing on rhythm and straightness`, completed: false, priority: "high" },
        { id: "related_distances", task: "Practice related distances: 24m (1 stride), 35m (2 strides) at speed", completed: false, priority: "high" },
        { id: "competition_simulation", task: "Practice with coloured fillers, flags, and atmosphere simulation", completed: false, priority: "medium" },
        { id: "kit_preparation", task: "Prepare: shirt, tie, navy/black jacket, light breeches, long boots, gloves", completed: false, priority: "high" },
        { id: "venue_research", task: "Study venue warm-up areas, surface type, and course walk timings", completed: false, priority: "medium" },
        { id: "backup_planning", task: "Prepare alternative strategies for if horse feels sticky or fresh", completed: false, priority: "medium" },
      ],
      "1-2 Weeks Before": [
        { id: "final_jumping", task: "Final jumping session at competition height - keep horse confident", completed: false, priority: "high" },
        { id: "equipment_preparation", task: "Clean all jumping tack, prepare stud kit and first aid supplies", completed: false, priority: "high" },
        { id: "travel_logistics", task: "Confirm transport times, route, and venue arrival procedures", completed: false, priority: "high" },
        { id: "start_times", task: "Check start times and warm-up arena availability", completed: false, priority: "high" },
        { id: "emergency_kit", task: "Pack emergency tack, spare reins, martingale, and comfort items", completed: false, priority: "medium" },
      ],
      "3-7 Days Before": [
        { id: "shoeing_final", task: "Farrier visit - check shoes secure, fit studs for surface type", completed: false, priority: "high" },
        { id: "horse_condition", task: "Assess horse soundness, energy levels, and appetite", completed: false, priority: "high" },
        { id: "mental_preparation", task: "Visualize successful clear rounds and positive riding", completed: false, priority: "medium" },
        { id: "competition_outfit", task: "Try on complete outfit, check hat safety standard (PAS015)", completed: false, priority: "high" },
        { id: "stable_setup", task: "Prepare stable with anti-slip mats, water, and calming environment", completed: false, priority: "medium" },
      ],
      "Competition Day": [
        { id: "arrival_timing", task: "Arrive 2 hours before class for settling and course walk", completed: false, priority: "high" },
        { id: "horse_turnout", task: "Professional grooming, secure braiding, and safety equipment check", completed: false, priority: "high" },
        { id: "course_walk", task: "Walk course twice: first for layout, second for stride counting and plan", completed: false, priority: "high" },
        { id: "warm_up_structure", task: "Systematic warm-up: flatwork, cavaletti, practice fence, then competition height", completed: false, priority: "high" },
        { id: "stud_insertion", task: "Insert appropriate studs 30 minutes before class", completed: false, priority: "high" },
        { id: "final_practice", task: "Jump 2-3 fences at competition height to confirm confidence", completed: false, priority: "medium" },
        { id: "competition_round", task: "Ride forward, straight lines, maintain rhythm, and trust your preparation", completed: false, priority: "high" },
      ]
    };

    if (isFirst) {
      checklist["2-4 Weeks Before"].push(
        { id: "venue_reconnaissance", task: "Visit venue when possible to see warm-up and competition arenas", completed: false, priority: "medium" },
        { id: "support_team", task: "Arrange experienced person to help with warm-up and course advice", completed: false, priority: "high" },
        { id: "rules_study", task: "Learn basic BS rules: elimination, refusals, and time allowed", completed: false, priority: "medium" }
      );
      checklist["Competition Day"].push(
        { id: "celebrate_achievement", task: "Regardless of result, celebrate completing your first jumping competition!", completed: false, priority: "low" }
      );
    }

    return checklist;
  }

  private getEventingChecklist(level: string, isFirst: boolean) {
    const phase = level.includes("80cm") ? "80cm" : 
                  level.includes("90cm") ? "90cm" : 
                  level.includes("100cm") ? "100cm" : 
                  level.includes("Novice") ? "Novice" : "80cm";

    let checklist = {
      "6-8 Weeks Before": [
        { id: "entry_submission", task: `Submit eventing entry for ${phase} level with all phases specified`, completed: false, priority: "high" },
        { id: "insurance_comprehensive", task: "Verify insurance covers all three eventing phases including cross country", completed: false, priority: "high" },
        { id: "membership_current", task: "Ensure BE membership, horse passport, and vaccination records current", completed: false, priority: "high" },
        { id: "transport_planning", task: "Book transport suitable for tired horse return journey", completed: false, priority: "high" },
        { id: "fitness_assessment", task: "Evaluate horse's current fitness for 3-phase competition demands", completed: false, priority: "high" },
        { id: "medical_check", task: "Ensure horse's wind, heart, and soundness suitable for cross country", completed: false, priority: "high" },
      ],
      "4-6 Weeks Before": [
        { id: "fitness_program", task: "Begin 3-phase fitness: dressage suppleness, jumping confidence, XC stamina", completed: false, priority: "high" },
        { id: "cross_country_schooling", task: `School XC fences at ${phase} height: logs, ditches, water, banks`, completed: false, priority: "high" },
        { id: "dressage_preparation", task: "Practice relevant dressage test with accuracy and calmness", completed: false, priority: "high" },
        { id: "showjumping_practice", task: `Jump courses at ${phase} height focusing on carefulness after XC`, completed: false, priority: "high" },
        { id: "equipment_specialist", task: "Check XC kit: body protector, medical armband, stopwatch, studs", completed: false, priority: "high" },
        { id: "terrain_training", task: "Include hill work, varied ground conditions, and stamina building", completed: false, priority: "high" },
      ],
      "2-4 Weeks Before": [
        { id: "test_memorization", task: "Learn dressage test thoroughly for accurate performance under pressure", completed: false, priority: "high" },
        { id: "xc_course_study", task: "Study cross country course map, distances, and optimum time calculation", completed: false, priority: "high" },
        { id: "combination_training", task: "Practice fence combinations and related distances on varied terrain", completed: false, priority: "high" },
        { id: "speed_training", task: "Practice galloping at competition pace (400-450mpm) safely", completed: false, priority: "high" },
        { id: "recovery_practice", task: "Simulate competition schedule: dressage, break, XC, rest, showjumping", completed: false, priority: "medium" },
        { id: "kit_organization", task: "Organize: dressage outfit, XC colours, casual SJ clothes, safety equipment", completed: false, priority: "high" },
      ],
      "1-2 Weeks Before": [
        { id: "final_schooling", task: "Final XC school focusing on confidence and partnership", completed: false, priority: "high" },
        { id: "equipment_check", task: "Test all safety equipment: body protector, hat, medical devices", completed: false, priority: "high" },
        { id: "schedule_planning", task: "Plan competition day timeline including phase warm-ups and breaks", completed: false, priority: "high" },
        { id: "support_coordination", task: "Brief support crew on their roles for each phase", completed: false, priority: "high" },
        { id: "emergency_preparation", task: "Prepare comprehensive first aid and emergency contact information", completed: false, priority: "medium" },
      ],
      "3-7 Days Before": [
        { id: "final_fitness", task: "Complete final fitness assessment and soundness check", completed: false, priority: "high" },
        { id: "shoe_preparation", task: "Farrier: secure shoes, fit all stud holes, check for loose clenches", completed: false, priority: "high" },
        { id: "mental_preparation", task: "Visualize successful completion of all three phases", completed: false, priority: "medium" },
        { id: "weather_monitoring", task: "Monitor weather forecast for ground conditions and clothing choices", completed: false, priority: "medium" },
        { id: "equipment_final", task: "Final check of all phase-specific equipment and spares", completed: false, priority: "high" },
      ],
      "Competition Day": [
        { id: "early_arrival", task: "Arrive 3+ hours early for multi-phase preparation and settling", completed: false, priority: "high" },
        { id: "dressage_prep", task: "First phase: thorough warm-up, accurate test execution", completed: false, priority: "high" },
        { id: "course_walk", task: "Walk XC course: route planning, alternative lines, safety strategies", completed: false, priority: "high" },
        { id: "xc_preparation", task: "XC warm-up: fitness check, confidence jumps, stud insertion", completed: false, priority: "high" },
        { id: "cross_country", task: "Ride positively forward, maintain rhythm, trust your preparation", completed: false, priority: "high" },
        { id: "recovery_phase", task: "Cool horse systematically, check for injuries, prepare for SJ", completed: false, priority: "high" },
        { id: "showjumping_final", task: "Final phase: careful warm-up, precise jumping to finish well", completed: false, priority: "high" },
      ]
    };

    if (isFirst) {
      checklist["2-4 Weeks Before"].push(
        { id: "venue_familiarization", task: "Visit venue to walk XC course and understand the terrain", completed: false, priority: "high" },
        { id: "experienced_support", task: "Arrange for experienced eventer to guide you through the day", completed: false, priority: "high" },
        { id: "safety_briefing", task: "Attend BE safety briefings and understand emergency procedures", completed: false, priority: "high" }
      );
      checklist["Competition Day"].push(
        { id: "completion_celebration", task: "Celebrate the massive achievement of completing your first event!", completed: false, priority: "low" }
      );
    }

    return checklist;
  }

  private getGenericChecklist(isFirst: boolean) {
    // Fallback basic checklist
    return {
      "4-6 Weeks Before": [
        { id: "entry_submission", task: "Submit competition entry", completed: false, priority: "high" },
        { id: "training_schedule", task: "Establish regular training routine", completed: false, priority: "high" },
      ],
      "1-2 Weeks Before": [
        { id: "equipment_prep", task: "Prepare all necessary equipment", completed: false, priority: "high" },
      ],
      "Competition Day": [
        { id: "arrive_early", task: "Arrive with plenty of time", completed: false, priority: "high" },
        { id: "warm_up", task: "Complete thorough warm-up", completed: false, priority: "high" },
      ]
    };
  }

  private getChecklistTemplate(competitionType: string, competitionDate: Date) {
    const daysUntilCompetition = Math.ceil((competitionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const isAdvancedLevel = competitionType.includes('CCI4*') || competitionType.includes('CCI5*') || competitionType.includes('Championship');
    
    return {
      "6-8 Weeks Before": [
        { id: "entry_submission", task: "Submit competition entry", completed: false, priority: "high" },
        { id: "accommodation_booking", task: "Book accommodation near venue", completed: false, priority: "high" },
        { id: "transport_arrangement", task: "Arrange horse transport", completed: false, priority: "high" },
        { id: "insurance_check", task: "Verify insurance coverage", completed: false, priority: "medium" },
        ...(isAdvancedLevel ? [
          { id: "international_docs", task: "Prepare international travel documents", completed: false, priority: "high" },
          { id: "vaccination_records", task: "Update horse vaccination records", completed: false, priority: "high" }
        ] : [])
      ],
      "4-6 Weeks Before": [
        { id: "fitness_program", task: "Finalize horse fitness program", completed: false, priority: "high" },
        { id: "equipment_check", task: "Full equipment inspection and cleaning", completed: false, priority: "medium" },
        { id: "shoeing_schedule", task: "Schedule pre-competition shoeing", completed: false, priority: "medium" },
        { id: "vet_checkup", task: "Pre-competition veterinary check", completed: false, priority: "high" },
        { id: "training_schedule", task: "Intensify training schedule", completed: false, priority: "high" }
      ],
      "2-4 Weeks Before": [
        { id: "competition_rules", task: "Review current competition rules", completed: false, priority: "high" },
        { id: "course_preview", task: "Study course maps and video", completed: false, priority: "medium" },
        { id: "nutrition_plan", task: "Finalize horse nutrition plan", completed: false, priority: "medium" },
        { id: "backup_equipment", task: "Prepare backup equipment", completed: false, priority: "low" },
        { id: "weather_check", task: "Monitor weather forecasts", completed: false, priority: "low" }
      ],
      "1-2 Weeks Before": [
        { id: "final_training", task: "Complete final training sessions", completed: false, priority: "high" },
        { id: "equipment_packing", task: "Pack and organize all equipment", completed: false, priority: "high" },
        { id: "travel_confirmation", task: "Confirm all travel arrangements", completed: false, priority: "high" },
        { id: "emergency_contacts", task: "Update emergency contact list", completed: false, priority: "medium" },
        { id: "mental_preparation", task: "Mental preparation and visualization", completed: false, priority: "medium" }
      ],
      "3-7 Days Before": [
        { id: "competition_kit", task: "Prepare competition day kit", completed: false, priority: "high" },
        { id: "horse_condition", task: "Final horse condition assessment", completed: false, priority: "high" },
        { id: "times_check", task: "Check competition times and schedule", completed: false, priority: "high" },
        { id: "venue_familiarization", task: "Arrive and familiarize with venue", completed: false, priority: "medium" },
        { id: "light_training", task: "Light training to maintain fitness", completed: false, priority: "medium" }
      ],
      "Competition Day": [
        { id: "early_arrival", task: "Arrive early for preparation", completed: false, priority: "high" },
        { id: "horse_warmup", task: "Complete horse warm-up routine", completed: false, priority: "high" },
        { id: "equipment_final_check", task: "Final equipment check", completed: false, priority: "high" },
        { id: "rider_preparation", task: "Rider physical and mental preparation", completed: false, priority: "high" },
        { id: "course_walk", task: "Final course walk", completed: false, priority: "high" },
        { id: "nutrition_hydration", task: "Maintain proper nutrition and hydration", completed: false, priority: "medium" }
      ]
    };
  }

  // Sponsor Methods
  async getAllSponsors(): Promise<Sponsor[]> {
    return await db.select().from(sponsors).orderBy(sponsors.displayOrder, desc(sponsors.createdAt));
  }

  async getActiveSponsor(): Promise<Sponsor | undefined> {
    // Get all active sponsors ordered by display order
    const activeSponsors = await db.select().from(sponsors)
      .where(eq(sponsors.isActive, true))
      .orderBy(sponsors.displayOrder);
    
    if (activeSponsors.length === 0) return undefined;
    
    const now = new Date();
    
    // Find sponsor that hasn't been displayed yet
    const neverDisplayed = activeSponsors.find(sponsor => !sponsor.lastDisplayed);
    if (neverDisplayed) {
      await this.updateSponsor(neverDisplayed.id, { lastDisplayed: now });
      return neverDisplayed;
    }
    
    // Find the sponsor that was displayed longest ago and is due for rotation
    let oldestSponsor = activeSponsors[0];
    let oldestTime = new Date(activeSponsors[0].lastDisplayed!).getTime();
    
    for (const sponsor of activeSponsors) {
      const lastDisplayedTime = new Date(sponsor.lastDisplayed!).getTime();
      const timeSinceDisplayed = now.getTime() - lastDisplayedTime;
      const rotationDurationMs = sponsor.rotationDuration * 1000;
      
      // If this sponsor is due for rotation and is older than current oldest
      if (timeSinceDisplayed >= rotationDurationMs && lastDisplayedTime < oldestTime) {
        oldestSponsor = sponsor;
        oldestTime = lastDisplayedTime;
      }
    }
    
    // Check if the oldest sponsor is due for rotation
    const timeSinceOldest = now.getTime() - oldestTime;
    const rotationDurationMs = oldestSponsor.rotationDuration * 1000;
    
    if (timeSinceOldest >= rotationDurationMs) {
      await this.updateSponsor(oldestSponsor.id, { lastDisplayed: now });
      return oldestSponsor;
    }
    
    // If no sponsor is due yet, return the one displayed longest ago
    return oldestSponsor;
  }

  async getSponsor(id: number): Promise<Sponsor | undefined> {
    const [sponsor] = await db.select().from(sponsors).where(eq(sponsors.id, id));
    return sponsor;
  }

  async createSponsor(insertSponsor: InsertSponsor): Promise<Sponsor> {
    const [sponsor] = await db.insert(sponsors).values(insertSponsor).returning();
    return sponsor;
  }

  async updateSponsor(id: number, updates: Partial<Sponsor>): Promise<Sponsor | undefined> {
    const [sponsor] = await db.update(sponsors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(sponsors.id, id))
      .returning();
    return sponsor;
  }

  async deleteSponsor(id: number): Promise<void> {
    await db.delete(sponsors).where(eq(sponsors.id, id));
  }

  async trackSponsorClick(id: number): Promise<void> {
    await db.update(sponsors)
      .set({ 
        clickCount: sql`${sponsors.clickCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(sponsors.id, id));
  }

  async trackSponsorImpression(id: number): Promise<void> {
    await db.update(sponsors)
      .set({ 
        impressionCount: sql`${sponsors.impressionCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(sponsors.id, id));
  }

  // Go High Level Integration Methods
  async getAllGhlContacts(): Promise<GhlContact[]> {
    return await db.select().from(ghlContacts).orderBy(desc(ghlContacts.lastSyncedAt));
  }

  async getGhlContact(id: number): Promise<GhlContact | undefined> {
    const result = await db.select().from(ghlContacts).where(eq(ghlContacts.id, id)).limit(1);
    return result[0];
  }

  async getGhlContactByGhlId(ghlId: string): Promise<GhlContact | undefined> {
    const result = await db.select().from(ghlContacts).where(eq(ghlContacts.ghlId, ghlId)).limit(1);
    return result[0];
  }

  async createGhlContact(contact: InsertGhlContact): Promise<GhlContact> {
    const result = await db.insert(ghlContacts).values(contact).returning();
    return result[0];
  }

  async updateGhlContact(id: number, updates: Partial<InsertGhlContact>): Promise<GhlContact | undefined> {
    const result = await db.update(ghlContacts)
      .set({ ...updates, lastSyncedAt: new Date() })
      .where(eq(ghlContacts.id, id))
      .returning();
    return result[0];
  }

  async deleteGhlContact(id: number): Promise<void> {
    await db.delete(ghlContacts).where(eq(ghlContacts.id, id));
  }

  async syncGhlContacts(locationId: string): Promise<number> {
    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) {
      throw new Error('GHL_API_KEY not configured');
    }

    let syncedCount = 0;
    let startAfterId: string | undefined;
    const limit = 100; // Maximum allowed by GHL API

    try {
      do {
        // Build query parameters
        const params = new URLSearchParams({
          locationId,
          limit: limit.toString()
        });
        
        if (startAfterId) {
          params.append('startAfterId', startAfterId);
        }

        // Fetch contacts from Go High Level API
        const response = await fetch(
          `https://services.leadconnectorhq.com/contacts/?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Version': '2021-07-28',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`GHL API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.contacts && Array.isArray(data.contacts)) {
          for (const contact of data.contacts) {
            // Check if contact already exists
            const existing = await this.getGhlContactByGhlId(contact.id);
            
            const contactData: InsertGhlContact = {
              ghlId: contact.id,
              locationId: contact.locationId || locationId,
              firstName: contact.firstName || null,
              lastName: contact.lastName || null,
              email: contact.email || null,
              phone: contact.phone || null,
              timezone: contact.timezone || null,
              country: contact.country || null,
              source: contact.source || null,
              dateAdded: contact.dateAdded ? new Date(contact.dateAdded) : null,
              tags: contact.tags || [],
              customFields: contact.customFields || null,
              attributions: contact.attributions || null,
              businessId: contact.businessId || null,
              lastSyncedAt: new Date()
            };

            if (existing) {
              await this.updateGhlContact(existing.id, contactData);
            } else {
              await this.createGhlContact(contactData);
            }
            
            syncedCount++;
          }

          // Set up pagination for next batch
          if (data.contacts.length === limit) {
            startAfterId = data.contacts[data.contacts.length - 1].id;
          } else {
            startAfterId = undefined; // No more pages
          }
        } else {
          startAfterId = undefined;
        }
      } while (startAfterId);

      return syncedCount;
    } catch (error) {
      console.error('Error syncing GHL contacts:', error);
      throw error;
    }
  }

  async createOrUpdateGhlContactInApi(
    email: string,
    firstName: string,
    lastName?: string,
    phone?: string,
    tags: string[] = [],
    customFields?: Record<string, any>
  ): Promise<{ success: boolean; contactId?: string; message?: string }> {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey) {
      throw new Error('GHL_API_KEY not configured');
    }

    if (!locationId) {
      throw new Error('GHL_LOCATION_ID not configured');
    }

    try {
      // Build the request body with optional fields
      const requestBody: any = {
        locationId,
        email,
        firstName,
        tags,
        source: 'Website Clinic Registration'
      };

      if (lastName) {
        requestBody.lastName = lastName;
      }

      if (phone) {
        requestBody.phone = phone;
      }

      // Convert customFields object to array format required by GHL API
      if (customFields) {
        requestBody.customFields = Object.entries(customFields).map(([key, value]) => ({
          key,
          field_value: value
        }));
      }

      // Create or update contact in Go High Level
      const response = await fetch(
        'https://services.leadconnectorhq.com/contacts/',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('GHL API error:', errorData);
        
        // Check if this is a duplicate contact error - GHL returns the existing contactId
        if (response.status === 400 && 
            errorData.message?.includes('duplicated contact') && 
            errorData.meta?.contactId) {
          const existingContactId = errorData.meta.contactId;
          console.log('Duplicate contact detected, updating existing contact:', existingContactId);
          
          // Create update body without tags (tags are handled separately via dedicated endpoint)
          const updateBody: any = {
            locationId,
            email,
            firstName,
            source: requestBody.source
          };
          if (lastName) updateBody.lastName = lastName;
          if (phone) updateBody.phone = phone;
          if (requestBody.customFields) updateBody.customFields = requestBody.customFields;
          
          // Update the existing contact info
          const updateResponse = await fetch(
            `https://services.leadconnectorhq.com/contacts/${existingContactId}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateBody)
            }
          );
          
          if (!updateResponse.ok) {
            const updateError = await updateResponse.json();
            console.error('GHL update error:', updateError);
            // Continue to try adding tags even if update fails
          }
          
          // Add tags using the dedicated tags endpoint (this appends tags rather than replacing)
          if (tags && tags.length > 0) {
            console.log(`Adding tags to existing contact ${existingContactId}:`, tags);
            const tagsResponse = await fetch(
              `https://services.leadconnectorhq.com/contacts/${existingContactId}/tags`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Version': '2021-07-28',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tags })
              }
            );
            
            if (!tagsResponse.ok) {
              const tagsError = await tagsResponse.json();
              console.error('GHL tags error:', tagsError);
              return {
                success: false,
                message: `Failed to add tags to existing contact: ${tagsResponse.status}`
              };
            }
            console.log(`Successfully added tags ${tags.join(', ')} to contact ${existingContactId}`);
          }
          
          return {
            success: true,
            contactId: existingContactId,
            message: 'Updated existing contact and added tags in Go High Level'
          };
        }
        
        return {
          success: false,
          message: `GHL API error: ${response.status} ${response.statusText}`
        };
      }

      const data = await response.json();
      
      // Store the contact in local database for tracking
      if (data.contact && data.contact.id) {
        const existing = await this.getGhlContactByGhlId(data.contact.id);
        
        const contactData: InsertGhlContact = {
          ghlId: data.contact.id,
          locationId: data.contact.locationId || locationId,
          firstName: data.contact.firstName || firstName,
          lastName: data.contact.lastName || lastName || null,
          email: data.contact.email || email,
          phone: data.contact.phone || phone || null,
          timezone: data.contact.timezone || null,
          country: data.contact.country || null,
          source: 'Website Clinic Registration',
          dateAdded: data.contact.dateAdded ? new Date(data.contact.dateAdded) : new Date(),
          tags: data.contact.tags || tags,
          customFields: data.contact.customFields || customFields || null,
          attributions: data.contact.attributions || null,
          businessId: data.contact.businessId || null,
          lastSyncedAt: new Date()
        };

        if (existing) {
          await this.updateGhlContact(existing.id, contactData);
        } else {
          await this.createGhlContact(contactData);
        }
      }

      return {
        success: true,
        contactId: data.contact?.id,
        message: 'Contact created/updated successfully in Go High Level'
      };
    } catch (error) {
      console.error('Error creating/updating GHL contact:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Visitor Profile System
  async getVisitorProfileByToken(token: string): Promise<VisitorProfile | undefined> {
    const results = await db.select().from(visitorProfiles).where(eq(visitorProfiles.token, token)).limit(1);
    return results[0];
  }

  async getVisitorProfileByEmail(email: string): Promise<VisitorProfile | undefined> {
    const results = await db.select().from(visitorProfiles).where(eq(visitorProfiles.email, email.toLowerCase())).limit(1);
    return results[0];
  }

  async createOrUpdateVisitorProfile(
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    source: string,
    ghlContactId?: string
  ): Promise<{ profile: VisitorProfile; token: string; isNew: boolean }> {
    const normalizedEmail = email.toLowerCase();
    
    // Check if profile exists by email
    const existing = await this.getVisitorProfileByEmail(normalizedEmail);
    
    if (existing) {
      // Update existing profile - add source if not already present
      const updatedSources = existing.sources.includes(source) 
        ? existing.sources 
        : [...existing.sources, source];
      
      const updated = await db.update(visitorProfiles)
        .set({
          firstName,
          lastName,
          mobile,
          sources: updatedSources,
          ghlContactId: ghlContactId || existing.ghlContactId,
          lastSeenAt: new Date()
        })
        .where(eq(visitorProfiles.id, existing.id))
        .returning();
      
      return { profile: updated[0], token: existing.token, isNew: false };
    }
    
    // Create new profile with secure random token
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    
    const newProfile = await db.insert(visitorProfiles)
      .values({
        token,
        firstName,
        lastName,
        email: normalizedEmail,
        mobile,
        sources: [source],
        ghlContactId: ghlContactId || null
      })
      .returning();
    
    return { profile: newProfile[0], token, isNew: true };
  }

  async updateVisitorProfileLastSeen(token: string): Promise<void> {
    await db.update(visitorProfiles)
      .set({ lastSeenAt: new Date() })
      .where(eq(visitorProfiles.token, token));
  }

  async deleteVisitorProfile(token: string): Promise<void> {
    await db.delete(visitorProfiles).where(eq(visitorProfiles.token, token));
  }
}

export const storage = new DatabaseStorage();
