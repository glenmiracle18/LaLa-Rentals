import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import DashSidebar from "./(components)/sidebar";
import ProtectedHostRoute from "@/providers/session-route-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    // <ProtectedHostRoute> 
    // no need to use session route provider, since the job is already done by the middleware file in /src
      <SidebarProvider defaultOpen={defaultOpen}>
        {/* <AppSidebar /> */}
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <SidebarTrigger /> */}
       <DashSidebar>
        <div className="p-8">

        {children}
        </div>
       </DashSidebar>
      </div>
    </ SidebarProvider>
    // </ProtectedHostRoute>
  );
}
