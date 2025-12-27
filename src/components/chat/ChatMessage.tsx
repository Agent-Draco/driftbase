import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      initials: string;
      color: string;
      avatar_url?: string;
    };
    timestamp: Date;
    isOwn?: boolean;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isOwn = message.isOwn;

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-9 w-9 shrink-0 shadow-sm">
        {message.sender.avatar_url && (
          <AvatarImage src={message.sender.avatar_url} alt={message.sender.name} />
        )}
        <AvatarFallback className={cn("text-sm font-semibold", message.sender.color)}>
          {message.sender.initials}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex max-w-[70%] flex-col gap-1", isOwn && "items-end")}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {message.sender.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(message.timestamp, "h:mm a")}
          </span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-card text-card-foreground border border-border rounded-tl-sm"
          )}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
