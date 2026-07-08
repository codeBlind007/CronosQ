"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getJobs, getJobById, createJob } from "@/services/job.service";
import type { CreateJobInput, JobFilters } from "@/types";

export const JOB_KEYS = {
  all: ["jobs"] as const,
  list: (filters?: JobFilters) => ["jobs", "list", filters] as const,
  detail: (id: string) => ["jobs", "detail", id] as const,
};

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: JOB_KEYS.list(filters),
    queryFn: () => getJobs(filters),
  });
}

export function useJobById(id: string) {
  return useQuery({
    queryKey: JOB_KEYS.detail(id),
    queryFn: () => getJobById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobInput) => createJob(payload),
    onSuccess: () => {
      // Invalidate all job list queries
      queryClient.invalidateQueries({ queryKey: JOB_KEYS.all });
    },
  });
}
