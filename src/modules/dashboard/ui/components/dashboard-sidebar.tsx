"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon, MessagesSquareIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface ChatSession {
  id: string;
  title: string | null;
  createdAt: string;
}

const firstSection = [
  // {
  //   icon: MessagesSquareIcon,
  //   label: "New Chat",
  //   href: "/chats",
  // },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

// const secondSection = [
//   {
//     icon: StarIcon,
//     label: "Upgrade",
//     href: "/upgrade",
//   },
// ]

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/chat/sessions");
      const data = await res.json();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  const handleNewChat = async () => {
    const res = await fetch("/api/chat/sessions", { method: "POST" });
    const session = await res.json();
    router.push(`/chat/${session.id}`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="text-sidebar-accent-foreground">
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="logo.svg" alt="logo" height={42} width={42} />
          <p className="text-xl font-semibold">CoachPotato AI</p>
        </Link>
      </SidebarHeader>

      <div className="px-4 py-2">
        <Separator className="opacity-10 text-[#6b5d5d]" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="h-10 w-full justify-start gap-2 text-orange-600 border border-orange-600/30 hover:bg-orange-600/10 transition"
                  onClick={handleNewChat}
                >
                  <PlusIcon className="size-4" />
                  <span className="text-sm font-medium tracking-tight">New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {firstSection.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-10 border border-transparent hover:border-[#6b5d5d]/10 sidebarGradientButton transition-all duration-300",
                      pathname === item.href &&
                        "border-l-4 border-l-orange-600  "
                    )}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="text-sm font-medium tracking-tigh">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-2">
          <Separator className="opacity-10 text-[#5D6B68]" />
        </div>
        {sessions.length > 0 && (
          <>
            <div className="px-4 py-2">
              <Separator className="opacity-10 text-[#6b5d5d]" />
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sessions.map((s) => (
                    <SidebarMenuItem key={s.id}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "h-10 text-left px-3 sidebarGradientButton transition-all",
                          pathname?.includes(s.id) &&
                            "border-l-4 border-l-orange-600"
                        )}
                        isActive={pathname?.includes(s.id)}
                      >
                        <Link href={`/chat/${s.id}`}>
                          <div className="flex flex-col">
                            <span className="truncate text-sm font-medium leading-tight">
                              {s.title ||
                                format(
                                  new Date(s.createdAt),
                                  "MMM d, yyyy HH:mm"
                                )}
                            </span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="text-white">
        {/* <DashboardTrial />   */}
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
