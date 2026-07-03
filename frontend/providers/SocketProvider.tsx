"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { connectSocket, disconnectSocket } from "@/lib/socket";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;
    console.log("Connecting socket...");
    connectSocket(getToken);

    return () => {
      disconnectSocket();
    };
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}