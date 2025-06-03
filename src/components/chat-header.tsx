'use client';

import {cn} from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function ChatHeader({
    name,
    isConnected
}: {
    name: string;
    isConnected: boolean;
}) {
    return (
        <header className="flex sticky top-0 bg-background py-1.5 items-center justify-center px-2 md:px-2 gap-2">
            <div className="flex items-center gap-2">
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
            </div>
        </header>
    );
}