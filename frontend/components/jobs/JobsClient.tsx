"use client";

import { useState } from "react";
import { useJobs } from "@/hooks/useJobs";
import { useJobSocket } from "@/hooks/useJobSocket";
import { SearchBar } from "@/components/shared/SearchBar";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobTable } from "@/components/jobs/JobTable";
import {CreateJobDialog} from "@/components/jobs/create-job-dialog/CreateJobDialog";
import { Plus } from "lucide-react";
import type { Job, JobStatus, JobType } from "@/types";

interface JobsClientProps {
  initialJobs: Job[];
}

export function JobsClient({ initialJobs }: JobsClientProps) {
  // Real-time socket listener
  useJobSocket();

  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [type, setType] = useState<JobType | "">("");
  const [deadLettered, setDeadLettered] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 10; // Use clean pagination limit

  // TanStack Query for jobs with current filters
  const {
    data: jobsData,
    isLoading,
    error,
  } = useJobs({
    status,
    type,
    deadLettered,
    page,
    limit,
  } as any);

  const jobs = jobsData?.data ?? (page === 1 && !status && !type && !deadLettered ? initialJobs : []);

  // Filter jobs locally based on search query (name/description matching)
  const filteredJobs = jobs.filter((job) => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      job.name.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    );
  });

  // Since backend doesn't return total count, check if there's a next page
  const hasNextPage = jobs.length === limit;

  return (
    <div className="flex flex-col gap-6">
      {/* Filters and Search toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            placeholder="Search jobs by name…"
            value={search}
            onChange={setSearch}
            className="w-full sm:w-[260px]"
          />
          <JobFilters
            status={status}
            type={type}
            deadLettered={deadLettered}
            onStatusChange={(s) => {
              setStatus(s);
              setPage(1);
            }}
            onTypeChange={(t) => {
              setType(t);
              setPage(1);
            }}
            onDeadLetteredChange={(v) => {
              setDeadLettered(v);
              setPage(1);
            }}
          />
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Create Job
        </button>
      </div>

      {/* Main Jobs Table */}
      <JobTable
        jobs={filteredJobs}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
        action={
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Job
          </button>
        }
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 text-sm text-zinc-500">
        <span>Page {page}</span>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            Previous
          </button>
          <button
            disabled={!hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Dialog */}
      <CreateJobDialog open={openCreate} onClose={() => setOpenCreate(false)} />
    </div>
  );
}
