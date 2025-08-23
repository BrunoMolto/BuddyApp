export interface User {
  id: string;
  username: string;
  streak: number;
  conversationsToday: number;
  lastActiveDate?: string;
}

export interface ConversationTopic {
  id: string;
  french: string;
  english: string;
  emoji: string;
  starterPrompt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  translation?: string;
  timestamp?: Date;
}

export interface Conversation {
  id: string;
  userId?: string;
  topic: string;
  topicEmoji: string;
  topicEnglish: string;
  createdAt?: Date;
  isActive?: string;
}
