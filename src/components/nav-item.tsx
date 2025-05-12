'use client';

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
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
  const segment = useSelectedLayoutSegment()
    
  return (
    <SidebarMenuItem key={label}>
      <SidebarMenuButton
        tooltip={{
          children: label,
          hidden: false,
        }}
        onClick={() => {router.push(href)}}
        isActive={href === `/${segment}`}
        className="px-2.5 md:px-2"
      >
        {children}
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}