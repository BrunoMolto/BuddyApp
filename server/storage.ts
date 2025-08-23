import { type User, type InsertUser, type Conversation, type InsertConversation, type Message, type InsertMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProgress(id: string, conversationsToday: number, streak: number, lastActiveDate: string): Promise<void>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getUserConversations(userId: string): Promise<Conversation[]>;
  updateConversationStatus(id: string, isActive: string): Promise<void>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: string): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    
    // Create a demo user
    const demoUser: User = {
      id: "demo-user-1",
      username: "student",
      password: "password",
      streak: 5,
      conversationsToday: 3,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    this.users.set(demoUser.id, demoUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      streak: 0, 
      conversationsToday: 0, 
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProgress(id: string, conversationsToday: number, streak: number, lastActiveDate: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.conversationsToday = conversationsToday;
      user.streak = streak;
      user.lastActiveDate = lastActiveDate;
      this.users.set(id, user);
    }
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      isActive: "true",
      userId: insertConversation.userId || null
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.userId === userId
    );
  }

  async updateConversationStatus(id: string, isActive: string): Promise<void> {
    const conversation = this.conversations.get(id);
    if (conversation) {
      conversation.isActive = isActive;
      this.conversations.set(id, conversation);
    }
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      conversationId: insertMessage.conversationId || null,
      translation: insertMessage.translation || null
    };
    this.messages.set(id, message);
    return message;
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((message) => message.conversationId === conversationId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();
