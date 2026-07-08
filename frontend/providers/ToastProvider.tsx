"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: "#111827",
          border: "1px solid #27272A",
          color: "#F4F4F5",
        },
      }}
    />
  );
}
