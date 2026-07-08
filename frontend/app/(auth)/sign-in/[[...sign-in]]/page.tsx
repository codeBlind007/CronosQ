import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#09090B] py-12 px-6">
      <SignIn
        appearance={{
          elements: {
            card: "bg-zinc-950 border border-zinc-800",
            headerTitle: "text-zinc-100",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
            formFieldLabel: "text-zinc-400",
            formFieldInput: "bg-zinc-900 border border-zinc-800 text-zinc-300",
            footerActionText: "text-zinc-500",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
          },
        }}
      />
    </div>
  );
}
