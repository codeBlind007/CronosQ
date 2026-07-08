import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { JobDetailsClient } from "@/components/jobs/JobDetailsClient";
import type { Job } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function fetchServerJob(id: string, token: string | null): Promise<Job | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("fetchServerJob error:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function JobDetailsPage({ params }: PageProps) {
  const authSession = await auth();
  const token = await authSession.getToken();

  if (!authSession.userId) {
    redirect("/sign-in");
  }

  const { jobId } = await params;
  const job = await fetchServerJob(jobId, token);

  if (!job) {
    redirect("/dashboard/jobs");
  }

  return (
    <>
      <Topbar
        title="Job Details"
        description="Inspect execution logs, parameters, and queue timeline."
      />
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <JobDetailsClient jobId={jobId} initialJob={job} />
      </div>
    </>
  );
}
