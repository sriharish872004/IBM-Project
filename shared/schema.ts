import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { conversations, messages } from "./models/chat";

export * from "./models/auth";
export * from "./models/chat";

// Schemes Table
export const schemes = pgTable("schemes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  agency: text("agency").notNull(),
  category: text("category").notNull(),
  criteria: jsonb("criteria").notNull(), // AI-readable criteria
  benefits: text("benefits").notNull(),
  applicationUrl: text("application_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications/Eligibility Checks Table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Links to auth users
  schemeId: integer("scheme_id").notNull().references(() => schemes.id),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, eligible, ineligible
  aiVerificationResult: jsonb("ai_verification_result"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// Awareness Surveys Table
export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  responses: jsonb("responses").notNull(),
  awarenessScore: integer("awareness_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas & Types
export const insertSchemeSchema = createInsertSchema(schemes).omit({ id: true, createdAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, submittedAt: true });
export const insertSurveySchema = createInsertSchema(surveys).omit({ id: true, createdAt: true });

export type Scheme = typeof schemes.$inferSelect;
export type InsertScheme = z.infer<typeof insertSchemeSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = z.infer<typeof insertSurveySchema>;
