export interface Comment {
  followId: number;
  createdBy: string;
  createdAt: string;
  content?: string;
  body?: string;
  hasUpdated: boolean;
}

export interface MessageBody {
  subject: string;
  content: string;
}

export interface Message {
  mDBID: number;
  mDID: number;
  body: MessageBody;
  comments: Comment[];
}

export interface Notification {
  messages: Message[];
}
