"use client";

import * as React from "react";
import {
  IconDashboard,
  IconMailbox,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconImageInPicture,
  IconMoneybag,
  IconVideo,
  IconUser,
  IconMovie,
  IconSettings
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useWorkspaceStore } from "@/lib/store"; // make sure this exists
import { Workspace } from "../../types/index";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ url: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const { setWorkspace, currentWorkspace } = useWorkspaceStore();
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [current, setCurrent] = React.useState<Workspace | null>(null);

  // keep workspace in global store
  React.useEffect(() => {
    if (params?.url) setWorkspace(params.url);
  }, [params, setWorkspace]);

  // fetch all workspaces
  React.useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/workspace`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch workspaces");
        const data = await res.json();
        setWorkspaces(data);

        const active = data.find((ws: Workspace) => ws.url === params?.url);
        setCurrent(active || null);
      } catch (err) {
        console.error(err);
      }
    }
    fetchWorkspaces();
  }, [params]);

 const workspaceSlug = params?.url || currentWorkspace || "";

const data = {
  user: {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: `https://api.dicebear.com/9.x/glass/svg?seed=${
      session?.user?.name || "user"
    }`,
  },
  navMain: [
    {
      title: "My Ads",
      url: `/dashboard/${workspaceSlug}`,
      icon:  IconFolder,
    },
    {
      title: "AI Product Image",
      url: `/dashboard/${workspaceSlug}/product-image/create`,
      icon: IconImageInPicture,
    },
    {
      title: "AI Product Video",
      url: `/dashboard/${workspaceSlug}/product-video/create`,
      icon: IconVideo,
    },
    {
      title: "AI Product Avatar",
      url: `/dashboard/${workspaceSlug}/product-avatar/create`,
      icon: IconUser,
    },
     {
      title: "Settings",
      url: `/dashboard/${workspaceSlug}/settings`,
      icon: IconSettings,
    },
    {
      title: "Upgrade",
      url: `/dashboard/${workspaceSlug}/upgrade`,
      icon: IconMoneybag,
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
};


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-2">
            {/* Logo link */}
              <Link href={`/`} className="flex items-center justify-center gap-[.3rem]">
                            <IconMovie className="!size-6" />
                            <span className="text-[1rem] font-semibold">QuickAds</span>
                      </Link>
            <span className="mx-1 text-gray-400">|</span>
            {/* Current workspace name */}
            <span
              className="text-muted-foreground text-[1rem] line-clamp-2 truncate"
              suppressHydrationWarning
            >
              {current?.name || ""}
            </span>
            {/* Workspace dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0 h-6 w-6">
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {workspaces.map((ws, i) => (
                  <DropdownMenuItem
                    key={i}
                    onClick={() => router.push(`/dashboard/${ws.url}`)}
                  >
                    {ws.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/workspace/create")}
                  className="text-green-600 font-medium cursor-pointer"
                >
                  + Create New Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
