"use client";

import Link from "next/link";
import { useNotificationById } from "@/hooks/useNotifications";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    RefreshCw,
    Bell,
    AlertCircle,
    ExternalLink,
    Smartphone,
    Eye,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationEventType } from "@/types";
import { Skeleton } from "@/components/shared/LoadingSkeleton";

function formatDateTime(value: string | Date) {
    return new Date(value).toLocaleString(undefined, {
        dateStyle: "long",
        timeStyle: "medium",
    });
}

const TYPE_CONFIG: Record<
    NotificationEventType,
    {
        icon: React.ElementType;
        color: string;
        bg: string;
        label: string;
        description: string;
    }
> = {
    JOB_COMPLETED: {
        icon: CheckCircle,
        color: "text-green-400",
        bg: "bg-green-400/10",
        label: "Success Alert",
        description: "The scheduled job executed and completed successfully.",
    },
    JOB_FAILED: {
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        label: "Failure Alert",
        description: "The scheduled job execution failed. Attention may be required.",
    },
    JOB_RETRYING: {
        icon: RefreshCw,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        label: "Retry Alert",
        description: "The job failed but is being retried automatically.",
    },
    REMINDER: {
        icon: Bell,
        color: "text-indigo-400",
        bg: "bg-indigo-400/10",
        label: "Reminder",
        description: "A configured reminder alert has triggered.",
    },
    SYSTEM: {
        icon: AlertCircle,
        color: "text-zinc-400",
        bg: "bg-zinc-400/10",
        label: "System Notification",
        description: "Administrative or system level message.",
    },
};

interface NotificationDetailsProps {
    notificationId: string;
    initialNotification?: Notification;
}

export function NotificationDetails({
    notificationId,
    initialNotification,
}: NotificationDetailsProps) {
    const {
        data: notification,
        isLoading,
        error,
        refetch,
    } = useNotificationById(notificationId);

    const currentNotification = notification ?? initialNotification;

    if (isLoading && !currentNotification) {
        return <NotificationDetailsSkeleton />;
    }

    if (error && !currentNotification) {
        return (
            <div className="card p-8 text-center flex flex-col items-center gap-4 fade-in">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <AlertCircle className="text-red-400" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-md font-semibold text-zinc-200">
                        Failed to load notification
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm">
                        {error instanceof Error
                            ? error.message
                            : "An unexpected error occurred while fetching the notification."}
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 active:bg-zinc-800 transition-colors"
                >
                    <RefreshCw size={12} />
                    Retry Connection
                </button>
            </div>
        );
    }

    if (!currentNotification) {
        return (
            <div className="card p-8 text-center flex flex-col items-center gap-4 fade-in">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                    <Bell className="text-zinc-500" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-md font-semibold text-zinc-200">
                        Notification not found
                    </h3>
                    <p className="text-xs text-zinc-500">
                        The notification you are looking for does not exist or has been deleted.
                    </p>
                </div>
                <Link
                    href="/dashboard/notifications"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
                >
                    <ArrowLeft size={12} />
                    Back to Notifications
                </Link>
            </div>
        );
    }

    const config = TYPE_CONFIG[currentNotification.type] ?? TYPE_CONFIG.SYSTEM;
    const Icon = config.icon;

    // Extract channels or display metadata cleanly
    const channels = currentNotification.metadata?.channels as string[] | undefined;

    return (
        <div className="flex flex-col gap-6 fade-in">
            {/* Back button */}
            <div>
                <Link
                    href="/dashboard/notifications"
                    className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Notifications
                </Link>
            </div>

            {/* Main card */}
            <div className="card overflow-hidden">
                {/* Top banner styling based on notification type */}
                <div className={cn("h-1.5 w-full", config.bg.replace("/10", "/30"))} />

                <div className="p-6 md:p-8 flex flex-col gap-6">
                    {/* Header section */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-800/40 pb-6">
                        <div className="flex gap-4 items-start">
                            <div
                                className={cn(
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                                    config.bg
                                )}
                            >
                                <Icon size={20} className={config.color} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                                            config.bg,
                                            config.color
                                        )}
                                    >
                                        {config.label}
                                    </span>
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border",
                                            currentNotification.isRead
                                                ? "bg-zinc-900 border-zinc-800 text-zinc-500"
                                                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                        )}
                                    >
                                        {currentNotification.isRead ? "Read" : "New"}
                                    </span>
                                </div>
                                <h1 className="text-lg md:text-xl font-bold text-zinc-100 mt-1 leading-snug">
                                    {currentNotification.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* Message section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Details
                        </h3>
                        <p className="text-sm md:text-base text-zinc-300 bg-zinc-900/40 border border-zinc-800/20 rounded-xl p-4 md:p-5 whitespace-pre-wrap leading-relaxed">
                            {currentNotification.message}
                        </p>
                    </div>

                    {/* Quick properties list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3.5 bg-zinc-900/20 border border-zinc-800/30 p-4 rounded-xl">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                Metadata & Timeline
                            </h3>
                            <div className="flex flex-col gap-2.5 text-xs">
                                <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/40">
                                    <span className="text-zinc-500 flex items-center gap-1.5">
                                        <Calendar size={13} />
                                        Received
                                    </span>
                                    <span className="text-zinc-300 font-medium text-right">
                                        {formatDateTime(currentNotification.createdAt)}
                                    </span>
                                </div>

                                {currentNotification.readAt && (
                                    <div className="flex justify-between items-center py-0.5 border-b border-zinc-800/40">
                                        <span className="text-zinc-500 flex items-center gap-1.5">
                                            <Eye size={13} />
                                            Read At
                                        </span>
                                        <span className="text-zinc-300 font-medium text-right">
                                            {formatDateTime(currentNotification.readAt)}
                                        </span>
                                    </div>
                                )}

                                {channels && channels.length > 0 && (
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-zinc-500 flex items-center gap-1.5">
                                            <Smartphone size={13} />
                                            Delivery Channels
                                        </span>
                                        <div className="flex gap-1">
                                            {channels.map((chan) => (
                                                <span
                                                    key={chan}
                                                    className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono"
                                                >
                                                    {chan}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3.5 bg-zinc-900/20 border border-zinc-800/30 p-4 rounded-xl justify-between">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    Alert Description
                                </h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {config.description}
                                </p>
                            </div>

                            {currentNotification.jobId && (
                                <div className="mt-4 pt-4 border-t border-zinc-800/40 flex flex-col sm:flex-row gap-2">
                                    <Link
                                        href={`/dashboard/jobs/${currentNotification.jobId}`}
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs py-2 px-3 transition-colors shadow-sm"
                                    >
                                        View Related Job
                                        <ExternalLink size={12} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full metadata JSON viewer */}
                    {currentNotification.metadata &&
                        Object.keys(currentNotification.metadata).length > 0 && (
                            <div className="flex flex-col gap-3 border-t border-zinc-800/40 pt-6">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    Payload Metadata (Raw)
                                </h3>
                                <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono text-indigo-300 overflow-x-auto max-h-62.5">
                                    {JSON.stringify(currentNotification.metadata, null, 2)}
                                </pre>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}

function NotificationDetailsSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-4 w-28" />
            <div className="card overflow-hidden">
                <div className="h-1.5 w-full bg-zinc-800/40" />
                <div className="p-6 md:p-8 flex flex-col gap-6">
                    <div className="flex gap-4 border-b border-zinc-800/40 pb-6">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-20 w-full rounded-xl" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4 border border-zinc-800/30 p-4 rounded-xl">
                            <Skeleton className="h-3 w-28" />
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 border border-zinc-800/30 p-4 rounded-xl justify-between">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-8 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
