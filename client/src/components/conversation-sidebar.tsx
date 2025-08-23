import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import type { User, ConversationTopic } from "@/lib/types";

interface ConversationSidebarProps {
  topics: ConversationTopic[];
  selectedTopic: ConversationTopic | null;
  onTopicSelect: (topic: ConversationTopic) => void;
  user?: User;
  onConversationStart: (conversationId: string) => void;
}

export default function ConversationSidebar({
  topics,
  selectedTopic,
  onTopicSelect,
  user,
  onConversationStart,
}: ConversationSidebarProps) {
  const queryClient = useQueryClient();
  const [isStarting, setIsStarting] = useState(false);

  const startConversationMutation = useMutation({
    mutationFn: async (topic: ConversationTopic) => {
      const response = await apiRequest("POST", "/api/conversations", {
        userId: "demo-user-1",
        topic: topic.id,
        topicEmoji: topic.emoji,
        topicEnglish: topic.english,
      });
      return response.json();
    },
    onSuccess: (conversation) => {
      onConversationStart(conversation.id);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handleTopicClick = async (topic: ConversationTopic) => {
    onTopicSelect(topic);
    setIsStarting(true);
    
    try {
      await startConversationMutation.mutateAsync(topic);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      <Card className="rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-playful text-lg text-gray-800 mb-4">Choose Your Adventure! 🎯</h3>
        
        <div className="space-y-3">
          {topics.map((topic) => (
            <Button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              disabled={isStarting}
              className={`w-full text-left p-4 h-auto justify-start transition-all transform hover:scale-105 ${
                selectedTopic?.id === topic.id
                  ? "bg-french-blue text-white hover:bg-french-blue/90"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-french-blue hover:shadow-md"
              }`}
              variant="ghost"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{topic.emoji}</span>
                <div>
                  <h4 className="font-semibold">{topic.french}</h4>
                  <p className={`text-sm ${
                    selectedTopic?.id === topic.id ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {topic.english}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>
      
      {/* Progress Card */}
      {user && (
        <Card className="bg-gradient-to-br from-kid-green to-kid-green/80 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="font-playful text-lg mb-3">Your Progress 📊</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Conversations Today</span>
              <span className="font-bold">{user.conversationsToday}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${Math.min(100, (user.conversationsToday / 5) * 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-green-100">Goal: 5 conversations per day</div>
          </div>
        </Card>
      )}
    </div>
  );
}
