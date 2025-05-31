"use client"

import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {Message} from "@/lib/types";

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

type ChatContext = {
    messages: Record<string, Message[]>;
    conversations: Conversation[];
    sendMessage: (message: Message) => void;
    loadMessages: (id: string, messageId?: number, limit?: number) => Promise<void>;
    loadConversations: () => Promise<void>;
    markConversationAsRead: (username: string) => void;
}

const ChatContext = createContext<ChatContext | undefined>(undefined);

type MessagesState = Record<string, Message[]>;

export function ChatProvider({children}: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
    const [messages, setMessages] = useState<MessagesState>({});
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messagesLoaded, setMessagesLoaded] = useState<Set<string>>(new Set());
    const [conversationsLoaded, setConversationsLoaded] = useState<boolean>(false);
    const {data: session} = useSession()

    /* ---------------- Conversations and messages loading on startup -------------- */

    const loadConversations = useCallback(async () => {
        if (conversationsLoaded)
            return
        try {
            const response = await fetch('/api/conversations');
            if (!response.ok) {
                throw new Error('Failed to load conversations');
            }

            const newConversations: Conversation[] = await response.json();
            setConversations(newConversations);
            setConversationsLoaded(true);
        } catch (error) {
            console.error('Error loading conversations:', error);
            throw error;
        }
    }, [conversationsLoaded])

    const loadMessages = useCallback(async (id: string, messageId?: number, limit: number = 50) => {
        if (messagesLoaded.has(id))
            return;
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

            setMessages(prev => ({
                ...prev,
                [id]: newMessages
            }));

            setMessagesLoaded(prev => new Set([...prev, id]));
        } catch (error) {
            console.error('Error loading messages:', error);
            throw error;
        }
    }, [messagesLoaded])

    const markConversationAsRead = useCallback((username: string) => {
        setConversations(prev =>
            prev.map(conv =>
                conv.friendUsername === username
                    ? { ...conv, unreadCount: 0 }
                    : conv
            )
        );
    }, []);

    /* ---------------- WebSocket Connection -------------- */

    useEffect(() => {
        if (!session) return;

        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${session.accessToken}`);

        ws.onopen = () => {
            console.log("WebSocket connection opened");
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            updateMessages(message);
            updateConversationWithMessage(message);
        };

        ws.onclose = () => {
            console.log("WebSocket connection opened");
        };

        setSocket(ws);
        return () => ws.close();
    }, [session?.user]);

    const sendMessage = (message: Message) => {
        if (socket) {
            socket.send(JSON.stringify(message));
        }
    };

    const updateMessages = (message: Message) => {
        const username = session?.user?.preferred_username
        if (!username) return;

        if (message.receiver === username) {
            setMessages((prev) => ({
                ...prev,
                [message.sender]: [...(prev[message.sender] || []), message]
            }));
        } else {
            setMessages((prev) => ({
                ...prev,
                [message.receiver]: [...(prev[message.receiver] || []), message]
            }));
        }
    };

    const updateConversationWithMessage = (message: Message) => {
        setConversations(prev => {
            const existingConversation = prev.find(
                conv => conv.friendUsername === message.sender || conv.friendUsername === message.receiver
            );

            if (!existingConversation) {
                return prev
            }

            const updatedConversation =  {
                ...existingConversation,
                latestMessage: {
                    messageId: message.messageId,
                    type: null,
                    sender: message.sender,
                    receiver: message.receiver,
                    content: message.content,
                    createdAt: message.createdAt
                },
                unreadCount: message.sender === existingConversation.friendUsername
                    ? existingConversation.unreadCount + 1
                    : existingConversation.unreadCount
            };

            return [
                updatedConversation,
                ...prev.filter(conv => conv.friendUsername !== existingConversation.friendUsername)
            ];
        });
    };



    return (
        <ChatContext.Provider value={{
            messages, 
            conversations,
            sendMessage, 
            loadMessages,
            loadConversations,
            markConversationAsRead
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = (): ChatContext => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
