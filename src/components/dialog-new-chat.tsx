"use client"

import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem} from "@/components/ui/command";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Friend} from "@/lib/types";
import useSWR from "swr";
import {fetcher} from "@/lib/utils";
import {useRouter} from "next/navigation";

export function DialogNewChat({open, setOpen}: { open: boolean; setOpen: (open: boolean) => void }) {
    const router = useRouter()
    const [selectedUser, setSelectedUser] = useState<Friend | null>(null)

    // SWR hook - only fetch when we have a search term
    const {
        data: users,
        // error,
        // isLoading
    } = useSWR<Array<Friend>>(`/api/friends`, fetcher, {fallbackData: []}
    );

    const onOpenChange = (open: boolean) => {
        setOpen(open);
        setSelectedUser(null)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-0 p-0 outline-none">
                <DialogHeader className="px-4 pb-4 pt-5">
                    <DialogTitle>New Chat</DialogTitle>
                    <DialogDescription>
                        Choose a friend to chat with
                    </DialogDescription>
                </DialogHeader>
                <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
                    <CommandInput placeholder="Search a friend"></CommandInput>
                    <CommandList>
                        <CommandEmpty>No such user</CommandEmpty>
                        <CommandGroup className="p-2">
                            {users?.map((user: Friend) => (
                                <CommandItem
                                    key={user.username}
                                    className="flex items-center px-2"
                                    onSelect={() => {
                                        setSelectedUser(selectedUser?.username === user.username ? null : user);
                                    }}
                                >
                                    <Avatar>
                                        <AvatarImage src={""} alt="Image"/>
                                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2">
                                        <p className="text-sm font-medium leading-none">
                                            {user.fullName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.username}
                                        </p>
                                    </div>
                                    {selectedUser?.username === user.username ? (
                                        <Check className="ml-auto flex h-5 w-5 text-primary"/>
                                    ) : null}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
                <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
                    {selectedUser ? (
                        <div className="flex -space-x-2 overflow-hidden">
                            <Avatar
                                key={selectedUser.username}
                                className="inline-block border-2 border-background"
                            >
                                <AvatarImage src=""/>
                                <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Select a user to start chat
                        </p>
                    )}
                    <Button
                        disabled={!selectedUser}
                        onClick={() => {
                            onOpenChange(false)
                            router.push(`/chats/${selectedUser?.username}`)
                        }}
                    >
                        Start Chatting
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}