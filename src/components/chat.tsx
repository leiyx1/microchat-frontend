'use client';

// import type { Attachment, Message } from 'ai';
import type { Message } from '@/lib/types'
// import { useChat } from 'ai/react';
// import { useState } from 'react';
// import useSWR, { useSWRConfig } from 'swr';

// import { ChatHeader } from '@/components/chat-header';
// import type { Vote } from '@/lib/db/schema';
// import { fetcher } from '@/lib/utils';

// import { Block } from './block';
// import { MultimodalInput } from './multimodal-input';
import {useChat} from "@/app/(chat)/chat-provider";
import {useState, useEffect} from "react";
import {MultimodalInput} from "@/components/multimodal-input";
import {Messages} from "@/components/messages";
// import { VisibilityType } from './visibility-selector';
// import { useBlockSelector } from '@/hooks/use-block';

export function Chat({
  id,
  // initialMessages,
  // selectedModelId,
  // selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  // initialMessages: Array<Message>;
  // selectedModelId: string;
  // selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  // const { mutate } = useSWRConfig();

  // const {
  //   messages,
  //   setMessages,
  //   handleSubmit,
  //   input,
  //   setInput,
  //   append,
  //   isLoading,
  //   stop,
  //   reload,
  // } = useChat({
  //   id,
  //   body: { id, modelId: selectedModelId },
  //   initialMessages,
  //   experimental_throttle: 100,
  //   onFinish: () => {
  //     mutate('/api/history');
  //   },
  // });

  const { messages, sendMessage, loadMessages } = useChat()
  const [ input, setInput ] = useState<string>("")

  useEffect(() => {
    // Only load messages if we don't have any for this conversation
    if (!messages[id]?.length) {
      loadMessages(id).catch(console.error);
    }
  }, [id, loadMessages]);

  const handleSubmit = () => {
    const message : Message = {
      sender: "",
      receiver: id, 
      content: input,
      messageId: Date.now(), // Temporary ID for new messages
      createdAt: new Date().toISOString()
    };
    sendMessage(message);
    setInput(""); // Clear input after sending
  }

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/*<ChatHeader*/}
        {/*  chatId={id}*/}
        {/*  selectedModelId={selectedModelId}*/}
        {/*  selectedVisibilityType={selectedVisibilityType}*/}
        {/*  isReadonly={isReadonly}*/}
        {/*/>*/}

        <Messages
          isLoading={false}
          messages={messages[id] || []}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={false}
              // stop={stop}
              // attachments={attachments}
              // setAttachments={setAttachments}
              // messages={messages}
              // setMessages={setMessages}
              // append={append}
            />
          )}
        </form>
      </div>

    </>
  );
}
