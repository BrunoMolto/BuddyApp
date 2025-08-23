import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  streak: integer("streak").default(0),
  conversationsToday: integer("conversations_today").default(0),
  lastActiveDate: text("last_active_date"),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  topic: text("topic").notNull(),
  topicEmoji: text("topic_emoji").notNull(),
  topicEnglish: text("topic_english").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  isActive: text("is_active").default("true"),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  translation: text("translation"),
  timestamp: timestamp("timestamp").default(sql`now()`),
});

export const conversationTopics = [
  {
    id: "introducing",
    french: "Se Présenter",
    english: "Introducing Yourself",
    emoji: "👋",
    starterPrompt: "Bonjour ! Comment tu t'appelles ?"
  },
  {
    id: "family",
    french: "La Famille",
    english: "Talking About Family", 
    emoji: "👨‍👩‍👧‍👦",
    starterPrompt: "Parle-moi de ta famille ! As-tu des frères et sœurs ?"
  },
  {
    id: "school",
    french: "L'École",
    english: "School Life",
    emoji: "🏫", 
    starterPrompt: "Comment se passe l'école ? Quelle est ta matière préférée ?"
  },
  {
    id: "hobbies",
    french: "Mes Loisirs", 
    english: "Hobbies & Fun",
    emoji: "🎨",
    starterPrompt: "Quels sont tes loisirs préférés ? Que fais-tu pendant ton temps libre ?"
  },
  {
    id: "food",
    french: "La Nourriture",
    english: "Food & Meals", 
    emoji: "🍎",
    starterPrompt: "Quel est ton plat préféré ? Qu'est-ce que tu aimes manger ?"
  }
];

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type ConversationTopic = typeof conversationTopics[0];
