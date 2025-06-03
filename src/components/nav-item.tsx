'use client';

import { SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import {useRouter, useSelectedLayoutSegment} from "next/navigation";

export function NavItem({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode
}) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const { isMobile, setOpenMobile } = useSidebar();
    
  return (
    <SidebarMenuItem key={label}>
      <SidebarMenuButton
        tooltip={{
          children: label,
          hidden: false,
        }}
        onClick={() => {
          router.push(href);
          if (isMobile) {
            setOpenMobile(false);
          }
        }}
        isActive={href === `/${segment}`}
        className="px-2.5 md:px-2"
      >
        {children}
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}