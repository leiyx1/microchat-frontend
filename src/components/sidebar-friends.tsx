'use client';

import { useParams, usePathname} from 'next/navigation';
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import { memo, useEffect} from 'react';
import useSWR from 'swr';

import {
  SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {fetcher, getInitials} from '@/lib/utils';
import {Friend} from "@/lib/types";
import {DialogNewFriend} from "@/components/dialog-add-friend";
import {Button} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {toast} from "sonner";

interface FriendRequest {
    id: string;
    senderUsername: string;
    senderFullName: string;
    receiverUsername: string;
    receiverFullName: string;
    status: "PENDING" | "APPROVED";
    createdDate: string;
}

const PureFriendItem = ({
  friend,
}: {
  friend: Friend;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
      >
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={friend.avatarUrl}/>
          <AvatarFallback className="rounded-lg">{getInitials(friend.fullName)}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{friend.fullName}</span>
          <span className="truncate text-xs">{friend.username}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const FriendItem = memo(PureFriendItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

const PureFriendRequestItem = ({
  request,
  onAccept,
  onDelete,
}: {
  request: FriendRequest;
  onAccept: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <SidebarMenuItem>
      <div className="flex items-center gap-2 p-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarFallback className="rounded-lg">{getInitials(request.senderFullName)}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{request.senderFullName}</span>
          <span className="truncate text-xs">{request.senderUsername}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onAccept(request.id);
            }}
          >
            Accept
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(request.id);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </SidebarMenuItem>
  );
};

export const FriendRequestItem = memo(PureFriendRequestItem);

export function SidebarFriends({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const { data: session } = useSession();
  const {
    data: friends,
    isLoading: isLoadingFriends,
    mutate: mutateFriends,
  } = useSWR<Array<Friend>>('/api/friends', fetcher, {
    fallbackData: [],
  });

  const {
    data: requests,
    isLoading: isLoadingRequests,
    mutate: mutateRequests,
  } = useSWR<Array<FriendRequest>>('/api/friend_requests', fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutateFriends();
    mutateRequests();
  }, [pathname, mutateFriends, mutateRequests]);

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friend_requests/${requestId}`, {
        method: 'PATCH'
      });
      if (!response.ok)
        throw Error();
      toast.success("Friend request accepted");
      mutateRequests();
      mutateFriends();
    } catch {
      toast.error("Error accepting friend request");
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friend_requests/${requestId}`, {
        method: 'DELETE'
      });
      if (!response.ok)
        throw Error();
      toast.success("Friend request deleted");
      mutateRequests();
    } catch {
      toast.error('Error deleting friend request');
    }
  };

  const pendingRequests = requests?.filter(
    request => 
      request.status === "PENDING" && 
      request.receiverUsername === session?.user?.preferred_username
  ) || [];

  if (isLoadingFriends || isLoadingRequests) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (friends?.length === 0 && pendingRequests.length === 0) {
    return (
      <>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
              Add a friend to start chatting!
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <DialogNewFriend open={open} setOpen={setOpen}>
        </DialogNewFriend>
      </>
    );
  }

  return (
    <>
      {pendingRequests.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Friend Requests</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pendingRequests.map(request => (
                <FriendRequestItem
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      <SidebarGroup>
        <SidebarGroupLabel>Friends</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {friends && friends.map(chat => (
              <FriendItem
                key={chat.id}
                friend={chat}
                isActive={chat.username === id}
                setOpenMobile={setOpenMobile}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <DialogNewFriend open={open} setOpen={setOpen}>
      </DialogNewFriend>
    </>
  );
}
