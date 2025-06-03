'use client';

import {cn} from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {useSidebar} from "@/components/ui/sidebar";
import {SidebarToggle} from "@/components/sidebar-toggle";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";

export function ChatHeader({
    name,
    isConnected
}: {
    name: string | undefined;
    isConnected: boolean;
}) {
    const {isMobile} = useSidebar()
    const pathname = usePathname()
    const isSpecificChat = pathname.startsWith('/chats/') && pathname !== '/chats'

    return (
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
            {isMobile && (
                isSpecificChat ? (
                    <Link href="/chats">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back to chats</span>
                        </Button>
                    </Link>
                ) : (
                    <SidebarToggle />
                )
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-2">
                {name ? (
                    <>
                        <div className="font-semibold">{name}</div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className={cn(
                                        "h-2 w-2 rounded-full",
                                        isConnected ? "bg-green-500" : "bg-yellow-500 animate-pulse"
                                    )} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isConnected ? "Connected" : "Trying to reconnect..."}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                ) : isMobile && !isSpecificChat ? (
                    <div className="font-semibold text-lg">MicroChat</div>
                ) : null}
            </div>
            <div className="flex-1" />
        </header>
    );
}