import type { Metadata } from "next";

import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers";
import DashSidebar from "./(components)/sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
      <SidebarProvider defaultOpen={defaultOpen}>
        <div
          className="antialiased w-full"
        >
       <DashSidebar>
        <div className="p-8">

        {children}
        </div>
       </DashSidebar>
      </div>
    </ SidebarProvider>
  );
}
