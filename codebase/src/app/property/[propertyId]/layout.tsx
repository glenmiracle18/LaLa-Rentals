import type { Metadata } from "next";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import Header from "@/components/landing/header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
      <SidebarProvider defaultOpen={defaultOpen}>
        {/* <AppSidebar /> */}
      <div
        className="antialiased"
      >
        {/* <SidebarTrigger /> */}
        <Header />
        <div className="p-8">
        {children}
        </div>
      </div>
    </ SidebarProvider>
  );
}
