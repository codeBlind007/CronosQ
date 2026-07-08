"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#architecture", label: "Architecture" },
  { href: "#why-cronosq", label: "Why CronosQ" },
];

export function LandingNav() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#09090B]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-zinc-100"
        >
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Zap size={14} className="text-indigo-400" />
          </div>
          CronosQ
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isLoaded && !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors">
                  Get started
                </button>
              </SignUpButton>
            </>
          ) : null}
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
