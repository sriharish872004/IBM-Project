import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes, setupAuth } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Register Chat & Image
  registerChatRoutes(app);
  registerImageRoutes(app);

  // Schemes
  app.get(api.schemes.list.path, async (req, res) => {
    const search = req.query.search as string;
    const category = req.query.category as string;
    const schemes = await storage.getSchemes(search, category);
    res.json(schemes);
  });

  app.get(api.schemes.get.path, async (req, res) => {
    const scheme = await storage.getScheme(Number(req.params.id));
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  });

  app.post(api.schemes.create.path, async (req, res) => {
    try {
      const input = api.schemes.create.input.parse(req.body);
      const scheme = await storage.createScheme(input);
      res.status(201).json(scheme);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.schemes.recommend.path, async (req, res) => {
    try {
      const { userProfile } = req.body;
      const allSchemes = await storage.getSchemes();
      
      // AI Matching Logic
      const prompt = `
        User Profile: ${userProfile}
        
        Available Schemes:
        ${JSON.stringify(allSchemes.map(s => ({ id: s.id, title: s.title, criteria: s.criteria })))}
        
        Return a JSON array of scheme IDs that strictly match the user profile.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });
      
      const result = JSON.parse(response.choices[0].message.content || '{"ids": []}');
      const matchedIds = result.ids || [];
      const recommendedSchemes = allSchemes.filter(s => matchedIds.includes(s.id));
      
      res.json(recommendedSchemes);
    } catch (err) {
      console.error("Recommendation Error:", err);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Applications
  app.get(api.applications.list.path, async (req, res) => {
    // In a real app, filter by user if not admin. For now, list all.
    // If we have user info in req.user, we can filter.
    const user = req.user as any;
    if (user) {
        // Assume non-admin users only see their own
        // But for "admin" dashboard purposes in MVP, maybe we return all if we had an admin flag.
        // For simplicity, let's just return all for now or filter if query param exists?
        // Let's assume frontend handles "my applications" vs "all applications" via separate logic or filtering.
        // But wait, the route contract doesn't have query params for this.
        // Let's just return all for simplicity in this MVP.
        const apps = await storage.getApplications();
        res.json(apps);
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.post(api.applications.create.path, async (req, res) => {
    try {
      const input = api.applications.create.input.parse(req.body);
      const application = await storage.createApplication(input);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.applications.verify.path, async (req, res) => {
    const id = Number(req.params.id);
    const application = await storage.getApplication(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    const scheme = await storage.getScheme(application.schemeId);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });

    // AI Verification
    const prompt = `
      Scheme Criteria: ${JSON.stringify(scheme.criteria)}
      Application Data (User ID ${application.userId}): Assume user data is verified for this MVP.
      
      Determine eligibility. Return JSON: { "eligible": boolean, "reason": "string" }
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"eligible": false, "reason": "AI Error"}');
    const newStatus = result.eligible ? "eligible" : "ineligible";

    const updated = await storage.updateApplicationStatus(id, newStatus, result);
    res.json(updated);
  });

  // Surveys
  app.post(api.surveys.create.path, async (req, res) => {
    try {
      const input = api.surveys.create.input.parse(req.body);
      const survey = await storage.createSurvey(input);
      res.status(201).json(survey);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.surveys.stats.path, async (req, res) => {
    const surveys = await storage.getAllSurveys();
    
    // AI Analysis of Gap
    const prompt = `
      Analyze these survey responses to identify awareness gaps:
      ${JSON.stringify(surveys.map(s => s.responses))}
      
      Return a short summary string.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
    });

    const gapAnalysis = response.choices[0].message.content || "Analysis failed.";

    res.json({
      totalSurveys: surveys.length,
      averageAwareness: 75, // Placeholder/Calculation needed
      gapAnalysis
    });
  });

  // Seed Data
  if ((await storage.getSchemes()).length <= 7) {
    const additionalSchemes = [
      {
        title: "PM-KMY (Kisan Maandhan Yojana)",
        description: "Old age pension scheme for all Small and Marginal Farmers (SMF) in the country.",
        agency: "Ministry of Agriculture and Farmers Welfare",
        category: "Agriculture",
        criteria: { type: "json", required: ["farmer", "age_18_to_40", "land_less_than_2_hectares"] },
        benefits: "Fixed pension of Rs. 3,000/- per month on attaining the age of 60 years.",
        applicationUrl: "https://maandhan.in"
      },
      {
        title: "Mission Indradhanush",
        description: "Immunization program to ensure full immunization with all available vaccines for children up to two years and pregnant women.",
        agency: "Ministry of Health and Family Welfare",
        category: "Health",
        criteria: { type: "json", required: ["pregnant_women", "children_under_2"] },
        benefits: "Free vaccination against life-threatening diseases.",
        applicationUrl: "https://www.nhm.gov.in"
      },
      {
        title: "PMAY-G (Gramin)",
        description: "Provides a pucca house with basic amenities to all houseless householders and those households living in kutcha and dilapidated house.",
        agency: "Ministry of Rural Development",
        category: "Housing",
        criteria: { type: "json", required: ["rural_area", "no_pucca_house", "SECC_2011_data"] },
        benefits: "Financial assistance for house construction.",
        applicationUrl: "https://pmayg.nic.in"
      },
      {
        title: "Stand Up India",
        description: "Facilitates bank loans between 10 lakh and 1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.",
        agency: "Department of Financial Services",
        category: "Business",
        criteria: { type: "json", required: ["SC_ST_or_Woman", "above_18_years", "greenfield_enterprise"] },
        benefits: "Bank loan for entrepreneurship.",
        applicationUrl: "https://www.standupmitra.in"
      },
      {
        title: "PM-SVA Nidhi",
        description: "Special Micro-Credit Facility Scheme for providing affordable loans to street vendors to resume their livelihoods.",
        agency: "Ministry of Housing and Urban Affairs",
        category: "Business",
        criteria: { type: "json", required: ["street_vendor", "urban_area"] },
        benefits: "Working capital loan up to Rs. 10,000.",
        applicationUrl: "https://pmsvanidhi.mohua.gov.in"
      },
      {
        title: "Kushal Yuva Program",
        description: "Skill development program for youth to enhance their employability through soft skills and IT literacy.",
        agency: "Bihar Skill Development Mission",
        category: "Education",
        criteria: { type: "json", required: ["age_15_to_28", "passed_10th_or_12th"] },
        benefits: "Training in Communication, IT Literacy and Soft Skills.",
        applicationUrl: "https://skillmissionbihar.org"
      }
    ];

    for (const scheme of additionalSchemes) {
      await storage.createScheme(scheme);
    }
  }

  return httpServer;
}
