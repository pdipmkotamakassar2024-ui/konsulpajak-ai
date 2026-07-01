export interface ChatAttachment {
  name: string;
  type: string;
  size: number;
  data: string;
}

export interface ChatSummary {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface StoredChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}
