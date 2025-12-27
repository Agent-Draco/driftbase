import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberCardProps {
  member: {
    id: string;
    name: string;
    initials: string;
    color: string;
    status: "online" | "offline" | "away";
    bio?: string;
    joinedDate: string;
    avatar_url?: string;
  };
  onMessage?: () => void;
}

const statusColors = {
  online: "bg-[hsl(var(--success))]",
  away: "bg-[hsl(var(--warning))]",
  offline: "bg-muted",
};

export function MemberCard({ member, onMessage }: MemberCardProps) {
  return (
    <Card className="group overflow-hidden border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14 shadow-sm">
              {member.avatar_url && (
                <AvatarImage src={member.avatar_url} alt={member.name} />
              )}
              <AvatarFallback className={`text-lg font-bold ${member.color}`}>
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${statusColors[member.status]}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground truncate">{member.name}</h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {member.status}
              </Badge>
            </div>
            {member.bio && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Joined {member.joinedDate}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onMessage}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
