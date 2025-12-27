import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Skull, Star } from "lucide-react";
import { format } from "date-fns";

interface HallEntryProps {
  entry: {
    id: string;
    title: string;
    description: string;
    type: "fame" | "shame";
    award: string;
    winner: {
      name: string;
      initials: string;
      color: string;
    };
    date: Date;
  };
}

export function HallEntry({ entry }: HallEntryProps) {
  const isFame = entry.type === "fame";

  return (
    <Card className="group overflow-hidden border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${
              isFame ? "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]" : "bg-destructive text-destructive-foreground"
            }`}
          >
            {isFame ? <Trophy className="h-6 w-6" /> : <Skull className="h-6 w-6" />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground">{entry.title}</h3>
              <Badge variant={isFame ? "default" : "destructive"} className="text-xs">
                {entry.award}
              </Badge>
            </div>

            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {entry.description}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={`text-xs font-semibold ${entry.winner.color}`}>
                    {entry.winner.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-card-foreground">
                  {entry.winner.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(entry.date, "MMM d, yyyy")}
              </span>
            </div>
          </div>

          <Star className={`h-5 w-5 shrink-0 transition-colors ${isFame ? "text-[hsl(var(--warning))] fill-[hsl(var(--warning))]" : "text-muted"}`} />
        </div>
      </CardContent>
    </Card>
  );
}
