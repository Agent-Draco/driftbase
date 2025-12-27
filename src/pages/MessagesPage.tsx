import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePrivateMessages } from "@/hooks/usePrivateMessages";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { partnerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, conversations, loading, sendMessage } = usePrivateMessages(partnerId);
  const { profiles } = useProfiles();
  const [newMessage, setNewMessage] = useState('');

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !partnerId) return;
    await sendMessage(partnerId, newMessage);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show conversation view
  if (partnerId) {
    const partner = profiles.find(p => p.id === partnerId);
    return (
      <div className="flex h-screen flex-col">
        <PageHeader
          title={partner?.display_name || partner?.username || 'Private Chat'}
          subtitle="Direct message"
          icon={
            <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
        />
        <ScrollArea className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={cn("flex gap-3", isOwn ? "flex-row-reverse" : "flex-row")}>
                  <Avatar className="h-8 w-8">
                    {msg.sender?.avatar_url && <AvatarImage src={msg.sender.avatar_url} />}
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials(msg.sender?.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("max-w-[70%]", isOwn && "text-right")}>
                    <div className={cn(
                      "rounded-2xl px-4 py-2",
                      isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(msg.created_at), "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="mx-auto max-w-2xl flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    );
  }

  // Show conversations list
  return (
    <div className="flex h-screen flex-col">
      <PageHeader title="Private Messages" subtitle="Your conversations" icon={<Mail className="h-6 w-6" />} />
      <ScrollArea className="flex-1 p-6">
        <div className="mx-auto max-w-2xl space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Start a conversation</h3>
          {profiles.filter(p => p.id !== user?.id).map((profile) => (
            <Card key={profile.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/messages/${profile.id}`)}>
              <CardContent className="p-4 flex items-center gap-3">
                <Avatar><AvatarImage src={profile.avatar_url || undefined} /><AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback></Avatar>
                <div className="flex-1"><p className="font-medium">{profile.display_name || profile.username}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
