import type { Metadata } from "next";
import ToastProvider from "../providers/toast-provider";
import AuthProvider from "../providers/provider";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
   title: "AI Product Ads Generator",
  description:
    "Upload, transform, and optimize your images with AI-powered tools. Resize, crop, remove backgrounds, and more with AI transformations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToastProvider />
      <AuthProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
                  {children}
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </>
  );
}
