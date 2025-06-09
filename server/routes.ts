import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertClinicRegistrationSchema, insertClinicSchema } from "@shared/schema";

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

  // Register for clinic
  app.post("/api/clinics/:id/register", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const registrationData = insertClinicRegistrationSchema.parse({
        ...req.body,
        clinicId
      });
      
      const clinic = await storage.getClinic(clinicId);
      if (!clinic) {
        return res.status(404).json({ message: "Clinic not found" });
      }
      
      if (clinic.currentParticipants >= clinic.maxParticipants) {
        return res.status(400).json({ message: "Clinic is full" });
      }
      
      const registration = await storage.createClinicRegistration(registrationData);
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

  app.post("/api/admin/clinics", async (req, res) => {
    try {
      // Convert date strings to Date objects before validation
      const rawData = req.body;
      const clinicData = {
        ...rawData,
        date: new Date(rawData.date),
        endDate: new Date(rawData.endDate)
      };
      
      // Validate the clinic data
      const validatedData = insertClinicSchema.parse(clinicData);
      const clinic = await storage.createClinic(validatedData);
      res.status(201).json(clinic);
    } catch (error) {
      console.error("Error creating clinic:", error);
      res.status(400).json({ message: "Invalid clinic data" });
    }
  });

  app.put("/api/admin/clinics/:id", async (req, res) => {
    try {
      const clinicId = parseInt(req.params.id);
      const updateData = req.body;
      const updatedClinic = await storage.updateClinic(clinicId, updateData);
      if (!updatedClinic) {
        return res.status(404).json({ message: "Clinic not found" });
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

  const httpServer = createServer(app);
  return httpServer;
}
