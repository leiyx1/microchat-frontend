"use client"

import { Chat } from '@/components/chat';
import {useParams} from "next/navigation";

export default function Page() {
  const {id: id} = useParams<{id: string}>();

  return (
    <>
      <Chat
        // id={chat.id}
        id={id}
        // initialMessages={convertToUIMessages(messagesFromDb)}
        // selectedModelId={selectedModelId}
        // selectedVisibilityType={chat.visibility}
        // selectedVisibilityType={chat.visibility}
        // isReadonly={session?.user?.id !== chat.userId}
        isReadonly={false}
      />
      {/*<DataStreamHandler id={id} />*/}
    </>
  );
}
