import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import SocketProvider from "@/providers/SocketProvider";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CronosQ — Distributed Job Scheduling",
    template: "%s · CronosQ",
  },
  description:
    "Reliable distributed job scheduling for emails, webhooks, and reminders. Built for production.",
  keywords: ["job scheduler", "cron", "webhooks", "distributed", "queues"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="antialiased">
        <ClerkProvider>
          <QueryProvider>
            <SocketProvider>
              {children}
              <ToastProvider />
            </SocketProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
