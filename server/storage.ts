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
  type InsertTrainingVideo
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
  createNews(news: InsertNews): Promise<News>;
  
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
    return await db.select().from(news).orderBy(news.publishedAt);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
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

  async addToWaitlist(insertWaitlistEntry: InsertClinicWaitlist): Promise<ClinicWaitlist> {
    // Get current waitlist position
    const waitlistCount = await db.select().from(clinicWaitlist).where(eq(clinicWaitlist.clinicId, insertWaitlistEntry.clinicId));
    const position = waitlistCount.length + 1;
    
    const [waitlistEntry] = await db.insert(clinicWaitlist).values({
      ...insertWaitlistEntry,
      position
    }).returning();
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
}

export const storage = new DatabaseStorage();
