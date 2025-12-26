import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageCircle, Users } from "lucide-react";
import { mockMessages, mockMembers } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (content: string) => {
    const newMessage = {
      id: String(messages.length + 1),
      content,
      sender: mockMembers[3], // Current user
      timestamp: new Date(),
      isOwn: true,
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Total Chat"
        subtitle="The main hangout for all Driftaculars"
        icon={<MessageCircle className="h-6 w-6" />}
        action={
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {mockMembers.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className={`text-xs font-semibold ${member.color}`}>
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {mockMembers.length} online
            </span>
          </div>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <div className="mx-auto w-full max-w-3xl">
        <ChatInput onSend={handleSend} placeholder="Send a message to everyone..." />
      </div>
    </div>
  );
}
