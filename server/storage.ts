import { schemes, applications, surveys, type Scheme, type InsertScheme, type Application, type InsertApplication, type Survey, type InsertSurvey } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Schemes
  getSchemes(search?: string, category?: string): Promise<Scheme[]>;
  getScheme(id: number): Promise<Scheme | undefined>;
  createScheme(scheme: InsertScheme): Promise<Scheme>;
  
  // Applications
  getApplications(): Promise<Application[]>;
  getUserApplications(userId: string): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  getApplication(id: number): Promise<Application | undefined>;
  updateApplicationStatus(id: number, status: string, aiResult?: any): Promise<Application>;

  // Surveys
  createSurvey(survey: InsertSurvey): Promise<Survey>;
  getAllSurveys(): Promise<Survey[]>;
}

export class DatabaseStorage implements IStorage {
  // Schemes
  async getSchemes(search?: string, category?: string): Promise<Scheme[]> {
    let query = db.select().from(schemes);
    // Basic filtering implementation (could be improved with proper WHERE clauses)
    const allSchemes = await query;
    return allSchemes.filter(s => {
      let matches = true;
      if (search) {
        matches = matches && (s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
      }
      if (category) {
        matches = matches && s.category === category;
      }
      return matches;
    });
  }

  async getScheme(id: number): Promise<Scheme | undefined> {
    const [scheme] = await db.select().from(schemes).where(eq(schemes.id, id));
    return scheme;
  }

  async createScheme(insertScheme: InsertScheme): Promise<Scheme> {
    const [scheme] = await db.insert(schemes).values(insertScheme).returning();
    return scheme;
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return db.select().from(applications).orderBy(desc(applications.submittedAt));
  }

  async getUserApplications(userId: string): Promise<Application[]> {
    return db.select().from(applications).where(eq(applications.userId, userId)).orderBy(desc(applications.submittedAt));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async updateApplicationStatus(id: number, status: string, aiResult?: any): Promise<Application> {
    const [updated] = await db
      .update(applications)
      .set({ status, aiVerificationResult: aiResult })
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  // Surveys
  async createSurvey(insertSurvey: InsertSurvey): Promise<Survey> {
    const [survey] = await db.insert(surveys).values(insertSurvey).returning();
    return survey;
  }

  async getAllSurveys(): Promise<Survey[]> {
    return db.select().from(surveys).orderBy(desc(surveys.createdAt));
  }
}

export const storage = new DatabaseStorage();
