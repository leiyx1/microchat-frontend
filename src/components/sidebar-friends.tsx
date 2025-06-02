'use client';

import { useParams, usePathname} from 'next/navigation';
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import { memo, useEffect} from 'react';
import useSWR from 'swr';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {fetcher, getInitials} from '@/lib/utils';
import {Friend} from "@/lib/types";
import {DialogNewFriend} from "@/components/dialog-add-friend";

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

export function SidebarFriends({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const {
    data: friends,
    isLoading,
    mutate,
  } = useSWR<Array<Friend>>('/api/friends', fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  if (isLoading) {
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

  if (friends?.length === 0) {
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
      <SidebarGroup>
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
