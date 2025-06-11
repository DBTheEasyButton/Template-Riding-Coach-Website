import { 
  users, 
  achievements, 
  events, 
  news, 
  contacts,
  clinics,
  clinicSessions,
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
  type LoyaltyProgramWithDiscounts
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  getAllNews(): Promise<News[]>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, updates: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number): Promise<void>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  
  getAllClinics(): Promise<ClinicWithSessions[]>;
  getClinic(id: number): Promise<Clinic | undefined>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  updateClinic(id: number, clinic: Partial<InsertClinic>): Promise<Clinic | undefined>;
  deleteClinic(id: number): Promise<void>;
  createClinicSession(session: InsertClinicSession): Promise<ClinicSession>;
  
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
  getLoyaltyProgram(email: string): Promise<LoyaltyProgramWithDiscounts | undefined>;
  createLoyaltyProgram(program: InsertLoyaltyProgram): Promise<LoyaltyProgram>;
  updateLoyaltyProgram(email: string, updates: Partial<InsertLoyaltyProgram>): Promise<LoyaltyProgram | undefined>;
  incrementClinicEntries(email: string, amount: number): Promise<LoyaltyProgram | undefined>;
  createLoyaltyDiscount(discount: InsertLoyaltyDiscount): Promise<LoyaltyDiscount>;
  getLoyaltyDiscounts(loyaltyId: number): Promise<LoyaltyDiscount[]>;
  getAvailableDiscount(email: string): Promise<LoyaltyDiscount | undefined>;
  useLoyaltyDiscount(discountCode: string, registrationId: number): Promise<LoyaltyDiscount | undefined>;
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
        title: "Badminton Horse Trials",
        location: "Badminton, England", 
        date: new Date('2024-04-15'),
        type: "upcoming",
        horse: "Castello Primo",
        level: "CCI5*-L",
        result: null
      },
      {
        title: "Kentucky Three-Day Event",
        location: "Lexington, USA",
        date: new Date('2024-04-28'),
        type: "upcoming", 
        horse: "Venetian Dream",
        level: "CCI5*-L",
        result: null
      },
      {
        title: "Adelaide CCI4*-L",
        location: "Adelaide, Australia",
        date: new Date('2024-03-10'),
        type: "completed",
        horse: "Tuscan Thunder", 
        level: "CCI4*-L",
        result: "1st Place"
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
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.danbizzarromethod.com/app" style="background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Download Our App</a>
              </div>
              <p>Best regards,<br>The Dan Bizzarro Method Team</p>
            </div>
          </div>
        `,
        textContent: `Welcome {{firstName}}!

Thank you for joining the Dan Bizzarro Method community. You'll now receive exclusive training tips, clinic announcements, competition updates, and special offers.

Download our app: https://www.danbizzarromethod.com/app

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

  async getAllClinics(): Promise<ClinicWithSessions[]> {
    const clinicsData = await db.select().from(clinics).where(eq(clinics.isActive, true)).orderBy(clinics.date);
    
    // For each clinic, get its sessions if it has multiple sessions
    const clinicsWithSessions: ClinicWithSessions[] = await Promise.all(
      clinicsData.map(async (clinic): Promise<ClinicWithSessions> => {
        if (clinic.hasMultipleSessions) {
          const sessions = await db.select().from(clinicSessions).where(eq(clinicSessions.clinicId, clinic.id));
          return { ...clinic, sessions };
        }
        return { ...clinic, sessions: [] };
      })
    );
    
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
    // First, delete all existing sessions for this clinic to avoid confusion
    await db.delete(clinicSessions).where(eq(clinicSessions.clinicId, id));
    
    // Update the clinic with complete replacement of all fields
    const [clinic] = await db.update(clinics)
      .set(updateData)
      .where(eq(clinics.id, id))
      .returning();
    return clinic;
  }

  async deleteClinic(id: number): Promise<void> {
    await db.delete(clinics).where(eq(clinics.id, id));
  }

  async createClinicSession(insertSession: InsertClinicSession): Promise<ClinicSession> {
    const [session] = await db.insert(clinicSessions).values(insertSession).returning();
    return session;
  }

  async createClinicRegistration(insertRegistration: InsertClinicRegistration): Promise<ClinicRegistration> {
    const [registration] = await db.insert(clinicRegistrations).values(insertRegistration).returning();
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

    const adminFee = 500; // £5.00 in pence
    const refundAmount = Math.max(0, clinic.price - adminFee);

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

  async incrementClinicEntries(email: string, amount: number): Promise<LoyaltyProgram | undefined> {
    // Get or create loyalty program
    let program = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.email, email)).then(rows => rows[0]);
    
    if (!program) {
      // Create new loyalty program entry
      const [emailParts] = email.split('@');
      const [newProgram] = await db
        .insert(loyaltyProgram)
        .values({
          email,
          firstName: emailParts, // Will be updated with real data later
          lastName: '',
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
}

export const storage = new DatabaseStorage();
