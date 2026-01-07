import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertSurvey } from "@shared/schema";

// GET /api/surveys/stats
export function useSurveyStats() {
  return useQuery({
    queryKey: [api.surveys.stats.path],
    queryFn: async () => {
      const res = await fetch(api.surveys.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch survey stats");
      return api.surveys.stats.responses[200].parse(await res.json());
    },
  });
}

// POST /api/surveys
export function useCreateSurvey() {
  return useMutation({
    mutationFn: async (data: InsertSurvey) => {
      const validated = api.surveys.create.input.parse(data);
      const res = await fetch(api.surveys.create.path, {
        method: api.surveys.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.surveys.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit survey");
      }
      return api.surveys.create.responses[201].parse(await res.json());
    },
  });
}
