'use client';

import Link from 'next/link';
import { useParams, usePathname} from 'next/navigation';
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
import type { Chat } from '@/lib/types';
import { fetcher } from '@/lib/utils';

interface Conversation {
  friendUsername: string;
  friendFirstName: string;
  friendLastName: string;
  latestMessage: {
    messageId: number;
    type: string | null;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
  };
  unreadCount: number;
  friendFullName: string;
}

const PureChatItem = ({
  chat,
  isActive,
  setOpenMobile,
}: {
  chat: Conversation;
  isActive: boolean;
  setOpenMobile: (open: boolean) => void;
}) => {
  const displayName = chat.friendFullName || chat.friendUsername;
  const messageDate = new Date(chat.latestMessage.createdAt);
  const formattedDate = messageDate.toLocaleDateString();
  const isCurrentUser = chat.latestMessage.sender === 'user';
  const messagePreview = isCurrentUser 
    ? `You: ${chat.latestMessage.content}`
    : chat.latestMessage.content;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link 
          href={`/chats/${chat.friendUsername}`} 
          onClick={() => setOpenMobile(false)}
          className="w-full min-h-[72px]"
        >
          <div className="flex flex-col w-full gap-2 py-4 px-3">
            <div className="flex justify-between items-center min-h-[24px]">
              <span className="font-medium truncate max-w-[180px]">{displayName}</span>
              {chat.unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground min-h-[20px]">
              <span className="truncate max-w-[180px]">{messagePreview}</span>
              <span className="text-xs whitespace-nowrap ml-2">{formattedDate}</span>
            </div>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.chat.unreadCount !== nextProps.chat.unreadCount) return false;
  if (prevProps.chat.latestMessage.messageId !== nextProps.chat.latestMessage.messageId) return false;
  return true;
});

// export function SidebarHistory({ user }: { user: User | undefined }) {
export function SidebarChats() {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const {
    data: conversations,
    isLoading,
    mutate,
  } = useSWR<Array<Conversation>>('/api/conversations', fetcher, {
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

  if (!conversations || conversations.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
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
            {conversations.map((chat) => (
              <ChatItem
                key={chat.friendUsername}
                chat={chat}
                isActive={chat.friendUsername === id}
                setOpenMobile={setOpenMobile}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
