import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { NotificationDetails } from "@/components/notifications/NotificationDetails";
import type { Notification } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function fetchServerNotification(id: string, token: string | null): Promise<Notification | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/jobs/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("fetchServerNotification error:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    notificationId: string;
  }>;
}

export default async function NotificationDetailsPage({ params }: PageProps) {
  const authSession = await auth();
  const token = await authSession.getToken();

  if (!authSession.userId) {
    redirect("/sign-in");
  }

  const { notificationId } = await params;
  const notification = await fetchServerNotification(notificationId, token);

  // If notification doesn't exist on server, redirect back to notifications list
  if (!notification) {
    redirect("/dashboard/notifications");
  }

  return (
    <>
      <Topbar
        title="Notification Details"
        description="Inspect notification parameters, channels, trigger timeline, and related background jobs."
      />
      <div className="flex-1 p-6 max-w-4xl w-full mx-auto">
        <NotificationDetails notificationId={notificationId} initialNotification={notification} />
      </div>
    </>
  );
}