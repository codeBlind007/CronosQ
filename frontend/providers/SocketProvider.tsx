"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { setAuthTokenGetter } from "@/services/api";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isSignedIn } = useAuth();
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;

    setAuthTokenGetter(getToken);

    connectSocket(getToken)
      .catch((error) => {
        console.error("Socket connection failed:", error);
      })
      .finally(() => {
        setSocketReady(true);
      });

    return () => {
      disconnectSocket();
      setAuthTokenGetter(null);
      queueMicrotask(() => setSocketReady(false));
    };
  }, [isSignedIn, getToken]);

  if (!isSignedIn || socketReady) {
    return <>{children}</>;
  }

  return null;
}
