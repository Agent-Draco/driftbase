import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSend, placeholder = "Type a message..." }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t border-border bg-surface p-4">
      <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
        <Paperclip className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
        <Smile className="h-5 w-5" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 rounded-full border-border bg-background px-4 py-2 focus-visible:ring-primary"
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim()}
        className="shrink-0 rounded-full shadow-glow-primary transition-all duration-200 hover:scale-105 disabled:shadow-none"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
