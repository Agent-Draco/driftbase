import { useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageCircle, Users, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/hooks/useAuth";

export default function ChatPage() {
  const { messages, loading, sendMessage } = useRealtimeChat();
  const { onlineProfiles } = useProfiles();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    await sendMessage(content);
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <PageHeader
        title="Total Chat"
        subtitle="The main hangout for all Driftaculars"
        icon={<MessageCircle className="h-6 w-6" />}
        action={
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {onlineProfiles.slice(0, 4).map((profile) => (
                <Avatar key={profile.id} className="h-8 w-8 border-2 border-background">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.display_name || ''} />
                  ) : null}
                  <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                    {getInitials(profile.display_name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {onlineProfiles.length} online
            </span>
          </div>
        }
      />

      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                No messages yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to say something!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={{
                  id: message.id,
                  content: message.content,
                  sender: {
                    id: message.sender_id,
                    name: message.profiles?.display_name || message.profiles?.username || 'Unknown',
                    initials: getInitials(message.profiles?.display_name || message.profiles?.username),
                    color: 'bg-primary text-primary-foreground',
                    avatar_url: message.profiles?.avatar_url || undefined,
                  },
                  timestamp: new Date(message.created_at),
                  isOwn: message.sender_id === user?.id,
                }}
              />
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="mx-auto w-full max-w-3xl">
        <ChatInput onSend={handleSend} placeholder="Send a message to everyone..." />
      </div>
    </div>
  );
}
