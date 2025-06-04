"use client"

import {SetStateAction, useEffect, useState} from "react";
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
import {toast} from "sonner";

export function DialogNewFriend({open, setOpen}: { open: boolean; setOpen: (open: boolean) => void }) {
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<Friend | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // SWR hook - only fetch when we have a search term
    const shouldFetch = debouncedSearch && debouncedSearch.trim().length > 0;
    const {
        data: users,
        // error,
        // isLoading
    } = useSWR<Array<Friend>>(
        shouldFetch ? `/api/users/${encodeURIComponent(debouncedSearch)}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 300000, // 5 minutes
            fallbackData: []
        }
    );

    // Handle input change
    const handleInputChange = (value: SetStateAction<string>) => {
        setSearch(value);
    };

    const handleSendRequest = async () => {
        if (!selectedUser) return;

        const response = await fetch(`/api/friends/${selectedUser.username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Client response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            toast.error('Failed to send friend request');
        } else {
            toast.success(`Friend request sent to ${selectedUser.fullName}`);
            setTimeout(() => {
                setOpen(false);
                setSelectedUser(null);
                setSearch('');
            }, 1000);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="gap-0 p-0 outline-none">
                <DialogHeader className="px-4 pb-4 pt-5">
                    <DialogTitle>New Friend</DialogTitle>
                    <DialogDescription>
                        Add a new friend to chat with
                    </DialogDescription>
                </DialogHeader>
                <Command className="overflow-hidden rounded-t-none border-t bg-transparent" shouldFilter={false}>
                    <CommandInput
                        placeholder="Type a username"
                        value={search}
                        onValueChange={handleInputChange}
                    ></CommandInput>
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
                            Select a user to send friend request
                        </p>
                    )}
                    <Button
                        disabled={!selectedUser}
                        onClick={handleSendRequest}
                    >
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}