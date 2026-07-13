import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { NotificationsClient } from "@/components/notifications/NotificationsClient";
import type { Notification } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function fetchInitialNotifications(token: string | null): Promise<Notification[]> {
  if (!token) return [];
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/jobs/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (res.status === 404) return [];
    if (!res.ok) throw new Error("Failed to fetch initial notifications");

    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error("fetchInitialNotifications error:", error);
    return [];
  }
}

export default async function NotificationsPage() {
  const authSession = await auth();
  const token = await authSession.getToken();

  if (!authSession.userId) {
    redirect("/sign-in");
  }

  const initialNotifications = await fetchInitialNotifications(token);

  return (
    <>
      <Topbar
        title="Notifications"
        description="View system alerts, task statuses, and processing warnings."
      />
      <div className="flex-1 p-10 max-w-4xl w-full mx-auto">
        <NotificationsClient initialNotifications={initialNotifications} />
      </div>
    </>
  );
}
