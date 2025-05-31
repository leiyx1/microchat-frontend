"use client"
import "../globals.css"

import * as React from "react"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {ChatProvider} from "@/app/(chat)/chat-provider";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

export default function Layout({
                                   children,
                               }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data: session, status: authenticationStatus} = useSession();
    useEffect(() => {
        if (authenticationStatus === 'unauthenticated' || !!session?.error)
            router.push("/login");
    })

    return (
        <SidebarProvider style={{"--sidebar-width": "350px",} as React.CSSProperties}>
            <ChatProvider>
                <AppSidebar/>
                <SidebarInset>
                    {children}
                </SidebarInset>
            </ChatProvider>
        </SidebarProvider>
    )
}