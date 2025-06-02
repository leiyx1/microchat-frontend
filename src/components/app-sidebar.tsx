"use client"

import * as React from "react"
import {MessageCircle, Users2, Plus} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import {NavItem} from "@/components/nav-item";
import {SidebarFriends} from "@/components/sidebar-friends";
import {useSelectedLayoutSegment} from "next/navigation";
import {SidebarChats} from "@/components/sidebar-chats";
import {NavUser} from "@/components/nav-user";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {useSession} from "next-auth/react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const segment = useSelectedLayoutSegment();
    const [newFriendDialogOpen, setnewFriendDialogOpen] = React.useState(false);
    const [newChatDialogOpen, setnewChatDialogOpen] = React.useState(false);
    const {data: session} = useSession()

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
                    <NavUser user={{
                        name: session?.user?.name || "",
                        email: session?.user?.preferred_username || "",
                        avatar: "/avatars/shadcn.jpg",
                    }} />
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
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="ml-auto rounded-full"
                                        onClick={() => {
                                            if (segment === 'chats') {
                                                setnewChatDialogOpen(true);
                                            } else if (segment === 'friends') {
                                                setnewFriendDialogOpen(true);
                                            }
                                        }}
                                    >
                                        <Plus />
                                        <span className="sr-only">
                                            {segment === 'chats' ? 'New chat' : 'New friend'}
                                        </span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={10}>
                                    {segment === 'chats' ? 'New chat' : 'New friend'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {(segment === 'chats') && <SidebarChats open={newChatDialogOpen} setOpen={setnewChatDialogOpen} />}
                    {(segment === 'friends') && <SidebarFriends open={newFriendDialogOpen} setOpen={setnewFriendDialogOpen}/>}
                </SidebarContent>
            </Sidebar>
        </Sidebar>
    )
}
