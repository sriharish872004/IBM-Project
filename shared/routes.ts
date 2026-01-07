import { z } from 'zod';
import { insertSchemeSchema, schemes, applications, surveys, insertApplicationSchema, insertSurveySchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  schemes: {
    list: {
      method: 'GET' as const,
      path: '/api/schemes',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof schemes.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/schemes/:id',
      responses: {
        200: z.custom<typeof schemes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/schemes',
      input: insertSchemeSchema,
      responses: {
        201: z.custom<typeof schemes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    recommend: {
      method: 'POST' as const,
      path: '/api/schemes/recommend', // AI recommendation
      input: z.object({
        userProfile: z.string(), // Description of user
      }),
      responses: {
        200: z.array(z.custom<typeof schemes.$inferSelect>()),
      },
    }
  },
  applications: {
    list: {
      method: 'GET' as const,
      path: '/api/applications',
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/applications',
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    verify: { // AI verification
      method: 'POST' as const,
      path: '/api/applications/:id/verify',
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  surveys: {
    create: {
      method: 'POST' as const,
      path: '/api/surveys',
      input: insertSurveySchema,
      responses: {
        201: z.custom<typeof surveys.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/surveys/stats',
      responses: {
        200: z.object({
          totalSurveys: z.number(),
          averageAwareness: z.number(),
          gapAnalysis: z.string(), // AI generated analysis
        }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
