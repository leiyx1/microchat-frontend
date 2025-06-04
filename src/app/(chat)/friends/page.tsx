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
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {getInitials} from "@/lib/utils";
import useSWR from "swr";
import {fetcher} from "@/lib/utils";
import {Friend} from "@/lib/types";
import React from "react";

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
  const {
    data: friends,
    isLoading,
    // mutate,
  } = useSWR<Array<Friend>>('/api/friends', fetcher, {
    fallbackData: [],
  });
  

  if (isLoading) {
    return (
      <>
        {isMobile && <ChatHeader name="Friends" isConnected={false}/>}
        <div className="flex-1">
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
        </div>
      </>
    );
  }

  if (friends?.length === 0) {
    return (
      <>
        {isMobile && <ChatHeader name="Friends" isConnected={false}/>}
        {isMobile ? (
          <div className="flex-1">
            <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
              Add a friend to start chatting!
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-4xl font-medium text-gray-200">
              MicroChat
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {isMobile && <ChatHeader name="Friends" isConnected={false}/>}
      {isMobile ? (
        <div className="flex-1">
          <div className="flex flex-col">
            {friends && friends.map(friend => (
              <div key={friend.id} className="flex items-center gap-2 p-2 hover:bg-muted">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={friend.avatarUrl}/>
                  <AvatarFallback className="rounded-lg">{getInitials(friend.fullName)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{friend.fullName}</span>
                  <span className="truncate text-xs">{friend.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-4xl font-medium text-gray-200">
            MicroChat
          </div>
        </div>
      )}
    </>
  );
}
