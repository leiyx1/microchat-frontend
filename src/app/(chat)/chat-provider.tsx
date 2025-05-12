"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Message} from "@/lib/types";
import { fetcher } from "@/lib/utils";

type ChatContext = {
    messages: Record<string, Message[]>;
    sendMessage: (message: Message) => void;
    loadMessages: (id: string, messageId?: number, limit?: number) => Promise<void>;
}

const ChatContext = createContext<ChatContext | undefined>(undefined);

type MessagesState = Record<string, Message[]>;
type LoadedMessageIds = Record<string, Set<number>>;

export function ChatProvider({children}: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [messages, setMessages] = useState<MessagesState>({});
    const [loadedMessageIds, setLoadedMessageIds] = useState<LoadedMessageIds>({});
    const {data: session} = useSession()

    const loadMessages = async (id: string, messageId?: number, limit: number = 50) => {
        try {
            const queryParams = new URLSearchParams();
            if (messageId) {
                queryParams.append('messageId', messageId.toString());
            }
            queryParams.append('limit', limit.toString());
            
            const response = await fetch(`/api/messages/${id}?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to load messages');
            }
            
            const newMessages: Message[] = await response.json();
            
            // Filter out messages we already have
            const existingIds = loadedMessageIds[id] || new Set();
            const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.messageId));
            
            if (uniqueNewMessages.length === 0) {
                return; // No new messages to add
            }

            // Update loaded message IDs
            const newIds = new Set(uniqueNewMessages.map(msg => msg.messageId));
            setLoadedMessageIds(prev => ({
                ...prev,
                [id]: new Set([...existingIds, ...newIds])
            }));
            
            // Add new messages to state and sort by createdAt
            setMessages(prev => ({
                ...prev,
                [id]: [...(prev[id] || []), ...uniqueNewMessages].sort((a, b) => 
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                )
            }));
        } catch (error) {
            console.error('Error loading messages:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (!session) return;

        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${session.accessToken}`);

        ws.onopen = () => {
                    };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
                                    if (message.receiver === session.user?.preferred_username) {
                setMessages((prev) => ({
                    ...prev,
                    [message.sender]: [...(prev[message.sender] || []), message]}));
            } else {
                setMessages((prev) => ({
                    ...prev,
                    [message.receiver]: [...(prev[message.receiver] || []), message]}));
            }
        };

        ws.onclose = () => {
                    };

        setSocket(ws);
        return () => ws.close();
    }, [session?.user]);

    const sendMessage = (message: Message) => {
        if (socket) {
            socket.send(JSON.stringify(message));
        }
    };

    return (
        <ChatContext.Provider value={{messages, sendMessage, loadMessages}}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContext => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
