"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function GlobalHeaderBridge({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/blog")) {
    return null;
  }

  return <>{children}</>;
}
