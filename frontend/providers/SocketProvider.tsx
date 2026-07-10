"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { setAuthTokenGetter } from "@/services/api";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    setAuthTokenGetter(getToken);

    connectSocket(getToken);

    return () => {
      disconnectSocket();
      setAuthTokenGetter(null);
    };
  }, [isSignedIn, getToken]);

  return <>{children}</>;
}
