import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { User, Key, Bell} from "lucide-react";
import Image from "next/image";

export default async function SettingsPage() {
  const authSession = await auth();
  if (!authSession.userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <>
      <Topbar
        title="Settings"
        description="Manage your profile, team account, and developer credentials."
      />
      <div className="flex-1 p-10 max-w-4xl w-full mx-auto flex flex-col gap-8">
        {/* Profile summary card */}
        <div className="card p-6 flex flex-col sm:flex-row items-center gap-4">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Avatar"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full border border-zinc-800"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <User size={24} className="text-zinc-500" />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-base font-semibold text-zinc-100">
              {user?.fullName ?? user?.username ?? "User Account"}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {user?.primaryEmailAddress?.emailAddress ?? "No email linked"}
            </p>
            <p className="text-[10px] font-mono text-zinc-600 mt-0.5">
              ID: {user?.id}
            </p>
          </div>
        </div>

        {/* Configurations Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Credentials */}
          <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Key size={14} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">API Credentials</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Your API keys grant full read/write access to schedule and execute jobs programmatically. Keep them secret.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-semibold text-zinc-600 tracking-wider">
                Public API Token
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value="pk_live_d1a29384bc19a842b09c80d8ad81c9a03c2b8c8d"
                  readOnly
                  className="w-full font-mono text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 py-1.5 px-3 rounded-lg outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Bell size={14} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200">Alert Preferences</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Configure system alerts when cron executions fail or reach their dead-letter thresholds.
            </p>
            <div className="flex flex-col gap-2 text-xs text-zinc-400 mt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500/20"
                />
                Email on execution failures
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500/20"
                />
                Push notifications on dead-lettering
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
