import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { JobsClient } from "@/components/jobs/JobsClient";
import type { Job } from "@/types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function fetchInitialJobs(token: string | null): Promise<Job[]> {
  if (!token) return [];
  try {
    console.log(
      "fetchInitialJobs auth token present:",
      Boolean(token),
      "length:",
      token.length,
    );
    const res = await fetch(`${BACKEND_URL}/api/v1/jobs?limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Failed to fetch initial jobs");

    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("fetchInitialJobs error:", error);
    return [];
  }
}

export default async function JobsPage() {
  const authSession = await auth();
  const token = await authSession.getToken();
  console.log(
    "JobsPage token present:",
    Boolean(token),
    "length:",
    token?.length ?? 0,
  );
  if (!authSession.userId) {
    redirect("/sign-in");
  }

  const initialJobs = await fetchInitialJobs(token);

  return (
    <>
      <Topbar
        title="Jobs"
        description="Configure webhooks, email schedules, and custom recurring workers."
      />
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <JobsClient initialJobs={initialJobs} />
      </div>
    </>
  );
}
