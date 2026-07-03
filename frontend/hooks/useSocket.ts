"use client";

import { getSocket } from "@/lib/socket";

export function useSocket() {
  return getSocket();
}