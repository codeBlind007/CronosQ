import { auth } from "@clerk/nextjs/server";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  // Protect all sub-routes of /dashboard server-side
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
