import { apiClient } from "./api";
import type {
  Job,
  CreateJobInput,
  JobFilters,
  ApiResponse,
  PaginatedJobsResponse,
} from "@/types";

export async function getJobs(
  filters?: JobFilters,
): Promise<PaginatedJobsResponse> {
  const params: Record<string, string | number | boolean | undefined> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.type) params.type = filters.type;
  if (filters?.deadLettered !== undefined)
    params.deadLettered = filters.deadLettered;
  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;

  const { data } = await apiClient.get<PaginatedJobsResponse>("/jobs", {
    params,
  });
  return data;
}

export async function getJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
  return data.data;
}

export async function createJob(payload: CreateJobInput): Promise<Job> {
  const { data } = await apiClient.post<ApiResponse<Job>>("/jobs", payload);
  return data.data;
}
