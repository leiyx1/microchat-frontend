"use client"

import * as React from "react"
import {MessageCircle, Users2} from "lucide-react"

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
} from "@/components/ui/sidebar"
import {NavItem} from "@/components/nav-item";
import {SidebarFriends} from "@/components/sidebar-friends";
import {useSelectedLayoutSegment} from "next/navigation";
import {SidebarChats} from "@/components/sidebar-chats";
import {NavUser} from "@/components/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const segment = useSelectedLayoutSegment();

    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
            {...props}
        >
            {/* This is the first sidebar */}
            {/* We disable collapsible and adjust width to icon. */}
            {/* This will make the sidebar appear as icons. */}
            <Sidebar
                collapsible="none"
                className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                <a href="#">
                                    <div
                                        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <svg width="200" height="200" viewBox="0 0 200 200"
                                             xmlns="http://www.w3.org/2000/svg" fill="none">
                                            <path
                                                d="M50 50h100a20 20 0 0 1 20 20v60a20 20 0 0 1-20 20H80l-30 20v-20H50a20 20 0 0 1-20-20V70a20 20 0 0 1 20-20z"
                                                fill="black" stroke="black" stroke-width="5" stroke-linejoin="round"/>

                                            <text x="85" y="95" font-family="Arial" font-size="40" fill="white"
                                                  font-weight="bold">M
                                            </text>
                                        </svg>
                                        {/*<Command className="size-4" />*/}
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Acme Inc</span>
                                        <span className="truncate text-xs">Enterprise</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                <NavItem href="/chats" label="Chats"> <MessageCircle/> </NavItem>
                                <NavItem href="/friends" label="Friends"> <Users2/> </NavItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={{
                        name: "shadcn",
                        email: "m@example.com",
                        avatar: "/avatars/shadcn.jpg",
                    }} />
                </SidebarFooter>
            </Sidebar>

            {/* This is the second sidebar */}
            {/* We disable collapsible and let it fill remaining space */}
            <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="text-base font-medium text-foreground">
                            {(segment === 'chats') && 'Chats'}
                            {(segment === 'friends') && 'Friends'}
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {(segment === 'chats') && <SidebarChats/>}
                    {(segment === 'friends') && <SidebarFriends/>}
                </SidebarContent>
            </Sidebar>
        </Sidebar>
    )
}
