import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertApplication } from "@shared/schema";

// GET /api/applications
export function useApplications() {
  return useQuery({
    queryKey: [api.applications.list.path],
    queryFn: async () => {
      const res = await fetch(api.applications.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.applications.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/applications
export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertApplication) => {
      const validated = api.applications.create.input.parse(data);
      const res = await fetch(api.applications.create.path, {
        method: api.applications.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.applications.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit application");
      }
      return api.applications.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.applications.list.path] }),
  });
}

// POST /api/applications/:id/verify - AI Verification
export function useVerifyApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.applications.verify.path, { id });
      const res = await fetch(url, {
        method: api.applications.verify.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Application not found");
        throw new Error("Failed to verify application");
      }
      return api.applications.verify.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.applications.list.path] }),
  });
}
