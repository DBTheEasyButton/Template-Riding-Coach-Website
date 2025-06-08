import { 
  users, 
  achievements, 
  events, 
  news, 
  contacts,
  type User, 
  type InsertUser,
  type Achievement,
  type InsertAchievement,
  type Event,
  type InsertEvent,
  type News,
  type InsertNews,
  type Contact,
  type InsertContact
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private achievements: Map<number, Achievement>;
  private events: Map<number, Event>;
  private news: Map<number, News>;
  private contacts: Map<number, Contact>;
  private currentUserId: number;
  private currentAchievementId: number;
  private currentEventId: number;
  private currentNewsId: number;
  private currentContactId: number;

  constructor() {
    this.users = new Map();
    this.achievements = new Map();
    this.events = new Map();
    this.news = new Map();
    this.contacts = new Map();
    this.currentUserId = 1;
    this.currentAchievementId = 1;
    this.currentEventId = 1;
    this.currentNewsId = 1;
    this.currentContactId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed achievements data
    const sampleAchievements: Achievement[] = [
      {
        id: this.currentAchievementId++,
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
        id: this.currentAchievementId++,
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
        id: this.currentAchievementId++,
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

    sampleAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });

    // Seed events data
    const sampleEvents: Event[] = [
      {
        id: this.currentEventId++,
        title: "Badminton Horse Trials",
        location: "Badminton, England",
        date: new Date('2024-04-15'),
        type: "upcoming",
        horse: "Castello Primo",
        level: "CCI5*-L",
        result: null
      },
      {
        id: this.currentEventId++,
        title: "Kentucky Three-Day Event",
        location: "Lexington, USA",
        date: new Date('2024-04-28'),
        type: "upcoming",
        horse: "Venetian Dream",
        level: "CCI5*-L",
        result: null
      },
      {
        id: this.currentEventId++,
        title: "Adelaide CCI4*-L",
        location: "Adelaide, Australia",
        date: new Date('2024-03-10'),
        type: "completed",
        horse: "Tuscan Thunder",
        level: "CCI4*-L",
        result: "1st Place"
      }
    ];

    sampleEvents.forEach(event => {
      this.events.set(event.id, event);
    });

    // Seed news data
    const sampleNews: News[] = [
      {
        id: this.currentNewsId++,
        title: "Badminton Preparation Underway",
        excerpt: "Dan and Castello Primo are putting the finishing touches on their preparation for this year's Badminton Horse Trials, with final training sessions showing promising form...",
        content: "Full article content here...",
        image: "https://images.unsplash.com/photo-1553284966-19b8815c7817?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        publishedAt: new Date('2024-03-25'),
        slug: "badminton-preparation-underway"
      },
      {
        id: this.currentNewsId++,
        title: "New Training Facility Opens",
        excerpt: "The new state-of-the-art training facility in Tuscany officially opened this week, featuring world-class amenities for both horse and rider development...",
        content: "Full article content here...",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80",
        publishedAt: new Date('2024-03-20'),
        slug: "new-training-facility-opens"
      }
    ];

    sampleNews.forEach(article => {
      this.news.set(article.id, article);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).sort((a, b) => b.year - a.year);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const newsItem: News = { ...insertNews, id };
    this.news.set(id, newsItem);
    return newsItem;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { 
      ...insertContact, 
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
