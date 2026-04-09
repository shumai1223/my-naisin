"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components/Header";

export function GlobalHeaderBridge() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/blog")) {
    return null;
  }

  return <Header />;
}
