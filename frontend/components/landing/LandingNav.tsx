"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const NAV_LINKS = [
  { href: "#architecture", label: "Architecture" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
];

export function LandingNav() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#09090B]">
      <div className="max-w-[1400px] mx-auto px-10 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-[#FAFAFA]"
        >
          <Zap size={16} className="text-[#6366F1]" />
          CronosQ
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoaded && !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors duration-150 px-3 py-1.5 rounded-lg hover:bg-white/[0.04]">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium bg-[#6366F1] hover:bg-[#5558E3] hover:-translate-y-px text-white px-4 py-1.5 rounded-lg transition-all duration-150">
                  Get started
                </button>
              </SignUpButton>
            </>
          ) : null}
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium bg-[#6366F1] hover:bg-[#5558E3] hover:-translate-y-px text-white px-4 py-1.5 rounded-lg transition-all duration-150"
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
