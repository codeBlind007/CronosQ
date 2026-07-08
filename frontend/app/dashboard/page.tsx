import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { Job, Notification } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function fetchServerJobs(token: string | null): Promise<Job[]> {
  if (!token) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/jobs?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // no cache for dashboard
    });

    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Failed to fetch jobs");

    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("fetchServerJobs error:", error);
    return [];
  }
}

async function fetchServerNotifications(token: string | null): Promise<Notification[]> {
  if (!token) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/jobs/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Failed to fetch notifications");

    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("fetchServerNotifications error:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const authSession = await auth();
  const token = await authSession.getToken();

  if (!authSession.userId) {
    redirect("/sign-in");
  }

  // Parallel server-side fetch
  const [initialJobs, initialNotifications] = await Promise.all([
    fetchServerJobs(token),
    fetchServerNotifications(token),
  ]);

  return (
    <>
      <Topbar
        title="Dashboard"
        description="Monitor system metrics, queue states, and execution runs."
      />
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <DashboardClient
          initialJobs={initialJobs}
          initialNotifications={initialNotifications}
        />
      </div>
    </>
  );
}
