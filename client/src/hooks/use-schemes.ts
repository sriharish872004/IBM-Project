import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertScheme } from "@shared/schema";

// GET /api/schemes
export function useSchemes(filters?: { search?: string; category?: string }) {
  return useQuery({
    queryKey: [api.schemes.list.path, filters],
    queryFn: async () => {
      const url = buildUrl(api.schemes.list.path);
      const searchParams = new URLSearchParams();
      if (filters?.search) searchParams.append("search", filters.search);
      if (filters?.category) searchParams.append("category", filters.category);
      
      const fullUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;
      
      const res = await fetch(fullUrl, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch schemes");
      return api.schemes.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/schemes/:id
export function useScheme(id: number) {
  return useQuery({
    queryKey: [api.schemes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.schemes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scheme details");
      return api.schemes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// POST /api/schemes/recommend - AI Recommendations
export function useRecommendSchemes() {
  return useMutation({
    mutationFn: async (userProfile: string) => {
      const res = await fetch(api.schemes.recommend.path, {
        method: api.schemes.recommend.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get recommendations");
      return api.schemes.recommend.responses[200].parse(await res.json());
    },
  });
}

// POST /api/schemes
export function useCreateScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertScheme) => {
      const validated = api.schemes.create.input.parse(data);
      const res = await fetch(api.schemes.create.path, {
        method: api.schemes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.schemes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create scheme");
      }
      return api.schemes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.schemes.list.path] }),
  });
}
