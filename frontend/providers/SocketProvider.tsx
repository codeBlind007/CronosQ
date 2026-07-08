"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { setAuthToken } from "@/services/api";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    // Set Clerk token on Axios instance for every session
    getToken().then((token) => {
      setAuthToken(token);
    });

    connectSocket(getToken);

    return () => {
      disconnectSocket();
      setAuthToken(null);
    };
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}