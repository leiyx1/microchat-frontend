"use client"
// import { cookies } from 'next/headers';
// import { notFound } from 'next/navigation';

// import { auth } from '@/app/(auth)/auth';
// import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models';
// import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
// import { convertToUIMessages } from '@/lib/utils';
// import { DataStreamHandler } from '@/components/data-stream-handler';
import {ChatHeader} from "@/components/chat-header";
import {useSidebar} from "@/components/ui/sidebar";
import {useChat} from "@/app/(chat)/chat-provider";
import {DialogNewChat} from "@/components/dialog-new-chat";
import React from "react";
import Link from "next/link";

// export default async function Page(props: { params: Promise<{ id: string }> }) {
export default function Page() {
//   const params = await props.params;
//   const { id } = params;
  // const chat = await getChatById({ id });

  // if (!chat) {
  //   notFound();
  // }

  // const session = await auth();
  //
  // if (chat.visibility === 'private') {
  //   if (!session || !session.user) {
  //     return notFound();
  //   }
  //
  //   if (session.user.id !== chat.userId) {
  //     return notFound();
  //   }
  // }

  // const messagesFromDb = await getMessagesByChatId({
  //   id,
  // });

  // const cookieStore = await cookies();
  // const modelIdFromCookie = cookieStore.get('model-id')?.value;
  // const selectedModelId =
  //   models.find((model) => model.id === modelIdFromCookie)?.id ||
  //   DEFAULT_MODEL_NAME;
  const {isMobile} = useSidebar();
  const [newChatDialogOpen, setNewChatDialogOpen] = React.useState(false);
  const { conversations, loadConversations } = useChat();

  React.useEffect(() => {
    loadConversations().catch(console.error);
  }, [loadConversations]);

  if (!conversations || conversations.length === 0) {
    return (
      <>
        <ChatHeader name="Chats" isConnected={false}/>
        <div className="flex-1">
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </div>
        <DialogNewChat open={newChatDialogOpen} setOpen={setNewChatDialogOpen} />
      </>
    );
  }

  return (
    <>
      <ChatHeader name="Chats" isConnected={false}/>
      {isMobile ? (
        <div className="flex-1">
          <div className="flex flex-col">
            {conversations.map((chat) => {
              const displayName = chat.friendFullName || chat.friendUsername;
              const messageDate = new Date(chat.latestMessage.createdAt);
              const today = new Date();
              const isToday = messageDate.toDateString() === today.toDateString();
              
              const formattedDate = isToday 
                ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : messageDate.toLocaleDateString();

              const isCurrentUser = chat.latestMessage.sender === 'user';
              const messagePreview = isCurrentUser 
                ? `You: ${chat.latestMessage.content}`
                : chat.latestMessage.content;

              return (
                <Link 
                  key={chat.friendUsername}
                  href={`/chats/${chat.friendUsername}`}
                  className="w-full min-h-[72px] hover:bg-muted"
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
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-4xl font-medium text-gray-200">
            MicroChat
          </div>
        </div>
      )}
      <DialogNewChat open={newChatDialogOpen} setOpen={setNewChatDialogOpen} />
    </>
  );
}
