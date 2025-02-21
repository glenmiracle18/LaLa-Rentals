"use client"
import * as React from "react"

import { SearchForm } from "@/components/search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { House } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Manage your rentals",
      url: "#",
      items: [
        {
          title: "Properties",
          url: "#",
        },
      ],
    },
   
   
  ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const username = useUser().user?.fullName
  const email = useUser().user?.primaryEmailAddress?.toString()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
      <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/" className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <House className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">LaLa Rentals</span>
              </div>
              </Link>
            </SidebarMenuButton>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="px-2 py-4">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors border border-border">
        <UserButton />
        <div className="flex flex-col">
          <span className="text-sm font-medium">{username}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
        </div>
      </div>
    </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
