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
import { fetcher } from '@/lib/utils';
import {Friend} from "@/lib/types";

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
          <AvatarImage src="https://microchat-bucket.s3.ca-central-1.amazonaws.com/913c4bc3245718481cebd8a456e8753d.jpg"/>
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{friend.username}</span>
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

export function SidebarFriends() {
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
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Add a friend to start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
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
    </>
  );
}
