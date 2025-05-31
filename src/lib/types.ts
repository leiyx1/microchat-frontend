export interface Message {
    messageId: number;
    id?: string;
    sender: string;
    receiver: string;
    content: string;
    createdAt: string;
    // experimental_attachments?: Attachment[];
    role?: 'sender' | 'receiver';
    // data?: JSONValue;
    // annotations?: JSONValue[] | undefined;
    // toolInvocations?: Array<ToolInvocation>;
}

export interface Friend {
    id: string;
    username: string;
    fullName: string;
}

export interface Chat {
    id: string;
    username: string;
}