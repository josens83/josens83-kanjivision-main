"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Mounts once at the root layout. On first client render it:
 *  - reads authToken from localStorage
 *  - calls GET /api/auth/me to refresh the user / clear stale tokens
 * Purely a side-effect component — renders nothing.
 */
export function AuthBoot() {
  const hydrate = useAppStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
